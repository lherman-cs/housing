import { HousingNumber } from "./number";

export type Plan = 'house' | 'rental'

export interface IInvestment {
  principle: number;
  contribution: HousingNumber;
  growthRate: HousingNumber;
}

export interface IHousing {
  plan: Plan;
  payment: HousingNumber;
  downPayment: number;
  chargeForRoom: HousingNumber;
  chargeForRoomIncrease: HousingNumber;
  extraBedrooms: number;
  utilityCost: HousingNumber;
}

export interface IHouse extends IHousing {
  repairCost: HousingNumber;
  housePrice: number;
  growthRate: HousingNumber;
  hoaFee: HousingNumber;
}

export interface IRental extends IHousing {
  paymentIncrease: HousingNumber;
}

function assert(condition: boolean, message?: string) {
  if (!condition) {
    throw new Error("Abort assertion failed" + message ? ": " + message : '');
  }
}

function expect(condition: boolean, message?: string) {
  if (!condition) {
    console.warn("Condition not met" + message ? ": " + message : '');
  }
}

/*
   'base' is how much you spend the first year
   'base' + 'base' * 'rate' is how much you spend the next year
   etc. 

   exponentialSum computes the total amount of money you spent over a specified amount of 'years'
*/
export function exponentialSum(base: number, rate: HousingNumber, years: number): number {
  const ratePerYear = rate.yearly();
  expect(ratePerYear >= 0 && ratePerYear <= 1, "rate is not between 0 and 1");
  assert(base >= 0, "base is negative");
  assert(years >= 0, "years is negative");

  let total = base;
  let curr = base;
  for (let year = 1; year < years; year++) {
    curr += curr * ratePerYear;
    total += curr;
  }
  return total;
};

/**
 * Computes the amount of money you will have after investing for 'months' assuming you have 'base'
 *    (principle) invested and you add 'invest' money to the investment and the investe money grows
 *    at a 'rate' each month
 * @param base principle, the amount of money invested at the start time
 * @param invest 
 * @param rate 
 * @param months 
 */
export function reccuringInvestment(base: number, invest: HousingNumber, rate: HousingNumber, months: number): number {
  const investPerMonth = invest.monthly();
  const ratePerMonth = rate.monthly();
  expect(ratePerMonth >= 0 && ratePerMonth <= 1, "rate is not between 0 and 1");
  assert(investPerMonth >= 0, "invest is negative");
  assert(base >= 0, "base is negative");
  assert(months >= 0, "months is negative");
  function* invests() {
    for (let month = 0; month < months; month++) {
      yield investPerMonth;
    }
  };

  return reccuringInvestmentWithGenerator(base, invests(), rate);
};

/**
 * 
 * @param base 
 * @param invests 
 * @param rate 
 */
export function reccuringInvestmentWithGenerator(base: number, invests: Generator<number>, rate: HousingNumber): number {
  let ratePerMonth = rate.monthly();
  expect(ratePerMonth >= 0 && ratePerMonth <= 1, "rate is not between 0 and 1");
  assert(base >= 0, "base is negative");
  let curr = base;
  ratePerMonth += 1;
  for (const invest of invests) {
    curr = curr * ratePerMonth + invest;
  }
  return curr;
};

export function investmentLoss(housing: IHousing, investment: IInvestment, years: number) {
  assert(years >= 0, "years is negative");

  switch (housing.plan) {
    case "house":
      return investmentLossHouse(housing as IHouse, investment, years);
    case "rental":
      return investmentLossRental(housing as IRental, investment, years);
    default:
      throw new Error("Unsupported plan");
  }
}

function investmentLossHouse(house: IHouse, investment: IInvestment, years: number) {
  assert(years >= 0, "years is negative");

  const withoutHousing = reccuringInvestment(
    investment.principle,
    investment.contribution,
    investment.growthRate,
    years * 12);

  function* invests() {
    const months = years * 12;
    let rentIncome = house.chargeForRoom.monthly() * house.extraBedrooms;
    for (let month = 1; month <= months; month++) {
      yield (
        investment.contribution.monthly()
        - house.utilityCost.monthly()
        - house.payment.monthly()
        - house.repairCost.monthly()
        - house.hoaFee.monthly()
        + rentIncome
      );

      if (month % 12 === 0) {
        rentIncome *= (1 + house.chargeForRoomIncrease.yearly());
      }
    }
  }

  const withHousing = reccuringInvestmentWithGenerator(
    investment.principle - house.downPayment,
    invests(),
    investment.growthRate
  )

  // const withHousing = reccuringInvestment(
  //   investment.principle - house.downPayment,
  //   investment.monthlyInvestment - house.utilityCost - house.monthlyPayment,
  //   investment.growthRatePerYear / 12,
  //   years * 12);
  return withoutHousing - withHousing;
}

function investmentLossRental(house: IRental, investment: IInvestment, years: number) {
  assert(years >= 0, "years is negative");

  const withoutHousing = reccuringInvestment(
    investment.principle,
    investment.contribution,
    investment.growthRate,
    years * 12);

  function* invests() {
    const months = years * 12;
    let monthlyPayment = house.payment.monthly();
    for (let month = 1; month <= months; month++) {
      yield (investment.contribution.monthly() - house.utilityCost.monthly() - monthlyPayment);
      if (month % 12 === 0) {
        monthlyPayment *= (1 + house.paymentIncrease.yearly());
      }
    }
  }
  const withHousing = reccuringInvestmentWithGenerator(
    investment.principle - house.downPayment,
    invests(),
    investment.growthRate);
  return withoutHousing - withHousing;
}

export function houseAppreciation(house: IHouse, years: number) {
  return house.housePrice * Math.pow(1 + house.growthRate.yearly(), years)
}
