import React from 'react';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import {InputDialog, InputDialogData} from './components/InputDialog';
import {IHousing, Plan, IHouse, IRental, IInvestment} from './main';
import {HousingNumber} from './number';

function App() {
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState<InputDialogData[]>([]);

  const handleSubmit = (data: InputDialogData) => {
    setRows([
      ...rows,
      data
    ]);
    setOpen(false);
  };

  async function loadCSV(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) {
      return;
    }

    const file = files[0];
    const content = await file.text();
    const csvRows = content.split('\n').map(row => row.split(','));

    const newRows: InputDialogData[] = [];
    for (const csvCols of csvRows) {
      const plan = csvCols[0] as Plan;
      const years = Number(csvCols[1]);
      const isHouse = plan === 'house';
      const house = {} as IHouse;
      const rental = {} as IRental;
      const housing = isHouse ? house : rental;

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

      console.log(csvCols);
      const investmentLoss = Number(csvCols[16]);

      newRows.push({
        housingType: plan,
        years,
        house,
        rental,
        investment,
        investmentLoss
      });
    }

    setRows(newRows);
  }

  function downloadCSV() {
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

        row.investmentLoss,
      ]);
    }

    const csvContent = "data:text/csv;charset=utf-8,"
      + csvRows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2}>Housing Type</TableCell>
              <TableCell rowSpan={2}>Projected Years</TableCell>
              <TableCell colSpan={6} align="center">Housing</TableCell>
              <TableCell colSpan={4} align="center">House</TableCell>
              <TableCell colSpan={1} align="center">Apartment</TableCell>
              <TableCell colSpan={3} align="center">Investment</TableCell>
              <TableCell rowSpan={2}>Investment Loss</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Monthly Payment</TableCell>
              <TableCell align="center">Down Payment</TableCell>
              <TableCell align="center">Extra Bedrooms</TableCell>
              <TableCell align="center">Change per Room</TableCell>
              <TableCell align="center">Change per Room Increase Rate</TableCell>
              <TableCell align="center">Utility Cost</TableCell>

              <TableCell align="center">Repair Cost</TableCell>
              <TableCell align="center">House Price</TableCell>
              <TableCell align="center">House Appreciation Rate</TableCell>
              <TableCell align="center">HOA Fee</TableCell>

              <TableCell align="center">Monthly Payment Increase Rate</TableCell>

              <TableCell align="center">Principle</TableCell>
              <TableCell align="center">Contribution</TableCell>
              <TableCell align="center">Growth Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => {
              const isHouse = row.housingType === 'house';
              const housing: IHousing = isHouse ? row.house : row.rental;

              return (<TableRow>
                <TableCell align="center">{row.housingType}</TableCell>
                <TableCell align="center">{row.years}</TableCell>

                <TableCell align="center">{housing.payment.monthly()}</TableCell>
                <TableCell align="center">{housing.downPayment}</TableCell>
                <TableCell align="center">{housing.extraBedrooms}</TableCell>
                <TableCell align="center">{housing.chargeForRoom.monthly()}</TableCell>
                <TableCell align="center">{housing.chargeForRoomIncrease.yearly()}</TableCell>
                <TableCell align="center">{housing.utilityCost.monthly()}</TableCell>

                <TableCell align="center">{isHouse ? row.house.repairCost.yearly() : 'N/A'}</TableCell>
                <TableCell align="center">{isHouse ? row.house.housePrice : 'N/A'}</TableCell>
                <TableCell align="center">{isHouse ? row.house.growthRate.yearly() : 'N/A'}</TableCell>
                <TableCell align="center">{isHouse ? row.house.hoaFee.yearly() : 'N/A'}</TableCell>

                <TableCell align="center">{!isHouse ? row.rental.paymentIncrease.yearly() : 'N/A'}</TableCell>

                <TableCell align="center">{row.investment.principle}</TableCell>
                <TableCell align="center">{row.investment.contribution.monthly()}</TableCell>
                <TableCell align="center">{row.investment.growthRate.yearly()}</TableCell>

                <TableCell align="center">{row.investmentLoss}</TableCell>
              </TableRow>)
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <InputDialog open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      <Button onClick={() => setOpen(true)}>Add</Button>
      <Button onClick={downloadCSV}>Download as CSV</Button>
      <input
        accept="text/csv"
        id="contained-button-file"
        type="file"
        onChange={loadCSV}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span">
          Load CSV
        </Button>
      </label>
    </div >
  );
}

export default App;
