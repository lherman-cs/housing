import {
  investmentLoss,
  IRental,
  IInvestment,
  exponentialSum,
  reccuringInvestment,
  reccuringInvestmentWithGenerator,
  IHouse,
  houseAppreciation,
  loanPrinciple
} from "./main";
import { HousingNumber } from "./number";


describe('exponentialSum', function () {
  it('Happy Path', function () {
    expect(exponentialSum(100, new HousingNumber(.00, "yearly"), 1)).toEqual(100);
    expect(exponentialSum(100, new HousingNumber(.05, "yearly"), 1)).toEqual(100);
    expect(exponentialSum(100, new HousingNumber(.05, "yearly"), 2)).toEqual(100 + 100 * 1.05);
    expect(exponentialSum(100, new HousingNumber(.05, "yearly"), 3)).toEqual(100 + 100 * 1.05 + 100 * 1.05 * 1.05);
  })
});

describe('reccuringInvestment', function () {
  it('Happy Path', function () {
    expect(reccuringInvestment(124383, new HousingNumber(13189, "monthly"), new HousingNumber(0.07, "yearly"), 12)).toBeCloseTo(296820, 0);
    expect(reccuringInvestment(124383, new HousingNumber(13189, "monthly"), new HousingNumber(0.07, "yearly"), 12 * 5)).toBeCloseTo(1120567, 0);
    expect(reccuringInvestment(124383, new HousingNumber(13189, "monthly"), new HousingNumber(0.07, "yearly"), 12 * 10)).toBeCloseTo(2532783, 0);
    expect(reccuringInvestment(124383, new HousingNumber(0, "monthly"), new HousingNumber(0.07, "yearly"), 12 * 10)).toBeCloseTo(249968, 0);
    expect(reccuringInvestment(100, new HousingNumber(13189, "monthly"), new HousingNumber(0.07, "yearly"), 12 * 10)).toBeCloseTo(2283016, 0);
    expect(reccuringInvestment(124383, new HousingNumber(13189, "monthly"), new HousingNumber(0, "yearly"), 12)).toBeCloseTo(124383 + 13189 * 12, 0);
    // according to https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator
    expect(reccuringInvestment(0, new HousingNumber(14294, "monthly"), new HousingNumber(0.07, "yearly"), 12 * 10)).toBeCloseTo(2474074.24, 0);
    expect(reccuringInvestment(124383, new HousingNumber(14294, "monthly"), new HousingNumber(.07, "yearly"), 24)).toBeCloseTo(510100.99, 0);
  })
});

describe('recurringInvestmentWithGenerator', function () {
  it('Happy Path', function () {
    let invest = function* () {
      yield 90
    };
    expect(reccuringInvestmentWithGenerator(9000, invest(), new HousingNumber(.07, "yearly"))).toEqual(9000 * (1 + .07 / 12) + 90);
    invest = function* () {
      yield 100;
      yield 105;
      yield 95;
      yield 5000;
      yield 0;
    }
    expect(reccuringInvestmentWithGenerator(100, invest(), new HousingNumber(.07, "yearly"))).toBeCloseTo(5437.43, 2);
  })
})

