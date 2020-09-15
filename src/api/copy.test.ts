import {copy} from './copy';
import {Loan} from './math';
import {HousingNumber, GrowableNumber} from './number';

describe('copy', function () {
  it('Happy Path', function () {
    const loan = new Loan();

    loan.term = 30;
    loan.principle = new GrowableNumber(95, new HousingNumber(.013, "monthly"));

    let cpy = new Loan();
    cpy = copy(loan, cpy);

    // Validate copied values
    expect(cpy.term).toEqual(30);
    cpy.term = 20;
    expect(loan.term).toEqual(30);
    expect(cpy.term).toEqual(20);

    // Validate deep copy, ensure original is not mutated
    expect(cpy.principle.start).toEqual(95);
    expect(loan.principle.rate).toEqual(cpy.principle.rate);
    cpy.principle = new GrowableNumber(5, new HousingNumber(.01, "monthly"));
    expect(loan.principle.rate === cpy.principle.rate).toBeFalsy();
    expect(cpy.principle.start).toEqual(5);
  })
})

