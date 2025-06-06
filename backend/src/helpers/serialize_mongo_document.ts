export function serializeMongoDocument<T extends { _id: any }>(doc: T): Omit<T, "_id"> & { _id: string } {
  return {
    ...doc,
    _id: doc._id.toString(),
  };
}

export function serializeMongoDocuments<T extends { _id: any }>(docs: T[]): (Omit<T, "_id"> & { _id: string })[] {
  return docs.map(serializeMongoDocument);
}
