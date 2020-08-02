import React from 'react';
import {
  Investment
} from '../api/math'
import {
  FormControl,
  InputAdornment,
  TextField,
  FormHelperText
} from '@material-ui/core';
import { buildTransformers } from '../api/transformer';

type InvestmentInputProps = {
  value: Investment,
  onChange: (value: Investment) => void,
};

export function InvestmentInput({value, onChange}: InvestmentInputProps) {
  const investmentTransformers = buildTransformers(value, onChange);
  const principleTransformers = buildTransformers(value.principle, (n) => {
    onChange({
      ...value,
      principle: n
    });
  });

  return (
    <div>
      <FormControl variant="filled">
        <TextField
          label="Investment Principle"
          id="standard-number"
          type="number"
          value={value.principle}
          onChange={principleTransformers.Number('start')}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <FormHelperText>How much money do you have currently (we expect you to take your down payment out of this money)</FormHelperText>
      </FormControl>
      <br />
      <FormControl variant="filled">
        <TextField
          label="Monthly Contribution"
          id="standard-number"
          type="number"
          value={value.contribution.monthly()}
          onChange={investmentTransformers.HousingNumber('contribution', 'monthly')}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <FormHelperText>How much do you contribute to your principle each month?</FormHelperText>
      </FormControl>

      <br />
      <FormControl variant="filled">
        <TextField
          label="Average Return"
          id="standard-number"
          type="number"
          value={value.principle.rate.yearly()}
          onChange={principleTransformers.HousingNumber('rate', "yearly")}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />
        <FormHelperText>What is the annual average rate of return of your portfolio?</FormHelperText>
      </FormControl>
      <br />
    </div>
  );
}
