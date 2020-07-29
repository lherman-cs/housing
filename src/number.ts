export type Period = 'monthly' | 'yearly'

export class HousingNumber {
  constructor(private amount: number, private period: Period) {}

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
