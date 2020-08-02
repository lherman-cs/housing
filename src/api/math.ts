import { HousingNumber, GrowableNumber } from "./number";

export type Plan = 'house' | 'rental'

export class Investment {
  principle = new GrowableNumber(100000, new HousingNumber(0.06, "yearly"));
  contribution = new HousingNumber(1000, "monthly");
}

export class Loan {
  term = 30;
  principle = new GrowableNumber(200000, new HousingNumber(0.03, "yearly"));
}

export class Housing {
  plan: Plan = "house";
  downPayment = 50000;
  chargeForRoom = new HousingNumber(600, "monthly");
  chargeForRoomIncrease = new HousingNumber(0.03, "yearly");
  extraBedrooms = 0;
  utilityCost = new HousingNumber(100, "monthly");
}

export class House extends Housing {
  plan = "house" as Plan;
  repairCost = new HousingNumber(500, "yearly");
  housePrice = 250000;
  growthRate = new HousingNumber(0.04, "yearly");
  hoaFee = new HousingNumber(250, "monthly");
  loan = new Loan();
  insurance = new HousingNumber(85, "monthly");
  taxes = new HousingNumber(202, "monthly");
}

export class Rental extends Housing {
  plan = "rental" as Plan;
  paymentIncrease = new HousingNumber(0.04, "yearly");
  payment = new HousingNumber(900, "monthly");
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
export function exponentialSum(base: GrowableNumber, years: number): number {
  expect(base.rate.yearly() >= 0 && base.rate.yearly() <= 1, "rate is not between 0 and 1");
  assert(base.start >= 0, "base is negative");
  assert(years >= 0, "years is negative");

  let total = base.start;
  let year = 1;

  for (const current of base.generator("yearly")) {
    if (year >= years) {
      break;
    }
    
    total += current;
    year += 1;
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

export function investmentLoss(housing: Housing, investment: Investment, years: number) {
  assert(years >= 0, "years is negative");

  switch (housing.plan) {
    case "house":
      return investmentLossHouse(housing as House, investment, years);
    case "rental":
      return investmentLossRental(housing as Rental, investment, years);
    default:
      throw new Error("Unsupported plan");
  }
}

function investmentLossHouse(house: House, investment: Investment, years: number) {
  assert(years >= 0, "years is negative");

  const withoutHousing = reccuringInvestment(
    investment.principle.start,
    investment.contribution,
    investment.principle.rate,
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
    investment.principle.start - house.downPayment,
    invests(),
    investment.principle.rate
  ) + houseAppreciation(house, years);

  return withoutHousing - withHousing;
}

// TODO: Find bug!!!
function investmentLossRental(house: Rental, investment: Investment, years: number) {
  assert(years >= 0, "years is negative");

  const withoutHousing = reccuringInvestment(
    investment.principle.start,
    investment.contribution,
    investment.principle.rate,
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
    investment.principle.start - house.downPayment,
    invests(),
    investment.principle.rate);
  return withoutHousing - withHousing;
}

export function houseAppreciation(house: House, years: number) {
  return house.housePrice * Math.pow(1 + house.growthRate.yearly(), years)
}

export function loanPayment(loan: Loan) {
  const numPayments = 12 * loan.term;
  const rate = loan.principle.rate.monthly()
  const top = rate * Math.pow(1 + rate, numPayments)
  const bottom = Math.pow(1 + rate, numPayments) - 1
  return new HousingNumber(loan.principle.start * top / bottom, "monthly")
}

export function round(n: number) {
  return +n.toFixed(2)
}

export function loanPrinciple(loan: Loan, years: number) {
  let loanAmount = loan.principle.start;
  const months = years * 12;
  const payment = loanPayment(loan).monthly()
  for (let month = 0; month < months; month++) {
    const interest = round(loanAmount * loan.principle.rate.monthly())
    const principle = payment - interest
    loanAmount -= principle;
    if (loanAmount < 0) {loanAmount = 0; month = months;}
  }
  return Math.round(loanAmount);
}

function monthlyPaymentRental(rental: Rental) {
  return rental.payment.monthly() + rental.utilityCost.monthly();
}

function monthlyPaymentHouse(house: House) {
  return loanPayment(house.loan).monthly()
    + house.hoaFee.monthly()
    + house.insurance.monthly()
    + house.taxes.monthly()
    + house.repairCost.monthly()
    + house.utilityCost.monthly()
}

export function monthlyPayment(housing: Housing) {
  const isHouse = housing.plan === 'house';
  return isHouse ? monthlyPaymentHouse(housing as House) : monthlyPaymentRental(housing as Rental);
}
