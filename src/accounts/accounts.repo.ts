import {mongoDbClient, MongoDBClient} from "../../store/mongo";
import {Collection} from "mongodb";
import {v1 as uuid} from 'uuid';

export class AccountsRepo {
    private collection: Promise<Collection<AccountDetails>>;

    constructor(private mongo: MongoDBClient) {
        this.collection = mongo.getDb().then(db => db.collection('account'));
        this.buildIndex();
    }

    async createAccount(account: AccountDetails): Promise<AccountDetails | Error> {
        if (!account.pk) {
            account.pk = uuid();
        }
        return (await this.collection).insertOne(account)
            .then(result => {
                return result.ops[0];
            }).catch(async err => {
                console.log(`Error adding potential influencer ${account.emailId} --> ${err.message}`);
                if (err.message.includes('duplicate key error')) {
                    return new Error("Account already exists");
                }
                throw err;
            });
    }

    async getUser(emailId: string, password: string): Promise<AccountDetails> {
        return (await this.collection).findOne({emailId, password});
    }

    private async buildIndex() {
        (await this.collection).createIndex({emailId: 1}, {unique: true});
        (await this.collection).createIndex({pk: 1}, {unique: true});
        (await this.collection).createIndex({pinCode: 1});
    }
}

export const accountRepo = new AccountsRepo(mongoDbClient);

export interface AccountDetails {
    pk?: string;
    name: string;
    phone: number;
    emailId: string;
    password: string;
    address: string;
    city: string;
    pinCode: number;
}
