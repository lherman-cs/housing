import React from 'react';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  ButtonGroup,
} from '@material-ui/core';
import { Edit, Delete } from "@material-ui/icons";
import {InputDialog, InputDialogData, InputDialogDataInit} from './components/InputDialog';
import {IHousing, monthlyPayment  } from './main';
import {loadCSV, downloadCSV} from './csv'

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

function percentFormat(rate: number): string {
  return (rate * 100).toFixed(2) + '%'
}

function App() {
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState<InputDialogData[]>([]);
  const [index, setIndex] = React.useState(-1);
  const [initialData, setInitialData] = React.useState<InputDialogDataInit|undefined>();

  function handleDownloadCSV(){
    const encodedUri = encodeURI(downloadCSV(rows));
    window.open(encodedUri);
  }
  
  async function handleLoadCSV(event: React.ChangeEvent<HTMLInputElement>){
    const files = event.target.files;
    if (!files) {
      return;
    }

    const file = files[0];
    if (!file) {
      return;
    }

    const content = await file.text();
    setRows(loadCSV(content))
  }

  const handleSubmit = (data: InputDialogData) => {
    if (index < 0 || index >= rows.length) {
    setRows([
      ...rows,
      data
    ]);
    } else {
      rows[index] = data;
      setRows([...rows]);
    }
    setOpen(false);
  };

  function handleOpen() {
    setIndex(-1);
    setOpen(true);
  }

  function handleRemove(i: number) {
    const left = rows.slice(0, i) || [];
    const right = rows.slice(i + 1) || [];
    setRows([...left, ...right]);
  }

  function handleEdit(i: number) {
    setIndex(i);
    setInitialData(rows[i]);
    setOpen(true);
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2} align="center">Housing Type</TableCell>
              <TableCell rowSpan={2} align="center">Projected Years</TableCell>
              <TableCell colSpan={6} align="center">Housing</TableCell>
              <TableCell colSpan={4} align="center">House</TableCell>
              <TableCell colSpan={1} align="center">Apartment</TableCell>
              <TableCell colSpan={4} align="center">Investment</TableCell>
              <TableCell rowSpan={2} align="center">Actions</TableCell>
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

              <TableCell align="center">Investment Loss</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.sort((a, b) => a.investmentLoss - b.investmentLoss).map((row, i) => {
              const isHouse = row.housingType === 'house';
              const housing: IHousing = isHouse ? row.house : row.rental;
              return (<TableRow>
                <TableCell align="center">{row.housingType}</TableCell>
                <TableCell align="center">{row.years}</TableCell>

                <TableCell align="center">{moneyFormatter.format(monthlyPayment(isHouse ? row.house : row.rental))}</TableCell>
                <TableCell align="center">{moneyFormatter.format(housing.downPayment)}</TableCell>
                <TableCell align="center">{housing.extraBedrooms}</TableCell>
                <TableCell align="center">{moneyFormatter.format(housing.chargeForRoom.monthly())}</TableCell>
                <TableCell align="center">{percentFormat(housing.chargeForRoomIncrease.yearly())}</TableCell>
                <TableCell align="center">{moneyFormatter.format(housing.utilityCost.monthly())}</TableCell>

                <TableCell align="center">{isHouse ? moneyFormatter.format(row.house.repairCost.yearly()) : 'N/A'}</TableCell>
                <TableCell align="center">{isHouse ? moneyFormatter.format(row.house.housePrice) : 'N/A'}</TableCell>
                <TableCell align="center">{isHouse ? percentFormat(row.house.growthRate.yearly()) : 'N/A'}</TableCell>
                <TableCell align="center">{isHouse ? moneyFormatter.format(row.house.hoaFee.monthly()) : 'N/A'}</TableCell>

                <TableCell align="center">{!isHouse ? percentFormat(row.rental.paymentIncrease.yearly()) : 'N/A'}</TableCell>

                <TableCell align="center">{moneyFormatter.format(row.investment.principle)}</TableCell>
                <TableCell align="center">{moneyFormatter.format(row.investment.contribution.monthly())}</TableCell>
                <TableCell align="center">{percentFormat(row.investment.growthRate.yearly())}</TableCell>

                <TableCell align="center">{moneyFormatter.format(row.investmentLoss)}</TableCell>
                <TableCell align="center">
                  <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                    <IconButton color="primary" aria-label="upload picture" component="span" onClick={() => handleEdit(i)}>
                      <Edit/>
                    </IconButton>
                    <IconButton color="primary" aria-label="upload picture" component="span" onClick={() => handleRemove(i)}>
                      <Delete/>
                    </IconButton>
                  </ButtonGroup>

                </TableCell>
              </TableRow>)
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <InputDialog initialData={initialData} open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      <Button onClick={handleOpen}>Add</Button>
      <Button onClick={handleDownloadCSV}>Download as CSV</Button>
      <input
        accept="text/csv"
        id="contained-button-file"
        type="file"
        onChange={handleLoadCSV}
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
