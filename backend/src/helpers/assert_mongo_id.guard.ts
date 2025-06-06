import type { MongoID } from "../models/mongo/mongo_id";

export function assertMongoId(id: string): asserts id is MongoID {
  if (id.length !== 24) {
    throw new Error("Bad Id string (should be 24 chars)!");
  }
}
