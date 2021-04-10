import {Router} from "express";
import {ratesRepo} from "../rates/rates.repo";
import {
    findAllPossibleTradesBetween,
    findAllPossibleTradesFrom,
    getMinMaxRateForAllProducts
} from "../utils/trades-calculator";
import * as _ from 'lodash';

const router = Router();

router.post('/trades/all', async (req, res, next) => {
    const sourceCity = req.body.sourceCity;
    const destinationCity = req.body.destinationCity;
    const dateOfTrade = req.body.dateOfTrade.toString();

    const date = new Date(dateOfTrade).toLocaleDateString();
    const allRatesOfDay = await ratesRepo.getRates(date);
    let responseData;

    if (!!sourceCity && !!destinationCity) {
        responseData = findAllPossibleTradesBetween(allRatesOfDay, sourceCity, destinationCity);
    } else if (!!sourceCity) {
        responseData = findAllPossibleTradesFrom(allRatesOfDay, sourceCity);
    } else {
        responseData = getMinMaxRateForAllProducts(allRatesOfDay);
    }
    return res.status(200).send({data: _.orderBy(responseData, 'profitPercentage', 'desc')});
});

router.get('/locations', async (req, res, next) => {
    const locationsData = await ratesRepo.getAllLocations();
    return res.status(200).send({locations: locationsData});
})

export const dashboardRouter = router;

