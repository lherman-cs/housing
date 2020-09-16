import {
  Investment,
  exponentialSum,
  reccuringInvestment,
  housingExpenses,
  principleAfterInterest,
  State,
  House,
  log,
  loanPayment,
  increaseByRate
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
    const house = new House();

    house.housePrice = 300000;
    house.growthRate = new HousingNumber(0.05, 'yearly');
    house.chargeForRoom = new HousingNumber(1200, 'monthly');
    house.extraBedrooms = 1;
    house.insurance = new HousingNumber(1000, 'monthly');
    house.utilityCost = new HousingNumber(500, 'monthly');
    house.repairCost = new HousingNumber(200, 'monthly');
    house.hoaFee = new HousingNumber(300, 'monthly');
    house.loan.term = 30;
    house.loan.principle = new GrowableNumber(100000, new HousingNumber(0.03, 'yearly'));
    state.data.housing = house;

    const expectedState = state.clone();
    const expectedHouse = house.clone();

    expectedHouse.housePrice = principleAfterInterest(house.housePrice, house.growthRate.monthly());
    expectedState.data.housing = expectedHouse;
    expectedState.netWorth = -800 - loanPayment(house.loan).monthly();

    const newState = log(housingExpenses())(state, 1);
    expect(newState).toEqual(expectedState);
  });

  it('should work with single year changing month', function () {
    const state = new State();
    const house = new House();

    house.housePrice = 300000;
    house.growthRate = new HousingNumber(0.05, 'yearly');
    house.chargeForRoom = new HousingNumber(1200, 'monthly');
    house.chargeForRoomIncrease = new HousingNumber(0.01, "yearly");
    house.extraBedrooms = 1;
    house.insurance = new HousingNumber(1000, 'monthly');
    house.utilityCost = new HousingNumber(500, 'monthly');
    house.repairCost = new HousingNumber(200, 'monthly');
    house.hoaFee = new HousingNumber(300, 'monthly');
    house.loan.term = 30;
    house.loan.principle = new GrowableNumber(100000, new HousingNumber(0.03, 'yearly'));
    state.data.housing = house;

    const expectedState = state.clone();
    const expectedHouse = house.clone();

    const increaseByInflation = increaseByRate(state.data.inflation.yearly());
    expectedHouse.housePrice = principleAfterInterest(house.housePrice, house.growthRate.monthly());
    expectedHouse.chargeForRoom.update("monthly", increaseByRate(0.01));
    expectedHouse.insurance.update("monthly", increaseByInflation);
    expectedHouse.utilityCost.update("monthly", increaseByInflation);
    expectedHouse.repairCost.update("monthly", increaseByInflation);
    expectedHouse.hoaFee.update("monthly", increaseByInflation);

    expectedState.data.housing = expectedHouse;
    expectedState.netWorth = -800 - loanPayment(house.loan).monthly();

    const newState = log(housingExpenses())(state, 12);
    expect(newState).toEqual(expectedState);
  });

  it('should work with multi months', function () {
    const state = new State();
    const house = new House();

    house.housePrice = 300000;
    house.growthRate = new HousingNumber(0.05, 'yearly');
    house.chargeForRoom = new HousingNumber(1200, 'monthly');
    house.extraBedrooms = 1;
    house.insurance = new HousingNumber(1000, 'monthly');
    house.utilityCost = new HousingNumber(500, 'monthly');
    house.repairCost = new HousingNumber(200, 'monthly');
    house.hoaFee = new HousingNumber(300, 'monthly');
    house.loan.term = 30;
    house.loan.principle = new GrowableNumber(100000, new HousingNumber(0.03, 'yearly'));
    state.data.housing = house;

    const expectedState1 = state.clone();
    const expectedHouse1 = house.clone();

    expectedHouse1.housePrice = principleAfterInterest(expectedHouse1.housePrice, expectedHouse1.growthRate.monthly());
    expectedState1.data.housing = expectedHouse1;
    expectedState1.netWorth = -800 - loanPayment(expectedHouse1.loan).monthly();

    const newState1 = log(housingExpenses())(state, 1);
    expect(newState1).toEqual(expectedState1);

    const expectedState2 = expectedState1.clone();
    const expectedHouse2 = expectedHouse1.clone();

    expectedHouse2.housePrice = principleAfterInterest(expectedHouse2.housePrice, expectedHouse2.growthRate.monthly());
    expectedState2.data.housing = expectedHouse2;
    expectedState2.netWorth -= (800 + loanPayment(expectedHouse2.loan).monthly());

    const newState2 = log(housingExpenses())(newState1, 1);
    expect(newState2).toEqual(expectedState2);
  });
})
