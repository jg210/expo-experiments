import { act, render, screen, waitFor, within } from "@testing-library/react-native";
import { Authorities } from "../Authorities";
import { LocalAuthority, LocalAuthorities } from '../FSA';
import ExpoExperimentsModule from "../../modules/expo-experiments/src/ExpoExperimentsModule";

import { setupServer } from 'msw/node';
import { http, HttpResponse, RequestHandlerOptions } from 'msw';
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
fingerprintAuthoritiesMock.mockImplementation((localAuthorities => SHA256(localAuthorities)));

const localAuthorities: LocalAuthority[] = [
    { localAuthorityId: 1, name: "Wessex" },
    { localAuthorityId: 2, name: "Southmoltonshire" }
];

function localAuthoritiesHandler(localAuthorities: LocalAuthority[], options?: RequestHandlerOptions) {
    return http.get<LocalAuthoritiesParams, LocalAuthoritiesRequestBody, LocalAuthoritiesResponseBody>(
        "https://aws.jeremygreen.me.uk/api/fsa/localAuthority",
        () => HttpResponse.json({ localAuthorities }),
        options
    );
}

const handlers = [
    localAuthoritiesHandler(localAuthorities)
];

const server = setupServer(...handlers);
server.events.on('request:start', ({ request, requestId }) => {
    console.log('request:start:', requestId, request.method, request.url);
});
server.events.on('request:match', ({ request, requestId }) => {
    console.log("request:match:", requestId, request.method, request.url);
});
server.events.on('response:mocked', ({ request, response }) => {
    console.log(
    'response:mocked: %s %s %s %s',
    request.method,
    request.url,
    response.status,
    response.statusText
    );
});

async function assertUICorrect(
    fingerprint: string,
    localAuthorities: LocalAuthority[]
) {
    await waitFor(() => {
        expect(screen.getByTestId("fingerprint")).toHaveTextContent(fingerprint.slice(0, 8));
    });
    const authoritiesList = screen.getByTestId("authoritiesList");
    const authorityListItems = within(authoritiesList).getAllByTestId("authorityListItem");
    expect(authorityListItems.length).toBe(localAuthorities.length);
    authorityListItems.forEach((authorityListItem, i) => {
        const authorityNameExpected = localAuthorities[i].name;
        expect(authorityListItem).toHaveTextContent(authorityNameExpected);
    });
    return authoritiesList;
}

describe("Authorities", () => {

    beforeEach(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it("renders", async () => {

        // To test drag to refresh works, return different data for first and second requests.
        const localAuthorities1 = localAuthorities.slice(0, 1);
        const localAuthorities2 = localAuthorities;
        server.use(localAuthoritiesHandler(localAuthorities1, { once: true }));
        const fingerprint1 = "b6557162";
        const fingerprint2 = "deb3b6d4";

        // The tested component.
        render(<AppQueryClientProvider><Authorities/></AppQueryClientProvider>);

        // Assert that expected values appear in UI. The app loads the data then calculates the fingerprint.
        // Waiting for the fingerprint first here means don't have to wait for data to load too.
        const authoritiesList = await assertUICorrect(fingerprint1, localAuthorities1);

        // Drag to refresh.
        //
        // This explains why refresh is triggered like this:
        //
        // https://github.com/callstack/react-native-testing-library/issues/809#issuecomment-1144703296
        //
        // The refetch function here is just a mock, so there is no real data reloading.
        act(() => {
            authoritiesList.props.refreshControl.props.onRefresh();
        })

        await assertUICorrect(fingerprint2, localAuthorities2);
    }, 15000);

    // TODO test data loading state by mocking a slow network.
    // TODO test fingerprint loading state by mocking promise that doesn't resolve.
    // TODO test no local authorities.

});
