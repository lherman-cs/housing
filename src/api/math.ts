import {HousingNumber, GrowableNumber} from "./number";
import {copy} from "./copy";

export type Plan = 'house' | 'rental'
export type TaxFilingStatus = 'individual' | 'joint'

export class Investment {
  principle = new GrowableNumber(100000, new HousingNumber(0.06, "yearly"));
  contribution = new HousingNumber(1000, "monthly");
  totalGain = 0;

  clone() {
    const investment = new Investment();
    return copy(this, investment);
  }
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
  insurance = new HousingNumber(85, "monthly");
  house = new House();
  rental = new Rental();

  clone(): Housing {
    const housing = new Housing();
    return copy(this, housing);
  }
}

export class House {
  repairCost = new HousingNumber(500, "yearly");
  housePrice = 250000;
  growthRate = new HousingNumber(0.04, "yearly");
  hoaFee = new HousingNumber(250, "monthly");
  loan = new Loan();
  buyClosingCosts = .04;
  sellClosingCosts = .06;

  clone(): House {
    const house = new House();
    return copy(this, house);
  }
}

export class Rental {
  paymentIncrease = new HousingNumber(0.04, "yearly");
  payment = new HousingNumber(900, "monthly");

  clone(): Rental {
    const rental = new Rental();
    return copy(this, rental);
  }
}

export class Data {
  housing = new Housing();
  investment = new Investment();
  taxes = new Tax();
  inflation = new HousingNumber(0.02, "yearly");

  clone() {
    const data = new Data();
    return copy(this, data);
  }
}

export class State {
  data = new Data();
  netWorth = 0;

  clone() {
    const state = new State();
    return copy(this, state);
  }
}

export type CalculateFn = (state: State, month: number) => State;

