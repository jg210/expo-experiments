import { Button } from "react-native"
import * as Sentry from "@sentry/react-native";

export const CrashTests = () => {
    return (<>
        <Button title='Crash test' onPress={ () => { throw new Error('testing 123') }} />
        <Button title='Record error' onPress={ () => { Sentry.captureException(new Error('testing 123')) }}/>
    </>);
}