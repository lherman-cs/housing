import {InputDialogData } from './components/InputDialog';
import {IHousing, Plan, IHouse, IRental, IInvestment, investmentLoss} from './main';
import {HousingNumber} from './number';

export function loadCSV(raw: string) {
    const csvRows = raw.split('\n').map(row => row.split(','));

    const newRows: InputDialogData[] = [];
    for (const csvCols of csvRows) {
      if (csvCols.length !== 16) {
        continue;
      }

      const plan = csvCols[0] as Plan;
      const years = Number(csvCols[1]);
      const isHouse = plan === 'house';
      const house = {} as IHouse;
      const rental = {} as IRental;
      const housing = isHouse ? house : rental;

      housing.plan = plan;
      housing.payment = new HousingNumber(Number(csvCols[2]), "monthly");
      housing.downPayment = Number(csvCols[3]);
      housing.extraBedrooms = Number(csvCols[4]);
      housing.chargeForRoom = new HousingNumber(Number(csvCols[5]), "monthly");
      housing.chargeForRoomIncrease = new HousingNumber(Number(csvCols[6]), "yearly");
      housing.utilityCost = new HousingNumber(Number(csvCols[7]), "monthly");

      house.repairCost = new HousingNumber(Number(csvCols[8]), "yearly");
      house.housePrice = Number(csvCols[9]);
      house.growthRate = new HousingNumber(Number(csvCols[10]), "yearly");
      house.hoaFee = new HousingNumber(Number(csvCols[11]), "yearly");

      rental.paymentIncrease = new HousingNumber(Number(csvCols[12]), "yearly");

      const investment: IInvestment = {
        principle: Number(csvCols[13]),
        contribution: new HousingNumber(Number(csvCols[14]), "monthly"),
        growthRate: new HousingNumber(Number(csvCols[15]), "yearly"),
      };

      newRows.push({
        housingType: plan,
        years,
        house,
        rental,
        investment,
        investmentLoss: investmentLoss(housing, investment, years)
      });
    }

    return newRows;
  }

export function downloadCSV(rows: InputDialogData[]): string {
    const csvRows = [];
    for (const row of rows) {
      const isHouse = row.housingType === 'house';
      const housing: IHousing = isHouse ? row.house : row.rental;

      csvRows.push([
        row.housingType,
        row.years,

        housing.payment.monthly(),
        housing.downPayment,
        housing.extraBedrooms,
        housing.chargeForRoom.monthly(),
        housing.chargeForRoomIncrease.yearly(),
        housing.utilityCost.monthly(),

        isHouse ? row.house.repairCost.yearly() : 0,
        isHouse ? row.house.housePrice : 0,
        isHouse ? row.house.growthRate.yearly() : 0,
        isHouse ? row.house.hoaFee.yearly() : 0,

        !isHouse ? row.rental.paymentIncrease.yearly() : 0,

        row.investment.principle,
        row.investment.contribution.monthly(),
        row.investment.growthRate.yearly(),
      ]);
    }

    return "data:text/csv;charset=utf-8,"
      + csvRows.map(e => e.join(",")).join("\n");
  }