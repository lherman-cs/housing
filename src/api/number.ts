export type Period = 'monthly' | 'yearly'

export class HousingNumber {
  constructor(public amount: number, public period: Period) {}

  fromCSV(raw: any): HousingNumber {
    if (!("amount" in raw && "period" in raw)) {
      throw Error("Parse error: amount and period have to exist");
    }

    const acceptedPeriods = ["yearly", "monthly"];
    let period: Period = "yearly";
    const amount = Number(raw["amount"]);
    if (acceptedPeriods.includes(raw["period"])) {
      period = raw["period"] as Period;
    } else {
      throw Error(`Parse error: period should be one of [${acceptedPeriods.join(", ")}], but got ${raw["period"]}`);
    }

    return new HousingNumber(amount, period);
  }

  to(period: Period): number {
    switch (period) {
      case "monthly":
        return this.monthly();
      case "yearly":
        return this.yearly();
    }
  }

  monthly(): number {
    let amount = this.amount;
    if (this.period === "yearly") {
      amount /= 12;
    }

    return amount;
  }

  yearly(): number {
    let amount = this.amount;
    if (this.period === "monthly") {
      amount *= 12;
    }

    return amount;
  }

  update(period: Period, fn: (amount: number) => number) {
    const amount = this.to(period);
    this.amount = fn(amount);
    this.period = period;
  }

  clone(): HousingNumber {
    return new HousingNumber(this.amount, this.period);
  }
}

type GrowableNumberCallback = (_: number) => number;
const growableNumberCallbackNoop: GrowableNumberCallback = (n: number): number => {
  return n;
}

export class GrowableNumber {
  constructor(public amount: number, public rate: HousingNumber) {}

  *generator(period: Period, onBefore = growableNumberCallbackNoop, onAfter = growableNumberCallbackNoop): Generator<number> {
    let amount = this.amount;

    while (true) {
      amount = onBefore(amount);
      amount *= (1 + this.rate.to(period));
      amount = onAfter(amount);
      yield amount;
    }
  }

  update(amount: number, rate: number, period: Period) {
    this.amount = amount;
    this.rate.update(period, _ => rate);
  }

  clone(): GrowableNumber {
    return new GrowableNumber(this.amount, this.rate.clone());
  }
}
