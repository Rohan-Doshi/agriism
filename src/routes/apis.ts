import {Router} from "express";
import {accountRepo} from "../accounts/accounts.repo";
import {v1 as uuid} from 'uuid';
import {ProductRates, ratesRepo} from "../rates/rates.repo";

const router = Router();

router.get('/healthcheck', async function (req, res, next) {
    return res.send({message: "This is more shit"});
});

router.post('/account/create', async function (req, res, next) {
    const name = req.body.name;
    const phone = req.body.phone;
    const emailId = req.body.emailId;
    const password = req.body.password;
    const address = req.body.address;
    const city = req.body.cityname;
    const pinCode = req.body.pincode;

    return accountRepo.createAccount({
        pk: uuid(),
        emailId,
        address,
        password,
        pinCode,
        name,
        city,
        phone
    }).then(account => {
        return res.send(account);
    });
});

router.post('/account/login', async function (req, res, next) {
    const emailId = req.body.emailId;
    const password = req.body.password;

    return accountRepo.getUser(emailId, password).then(account => {
        return res.send(account);
    });
});

router.post('/rates/add', async function (req, res, next) {
    const id = req.body.userPk;
    const rates: ProductRates[] = req.body.rates;
    const date = new Date().toLocaleDateString();

    return ratesRepo.addRates({
        accountId: id,
        date,
        rates
    }).then(result => {
        return res.send({message: 'added'});
    });
});

export const apiRouter = router;
