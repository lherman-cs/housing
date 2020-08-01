import {
  investmentLoss,
  Rental,
  Investment,
  exponentialSum,
  reccuringInvestment,
  reccuringInvestmentWithGenerator,
  House,
  houseAppreciation,
  loanPrinciple,
  Loan,
  loanPayment,
  round,
  monthlyPayment
} from "./main";
import {HousingNumber} from "./number";


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
    const rental: Rental = {
      plan: "rental",
      utilityCost: new HousingNumber(105, "monthly"),
      downPayment: 0,
      chargeForRoom: new HousingNumber(0, "monthly"),
      chargeForRoomIncrease: new HousingNumber(0, "yearly"),
      extraBedrooms: 0,
      payment: new HousingNumber(1000, "monthly"),
      paymentIncrease: new HousingNumber(0.05, "yearly")
    };

    const investment: Investment = {
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
    const invest = function* (rental: Rental, investment: Investment) {
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
    const house: House = {
      plan: "house",
      downPayment: 0,
      chargeForRoom: new HousingNumber(0, "monthly"),
      chargeForRoomIncrease: new HousingNumber(0, "yearly"),
      extraBedrooms: 0,
      repairCost: new HousingNumber(500, "yearly"),
      housePrice: 300000,
      growthRate: new HousingNumber(.05, "yearly"),
      utilityCost: new HousingNumber(105, "monthly"),
      hoaFee: new HousingNumber(255, "monthly"),
      insurance: new HousingNumber(85, "monthly"),
      taxes: new HousingNumber(202, "monthly"),
      loan: {
        interestRate: new HousingNumber(.03, "yearly"),
        term: 30,
        principle: 300000
      }
    };

    const investment: Investment = {
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
        - loanPayment(house.loan).monthly()
        - house.taxes.monthly()
        - house.insurance.monthly()
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
    const house: House = {
      plan: "house",
      utilityCost: new HousingNumber(105, "monthly"),
      downPayment: 0,
      chargeForRoom: new HousingNumber(300, "monthly"),
      chargeForRoomIncrease: new HousingNumber(.02, "yearly"),
      extraBedrooms: 2,
      repairCost: new HousingNumber(500, "yearly"),
      housePrice: 300000,
      growthRate: new HousingNumber(.05, "yearly"),
      hoaFee: new HousingNumber(255, "monthly"),
      insurance: new HousingNumber(85, "monthly"),
      taxes: new HousingNumber(202, "monthly"),
      loan: {
        interestRate: new HousingNumber(.03, "yearly"),
        term: 30,
        principle: 300000
      }
    };

    const investment: Investment = {
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
      - loanPayment(house.loan).monthly()
      - house.taxes.monthly()
      - house.insurance.monthly()
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
    const house: House = {
      plan: "house",
      utilityCost: new HousingNumber(105, "monthly"),
      downPayment: 0,
      chargeForRoom: new HousingNumber(0, "monthly"),
      chargeForRoomIncrease: new HousingNumber(0, "yearly"),
      extraBedrooms: 0,
      repairCost: new HousingNumber(500, "yearly"),
      housePrice: 300000,
      growthRate: new HousingNumber(.05, "yearly"),
      hoaFee: new HousingNumber(255, "monthly"),
      insurance: new HousingNumber(85, "monthly"),
      taxes: new HousingNumber(202, "monthly"),
      loan: {
        interestRate: new HousingNumber(.03, "yearly"),
        term: 30,
        principle: 300000
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

describe('loanPayment', function () {
  it('Happy Path', function () {
    let loan: Loan = {
      interestRate: new HousingNumber(.03, "yearly"),
      term: 30,
      principle: 10000
    };

    expect(loanPayment(loan).monthly()).toBeCloseTo(42.16);

    loan = {
      interestRate: new HousingNumber(.03, "yearly"),
      term: 7,
      principle: 10000
    };

    expect(loanPayment(loan).monthly()).toBeCloseTo(132.13);

    loan = {
      interestRate: new HousingNumber(.045, "yearly"),
      term: 15,
      principle: 165000
    };

    expect(loanPayment(loan).monthly()).toBeCloseTo(1262.24);

    loan = {
      interestRate: new HousingNumber(.03, "yearly"),
      principle: 9000,
      term: 30
    };

    expect(loanPayment(loan).monthly()).toBeCloseTo(37.94);

    loan = {
      interestRate: new HousingNumber(.03, "yearly"),
      principle: 181500,
      term: 30
    };

    expect(loanPayment(loan).monthly()).toBeCloseTo(765, 0);
  })
});

// TODO: fix property taxes (goes up as house price goes up)(can be annually)
// TODO: home insurance goes up each year, add this calculation
// TODO: add rental insurance calculation
// TODO: add tax breaks on some stuff
// TODO: fix HOA (goes up annually)

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
    const loan: Loan = {
      interestRate: new HousingNumber(.03, "yearly"),
      principle: 9000,
      term: 3
    };
    expect(loanPrinciple(loan, 30)).toBeCloseTo(0, 0);
    expect(loanPrinciple(loan, 1)).toBeCloseTo(6089, 0);
    expect(loanPrinciple(loan, 2)).toBeCloseTo(3090, 0);
    expect(loanPrinciple(loan, 3)).toBeCloseTo(0, 0);
  })

  it('Happy Path', function () {
    const loan: Loan = {
      interestRate: new HousingNumber(.03, "yearly"),
      principle: 181500,
      term: 30
    };
    // We expect the principle to be within +/- 1 of the expected principle
    //   This is due to small variations in the way we and calulators like
    //   Zillow do rounding
    expectWithinRange(loanPrinciple(loan, 29), 9036, 1);
    expectWithinRange(loanPrinciple(loan, 1), 177711, 1);
    expectWithinRange(loanPrinciple(loan, 30), 0, 1);
  })
});

describe('monthlyPayment', function () {
  it('House Happy Path', function () {
    const house: House = {
      plan: "house",
      utilityCost: new HousingNumber(105, "monthly"),
      downPayment: 0,
      chargeForRoom: new HousingNumber(0, "monthly"),
      chargeForRoomIncrease: new HousingNumber(0, "yearly"),
      extraBedrooms: 0,
      repairCost: new HousingNumber(500, "yearly"),
      housePrice: 300000,
      growthRate: new HousingNumber(.05, "yearly"),
      hoaFee: new HousingNumber(255, "monthly"),
      insurance: new HousingNumber(85, "monthly"),
      taxes: new HousingNumber(202, "monthly"),
      loan: {
        interestRate: new HousingNumber(.03, "yearly"),
        term: 30,
        principle: 300000
      }
    };
    expect(monthlyPayment(house)).toEqual(
      house.utilityCost.monthly()
      + house.insurance.monthly()
      + house.taxes.monthly()
      + house.hoaFee.monthly()
      + loanPayment(house.loan).monthly()
      + house.repairCost.monthly()
    );
  })
  it('Rental Happy Path', function () {
    const rental: Rental = {
      plan: "rental",
      utilityCost: new HousingNumber(105, "monthly"),
      downPayment: 0,
      chargeForRoom: new HousingNumber(0, "monthly"),
      chargeForRoomIncrease: new HousingNumber(0, "yearly"),
      extraBedrooms: 0,
      payment: new HousingNumber(1000, "monthly"),
      paymentIncrease: new HousingNumber(0.05, "yearly")
    };

    expect(monthlyPayment(rental)).toEqual(
      rental.utilityCost.monthly()
      + rental.payment.monthly()
    );
  })
});
