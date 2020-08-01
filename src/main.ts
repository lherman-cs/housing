import { HousingNumber } from "./number";

export type Plan = 'house' | 'rental'

export interface IInvestment {
  principle: number;
  contribution: HousingNumber;
  growthRate: HousingNumber;
}

export interface ILoan {
  term: number;
  interestRate: HousingNumber;
  principle: number;
}

export interface IHousing {
  plan: Plan;
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
  loan: ILoan;
  insurance: HousingNumber;
  taxes: HousingNumber;
}

export interface IRental extends IHousing {
  paymentIncrease: HousingNumber;
  payment: HousingNumber;
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
        - loanPayment(house.loan).monthly()
        - house.taxes.monthly()
        - house.insurance.monthly()
        - house.utilityCost.monthly()
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
  ) + houseAppreciation(house, years);

  return withoutHousing - withHousing;
}

// TODO: Find bug!!!
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

export function loanPayment (loan: ILoan) {
  const numPayments = 12 * loan.term;
  const rate = loan.interestRate.monthly()
  const top = rate * Math.pow(1+rate, numPayments)
  const bottom = Math.pow(1+rate, numPayments) - 1
  return new HousingNumber(loan.principle * top / bottom, "monthly" )
}

export function round(n: number) {
  return +n.toFixed(2)
}

export function loanPrinciple(loan: ILoan, years: number){
  let loanAmount = loan.principle;
  const months = years * 12;
  const payment = loanPayment(loan).monthly()
  for (let month = 0; month < months; month++) {
    const interest = round(loanAmount * loan.interestRate.monthly())
    const principle = payment - interest
    loanAmount -= principle;
    if (loanAmount < 0) { loanAmount = 0; month = months;}
  }
  return Math.round(loanAmount);
}

function monthlyPaymentRental(rental: IRental){
  return rental.payment.monthly() + rental.utilityCost.monthly();
}

function monthlyPaymentHouse(house: IHouse){
  return loanPayment(house.loan).monthly()
    + house.hoaFee.monthly()
    + house.insurance.monthly() 
    + house.taxes.monthly() 
    + house.repairCost.monthly() 
    + house.utilityCost.monthly()
}

export function monthlyPayment(housing: IHousing){
  const isHouse = housing.plan === 'house';
  return isHouse ? monthlyPaymentHouse(housing as IHouse): monthlyPaymentRental(housing as IRental);
}