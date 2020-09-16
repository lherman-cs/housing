import React from 'react';
import {
  FormControl,
  FormHelperText,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core';
import {Data, House} from '../api/math';
import {buildTransformers} from '../api/transformer';
import {HousingNumber, Period} from '../api/number';

export interface InputDialogProps {
  initialData: Data;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Data) => void
};

export type SupportedTypes = Number | HousingNumber;
export type DataFormField<T> = {
  label: string,
  helper: string,
  inputType: "number" | "email" | "password" | "text",
  validate?: (value: T) => boolean,
  period?: Period,
  startAdornment?: string,
  endAdornment?: string
};
export type DataForm<T> = {
  [key in keyof T]?: T[key] extends SupportedTypes ? DataFormField<T[key]> : DataForm<T[key]>
};

function generateForm<T>(form: DataForm<T>, data: T, onChange: (_: T) => void): JSX.Element {
  return (
    <div>
      {(Object.keys(form) as Array<keyof T>).map(key => {
        const value = data[key];
        if (value instanceof Number || value instanceof HousingNumber) {
          const field = form[key] as DataFormField<T[keyof T]>;
          const transformer = buildTransformers(data, onChange);
          return (
            <FormControl variant="filled">
              <TextField
                label={field.label}
                type={field.inputType}
                value={value}
                onChange={transformer[value.constructor.name](key, field.period)}
                InputProps={{
                  startAdornment: field.startAdornment && <InputAdornment position="start">field.startAdornment</InputAdornment>,
                  endAdornment: field.endAdornment && <InputAdornment position="end">field.endAdornment</InputAdornment>,
                }}
              />
              <FormHelperText>{field.helper}</FormHelperText>
            </FormControl>
          );
        }

        return generateForm<T[keyof T]>(form[key] as DataForm<T[keyof T]>, data[key], (obj) => {
          data[key] = obj;
          onChange(data);
        })
      })}
    </div>
  )
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
const BASE_FORM: Omit<DataForm<Data>, "housing"> = {
  investment: {
    principle: {
      start: {
        label: "Investment Principle",
        helper: "How much money do you have currently (we expect you to take your down payment out of this money)",
        inputType: "number",
        startAdornment: "$"
      },
      rate: {
        label: "Average Return",
        helper: "What is the annual average rate of return of your portfolio?",
        inputType: "number",
        endAdornment: "%"
      }
    },
    contribution: {
      label: "Monthly Contribution",
      helper: "How much do you contribute to your principle each month?",
      inputType: "number",
      startAdornment: "$"
    }
  },
  inflation: {
    label: "Inflation",
    helper: "How much inflation per year?",
    inputType: "number",
    endAdornment: "%",
    period: "yearly"
  }
};

const HOUSE_FORM: DataForm<Data> = {
  ...BASE_FORM,
  housing: {
  } as DataForm<House>,
};

export function InputDialog({initialData, onSubmit, onClose, open}: InputDialogProps) {
  const [data, setData] = React.useState<Data>(initialData);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const form = generateForm(HOUSE_FORM, data, setData);

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
      <DialogContent>
        {form}
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
