import { act, render, screen, waitFor, within } from "@testing-library/react-native";
import { Authorities } from "../Authorities";
import { LocalAuthority, LocalAuthorities } from '../FSA';
import ExpoExperimentsModule from "../../modules/expo-experiments/src/ExpoExperimentsModule";

import { setupServer } from 'msw/node';
import { delay, http, HttpResponse } from 'msw';
import { AppQueryClientProvider } from "../AppQueryClientProvider";

type LocalAuthoritiesParams = Record<string,never>;
type LocalAuthoritiesRequestBody = Record<string,never>;
type LocalAuthoritiesResponseBody = LocalAuthorities;

// https://docs.expo.dev/modules/mocking/ (putting a mock in the module's mocks directory) doesn't work, so mock locally.
// Need the __esModule and default to mock the default export and avoid the requireNativeModule() getting called, since it
// gives a "Cannot find native module 'ExpoExperiments'" error.
jest.mock("../../modules/expo-experiments/src/ExpoExperimentsModule", () => ({
    __esModule: true,
    default: { fingerprintAuthorities: jest.fn() },
  })
);

// Mock native ExpoExperimentsModule. Using a real fingerprint algorithm is simplest since don't need
// to ensure that return appropriate values if test evolves to pass different values to the
// function.
async function SHA256(strings: string[]) {
    const combinedString = strings.join('\x00') + '\x00';    
    const bytes: Uint8Array = new TextEncoder().encode(combinedString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
    const hashByteArray = new Uint8Array(hashBuffer);
    const hashArray = Array.from(hashByteArray);
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');    
    return hashHex;
}
const { fingerprintAuthorities } = ExpoExperimentsModule;
const fingerprintAuthoritiesMock = fingerprintAuthorities as jest.MockedFunction<typeof fingerprintAuthorities>;

const localAuthorities: LocalAuthority[] = [
    { localAuthorityId: 1, name: "Wessex" },
    { localAuthorityId: 2, name: "Southmoltonshire" }
];

// Create a Mock Service Worker handler.
function localAuthoritiesHandler(response: () => HttpResponse<LocalAuthoritiesResponseBody> | Promise<HttpResponse<LocalAuthoritiesResponseBody>>) {
    return http.get<LocalAuthoritiesParams, LocalAuthoritiesRequestBody, LocalAuthoritiesResponseBody>(
        "https://aws.jeremygreen.me.uk/api/fsa/localAuthority",
        response
    );
}

// Create a Mock Service Worker handler that returns the provided data.
function localAuthoritiesHandlerFor(localAuthorities: LocalAuthority[]) {
    return localAuthoritiesHandler(
        () => HttpResponse.json({ localAuthorities })
    );
}

const server = setupServer();
// server.events.on('request:start', ({ request, requestId }) => {
//     console.log('request:start:', requestId, request.method, request.url);
// });
// server.events.on('request:match', ({ request, requestId }) => {
//     console.log("request:match:", requestId, request.method, request.url);
// });
// server.events.on('response:mocked', ({ request, response }) => {
//     console.log(
//     'response:mocked: %s %s %s %s',
//     request.method,
//     request.url,
//     response.status,
//     response.statusText
//     );
// });

async function assertUICorrect(
    fingerprint: string,
    localAuthorities: LocalAuthority[]
) {
    // The fingerprint depends on the data, so waiting for this first means
    // don't need to wait for data too.
    await waitFor(() => {
        expect(screen.getByTestId("fingerprint")).toHaveTextContent(fingerprint.slice(0, 8));
    });
    const authoritiesList = screen.getByTestId("authoritiesList");
    const authorityListItems = within(authoritiesList).queryAllByTestId("authorityListItem");
    expect(authorityListItems.length).toBe(localAuthorities.length);
    authorityListItems.forEach((authorityListItem, i) => {
        const authorityNameExpected = localAuthorities[i].name;
        expect(authorityListItem).toHaveTextContent(authorityNameExpected);
    });
    return authoritiesList;
}

function assertLoadingState() {
    expect(screen.root).toHaveTextContent("loading...");
}

// A Promise<T> that never resolves.
function waitForever<T>() {
    return new Promise<T>((_resolve, _reject) => {});
}

describe("Authorities", () => {

    beforeEach(() => {
        server.listen();
        fingerprintAuthoritiesMock.mockImplementation((localAuthorities => SHA256(localAuthorities)));
    });
    afterEach(() => {
        server.resetHandlers()
        fingerprintAuthoritiesMock.mockReset();
    });
    afterAll(() => {
        server.close();
    });

    it("renders and refreshes", async () => {

        // Return different data before and after the later drag to refresh.
        const localAuthorities1 = localAuthorities.slice(0, 1);
        const localAuthorities2 = localAuthorities;
        const fingerprint1 = "b6557162";
        const fingerprint2 = "deb3b6d4";
        server.use(localAuthoritiesHandlerFor(localAuthorities1));

        // The tested component.
        render(<AppQueryClientProvider><Authorities/></AppQueryClientProvider>);

        const authoritiesList = await assertUICorrect(fingerprint1, localAuthorities1);

        // Drag to refresh with different data.
        //
        // This explains why refresh is triggered like this:
        //
        // https://github.com/callstack/react-native-testing-library/issues/809#issuecomment-1144703296
        server.use(localAuthoritiesHandlerFor(localAuthorities2));
        act(() => {
            authoritiesList.props.refreshControl.props.onRefresh();
        })

        await assertUICorrect(fingerprint2, localAuthorities2);
    });

    it("shows loading state if network slow", () => {
        server.use(localAuthoritiesHandler(async () => {
            await delay('infinite');
            return new HttpResponse()
          })
        );
        // The tested component.
        render(<AppQueryClientProvider><Authorities/></AppQueryClientProvider>);
        assertLoadingState();
    });

    it("shows loading state for fingerprint Promise", async () => {
        server.use(localAuthoritiesHandlerFor(localAuthorities));
        fingerprintAuthoritiesMock.mockImplementation((_localAuthorities) => waitForever<string>());
        // The tested component.
        render(<AppQueryClientProvider><Authorities/></AppQueryClientProvider>);
        assertLoadingState();
    });

    it("no local authorities", async () => {
        const localAuthorities: LocalAuthority[] = [];
        const localAuthorityNames = localAuthorities.map((localAuthority) => localAuthority.name);
        const fingerprint = await SHA256(localAuthorityNames);
        expect(fingerprint).toBe("6e340b9cffb37a989ca544e6bb780a2c78901d3fb33738768511a30617afa01d");
        server.use(localAuthoritiesHandlerFor(localAuthorities));
        // The tested component.
        render(<AppQueryClientProvider><Authorities/></AppQueryClientProvider>);
        await assertUICorrect(fingerprint, localAuthorities);
    });

    it("shows last render's fingerprint even if first render's Promise resolves last", async () => {
        console.log("test case started");
        const localAuthorities1 = localAuthorities.slice(0, 1);
        const localAuthorities2 = localAuthorities;
        const localAuthoritiesNames1 = localAuthorities1.map((localAuthority) => localAuthority.name);
        const localAuthoritiesNames2 = localAuthorities2.map((localAuthority) => localAuthority.name);
        const fingerprint1 = await SHA256(localAuthoritiesNames1);
        const fingerprint2 = await SHA256(localAuthoritiesNames2);
        expect(fingerprint1).not.toEqual(fingerprint2);
        // First render: Promise's resolve stored but not called yet.
        server.use(localAuthoritiesHandlerFor(localAuthorities1));
        let promise1Resolver: ((fingerprint: string) => void) | null = null;
        const mock1 = (_localAuthorities: string[]) => new Promise<string>((resolve, _reject) => {
            promise1Resolver = resolve;
        });
        //expect(promise1Resolver).not.toBeNull();
        fingerprintAuthoritiesMock.mockImplementation(mock1);
        const { rerender } = render(<AppQueryClientProvider><Authorities/></AppQueryClientProvider>);
        assertLoadingState();
        // Second render: completes normally.
        server.use(localAuthoritiesHandlerFor(localAuthorities2));
        const mock2 = async (_localAuthorities: string[]) => fingerprint2;
        fingerprintAuthoritiesMock.mockImplementation(mock2);
        rerender(
            <AppQueryClientProvider><Authorities/></AppQueryClientProvider>
        );
        // ...then resolve the Promise from the first render.
        await waitFor(() => {
            expect(fingerprintAuthoritiesMock).toHaveBeenCalled();
        });
        promise1Resolver!(fingerprint1);
        // ...but it should be ignored by the UI.
        await assertUICorrect(fingerprint2, localAuthorities2);
    });

});
