import {HousingNumber, GrowableNumber} from "./number";
import {copy} from "./copy";

export type Plan = 'house' | 'rental'
export type TaxFilingStatus = 'individual' | 'joint'

export class Investment {
  principle = new GrowableNumber(100000, new HousingNumber(0.06, "yearly"));
  contribution = new HousingNumber(1000, "monthly");
}

export class Tax {
  property = new HousingNumber(0.01, "yearly");
  householdIncome = new HousingNumber(220000, "yearly");
  capitalGainsRate = .15;
  filingStatus: TaxFilingStatus = "joint";
  marginalIncomeTaxRate = .24;

  clone(): Tax {
    const tax = new Tax();
    return copy(this, tax);
  }
}

export class Loan {
  term = 30;
  principle = new GrowableNumber(200000, new HousingNumber(0.03, "yearly"));

  clone(): Loan {
    const loan = new Loan();
    return copy(this, loan);
  }
}

export class Housing {
  plan: Plan = "house";
  downPayment = 50000;
  chargeForRoom = new HousingNumber(600, "monthly");
  chargeForRoomIncrease = new HousingNumber(0.03, "yearly");
  extraBedrooms = 0;
  utilityCost = new HousingNumber(100, "monthly");

  clone(): Housing {
    const housing = new Housing();
    return copy(this, housing);
  }
}

export class House extends Housing {
  plan = "house" as Plan;
  repairCost = new HousingNumber(500, "yearly");
  housePrice = 250000;
  growthRate = new HousingNumber(0.04, "yearly");
  hoaFee = new HousingNumber(250, "monthly");
  loan = new Loan();
  insurance = new HousingNumber(85, "monthly");
  buyClosingCosts = .04;
  sellClosingCosts = .06;

  clone(): House {
    const house = new House();
    return copy(this, house);
  }
}

export class Rental extends Housing {
  plan = "rental" as Plan;
  paymentIncrease = new HousingNumber(0.04, "yearly");
  payment = new HousingNumber(900, "monthly");

  clone(): Rental {
    const rental = new Rental();
    return copy(this, rental);
  }
}

export class Data {
  housing: Housing = new House();
  investment = new Investment();
  taxes = new Tax();
}
export class State {
  data = new Data();
  netWorth = 0;
  monthlyPayment = 0;

  clone() {
    const state = new State();
    return copy(this, state);
  }
}

export type CalculateFn = (state: State, month: number) => State;

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

export function* calculate(data: Data, months: number): Generator<State> {
  const calculateFns: CalculateFn[] = [
    reccuringInvestment(),
    housingExpenses(),
  ];

  const postCalculateFns: CalculateFn[] = [
    monthlyPayment(),
  ];

  let state = new State();
  state.data = data;

  for (let month = 1; month <= months; month++) {
    for (const fn of calculateFns) {
      state = fn(state, month);
    }

    let snapState = state.clone();
    for (const fn of postCalculateFns) {
      snapState = fn(snapState, month);
    }

    yield snapState
  }
}

function principleAfterInterest(principle: number, rate: number): number {
  expect(rate >= 0 && rate <= 1, "rate is not between 0 and 1");
  return principle * (1 + rate);
}

export function reccuringInvestment(): CalculateFn {
  return (state: State, _: number): State => {
    const data = state.data;
    const contribution = data.investment.contribution;
    const rate = data.investment.principle.rate;
    const principle = data.investment.principle.start;
    assert(principle >= 0, "base is negative");

    const newPrinciple = principleAfterInterest(principle, rate.monthly()) + contribution.monthly();
    const newState = state.clone();
    newState.data.investment.principle.start = newPrinciple;
    newState.netWorth = newPrinciple - principle;

    return newState;
  };
};

function housingExpenses(): CalculateFn {
  return (state: State, month: number): State => {
    const housing = state.data.housing;
    let fn: CalculateFn | null;

    switch (housing.plan) {
      case "house":
        fn = houseExpenses(housing as House);
        break;
      case "rental":
        fn = rentalExpenses(housing as Rental);
        break;
      default:
        throw new Error("Unsupported plan");
    }

    return fn(state, month);
  }
}

function houseExpenses(house: House): CalculateFn {
  return (state: State, month: number): State => {
    const rentIncome = house.chargeForRoom.monthly() * house.extraBedrooms;
    const expense =
      - loanPayment(house.loan).monthly()
      - house.insurance.monthly()
      - house.utilityCost.monthly()
      - house.repairCost.monthly()
      - house.hoaFee.monthly()
      + rentIncome;

    const newState = state.clone();
    newState.netWorth += expense;

    if (month % 12 === 0) {
      const newHouse = newState.data.housing as House;
      const newChargeForRoom = (1 + house.chargeForRoomIncrease.yearly()) * house.chargeForRoom.monthly();
      newHouse.chargeForRoom = new HousingNumber(newChargeForRoom, "monthly");

      newHouse.housePrice = principleAfterInterest(newHouse.housePrice, newHouse.growthRate.yearly());
    }

    return newState;
  }
}

function rentalExpenses(rental: Rental): CalculateFn {
  return (state: State, month: number): State => {
    const expense = rental.utilityCost.monthly() - rental.payment.monthly();
    const newState = state.clone();
    newState.netWorth += expense;

    if (month % 12 === 0) {
      const newRental = newState.data.housing as Rental;
      const newMonthlyPayment = (1 + rental.payment.monthly()) * rental.paymentIncrease.yearly();
      newRental.payment = new HousingNumber(newMonthlyPayment, "monthly");
    }

    return newState;
  }
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

export function monthlyPayment(): CalculateFn {
  return (state: State, month: number): State => {
    const housing = state.data.housing;
    const isHouse = housing.plan === 'house';
    const fn = isHouse ? monthlyPaymentHouse(housing as House) : monthlyPaymentRental(housing as Rental);
    return fn(state, month);
  }
}

function monthlyPaymentRental(rental: Rental): CalculateFn {
  return (state: State, _: number): State => {
    const newState = state.clone();
    newState.monthlyPayment += rental.payment.monthly() + rental.utilityCost.monthly();

    return newState;
  }
}

function monthlyPaymentHouse(house: House): CalculateFn {
  return (state: State, _: number): State => {
    const taxes = state.data.taxes;
    const newState = state.clone();
    newState.monthlyPayment += loanPayment(house.loan).monthly()
      + house.hoaFee.monthly()
      + house.insurance.monthly()
      + taxes.property.monthly()
      + house.repairCost.monthly()
      + house.utilityCost.monthly()

    return newState;
  }
}
