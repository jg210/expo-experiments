import { useQuery } from "@tanstack/react-query";
import { FlatList, Text } from "react-native";

interface localAuthorities {
  localAuthorities: LocalAuthority[]
}

interface LocalAuthority {
  localAuthorityId: number;
  name: string;
}

const queryKey = ["authorities"];
const getAuthorities: () => Promise<LocalAuthority[]> = async () => {
  const authorities = await fetch("https://aws.jeremygreen.me.uk/api/fsa/localAuthority");
  const json = await authorities.json() as unknown as localAuthorities;
  return json.localAuthorities;
};

interface ItemProps {
  name: string;
}
const Item = ({ name }: ItemProps) => <Text>{name}</Text>;

export const Authorities = () => {
  const { data } = useQuery({ queryKey, queryFn: getAuthorities });
  return (
    <FlatList
        data={data}
        renderItem={({ item }) => <Item name={item.name} />}
        keyExtractor={(item) => item.localAuthorityId.toString()}
    />
  );
};
