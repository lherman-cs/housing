import {
  exponentialSum,
  reccuringInvestment,
  housingExpenses,
  principleAfterInterest,
  State,
  log,
  Loan,
  loanPayment,
  loanPrinciple,
  round,
  increaseByRate,
  sellHouse,
  sellInvestment,
  CalculateFn,
  calculateMonth,
  postCalculateMonth,
  calculate,
  Callbacks,
  loanIntrest
} from "./math";
import {HousingNumber, GrowableNumber} from "./number";

function offsetMonth(fn: CalculateFn, months: number): CalculateFn {
  return (state: State, month: number): State => {
    return fn(state, month + months);
  }
}

describe('calculate', function () {
  it('Happy Path 1', function () {
    const state = new State();
    const housing = state.data.housing;
    const house = housing.house;
    const investment = state.data.investment;
    const taxes = state.data.taxes;
    state.data.inflation.update("yearly", () => 0.02);

    house.housePrice = 300000;
    house.growthRate = new HousingNumber(0.05, 'yearly');
    housing.chargeForRoom = new HousingNumber(1200, 'monthly');
    housing.chargeForRoomIncrease = new HousingNumber(0.02, "yearly");
    housing.extraBedrooms = 0;
    housing.insurance = new HousingNumber(1000, 'monthly');
    housing.utilityCost = new HousingNumber(500, 'monthly');
    housing.downPayment = 0.2 * house.housePrice;
    house.repairCost = new HousingNumber(200, 'monthly');
    house.hoaFee = new HousingNumber(300, 'monthly');
    house.loan.term = 30;
    house.loan.principle.amount = 240000;
    house.loan.principle.rate.update("yearly", () => 0.03);
    house.buyClosingCosts = 0.04;
    house.sellClosingCosts = 0.06;

    investment.principle = new GrowableNumber(100000, new HousingNumber(0.06, "yearly"));
    investment.contribution.update("monthly", () => 20000);

    taxes.filingStatus = "individual";
    taxes.capitalGainsRate = 0.05
    taxes.property.update("yearly", () => 0.01);

    const callbacks: Callbacks = {
      ongoing: offsetMonth(log(calculateMonth(), "ongoing"), 10),
      post: offsetMonth(log(postCalculateMonth(state), "post"), 10)
    };

    const it = calculate(state, 2, callbacks);

    let result = it.next();
    expect(result.done).toEqual(false);
    const newState1 = result.value as State;
    const expectedLoan = loanIntrest(house.loan);
    const expectedHomeValue = principleAfterInterest(300000, 0.05 / 12) * 0.94 - expectedLoan.newPrinciple;
    // investment - tax
    const expectedInvestment = principleAfterInterest(28000, 0.06 / 12) + 16738 - 6.85;
    const expectedNetWorth = expectedInvestment + expectedHomeValue;

    expect(newState1.netWorth).toBeCloseTo(expectedNetWorth);
  });
});

describe('exponentialSum', function () {
  it('Happy Path', function () {
    expect(exponentialSum(new GrowableNumber(100, new HousingNumber(.00, "yearly")), 1)).toEqual(100);
    expect(exponentialSum(new GrowableNumber(100, new HousingNumber(.05, "yearly")), 1)).toEqual(100);
    expect(exponentialSum(new GrowableNumber(100, new HousingNumber(.05, "yearly")), 2)).toEqual(100 + 100 * 1.05);
    expect(exponentialSum(new GrowableNumber(100, new HousingNumber(.05, "yearly")), 3)).toEqual(100 + 100 * 1.05 + 100 * 1.05 * 1.05);
  })
});


