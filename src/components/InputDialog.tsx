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
import {Plan, IHouse, IHousing, IRental, IInvestment, investmentLoss} from '../main';
import {HousingNumber} from "../number";
import {InvestmentInput} from './InvestmentInput';

const DEFAULT_HOUSING: IHousing = {
  plan: "house",
  payment: new HousingNumber(800, 'monthly'),
  downPayment: 0,
  chargeForRoom: new HousingNumber(600, 'monthly'),
  chargeForRoomIncrease: new HousingNumber(.03, "yearly"),
  extraBedrooms: 0,
  utilityCost: new HousingNumber(100, 'monthly'),
};

const DEFAULT_HOUSE: IHouse = {
  ...DEFAULT_HOUSING,
  plan: "house",
  repairCost: new HousingNumber(500, "yearly"),
  housePrice: 250000,
  growthRate: new HousingNumber(0.04, "yearly"),
  hoaFee: new HousingNumber(250, "monthly"),
  loan: {
    interestRate: new HousingNumber(.03, "yearly"),
    term: 30
  }
};

const DEFAULT_RENTAL: IRental = {
  ...DEFAULT_HOUSING,
  plan: "rental",
  paymentIncrease: new HousingNumber(0.01, "yearly")
};

const DEFAULT_INVESTMENT: IInvestment = {
  principle: 0,
  contribution: new HousingNumber(1000, "monthly"),
  growthRate: new HousingNumber(0.06, "yearly")
}

const DEFAULT_PROJECTED_YEARS = 10;

export interface InputDialogDataInit {
  housingType: Plan;
  house: IHouse;
  rental: IRental;
  investment: IInvestment;
  years: number;
};

export interface InputDialogData extends InputDialogDataInit {
  investmentLoss: number;
};

export interface InputDialogProps {
  initialData?: InputDialogDataInit;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: InputDialogData) => void
};

export function InputDialog({initialData, onSubmit, onClose, open}: InputDialogProps) {
  if (!initialData) {
    initialData = {
      housingType: 'house',
      house: DEFAULT_HOUSE,
      rental: DEFAULT_RENTAL,
      investment: DEFAULT_INVESTMENT,
      years: DEFAULT_PROJECTED_YEARS
    };
  }

  const [housingType, setHousingType] = React.useState<Plan>(initialData.housingType);
  const [house, setHouse] = React.useState<IHouse>(initialData.house);
  const [rental, setRental] = React.useState<IRental>(initialData.rental);
  const [investment, setInvestment] = React.useState<IInvestment>(initialData.investment);
  const [years, setYears] = React.useState<number>(initialData.years);

  React.useEffect(() => {
    if (!initialData) {
      return
    }
    setHousingType(initialData.housingType);
    setHouse(initialData.house);
    setRental(initialData.rental);
    setInvestment(initialData.investment);
    setYears(initialData.years);
  }, [initialData]);

  const handleChange = (event: React.ChangeEvent<{value: unknown}>) => {
    const value = event.target.value as Plan;
    setHousingType(value);
  };

  const handleSubmit = () => {
    onSubmit({
      housingType,
      house,
      rental,
      investment,
      years,
      investmentLoss: investmentLoss(housingType === 'house' ? house : rental, investment, years)
    });
  };

  let HousingInput;
  switch (housingType) {
    case "house":
      HousingInput = <HouseInput value={house} onChange={setHouse} />
      break;
    case "rental":
      HousingInput = <RentalInput value={rental} onChange={setRental} />
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
            value={housingType}
            onChange={handleChange}
          >
            <MenuItem value={'house'}>House</MenuItem>
            <MenuItem value={'rental'}>Apartment</MenuItem>
          </Select>
          <FormHelperText>Select housing type to compare</FormHelperText>
        </FormControl>
        {HousingInput}
        <InvestmentInput value={investment} onChange={setInvestment} />
        <FormControl variant="filled">
          <TextField
            label="Projected Years"
            id="standard-number"
            type="number"
            value={years}
            onChange={e => setYears(Number(e.target.value))}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
          </Button>
        <Button color="primary" onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog >
  );
}
