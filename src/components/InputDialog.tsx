import React from 'react';
import {
  FormControl,
  MenuItem,
  Select,
  FormHelperText,
  InputLabel,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core';
import {HouseInput, RentalInput} from './HousingInput'
import {Plan, House, Rental, Investment} from '../api/math';
import {InvestmentInput} from './InvestmentInput';

const DEFAULT_PROJECTED_YEARS = 10;

export class InputDialogData {
  housingType: Plan = "house";
  house = new House();
  rental = new Rental();
  investment = new Investment();
  years = DEFAULT_PROJECTED_YEARS;
};

export interface InputDialogProps {
  initialData: InputDialogData;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: InputDialogData) => void
};

export function InputDialog({initialData, onSubmit, onClose, open}: InputDialogProps) {
  const [data, setData] = React.useState<InputDialogData>(initialData);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleChange = (event: React.ChangeEvent<{value: unknown}>) => {
    const value = event.target.value as Plan;
    setData({...data, housingType: value});
  };

  let HousingInput;
  switch (data.housingType) {
    case "house":
      HousingInput = <HouseInput value={data.house} onChange={v => setData({...data, house: v})} />
      break;
    case "rental":
      HousingInput = <RentalInput value={data.rental} onChange={v => setData({...data, rental: v})} />
      break;
  }

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
      <DialogContent>
        <FormControl>
          <InputLabel id="select-housing-type">Housing Type</InputLabel>
          <Select
            labelId="select-housing-type"
            value={data.housingType}
            onChange={handleChange}
          >
            <MenuItem value={'house'}>House</MenuItem>
            <MenuItem value={'rental'}>Apartment</MenuItem>
          </Select>
          <FormHelperText>Select housing type to compare</FormHelperText>
        </FormControl>
        {HousingInput}
        <InvestmentInput value={data.investment} onChange={v => setData({...data, investment: v})} />
        <FormControl variant="filled">
          <TextField
            label="Projected Years"
            id="standard-number"
            type="number"
            value={data.years}
            onChange={e => setData({...data, years: Number(e.target.value)})}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
          <FormHelperText>How long do you plan to stay in this housing situation?</FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
          </Button>
        <Button color="primary" onClick={() => onSubmit(data)}>Submit</Button>
      </DialogActions>
    </Dialog >
  );
}