describe('reccuringInvestment', function () {
  it('Happy Path 1', function () {
    const state = new State();
    const investment = state.data.investment;
    investment.contribution.update("monthly", _ => 1000);
    investment.principle.amount = 0;
    investment.principle.rate.update("monthly", _ => .05);
    investment.totalGain = 0;
    state.data.investment = investment;

    const expectedState = state.clone();
    expectedState.data.investment.principle.amount = 1000;
    expectedState.data.investment.totalGain = 0;

    const newState = log(reccuringInvestment())(state, 2);
    expect(newState).toEqual(expectedState)
  })

  it('Happy Path 2', function () {
    const state = new State();
    const investment = state.data.investment;
    investment.contribution.update("monthly", _ => 1000);
    investment.principle.amount = 1000;
    investment.principle.rate.update("monthly", _ => .05);
    state.data.investment = investment;

    const expectedState = state.clone();
    expectedState.data.investment.principle.amount = 2050;
    expectedState.data.investment.totalGain = 50;

    const newState = log(reccuringInvestment())(state, 3);
    expect(newState).toEqual(expectedState)
  })

  it('should work with multi months', function () {
    const state = new State();
    const investment = state.data.investment;
    investment.contribution.update("monthly", _ => 1000);
    investment.principle.amount = 0;
    investment.principle.rate.update("monthly", _ => .05);
    state.data.investment = investment;

    const expectedState1 = state.clone();
    expectedState1.data.investment.principle.amount = 1000;

    const newState1 = log(reccuringInvestment())(state, 0);
    expect(newState1).toEqual(expectedState1)

    const expectedState2 = expectedState1.clone();
    expectedState2.data.investment.principle.amount = 2050;
    expectedState2.data.investment.totalGain = 50;

    const newState2 = log(reccuringInvestment())(newState1, 1);
    expect(newState2).toEqual(expectedState2)
  })
})

