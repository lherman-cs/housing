export type Period = 'monthly' | 'yearly'

export class HousingNumber {
  constructor(private amount: number, private period: Period) {}

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
}
