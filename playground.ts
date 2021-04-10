import {accountRepo} from "./src/accounts/accounts.repo";
import {ratesRepo} from "./src/rates/rates.repo";

async function testing() {
    const a = await ratesRepo.getAllLocations();
    console.log(a);
}


testing()