describe('investmentLoss', function () {
  it('Rental Good', function () {
    const rental: IRental = {
      plan: "rental",
      utilityCost: new HousingNumber(105, "monthly"),
      payment: new HousingNumber(1000, "monthly"),
      downPayment: 0,
      chargeForRoom: new HousingNumber(0, "monthly"),
      chargeForRoomIncrease: new HousingNumber(0, "yearly"),
      extraBedrooms: 0,
      paymentIncrease: new HousingNumber(0.05, "yearly")
    };

    const investment: IInvestment = {
      principle: 124383,
      contribution: new HousingNumber(14294, "monthly"),
      growthRate: new HousingNumber(0.07, "yearly")
    };

    const loss = investmentLoss(rental, investment, 2);
    const expectedWithoutHousing = reccuringInvestment(
      investment.principle,
      investment.contribution,
      investment.growthRate,
      24
    );
    const invest = function* (rental: IRental, investment: IInvestment) {
      for (let i = 0; i < 12; i++) {
        yield investment.contribution.monthly() - 1000 - rental.utilityCost.monthly();
      }
      for (let i = 0; i < 12; i++) {
        yield investment.contribution.monthly() - 1050 - rental.utilityCost.monthly();
      }
    }
    const expectedWithHousing = reccuringInvestmentWithGenerator(
      investment.principle - rental.downPayment,
      invest(rental, investment),
      investment.growthRate
    );
    expect(loss).toEqual(expectedWithoutHousing - expectedWithHousing);
  });

  it('House Good', function () {
    const house: IHouse = {
      plan: "house",
      utilityCost: new HousingNumber(105, "monthly"),
      payment: new HousingNumber(800, "monthly"),
      downPayment: 0,
      chargeForRoom: new HousingNumber(0, "monthly"),
      chargeForRoomIncrease: new HousingNumber(0, "yearly"),
      extraBedrooms: 0,
      repairCost: new HousingNumber(500, "yearly"),
      housePrice: 300000,
      growthRate: new HousingNumber(.05, "yearly"),
      hoaFee: new HousingNumber(255, "monthly"),
      loan: {
        interestRate: new HousingNumber(.03, "yearly"),
        term: 30
      }
    };

    const investment: IInvestment = {
      principle: 124383,
      contribution: new HousingNumber(14294, "monthly"),
      growthRate: new HousingNumber(0.07, "yearly")
    };

    const loss = investmentLoss(house, investment, 2);
    const expectedWithoutHousing = reccuringInvestment(
      investment.principle,
      investment.contribution,
      investment.growthRate,
      24
    );
    const expectedWithHousing = reccuringInvestment(
      investment.principle - house.downPayment,
      new HousingNumber(
        investment.contribution.monthly()
        - house.payment.monthly()
        - house.utilityCost.monthly()
        - house.hoaFee.monthly()
        - house.repairCost.monthly(),
        "monthly"
      ),
      investment.growthRate,
      24
    ) + houseAppreciation(house, 2);
    expect(loss).toEqual(expectedWithoutHousing - expectedWithHousing);
  });

  it('House with rental Good', function () {
    const house: IHouse = {
      plan: "house",
      utilityCost: new HousingNumber(105, "monthly"),
      payment: new HousingNumber(800, "monthly"),
      downPayment: 0,
      chargeForRoom: new HousingNumber(300, "monthly"),
      chargeForRoomIncrease: new HousingNumber(.02, "yearly"),
      extraBedrooms: 2,
      repairCost: new HousingNumber(500, "yearly"),
      housePrice: 300000,
      growthRate: new HousingNumber(.05, "yearly"),
      hoaFee: new HousingNumber(255, "monthly"),
      loan: {
        interestRate: new HousingNumber(.03, "yearly"),
        term: 30
      }
    };

    const investment: IInvestment = {
      principle: 124383,
      contribution: new HousingNumber(14294, "monthly"),
      growthRate: new HousingNumber(0.07, "yearly")
    };

    const loss = investmentLoss(house, investment, 2);
    const expectedWithoutHousing = reccuringInvestment(
      investment.principle,
      investment.contribution,
      investment.growthRate,
      24
    );

    const rentIncome = house.chargeForRoom.monthly() * house.extraBedrooms;
    const monthlyInvestment = investment.contribution.monthly()
      - house.payment.monthly()
      - house.utilityCost.monthly()
      - house.hoaFee.monthly()
      - house.repairCost.monthly()
      + rentIncome;
    const expectedWithHousingFirstYear = reccuringInvestment(
      investment.principle - house.downPayment,
      new HousingNumber(monthlyInvestment, "monthly"),
      investment.growthRate,
      12
    );
    const expectedWithHousingSecondYear = reccuringInvestment(
      expectedWithHousingFirstYear,
      new HousingNumber(monthlyInvestment + rentIncome * house.chargeForRoomIncrease.yearly(), "monthly"),
      investment.growthRate,
      12
    ) + houseAppreciation(house, 2);

    expect(loss).toEqual(expectedWithoutHousing - expectedWithHousingSecondYear);
  });
});

describe('houseAppreciation', function () {
  it('Happy Path', function () {
    const house: IHouse = {
      plan: "house",
      utilityCost: new HousingNumber(105, "monthly"),
      payment: new HousingNumber(800, "monthly"),
      downPayment: 0,
      chargeForRoom: new HousingNumber(0, "monthly"),
      chargeForRoomIncrease: new HousingNumber(0, "yearly"),
      extraBedrooms: 0,
      repairCost: new HousingNumber(500, "yearly"),
      housePrice: 300000,
      growthRate: new HousingNumber(.05, "yearly"),
      hoaFee: new HousingNumber(255, "monthly"),
      loan: {
        interestRate: new HousingNumber(.03, "yearly"),
        term: 30
      }
    };

    const rate = 1 + house.growthRate.yearly();
    expect(houseAppreciation(house, 0)).toEqual(house.housePrice);
    expect(houseAppreciation(house, 1)).toEqual(house.housePrice * rate);
    expect(houseAppreciation(house, 2)).toEqual(house.housePrice * Math.pow(rate, 2));
    expect(houseAppreciation(house, 5)).toEqual(house.housePrice * Math.pow(rate, 5));
    expect(houseAppreciation(house, 50)).toEqual(house.housePrice * Math.pow(rate, 50));
  })
});

// TODO: fix property taxes (goes up as house price goes up)

describe('loanPrinciple', function () {
  it('Happy Path', function () {
    const house: IHouse = {
      plan: "house",
      utilityCost: new HousingNumber(105, "monthly"),
      payment: new HousingNumber(765.21, "monthly"),
      downPayment: 60500,
      chargeForRoom: new HousingNumber(0, "monthly"),
      chargeForRoomIncrease: new HousingNumber(0, "yearly"),
      extraBedrooms: 0,
      repairCost: new HousingNumber(500, "yearly"),
      housePrice: 242000,
      growthRate: new HousingNumber(.05, "yearly"),
      hoaFee: new HousingNumber(255, "monthly"),
      loan: {
        interestRate: new HousingNumber(.03, "yearly"),
        term: 30
      }
    };
    expect(loanPrinciple(house, 30)).toBeCloseTo(0, 0);
    expect(loanPrinciple(house, 29)).toBeCloseTo(9036);
    expect(loanPrinciple(house, 1)).toBeCloseTo(177711);
  })
});