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
import {IHousing} from './main';

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

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2}>Housing Type</TableCell>
              <TableCell colSpan={6} align="center">Housing</TableCell>
              <TableCell colSpan={4} align="center">Apartment</TableCell>
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
    </div>
  );
}

export default App;
