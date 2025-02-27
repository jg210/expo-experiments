import { configure } from "@testing-library/react-native";

import console from "console";

global.console = console;

// The default timeout of 1s is too short on github actions.
configure({ asyncUtilTimeout: 15000 });
