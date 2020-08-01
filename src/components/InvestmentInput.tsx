import React from 'react';
import { 
  IInvestment
} from '../main'
import { HousingNumber, Period } from '../number'
import { 
  FormControl,
  InputAdornment,
  TextField,
  FormHelperText
} from '@material-ui/core';

type InvestmentInputProps = {
  value: IInvestment,
  onChange: (value: IInvestment) => void,
};

export function InvestmentInput({ value, onChange }: InvestmentInputProps) {
  const transformers = {
    "HousingNumber" : (prop: keyof IInvestment, type: Period) => 
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
          ...value,
          [prop]: new HousingNumber(Number(event.target.value), type)
        });
      },
    "Number": (prop: keyof IInvestment) => 
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
          ...value,
          [prop]: Number(event.target.value)
        });
      }
  }

  return (
    <div>
      <FormControl variant="filled">
        <TextField
          label="Investment Principle"
          id="standard-number"
          type="number"
          value={value.principle}
          onChange={transformers.Number('principle')}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          />
          <FormHelperText>How much money do you have currently (we expect you to take your down payment out of this money)</FormHelperText>
      </FormControl>
      <br/>
      <FormControl variant="filled">
        <TextField
          label="Monthly Contribution"
          id="standard-number"
          type="number"
          value={value.contribution.monthly()}
          onChange={transformers.HousingNumber('contribution', 'monthly')}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          />
          <FormHelperText>How much do you contribute to your principle each month?</FormHelperText>
      </FormControl>

      <br/>
      <FormControl variant="filled">
        <TextField
          label="Average Return"
          id="standard-number"
          type="number"
          value={value.growthRate.yearly()}
          onChange={transformers.HousingNumber('growthRate', 'yearly')}
          InputProps={{
             endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          />
          <FormHelperText>What is the annual average rate of return of your portfolio?</FormHelperText>
      </FormControl>
      <br/>
    </div>
  );
}
