import {investmentLoss, IRental, IInvestment, exponentialSum, reccuringInvestment} from "./main";
import {expect} from 'chai';


describe('exponentialSum', function () {
  it('Happy Path', function () {
    expect(exponentialSum(100, .00, 1)).equal(100);
    expect(exponentialSum(100, .05, 1)).equal(100);
    expect(exponentialSum(100, .05, 2)).equal(100 + 100 * 1.05);
    expect(exponentialSum(100, .05, 3)).equal(100 + 100 * 1.05 + 100 * 1.05 * 1.05);
  })
});

describe('reccuringInvestment', function () {
  it('Happy Path', function () {
    expect(reccuringInvestment(124383, 13189, 0.07 / 12, 12)).closeTo(296820, 0.5);
    expect(reccuringInvestment(124383, 13189, 0.07 / 12, 12 * 5)).closeTo(1120567, 0.5);
    expect(reccuringInvestment(124383, 13189, 0.07 / 12, 12 * 10)).closeTo(2532783, 0.5);
    expect(reccuringInvestment(124383, 0, 0.07 / 12, 12 * 10)).closeTo(249968, 0.5);
    expect(reccuringInvestment(100, 13189, 0.07 / 12, 12 * 10)).closeTo(2283016, 0.5);
    expect(reccuringInvestment(124383, 13189, 0, 12)).closeTo(124383 + 13189 * 12, 0.5);
    // according to https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator
    expect(reccuringInvestment(0, 14294, 0.07 / 12, 12 * 10)).closeTo(2474074.24, 0.5);
  })
});

describe.skip('investmentLoss', function () {
  it('Rental Good', function () {
    const rental: IRental = {
      plan: "rental",
      utilityCost: 105,
      monthlyPayment: 1000,
      downPayment: 0,
      chargeForRoom: 0,
      chargeForRoomIncrease: 0,
      extraBedrooms: 0,
      yearlyPaymentIncrease: 0.05
    };

    const investment: IInvestment = {
      principle: 124383,
      monthlyInvestment: 14294,
      growthRatePerYear: 0.07
    };

    const loss = investmentLoss(rental, investment, 2);
    const expectedWithoutHousing = 510104;
    const expectedWithHousing = 481103;
    expect(loss).equal(expectedWithoutHousing - expectedWithHousing);
  });
});
