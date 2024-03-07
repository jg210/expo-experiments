import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { FlatList, Text } from "react-native";

import { getAuthorities } from "./FSA";

const queryKey = ["authorities"];

interface ItemProps {
  name: string;
}
const Item = ({ name }: ItemProps) => <Text>{name}</Text>;

const Fallback = () => <Text>loading...</Text>;

// https://react.dev/reference/react/Suspense suggests can use Suspense in same component
// that can suspend, but that doesn't work, so need a separate component.
const AuthoritiesImpl = () => {
  const { data } = useSuspenseQuery({ queryKey, queryFn: getAuthorities });
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <Item name={item.name} />}
      keyExtractor={(item) => item.localAuthorityId.toString()}
    />
  );
};

export const Authorities = () => {
  return (
    <Suspense fallback={<Fallback />}>
      <AuthoritiesImpl />
    </Suspense>
  );
};
