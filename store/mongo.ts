import {Db, MongoClient} from "mongodb";

export class MongoDBClient {
    private client: MongoClient;

    constructor(private uri: string = "mongodb://agriism-trades:monkey42cup@agriism-shared-shard-00-00.kn7oi.mongodb.net:27017,agriism-shared-shard-00-01.kn7oi.mongodb.net:27017,agriism-shared-shard-00-02.kn7oi.mongodb.net:27017/agriism-rates?ssl=true&replicaSet=atlas-dblji3-shard-0&authSource=admin&retryWrites=true&w=majority") {
    }

    async getClient(): Promise<MongoClient> {
        if (this.client) {
            return this.client
        }
        let options = {};
        this.client = await MongoClient.connect(this.uri, options);
        return this.client
    }

    async getDb(dbName: string = 'agriism-trades'): Promise<Db> {
        return (await this.getClient()).db(dbName);
    }
}

export const mongoDbClient = new MongoDBClient();
