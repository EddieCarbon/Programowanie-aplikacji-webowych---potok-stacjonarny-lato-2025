import * as mongodb from "mongodb";
import config from "../../config.json";
import { createMongoId } from "../helpers/create_mongo_id";
import type { WithoutId } from "../models/mongo/without_id";

class DBService {
  private db!: mongodb.Db;

  constructor() {
    this.connect();
  }

  private async connect() {
    const client = new mongodb.MongoClient(config.mongodb_uri);
    await client.connect();
    this.db = client.db(config.db_name);
  }

  async create(data: mongodb.Document, collection: string) {
    return this.db
      .collection(collection)
      .insertOne(data)
      .then((data) => (data.acknowledged ? data.insertedId.toString() : null));
  }

  async find<Object extends Record<string, any> = Record<string, any>>(
    query = {},
    collection: string,
  ) {
    return this.db.collection(collection).find<Object>(query).toArray();
  }

  async findOne<Object extends mongodb.Document = mongodb.Document>(
    id: string,
    collection: string,
  ) {
    return this.db
      .collection(collection)
      .findOne<Object>({ _id: createMongoId(id) });
  }

  async replace(
    id: string,
    data: WithoutId<mongodb.Document>,
    collection: string,
  ) {
    return this.db
      .collection(collection)
      .replaceOne({ _id: createMongoId(id) }, data)
      .then((data) => data.modifiedCount === 1);
  }

  async patch(id: string, data: mongodb.Document, collection: string) {
    return this.db
      .collection(collection)
      .updateOne({ _id: createMongoId(id) }, { $set: data })
      .then((data) => data.modifiedCount === 1);
  }

  async delete(id: string, collection: string) {
    return this.db
      .collection(collection)
      .deleteOne({ _id: createMongoId(id) })
      .then((data) => data.deletedCount === 1);
  }
}

export const dbService = new DBService();
