export interface IInvestment {
  principle: number;
  monthlyInvestment: number;
  growthRatePerYear: number;
}

export interface IHousing {
  plan: "house" | "rental";
  monthlyPayment: number;
  downPayment: number;
  chargeForRoom: number;
  chargeForRoomIncrease: number;
  extraBedrooms: number;
  utilityCost: number;
}

export interface IHouse extends IHousing {
  annualRepairs: number;
  housePrice: number;
  growthRatePerYear: number;
}

export interface IRental extends IHousing {
  yearlyPaymentIncrease: number;
}

/*
   'base' is how much you spend the first year
   'base' + 'base' * 'rate' is how much you spend the next year
   etc. 

   exponentialSum computes the total amount of money you spent over a specified amount of 'years'
*/
export function exponentialSum(base: number, rate: number, years: number): number {
  let total = base;
  let curr = base;
  for (let year = 1; year < years; year++) {
    curr += curr * rate;
    total += curr;
  }
  return total;
};

/*
  Computes the amount of money you will have after investing for 'months' assuming you have 'base'
    (principle) invested and you add 'invest' money to the investment and the amount of money you 
    invest each month decreases at a rate of 'investRate' each month the money grows at 'rate'
    each month
*/
export function reccuringInvestment(base: number, invest: number, rate: number, months: number): number {
  function* invests() {
    for (let month = 0; month < months; month++) {
      yield invest;
    }
  };

  return reccuringInvestmentWithGenerator(base, invests(), rate);
};

export function reccuringInvestmentWithGenerator(base: number, invests: Generator<number>, rate: number): number {
  let curr = base;
  rate += 1;
  for (const invest of invests) {
    curr = curr * rate + invest;
  }
  return curr;
};

export function investmentLoss(housing: IHousing, investment: IInvestment, years: number) {
  switch (housing.plan) {
    case "house":
      return investmentLossHouse(housing as IHouse, investment, years);
    case "rental":
      return investmentLossRental(housing as IRental, investment, years);
    default:
      throw new Error("Unsupported plan");
  }
}

// Depends on down payment & mo payment
function investmentLossHouse(house: IHouse, investment: IInvestment, years: number) {
  const withoutHousing = reccuringInvestment(
    investment.principle,
    investment.monthlyInvestment,
    investment.growthRatePerYear / 12,
    years * 12);
  const withHousing = reccuringInvestment(
    investment.principle - house.downPayment,
    investment.monthlyInvestment - house.utilityCost - house.monthlyPayment,
    investment.growthRatePerYear / 12,
    years * 12);
  return withoutHousing - withHousing;
}

// Depends on down payment & mo payment & monthlyPaymentIncrease
function investmentLossRental(house: IRental, investment: IInvestment, years: number) {
  const withoutHousing = reccuringInvestment(
    investment.principle,
    investment.monthlyInvestment,
    investment.growthRatePerYear / 12,
    years * 12);

  function* invests() {
    const months = years * 12;
    let monthlyPayment = house.monthlyPayment;
    for (let month = 1; month <= months; month++) {
      yield investment.monthlyInvestment - house.utilityCost - monthlyPayment;
      if (month % 12 == 0) {
        monthlyPayment *= (1 + house.yearlyPaymentIncrease);
      }
    }
  }
  const withHousing = reccuringInvestmentWithGenerator(
    investment.principle - house.downPayment,
    invests(),
    investment.monthlyInvestment / 12)

  return withoutHousing - withHousing;
}
