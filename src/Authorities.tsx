import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { FlatList, Text } from "react-native";

import { getAuthorities } from "./FSA";
import { useRefresh } from "./useRefresh";

import React from 'react';

import ExpoExperimentsModule from "../modules/expo-experiments/src/ExpoExperimentsModule";
import { useLastPromise } from "./useLastPromise";

const queryKey = ["authorities"];

interface ItemProps {
  name: string;
}
const Item = ({ name }: ItemProps) => <Text testID="authorityListItem">{name}</Text>;

const Fallback = () => <Text>loading...</Text>;

// https://react.dev/reference/react/Suspense suggests can use Suspense in same component
// that can suspend, but that doesn't work, so need a separate component.
const AuthoritiesImpl = () => {
  const { data, refetch } = useSuspenseQuery({
    queryKey,
    queryFn: getAuthorities,
  });
  // The fingerprint will be stale during refreshes, so need to hide it somehow.
  // The string initial loading state uses same string, although in this case
  // refreshing is false.
  const refreshingText = "...";
  const [fingerprint, setFingerprint] = useState(refreshingText);
  const { refreshing, onRefresh } = useRefresh(refetch);
  const localAuthorityNames = data.map(localAuthority => localAuthority.name)
  // TODO with react 19 use(), could use Suspense while wait for Promise to resolve.
  useLastPromise(
    () => ExpoExperimentsModule.fingerprintAuthorities(localAuthorityNames),
    [localAuthorityNames],
    (fingerprint) => setFingerprint(fingerprint.substring(0, 8))
  );
  console.log("Authority: " + JSON.stringify(data) + " " + fingerprint);
  return (
    <>
      <Text testID="fingerprint">{refreshing ? refreshingText : fingerprint}</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => <Item name={item.name} />}
        keyExtractor={(item) => item.localAuthorityId.toString()}
        onRefresh={onRefresh}
        refreshing={refreshing}
        testID="authoritiesList"
      />
    </>
  );
};

export const Authorities = () => {
  return (
    <Suspense fallback={<Fallback />}>
      <AuthoritiesImpl />
    </Suspense>
  );
};
