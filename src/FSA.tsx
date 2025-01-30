interface LocalAuthorities {
  localAuthorities: LocalAuthority[];
}

interface LocalAuthority {
  localAuthorityId: number;
  name: string;
}

export const getAuthorities: () => Promise<LocalAuthority[]> = async () => {
  const authorities = await fetch(
    "https://aws.jeremygreen.me.uk/api/fsa/localAuthority",
  );
  const json = (await authorities.json()) as unknown as LocalAuthorities;
  const { localAuthorities } = json;
  return localAuthorities;
};
