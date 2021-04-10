import {mongoDbClient, MongoDBClient} from "../../store/mongo";
import {Collection} from "mongodb";

export class AccountsRepo {
    private collection: Promise<Collection<RateDetails>>;

    constructor(private mongo: MongoDBClient) {
        this.collection = mongo.getDb().then(db => db.collection('rates'));
        this.buildIndex();
    }

    async addRates(rateDetails: RateDetails): Promise<RateDetails> {
        return (await this.collection).insertOne(rateDetails)
            .then(result => {
                return result.ops[0];
            }).catch(async err => {
                console.log(`Error adding rates for user ${rateDetails.accountId} --> ${err.message}`);
                throw err;
            });
    }

    async getAllLocations(): Promise<string[]> {
        return (await this.collection)
            .distinct('city').then(r => r);
    }

    async getRates(localeDateString: string): Promise<RateDetails[]> {
        return (await this.collection).find({date: localeDateString}).toArray();
    }

    private async buildIndex() {
        (await this.collection).createIndex({date: 1, accountId: 1, city: 1, productName: 1}, {unique: true});
        (await this.collection).createIndex({city: 1});
        (await this.collection).createIndex({date: 1});
        (await this.collection).createIndex({accountId: 1});
    }
}

export const ratesRepo = new AccountsRepo(mongoDbClient);

export interface RateDetails {
    date: string;
    accountId: string;
    city: string;
    productName: string;
    rate: number;
    clientName: string;
    clientPhoneNumber: number;
}

export interface ProductRates {
    productName: string;
    rate: number;
}
