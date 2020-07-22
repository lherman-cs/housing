import {
  investmentLoss,
  IRental,
  IInvestment,
  exponentialSum,
  reccuringInvestment,
  reccuringInvestmentWithGenerator,
  IHouse,
  houseAppreciation
} from "./main";
import { expect } from 'chai';


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
    expect(reccuringInvestment(124383, 14294, .07 / 12, 24)).closeTo(510100.99, 0.5);
  })
});

describe('recurringInvestmentWithGenerator', function () {
  it('Happy Path', function () {
    let invest = function* () {
      yield 90
    };
    expect(reccuringInvestmentWithGenerator(9000, invest(), .07 / 12)).equal(9000 * (1 + .07 / 12) + 90);
    invest = function* () {
      yield 100;
      yield 105;
      yield 95;
      yield 5000;
      yield 0;
    }
    expect(reccuringInvestmentWithGenerator(100, invest(), .07 / 12)).closeTo(5437.43, .005);
  })
})

describe('investmentLoss', function () {
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
    const expectedWithoutHousing = reccuringInvestment(
      investment.principle,
      investment.monthlyInvestment,
      investment.growthRatePerYear / 12,
      24
    );
    const invest = function* (rental: IRental, investment: IInvestment) {
      for (let i = 0; i < 12; i++) {
        yield investment.monthlyInvestment - 1000 - rental.utilityCost;
      }
      for (let i = 0; i < 12; i++) {
        yield investment.monthlyInvestment - 1050 - rental.utilityCost;
      }
    }
    const expectedWithHousing = reccuringInvestmentWithGenerator(
      investment.principle - rental.downPayment,
      invest(rental, investment),
      investment.growthRatePerYear / 12,
    );
    expect(loss).equal(expectedWithoutHousing - expectedWithHousing);
  });

  it('House Good', function () {
    const house: IHouse = {
      plan: "house",
      utilityCost: 105,
      monthlyPayment: 800,
      downPayment: 0,
      chargeForRoom: 0,
      chargeForRoomIncrease: 0,
      extraBedrooms: 0,
      annualRepairs: 500,
      housePrice: 300000,
      growthRatePerYear: .05
    };

    const investment: IInvestment = {
      principle: 124383,
      monthlyInvestment: 14294,
      growthRatePerYear: 0.07
    };

    const loss = investmentLoss(house, investment, 2);
    const expectedWithoutHousing = reccuringInvestment(
      investment.principle,
      investment.monthlyInvestment,
      investment.growthRatePerYear / 12,
      24
    );
    const expectedWithHousing = reccuringInvestment(
      investment.principle - house.downPayment,
      investment.monthlyInvestment - house.monthlyPayment - house.utilityCost,
      investment.growthRatePerYear / 12,
      24
    );
    expect(loss).equal(expectedWithoutHousing - expectedWithHousing);
  });

  it('House with rental Good', function () {
    const house: IHouse = {
      plan: "house",
      utilityCost: 105,
      monthlyPayment: 800,
      downPayment: 0,
      chargeForRoom: 300,
      chargeForRoomIncrease: .02,
      extraBedrooms: 2,
      annualRepairs: 500,
      housePrice: 300000,
      growthRatePerYear: .05
    };

    const investment: IInvestment = {
      principle: 124383,
      monthlyInvestment: 14294,
      growthRatePerYear: 0.07
    };

    const loss = investmentLoss(house, investment, 2);
    const expectedWithoutHousing = reccuringInvestment(
      investment.principle,
      investment.monthlyInvestment,
      investment.growthRatePerYear / 12,
      24
    );

    const rentIncome = house.chargeForRoom * house.extraBedrooms;
    const monthlyInvestment = investment.monthlyInvestment
      - house.monthlyPayment
      - house.utilityCost
      + rentIncome;
    const expectedWithHousingFirstYear = reccuringInvestment(
      investment.principle - house.downPayment,
      monthlyInvestment,
      investment.growthRatePerYear / 12,
      12
    );
    const expectedWithHousingSecondYear = reccuringInvestment(
      expectedWithHousingFirstYear,
      monthlyInvestment + rentIncome * house.chargeForRoomIncrease,
      investment.growthRatePerYear / 12,
      12
    );

    expect(loss).equal(expectedWithoutHousing - expectedWithHousingSecondYear);
  });
});

describe('houseAppreciation', function () {
  it('Happy Path', function () {
    const house: IHouse = {
      plan: "house",
      utilityCost: 105,
      monthlyPayment: 800,
      downPayment: 0,
      chargeForRoom: 0,
      chargeForRoomIncrease: 0,
      extraBedrooms: 0,
      annualRepairs: 500,
      housePrice: 300000,
      growthRatePerYear: .05
    };

    const rate = 1 + house.growthRatePerYear;
    expect(houseAppreciation(house, 0)).equal(house.housePrice);
    expect(houseAppreciation(house, 1)).equal(house.housePrice * rate);
    expect(houseAppreciation(house, 2)).equal(house.housePrice * Math.pow(rate, 2));
    expect(houseAppreciation(house, 5)).equal(house.housePrice * Math.pow(rate, 5));
    expect(houseAppreciation(house, 50)).equal(house.housePrice * Math.pow(rate, 50));
  })
});
