import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, use } from "react";
import { FlatList, Text } from "react-native";

import { getAuthorities } from "./FSA";
import { useRefresh } from "./useRefresh";

import React from 'react';

import ExpoExperimentsModule from "../modules/expo-experiments/src/ExpoExperimentsModule";

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
  const { refreshing, onRefresh } = useRefresh(refetch);
  const localAuthorityNames = data.map(localAuthority => localAuthority.name)
  const fingerprint = use(ExpoExperimentsModule.fingerprintAuthorities(localAuthorityNames));
  const refreshingText = "...";
  const fingerprintText = refreshing ? refreshingText : fingerprint.substring(0, 8);
  return (
    <>
      <Text testID="fingerprint">{fingerprintText}</Text>
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