describe('housingExpenses', function () {
  it('should work with single non-year changing month', function () {
    const state = new State();
    const housing = state.data.housing;
    const house = housing.house;
    const investment = state.data.investment;

    house.housePrice = 300000;
    house.growthRate = new HousingNumber(0.05, 'yearly');
    housing.chargeForRoom = new HousingNumber(1200, 'monthly');
    housing.extraBedrooms = 1;
    housing.insurance = new HousingNumber(1000, 'monthly');
    housing.utilityCost = new HousingNumber(500, 'monthly');
    house.repairCost = new HousingNumber(200, 'monthly');
    house.hoaFee = new HousingNumber(300, 'monthly');
    house.loan.term = 30;
    house.loan.principle = new GrowableNumber(100000, new HousingNumber(0.03, 'yearly'));
    investment.principle.amount = 0;

    const expectedState = state.clone();
    const expectedHousing = expectedState.data.housing;

    expectedHousing.house.housePrice = principleAfterInterest(house.housePrice, house.growthRate.monthly());
    expectedState.data.housing = expectedHousing;
    expectedState.data.investment.principle.amount = -800 - loanPayment(house.loan).monthly();

    const newState = log(housingExpenses())(state, 1);
    expect(newState).toEqual(expectedState);
  });

  it('should work with single year changing month', function () {
    const state = new State();
    const housing = state.data.housing;
    const house = housing.house;
    const investment = state.data.investment;

    house.housePrice = 300000;
    house.growthRate = new HousingNumber(0.05, 'yearly');
    housing.chargeForRoom = new HousingNumber(1200, 'monthly');
    housing.chargeForRoomIncrease = new HousingNumber(0.01, "yearly");
    housing.extraBedrooms = 1;
    housing.insurance = new HousingNumber(1000, 'monthly');
    housing.utilityCost = new HousingNumber(500, 'monthly');
    house.repairCost = new HousingNumber(200, 'monthly');
    house.hoaFee = new HousingNumber(300, 'monthly');
    house.loan.term = 30;
    house.loan.principle = new GrowableNumber(100000, new HousingNumber(0.03, 'yearly'));
    investment.principle.amount = 0;

    const expectedState = state.clone();
    const expectedHousing = expectedState.data.housing;
    const expectedHouse = expectedHousing.house;

    const increaseByInflation = increaseByRate(state.data.inflation.yearly());
    expectedHouse.housePrice = principleAfterInterest(house.housePrice, house.growthRate.monthly());
    expectedHousing.chargeForRoom.update("monthly", increaseByRate(0.01));
    expectedHousing.insurance.update("monthly", increaseByInflation);
    expectedHousing.utilityCost.update("monthly", increaseByInflation);
    expectedHouse.repairCost.update("monthly", increaseByInflation);
    expectedHouse.hoaFee.update("monthly", increaseByInflation);

    expectedState.data.housing = expectedHousing;
    expectedState.data.investment.principle.amount = -800 - loanPayment(house.loan).monthly();

    const newState = log(housingExpenses())(state, 12);
    expect(newState).toEqual(expectedState);
  });

  it('should work with multi months', function () {
    const state = new State();
    const housing = state.data.housing;
    const house = housing.house;
    const investment = state.data.investment;

    house.housePrice = 300000;
    house.growthRate = new HousingNumber(0.05, 'yearly');
    housing.chargeForRoom = new HousingNumber(1200, 'monthly');
    housing.extraBedrooms = 1;
    housing.insurance = new HousingNumber(1000, 'monthly');
    housing.utilityCost = new HousingNumber(500, 'monthly');
    house.repairCost = new HousingNumber(200, 'monthly');
    house.hoaFee = new HousingNumber(300, 'monthly');
    house.loan.term = 30;
    house.loan.principle = new GrowableNumber(100000, new HousingNumber(0.03, 'yearly'));
    investment.principle.amount = 0;

    const expectedState1 = state.clone();
    const expectedHousing1 = expectedState1.data.housing;
    const expectedHouse1 = expectedHousing1.house;

    expectedHouse1.housePrice = principleAfterInterest(expectedHouse1.housePrice, expectedHouse1.growthRate.monthly());
    expectedState1.data.housing = expectedHousing1;
    expectedState1.data.investment.principle.amount = -800 - loanPayment(expectedHouse1.loan).monthly();

    const newState1 = log(housingExpenses())(state, 1);
    expect(newState1).toEqual(expectedState1);

    const expectedState2 = expectedState1.clone();
    const expectedHousing2 = expectedState2.data.housing;
    const expectedHouse2 = expectedHousing2.house;

    expectedHouse2.housePrice = principleAfterInterest(expectedHouse2.housePrice, expectedHouse2.growthRate.monthly());
    expectedState2.data.housing = expectedHousing2;
    expectedState2.data.investment.principle.amount -= (800 + loanPayment(expectedHouse2.loan).monthly());

    const newState2 = log(housingExpenses())(newState1, 1);
    expect(newState2).toEqual(expectedState2);
  });
})

