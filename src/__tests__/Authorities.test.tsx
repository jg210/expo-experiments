import { render, screen, waitForElementToBeRemoved } from "@testing-library/react-native";
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

describe("Authorities", () => {
    it("renders", async () => {
        // Mock react-query
        const data: LocalAuthority[] = [
            { localAuthorityId: 1, name: "Wessex" },
            { localAuthorityId: 2, name: "Southmoltonshire" }
        ];
        const refetch = jest.fn();
        (useSuspenseQuery as jest.Mock).mockImplementation(() => ({ data, refetch })); //mockReturnValue();

        // Mock ExpoExperimentsModule.
        const mockFingerprint = "324902423923abef";
        (ExpoExperimentsModule.fingerprintAuthorities as jest.Mock).mockResolvedValue(mockFingerprint);

        // The test.
        render(<Authorities/>);

        // Need to wait for the fingerprintAuthorities promise to resolve (not directly, but by waiting
        // for UI to update) otherwise the promise triggers a UI refresh after the test ends, which
        // means get:
        // 
        // Warning: An update to AuthoritiesImpl inside a test was not wrapped in act(...).
        //
        // https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning
        await waitForElementToBeRemoved(() => screen.queryByText("..."))

        // Assert that expected values appear in UI.
        screen.getByText(mockFingerprint.slice(0, 8));
        data.forEach(localAuthority => {
            screen.getByText(localAuthority.name);
        });

    });
});