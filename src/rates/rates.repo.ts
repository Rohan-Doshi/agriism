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

    private async buildIndex() {
        (await this.collection).createIndex({emailId: 1}, {unique: true});
        (await this.collection).createIndex({pk: 1}, {unique: true});
        (await this.collection).createIndex({pinCode: 1});
    }
}

export const ratesRepo = new AccountsRepo(mongoDbClient);

export interface RateDetails {
    date: string;
    accountId: string;
    rates: ProductRates[];
}

export interface ProductRates {
    productName: string;
    rate: number;
}