describe('sellHouse', function () {
  it('should work with single filing under 250k gain', function () {
    const state = new State();
    const housing = state.data.housing;
    const house = housing.house;
    const loan = state.data.housing.house.loan;
    const taxes = state.data.taxes;

    housing.downPayment = 20000;
    house.housePrice = 100000;
    house.sellClosingCosts = 0.06;
    loan.principle.amount = house.housePrice - housing.downPayment;
    taxes.filingStatus = "individual";
    taxes.capitalGainsRate = 0.05

    const stateAfterAppreciate = state.clone();
    const houseAfterAppreciate = stateAfterAppreciate.data.housing.house;
    houseAfterAppreciate.housePrice += 250000;

    const expectedState = stateAfterAppreciate.clone();
    expectedState.netWorth = houseAfterAppreciate.housePrice
      - houseAfterAppreciate.loan.principle.amount
      - houseAfterAppreciate.sellClosingCosts * houseAfterAppreciate.housePrice;

    const newState = log(sellHouse(state))(stateAfterAppreciate, 1);
    expect(newState).toEqual(expectedState);
  });

  it('should work with joint filing under 500k gain', function () {
    const state = new State();
    const housing = state.data.housing;
    const house = housing.house;
    const loan = state.data.housing.house.loan;
    const taxes = state.data.taxes;

    housing.downPayment = 50000;
    house.housePrice = 300000;
    house.sellClosingCosts = 0.06;
    loan.principle.amount = house.housePrice - housing.downPayment;
    taxes.filingStatus = "joint";
    taxes.capitalGainsRate = 0.15

    const stateAfterAppreciate = state.clone();
    const houseAfterAppreciate = stateAfterAppreciate.data.housing.house;
    houseAfterAppreciate.housePrice += 20000;

    const expectedState = stateAfterAppreciate.clone();
    expectedState.netWorth = houseAfterAppreciate.housePrice - 19200 - houseAfterAppreciate.loan.principle.amount;

    const newState = log(sellHouse(state))(stateAfterAppreciate, 1);
    expect(newState).toEqual(expectedState);
  });

  it('should work with single filing over 250k gain', function () {
    const state = new State();
    const housing = state.data.housing;
    const house = housing.house;
    const loan = state.data.housing.house.loan;
    const taxes = state.data.taxes;

    housing.downPayment = 100000;
    house.housePrice = 500000;
    house.sellClosingCosts = 0.06;
    loan.principle.amount = house.housePrice - housing.downPayment;
    taxes.filingStatus = "individual";
    taxes.capitalGainsRate = 0.15

    const stateAfterAppreciate = state.clone();
    const houseAfterAppreciate = stateAfterAppreciate.data.housing.house;
    houseAfterAppreciate.housePrice += 900000;

    const expectedState = stateAfterAppreciate.clone();
    expectedState.netWorth = houseAfterAppreciate.housePrice
      - houseAfterAppreciate.loan.principle.amount
      - houseAfterAppreciate.sellClosingCosts * houseAfterAppreciate.housePrice
      - (900000 - 250000) * stateAfterAppreciate.data.taxes.capitalGainsRate;

    const newState = log(sellHouse(state))(stateAfterAppreciate, 1);
    expect(newState).toEqual(expectedState);
  });

  it('should work with joint filing over 500k gain', function () {
    const state = new State();
    const housing = state.data.housing;
    const house = housing.house;
    const loan = state.data.housing.house.loan;
    const taxes = state.data.taxes;

    housing.downPayment = 10000;
    house.housePrice = 300000;
    house.sellClosingCosts = 0.06;
    loan.principle.amount = house.housePrice - housing.downPayment;
    taxes.filingStatus = "joint";
    taxes.capitalGainsRate = 0.15

    const stateAfterAppreciate = state.clone();
    const houseAfterAppreciate = stateAfterAppreciate.data.housing.house;
    houseAfterAppreciate.housePrice += 900000;

    const expectedState = stateAfterAppreciate.clone();
    expectedState.netWorth = houseAfterAppreciate.housePrice
      - houseAfterAppreciate.loan.principle.amount
      - houseAfterAppreciate.sellClosingCosts * houseAfterAppreciate.housePrice
      - (900000 - 500000) * stateAfterAppreciate.data.taxes.capitalGainsRate;

    const newState = log(sellHouse(state))(stateAfterAppreciate, 1);
    expect(newState).toEqual(expectedState);
  });
});

describe('loanPayment', function () {
  it('Happy Path', function () {
    let loan = new Loan();
    loan.term = 30;
    loan.principle = new GrowableNumber(10000, new HousingNumber(.03, "yearly"));

    expect(loanPayment(loan).monthly()).toBeCloseTo(42.16);

    loan.term = 7;
    loan.principle = new GrowableNumber(10000, new HousingNumber(.03, "yearly"));

    expect(loanPayment(loan).monthly()).toBeCloseTo(132.13);

    loan.term = 15;
    loan.principle = new GrowableNumber(165000, new HousingNumber(.045, "yearly"));

    expect(loanPayment(loan).monthly()).toBeCloseTo(1262.24);

    loan.principle = new GrowableNumber(9000, new HousingNumber(.03, "yearly"));
    loan.term = 30;

    expect(loanPayment(loan).monthly()).toBeCloseTo(37.94);

    loan.principle = new GrowableNumber(181500, new HousingNumber(.03, "yearly"));
    loan.term = 30;

    expect(loanPayment(loan).monthly()).toBeCloseTo(765, 0);

    loan.principle = new GrowableNumber(0, new HousingNumber(.03, "yearly"));
    loan.term = 30;

    expect(loanPayment(loan).monthly()).toBeCloseTo(0, 0);
  })
});

