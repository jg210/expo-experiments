import { act, render, screen, waitFor, waitForElementToBeRemoved, within } from "@testing-library/react-native";
import { Authorities } from "../Authorities";
import { LocalAuthority, LocalAuthorities } from '../FSA';
import ExpoExperimentsModule from "../../modules/expo-experiments/src/ExpoExperimentsModule";

import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
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

const localAuthorities: LocalAuthority[] = [
    { localAuthorityId: 1, name: "Wessex" },
    { localAuthorityId: 2, name: "Southmoltonshire" }
];

const handlers = [
    http.get<LocalAuthoritiesParams, LocalAuthoritiesRequestBody, LocalAuthoritiesResponseBody>(
        "https://aws.jeremygreen.me.uk/api/fsa/localAuthority",
        () => HttpResponse.json({ localAuthorities })
      ),
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

describe("Authorities", () => {

    beforeEach(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it("renders", async () => {

        // Mock ExpoExperimentsModule.
        const mockFingerprint = "324902423923abef";
        const { fingerprintAuthorities } = ExpoExperimentsModule;
        const fingerprintAuthoritiesMock = fingerprintAuthorities as jest.MockedFunction<typeof fingerprintAuthorities>;
        fingerprintAuthoritiesMock.mockResolvedValue(mockFingerprint);

        // The tested component.
        render(<AppQueryClientProvider><Authorities/></AppQueryClientProvider>);

        // Assert that expected values appear in UI. The app loads the data then calculates the fingerprint.
        // Waiting for the fingerprint first here means don't have to wait for data to load too.
        await waitFor(() => {
            expect(screen.getByTestId("fingerprint")).toHaveTextContent(mockFingerprint.slice(0, 8));
        });
        const authoritiesList = screen.getByTestId("authoritiesList");
        const authorityListItems = within(authoritiesList).getAllByTestId("authorityListItem");
        authorityListItems.forEach((authorityListItem, i) => {
            const authorityNameExpected = localAuthorities[i].name;
            expect(authorityListItem).toHaveTextContent(authorityNameExpected);
        });

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

        // TODO supply different date for refresh request and check UI.
        // ...removing following waitFor too.
        await waitFor(() => {
            expect(screen.getByTestId("fingerprint")).toHaveTextContent(mockFingerprint.slice(0, 8));
        });


    });

    // TODO test data loading state by mocking a slow network.
    // TODO test fingerprint loading state by mocking promise that doesn't resolve.

});
