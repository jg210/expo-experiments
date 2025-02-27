import { configure } from "@testing-library/react-native";

// The default timeout of 1s is too short on github actions.
configure({ asyncUtilTimeout: 15000 });