// TODO: add rental insurance calculation

function expectWithinRange(value: number, expectedValue: number, expectedInterval: number) {
  expect(value).toBeLessThanOrEqual(expectedValue + expectedInterval);
  expect(value).toBeGreaterThanOrEqual(expectedValue - expectedInterval);
}

describe('round', function () {
  it('Happy Path', function () {
    expect(round(1)).toEqual(1);
    expect(round(0)).toEqual(0);
    expect(round(0.17645)).toEqual(0.18);
    expect(round(0.1742)).toEqual(0.17);
    expect(round(13942.53226)).toEqual(13942.53);
    expect(round(-13942.53226)).toEqual(-13942.53);
  })
});

describe('loanPrinciple', function () {
  it('Simple Happy Path', function () {
    const loan = new Loan();
    loan.term = 3;
    loan.principle = new GrowableNumber(9000, new HousingNumber(.03, "yearly"));
    expect(loanPrinciple(loan, 30)).toBeCloseTo(0, 0);
    expect(loanPrinciple(loan, 1)).toBeCloseTo(6089, 0);
    expect(loanPrinciple(loan, 2)).toBeCloseTo(3090, 0);
    expect(loanPrinciple(loan, 3)).toBeCloseTo(0, 0);
  })

  it('Happy Path', function () {
    const loan = new Loan();
    loan.term = 30;
    loan.principle = new GrowableNumber(181500, new HousingNumber(.03, "yearly"));
    // We expect the principle to be within +/- 1 of the expected principle
    //   This is due to small variations in the way we and calulators like
    //   Zillow do rounding
    expectWithinRange(loanPrinciple(loan, 29), 9036, 1);
    expectWithinRange(loanPrinciple(loan, 1), 177711, 1);
    expectWithinRange(loanPrinciple(loan, 30), 0, 1);
  })
});

describe('loanIntrest', function () {
  /* 
   * Following tests use rounding with 2 decimal points as this seems to be the common approach
   * from most websites. But, since this is not accurate, we use no rounding in our calculation
  it('Happy Path 1', function () {
    const loan = new Loan();
    loan.principle.amount = 300000;
    loan.principle.rate.update("yearly", (_) => .03);

    const interest = loanIntrest(loan);
    expect(interest.interestPaid).toEqual(750);
    expect(interest.newPrinciple).toEqual(299485.19);
  });

  it('Happy Path 2', function () {
    const loan = new Loan();
    loan.principle.amount = 167470;
    loan.principle.rate.update("yearly", (_) => .03);

    const interest = loanIntrest(loan);
    expect(interest.interestPaid).toEqual(418.68);
    expect(interest.newPrinciple).toEqual(166642);
  });

  it('Happy Path 1', function () {
    const loan = new Loan();
    loan.principle.amount = 300000;
    loan.principle.rate.update("yearly", (_) => .03);

    const interest = loanIntrest(loan);
    expect(interest.interestPaid).toEqual(750);
    expect(interest.newPrinciple).toEqual(299485.19);
  });
  */
});

// TODO: write taxCredits tests
describe('taxCredits', function () {
  it('Happy Path', function () {
  });
});

describe('sellInvestment', function () {
  it('Happy Path 1', function () {
    const state = new State();
    const investment = state.data.investment;
    const taxes = state.data.taxes;

    investment.totalGain = 10000;
    taxes.capitalGainsRate = 0.24;

    const expectedState = state.clone();
    expectedState.netWorth = 7600;

    const newState = log(sellInvestment())(state, 1);
    expect(newState).toEqual(expectedState);
  });
});
