export const refUser = (id: number, firstName: string, lastName: string, nickName?: string): string => {
  const name = nickName ?? `${firstName} ${lastName}`;
  return `@id${id} (${name})`;
};