export function log(fn: CalculateFn, label?: string): CalculateFn {
  const buff: string[] = [];
  function logDiff(oldState: any, newState: any, prefixes: string[]) {
    if (typeof newState !== 'object') {
      if (oldState !== newState) {
        buff.push(`\t${prefixes.join(".")}: ${oldState} -> ${newState}`);
      }

      return;
    }


    for (const key in newState) {
      prefixes.push(key);
      logDiff(oldState[key], newState[key], prefixes);
      prefixes.pop();
    }
  }

  label = label ? `(${label})` : "";
  return (oldState: State, month: number): State => {
    const newState = fn(oldState, month);
    buff.push(`Changes in state on month ${month} ${label}:`);
    logDiff(oldState, newState, []);
    console.debug(buff.join("\n"));
    buff.length = 0;

    return newState;
  }
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
  assert(base.amount >= 0, "base is negative");
  assert(years >= 0, "years is negative");

  let total = base.amount;
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

export const increaseByRate = (rate: number) => (amount: number) => (1 + rate) * amount;

function chainCalculations(...fns: CalculateFn[]): CalculateFn {
  return (state: State, month: number): State => {
    for (const fn of fns) {
      state = fn(state, month)
    }

    return state;
  }
}

export function calculateMonth(): CalculateFn {
  return chainCalculations(
    reccuringInvestment(),
    housingExpenses(),
    taxCredits(),
  )
}

export function postCalculateMonth(initialState: State): CalculateFn {
  return chainCalculations(sellHouse(initialState), sellInvestment());
}

export type Callbacks = {
  ongoing: CalculateFn,
  post: CalculateFn
};

export function* calculateDefault(initialData: Data, months: number): Generator<State> {
  const initialState = new State();
  initialState.data = initialData.clone();

  yield* calculate(initialState, months, {
    ongoing: calculateMonth(),
    post: postCalculateMonth(initialState),
  });
}

export function* calculate(state: State, months: number, callbacks: Callbacks): Generator<State> {
  state = state.clone();
  const loan = state.data.housing.house.loan;
  const housing = state.data.housing;
  const investment = state.data.investment;
  loan.principle.amount = housing.house.housePrice - housing.downPayment;
  let closingCosts = 0;
  if (housing.plan === "house") {
    closingCosts = housing.house.housePrice * housing.house.buyClosingCosts;
  }
  investment.principle.amount -= (housing.downPayment + closingCosts);


  for (let month = 1; month <= months; month++) {
    console.log("Calculating month ", month);
    state = callbacks.ongoing(state, month);
    yield callbacks.post(state, month);
  }
}

export function principleAfterInterest(principle: number, rate: number): number {
  expect(rate >= 0 && rate <= 1, "rate is not between 0 and 1");
  return principle * (1 + rate);
}

export function reccuringInvestment(): CalculateFn {
  return (state: State, _: number): State => {
    const data = state.data;
    const contribution = data.investment.contribution;
    const rate = data.investment.principle.rate;
    const principle = data.investment.principle.amount;
    assert(principle >= 0, "base is negative");

    const newPrinciple = principleAfterInterest(principle, rate.monthly());
    const newState = state.clone();
    newState.data.investment.principle.amount = newPrinciple + contribution.monthly();
    newState.data.investment.totalGain += newPrinciple - principle;

    return newState;
  };
};

export function housingExpenses(): CalculateFn {
  return (state: State, month: number): State => {
    const housing = state.data.housing;
    const investment = state.data.investment;
    let fn: CalculateFn | null;

    const rentIncome = housing.chargeForRoom.monthly() * housing.extraBedrooms;
    investment.principle.amount +=
      rentIncome
      - housing.insurance.monthly()
      - housing.utilityCost.monthly();

    if (month % 12 === 0) {
      const increaseByInflation = increaseByRate(state.data.inflation.yearly());

      housing.chargeForRoom.update("monthly", increaseByRate(housing.chargeForRoomIncrease.yearly()));
      housing.insurance.update("monthly", increaseByInflation);
      housing.utilityCost.update("monthly", increaseByInflation);
    }

    switch (housing.plan) {
      case "house":
        fn = houseExpenses(housing.house);
        break;
      case "rental":
        fn = rentalExpenses(housing.rental);
        break;
      default:
        throw new Error("Unsupported plan");
    }

    return fn(state, month);
  }
}

function houseExpenses(house: House): CalculateFn {
  return (state: State, month: number): State => {
    const expense =
      - loanPayment(house.loan).monthly()
      - house.repairCost.monthly()
      - house.hoaFee.monthly()
      - state.data.taxes.property.monthly() * house.housePrice;

    const newState = state.clone();
    newState.data.investment.principle.amount += expense;

    const newHouse = newState.data.housing.house;
    newHouse.housePrice = principleAfterInterest(newHouse.housePrice, newHouse.growthRate.monthly());

    if (month % 12 === 0) {
      const increaseByInflation = increaseByRate(newState.data.inflation.yearly());

      newHouse.repairCost.update("monthly", increaseByInflation);
      newHouse.hoaFee.update("monthly", increaseByInflation);
    }

    return newState;
  }
}

function rentalExpenses(rental: Rental): CalculateFn {
  return (state: State, month: number): State => {
    const newState = state.clone();
    newState.data.investment.principle.amount -= rental.payment.monthly();

    if (month % 12 === 0) {
      const newRental = newState.data.housing.rental;
      newRental.payment.update("monthly", increaseByRate(rental.paymentIncrease.yearly()));
    }

    return newState;
  }
}

export function sellInvestment(): CalculateFn {
  return (state: State, _: number): State => {
    const newState = state.clone();
    const investment = newState.data.investment;
    const capitalGainsRate = newState.data.taxes.capitalGainsRate;

    newState.netWorth += investment.totalGain * (1 - capitalGainsRate)
      + investment.principle.amount - investment.totalGain;
    return newState;
  }
}

/*
 * sellHouse simulates the net gain of selling the house
 * */
export function sellHouse(initialState: State): CalculateFn {
  const initialHousePrice = initialState.data.housing.house.housePrice;
  return (state: State, _: number): State => {
    if (state.data.housing.plan !== "house") {
      return state;
    }

    const newState = state.clone();

    // loan principle is how much is owed on the loan
    const loanPrinciple = newState.data.housing.house.loan.principle.amount;

    // closing costs, a percent of which comes out of home value
    const closingCosts = newState.data.housing.house.sellClosingCosts;

    // house price is an estimation of what the house is worth
    // Note: house price has already been appreciated for the month
    const housePrice = newState.data.housing.house.housePrice;

    const sellExpenses = housePrice * closingCosts + loanPrinciple;
    let gain = housePrice - initialHousePrice;
    const capitalGainsRate = newState.data.taxes.capitalGainsRate;
    const filingStatus = newState.data.taxes.filingStatus;
    const limit = filingStatus === 'joint' ? 500000 : 250000;

    // apply capital gains exemption
    if (gain > limit) {
      gain = limit + (gain - limit) * (1 - capitalGainsRate);
    }

    newState.netWorth += (initialHousePrice + gain - sellExpenses);

    return newState;
  }
}

/*
   loanPayment computes and returns the monthly morgage (loan) payment
*/
export function loanPayment(loan: Loan) {
  const numPayments = 12 * loan.term;
  const rate = loan.principle.rate.monthly()
  const top = rate * Math.pow(1 + rate, numPayments)
  const bottom = Math.pow(1 + rate, numPayments) - 1
  return new HousingNumber(loan.principle.amount * top / bottom, "monthly")
}

export function round(n: number) {
  return +n.toFixed(2)
}

/*
   loanPrinciple computes the total amount of principle owed on the loan after
      a specified number of years
*/
export function loanPrinciple(loan: Loan, years: number) {
  let loanAmount = loan.principle.amount;
  const months = years * 12;
  const payment = loanPayment(loan).monthly()
  for (let month = 0; month < months; month++) {
    const interest = loanAmount * loan.principle.rate.monthly()
    const principle = payment - interest
    loanAmount -= principle;
    if (loanAmount < 0) {loanAmount = 0; month = months;}
  }
  return loanAmount;
}

/*
   loanInterest computes the amount of interest paid in this month
*/
export function loanIntrest(loan: Loan) {
  const principle = loan.principle.amount;

  const payment = loanPayment(loan).monthly();
  const interestPaid = principle * loan.principle.rate.monthly();
  const principlePaid = payment - interestPaid;
  let newPrinciple = principle - principlePaid;
  if (principle < principlePaid) {newPrinciple = 0;}

  return {
    interestPaid,
    newPrinciple
  };
}

/*
  taxCredits adds tax breaks from newWorth once a year
  Credits considered are:
    * Morgage Interest Deduction (consider morgage interest payments as
       tax deductions)
    * Property Tax Deductions (consider property tax as a deduction)

  It is assumed that deductions will not affect your tax bracket (even
    though this is not always the case). For example

    If you paid $4000 in propery tax and you are in the 25% tax bracket, your
      deduction would be valued at 4000 * .25 = 1000 and the calculator will
      apply 1000 to netWorth.

  Credits not considered are:
    * Capital Gains Exemption (assume the owner has lived in the house
       2 of last 5 years and as such qualifies for the this deduction
       which means for the first 250k of profit made from sale of home
       when single and first 500k of profit made from sale of home for
       joint (married) filers, no capital gains tax is applied)
*/
export function taxCredits(): CalculateFn {
  // Store how much interest has been paid this year in local state
  let interest = 0;

  return (state: State, month: number): State => {
    // Tax credits do not apply to renters
    if (state.data.housing.plan === 'rental') {
      return state;
    }

    const taxes = state.data.taxes;
    const {interestPaid, newPrinciple} =
      loanIntrest(state.data.housing.house.loan)

    // Update interest paid this year
    interest += interestPaid;

    const newState = state.clone();

    // Update principle owed on loan
    newState.data.housing.house.loan.principle.amount = newPrinciple;

    if (month % 12 === 0) {
      // Morgage Interest Deduction
      const principle = newState.data.investment.principle;
      principle.amount += interest * taxes.marginalIncomeTaxRate;
      interest = 0;
      // Property Tax Deduction
      principle.amount += taxes.property.yearly() * taxes.marginalIncomeTaxRate;
    }

    return newState;
  }
}
