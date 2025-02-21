import { render } from "@testing-library/react-native";
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
            { localAuthorityId: 1, name: "Wessex" }
        ];
        const refetch = jest.fn();
        (useSuspenseQuery as jest.Mock).mockImplementation(() => ({ data, refetch })); //mockReturnValue();

        // Mock ExpoExperimentsModule.
        //
        (ExpoExperimentsModule.fingerprintAuthorities as jest.Mock).mockResolvedValue("123456");

        // The test.
        render(<Authorities/>);
    });
});