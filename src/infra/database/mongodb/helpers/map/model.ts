export const toModel = <T>(collection: any): T => {
  const { _id, __v, ...collectionWithoutId } = collection;
  return { ...collectionWithoutId, id: _id.toHexString() };
};
