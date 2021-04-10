import {RateDetails} from "../rates/rates.repo";
import * as _ from 'lodash';

export function getMinMaxRateForAllProducts(allRatesOfDay: RateDetails[]) {
    const productsMap = _.groupBy<RateDetails>(allRatesOfDay, 'productName');
    const minMaxRates = {};
    const allProducts = Object.keys(productsMap);
    for (let product of allProducts) {
        let allRatesForProduct = productsMap[product];
        minMaxRates[product] = {
            minRates: _.minBy(allRatesForProduct, 'rate'),
            maxRates: _.maxBy(allRatesForProduct, 'rate')
        };
    }
    return minMaxRates;
}

export function findAllPossibleTradesFrom(allRatesOfDay: RateDetails[], sourceCity: string) {
    const sourceCityRates = _.chain(allRatesOfDay)
        .filter(rate => rate.city === sourceCity)
        .groupBy(rate => rate.productName)
        .value();
    const minMaxRates = {};
    const allProductMap = _.groupBy<RateDetails>(allRatesOfDay, 'productName');
    const sourceCityProducts = Object.keys(sourceCityRates);
    for (let product of sourceCityProducts) {
        let minRateOfCity = _.minBy(sourceCityRates[product], rate => rate.rate);
        let allValidTradeOptions = allProductMap[product].filter(p => p.rate > minRateOfCity.rate);
        if (allValidTradeOptions.length === 0) {
            continue;
        }
        minMaxRates[product] = {
            minRates: minRateOfCity,
            maxRates: _.maxBy(allValidTradeOptions, 'rate')
        };
    }
}

export function findAllPossibleTradesBetween(allRatesOfDay: RateDetails[], sourceCity: string, destination: string) {
    const sourceCityRates = _.chain(allRatesOfDay)
        .filter(rate => rate.city === sourceCity)
        .groupBy(rate => rate.productName)
        .value();
    const minMaxRates = {};
    const destinationCityRates = _.chain(allRatesOfDay)
        .filter(rate => rate.city === destination)
        .groupBy(rate => rate.productName)
        .value();
    const sourceCityProducts = Object.keys(sourceCityRates);
    for (let product of sourceCityProducts) {
        if (destinationCityRates[product].length === 0) {
            continue;
        }
        let minRateOfSourceCity = _.minBy(sourceCityRates[product], rate => rate.rate);
        let maxRateOfDestinationCity = _.maxBy(destinationCityRates[product], rate => rate.rate);
        if (maxRateOfDestinationCity.rate < minRateOfSourceCity.rate) {
            continue;
        }
        minMaxRates[product] = {
            minRates: minRateOfSourceCity,
            maxRates: maxRateOfDestinationCity
        };
    }
}
