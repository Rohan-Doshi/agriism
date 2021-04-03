import {accountRepo} from "./src/accounts/accounts.repo";

async function testing() {
    const a = await accountRepo.getUser('doshi.rohan09@gmail.com', 'testing123');
    console.log(JSON.stringify(a));
}


testing()
