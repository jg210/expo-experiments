import { act, render, screen, waitForElementToBeRemoved } from "@testing-library/react-native";
import { Authorities } from "../Authorities";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LocalAuthority } from '../FSA';
import ExpoExperimentsModule from "../../modules/expo-experiments/src/ExpoExperimentsModule";

jest.mock("@tanstack/react-query");

// https://docs.expo.dev/modules/mocking/ (putting a mock in the module's mocks directory) doesn't work, so mock locally.
// Need the __esModule and default to mock the default export and avoid the requireNativeModule() getting called, since it
// gives a "Cannot find native module 'ExpoExperiments'" error.
jest.mock("../../modules/expo-experiments/src/ExpoExperimentsModule", () => ({
    __esModule: true,
    default: { fingerprintAuthorities: jest.fn() },
  })
);

// Need to wait for the fingerprintAuthorities promise to resolve (not directly, but by waiting
// for UI to update) otherwise the promise triggers a UI refresh after the test ends, which
// means get:
//
// Warning: An update to AuthoritiesImpl inside a test was not wrapped in act(...).
//
// https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning
//
// (Alternatively, could just wait for the final UI values to appear.)
async function waitForLoadingToComplete() {
    await waitForElementToBeRemoved(() => screen.queryByText("..."));
}

describe("Authorities", () => {
    it("renders", async () => {
        // Mock react-query
        const data: LocalAuthority[] = [
            { localAuthorityId: 1, name: "Wessex" },
            { localAuthorityId: 2, name: "Southmoltonshire" }
        ];
        const refetch = jest.fn();
        (useSuspenseQuery as jest.Mock).mockImplementation(() => ({ data, refetch }));

        // Mock ExpoExperimentsModule.
        const mockFingerprint = "324902423923abef";
        (ExpoExperimentsModule.fingerprintAuthorities as jest.Mock).mockResolvedValue(mockFingerprint);

        // The tested component.
        render(<Authorities/>);

        await waitForLoadingToComplete();

        // Assert that expected values appear in UI.
        // TODO assert appears in right order.
        screen.getByText(mockFingerprint.slice(0, 8));
        data.forEach(localAuthority => {
            screen.getByText(localAuthority.name);
        });

        expect(refetch).toHaveBeenCalledTimes(0);

        // Drag to refresh.
        //
        // https://github.com/callstack/react-native-testing-library/issues/809#issuecomment-1144703296
        const flatList = screen.getByTestId("authoritiesList");
        act(() => {
            flatList.props.refreshControl.props.onRefresh();
        })
        expect(refetch).toHaveBeenCalledTimes(1);

        await waitForLoadingToComplete();

        // TODO provide new set of mocked data and assert it's rendered.

    });
});
