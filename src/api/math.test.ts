import {
  Investment,
  exponentialSum,
  reccuringInvestment,
  State,
  log
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
