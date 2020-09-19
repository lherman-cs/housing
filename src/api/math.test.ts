import {
  Investment,
  exponentialSum,
  reccuringInvestment,
  housingExpenses,
  principleAfterInterest,
  State,
  log,
  loanPayment,
  increaseByRate,
  sellHouse
} from "./math";
import {HousingNumber, GrowableNumber} from "./number";


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
    const investment = new Investment();
    investment.contribution.update("monthly", _ => 1000);
    investment.principle.start = 0;
    investment.principle.rate.update("monthly", _ => .05);
    state.data.investment = investment;

    const expectedState = state.clone();
    expectedState.netWorth = 1000;
    expectedState.data.investment.principle.start = 1000;

    const newState = log(reccuringInvestment())(state, 2);
    expect(newState).toEqual(expectedState)
  })

  it('Happy Path 2', function () {
    const state = new State();
    const investment = new Investment();
    investment.contribution.update("monthly", _ => 1000);
    investment.principle.start = 1000;
    investment.principle.rate.update("monthly", _ => .05);
    state.data.investment = investment;

    const expectedState = state.clone();
    expectedState.netWorth = 1050;
    expectedState.data.investment.principle.start = 2050;

    const newState = log(reccuringInvestment())(state, 3);
    expect(newState).toEqual(expectedState)
  })

  it('should work with multi months', function () {
    const state = new State();
    const investment = new Investment();
    investment.contribution.update("monthly", _ => 1000);
    investment.principle.start = 0;
    investment.principle.rate.update("monthly", _ => .05);
    state.data.investment = investment;

    const expectedState1 = state.clone();
    expectedState1.netWorth = 1000;
    expectedState1.data.investment.principle.start = 1000;

    const newState1 = log(reccuringInvestment())(state, 0);
    expect(newState1).toEqual(expectedState1)

    const expectedState2 = expectedState1.clone();
    expectedState2.netWorth = 2050;
    expectedState2.data.investment.principle.start = 2050;

    const newState2 = log(reccuringInvestment())(newState1, 1);
    expect(newState2).toEqual(expectedState2)
  })
})

describe('housingExpenses', function () {
  it('should work with single non-year changing month', function () {
    const state = new State();
    const housing = state.data.housing;
    const house = housing.house;

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
    state.data.housing = housing;

    const expectedState = state.clone();
    const expectedHousing = expectedState.data.housing;

    expectedHousing.house.housePrice = principleAfterInterest(house.housePrice, house.growthRate.monthly());
    expectedState.data.housing = expectedHousing;
    expectedState.netWorth = -800 - loanPayment(house.loan).monthly();

    const newState = log(housingExpenses())(state, 1);
    expect(newState).toEqual(expectedState);
  });

  it('should work with single year changing month', function () {
    const state = new State();
    const housing = state.data.housing;
    const house = housing.house;

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
    state.data.housing = housing;

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
    expectedState.netWorth = -800 - loanPayment(house.loan).monthly();

    const newState = log(housingExpenses())(state, 12);
    expect(newState).toEqual(expectedState);
  });

  it('should work with multi months', function () {
    const state = new State();
    const housing = state.data.housing;
    const house = housing.house;

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
    state.data.housing = housing;

    const expectedState1 = state.clone();
    const expectedHousing1 = expectedState1.data.housing;
    const expectedHouse1 = expectedHousing1.house;

    expectedHouse1.housePrice = principleAfterInterest(expectedHouse1.housePrice, expectedHouse1.growthRate.monthly());
    expectedState1.data.housing = expectedHousing1;
    expectedState1.netWorth = -800 - loanPayment(expectedHouse1.loan).monthly();

    const newState1 = log(housingExpenses())(state, 1);
    expect(newState1).toEqual(expectedState1);

    const expectedState2 = expectedState1.clone();
    const expectedHousing2 = expectedState2.data.housing;
    const expectedHouse2 = expectedHousing2.house;

    expectedHouse2.housePrice = principleAfterInterest(expectedHouse2.housePrice, expectedHouse2.growthRate.monthly());
    expectedState2.data.housing = expectedHousing2;
    expectedState2.netWorth -= (800 + loanPayment(expectedHouse2.loan).monthly());

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
    loan.principle.start = house.housePrice - housing.downPayment;
    taxes.filingStatus = "individual";
    taxes.capitalGainsRate = 0.05

    const stateAfterAppreciate = state.clone();
    const houseAfterAppreciate = stateAfterAppreciate.data.housing.house;
    houseAfterAppreciate.housePrice += 250000;

    const expectedState = stateAfterAppreciate.clone();
    expectedState.netWorth = houseAfterAppreciate.housePrice
      - houseAfterAppreciate.loan.principle.start
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
    loan.principle.start = house.housePrice - housing.downPayment;
    taxes.filingStatus = "joint";
    taxes.capitalGainsRate = 0.15

    const stateAfterAppreciate = state.clone();
    const houseAfterAppreciate = stateAfterAppreciate.data.housing.house;
    houseAfterAppreciate.housePrice += 20000;

    const expectedState = stateAfterAppreciate.clone();
    expectedState.netWorth = houseAfterAppreciate.housePrice - 19200 - houseAfterAppreciate.loan.principle.start;

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
    loan.principle.start = house.housePrice - housing.downPayment;
    taxes.filingStatus = "individual";
    taxes.capitalGainsRate = 0.15

    const stateAfterAppreciate = state.clone();
    const houseAfterAppreciate = stateAfterAppreciate.data.housing.house;
    houseAfterAppreciate.housePrice += 900000;

    const expectedState = stateAfterAppreciate.clone();
    expectedState.netWorth = houseAfterAppreciate.housePrice
      - houseAfterAppreciate.loan.principle.start
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
    loan.principle.start = house.housePrice - housing.downPayment;
    taxes.filingStatus = "joint";
    taxes.capitalGainsRate = 0.15

    const stateAfterAppreciate = state.clone();
    const houseAfterAppreciate = stateAfterAppreciate.data.housing.house;
    houseAfterAppreciate.housePrice += 900000;

    const expectedState = stateAfterAppreciate.clone();
    expectedState.netWorth = houseAfterAppreciate.housePrice
      - houseAfterAppreciate.loan.principle.start
      - houseAfterAppreciate.sellClosingCosts * houseAfterAppreciate.housePrice
      - (900000 - 500000) * stateAfterAppreciate.data.taxes.capitalGainsRate;

    const newState = log(sellHouse(state))(stateAfterAppreciate, 1);
    expect(newState).toEqual(expectedState);
  });
});
