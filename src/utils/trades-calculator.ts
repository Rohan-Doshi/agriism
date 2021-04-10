import {RateDetails} from "../rates/rates.repo";
import * as _ from 'lodash';

export function getMinMaxRateForAllProducts(allRatesOfDay: RateDetails[]) {
    const productsMap = _.groupBy<RateDetails>(allRatesOfDay, 'productName');
    const minMaxRates = [];
    const allProducts = Object.keys(productsMap);
    for (let product of allProducts) {
        let allRatesForProduct = productsMap[product];
        let minRates = _.minBy(allRatesForProduct, 'rate');
        let maxRates = _.maxBy(allRatesForProduct, 'rate');
        if (minRates.city === maxRates.city) {
            continue;
        }
        minMaxRates.push({
            productName: product,
            profitPercentage: _.round((maxRates.rate - minRates.rate) * 100 / minRates.rate, 2),
            minRate: minRates.rate,
            sourceCity: minRates.city,
            sourceVendor: minRates.clientName + "<" + minRates.clientPhoneNumber.toString() + ">",
            maxRate: maxRates.rate,
            destinationCity: maxRates.city,
            destinationVendor: maxRates.clientName + "<" + maxRates.clientPhoneNumber.toString() + ">",
        });
    }
    return minMaxRates;
}

export function findAllPossibleTradesFrom(allRatesOfDay: RateDetails[], sourceCity: string) {
    const sourceCityRates = _.chain(allRatesOfDay)
        .filter(rate => rate.city === sourceCity)
        .groupBy(rate => rate.productName)
        .value();
    const minMaxRates = [];
    const allProductMap = _.groupBy<RateDetails>(allRatesOfDay, 'productName');
    const sourceCityProducts = Object.keys(sourceCityRates);
    for (let product of sourceCityProducts) {
        let minRates = _.minBy(sourceCityRates[product], rate => rate.rate);
        let allValidTradeOptions = allProductMap[product].filter(p => p.rate > minRates.rate && p.city !== minRates.city);
        if (allValidTradeOptions.length === 0) {
            continue;
        }
        let maxRates = _.maxBy(allValidTradeOptions, 'rate')
        minMaxRates.push({
            productName: product,
            profitPercentage: _.round((maxRates.rate - minRates.rate) * 100 / minRates.rate, 2),
            minRate: minRates.rate,
            sourceCity: minRates.city,
            sourceVendor: minRates.clientName + "<" + minRates.clientPhoneNumber.toString() + ">",
            maxRate: maxRates.rate,
            destinationCity: maxRates.city,
            destinationVendor: maxRates.clientName + "<" + maxRates.clientPhoneNumber.toString() + ">",
        });
    }
    return minMaxRates;
}

export function findAllPossibleTradesBetween(allRatesOfDay: RateDetails[], sourceCity: string, destination: string) {
    const sourceCityRates = _.chain(allRatesOfDay)
        .filter(rate => rate.city === sourceCity)
        .groupBy(rate => rate.productName)
        .value();
    const destinationCityRates = _.chain(allRatesOfDay)
        .filter(rate => rate.city === destination)
        .groupBy(rate => rate.productName)
        .value();
    const minMaxRates = [];
    const sourceCityProducts = Object.keys(sourceCityRates);
    for (let product of sourceCityProducts) {
        if (!destinationCityRates[product] || destinationCityRates[product].length === 0) {
            continue;
        }
        let minRates = _.minBy(sourceCityRates[product], rate => rate.rate);
        let maxRates = _.maxBy(destinationCityRates[product], rate => rate.rate);
        if (maxRates.rate < minRates.rate) {
            continue;
        }
        minMaxRates.push({
            productName: product,
            profitPercentage: _.round((maxRates.rate - minRates.rate) * 100 / minRates.rate, 2),
            minRate: minRates.rate,
            sourceCity: minRates.city,
            sourceVendor: minRates.clientName + "<" + minRates.clientPhoneNumber.toString() + ">",
            maxRate: maxRates.rate,
            destinationCity: maxRates.city,
            destinationVendor: maxRates.clientName + "<" + maxRates.clientPhoneNumber.toString() + ">",
        });
    }
    return minMaxRates;
}

