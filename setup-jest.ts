import { configure } from "@testing-library/react-native";

// The default timeout of 1s is too short.
configure({ asyncUtilTimeout: 5000 });
