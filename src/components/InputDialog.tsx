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
import {Data, House, Plan, Housing} from '../api/math';
import {buildTransformers} from '../api/transformer';
import {HousingNumber, Period} from '../api/number';
import {copy} from '../api/copy';

export interface InputDialogProps {
  initialData: InputDialogData;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: InputDialogData) => void
};

export type SupportedTypes = String | Number | HousingNumber;
export type DataFormField<T> = {
  rank: number,
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
  const formFields: [JSX.Element, number][] = [];

  function addFormFields<T>(form: DataForm<T>, data: T, onChange: (_: T) => void) {
    (Object.keys(data) as Array<keyof T>)
      .filter(key => typeof data[key] !== 'function')
      .filter(key => form[key])
      .forEach(key => {
        const value = data[key];
        if (typeof value === "string"
          || value instanceof String
          || typeof value === "number"
          || value instanceof Number
          || value instanceof HousingNumber) {
          const field = form[key] as DataFormField<T[keyof T]>;
          const transformer = buildTransformers(data, onChange);
          const period = field.period;
          if (value instanceof HousingNumber) {
            if (!period) {
              throw new Error(`${key} is a housing number. "period" is required`);
            }
          }

          formFields.push([
            (<React.Fragment>
              <FormControl variant="filled">
                <TextField
                  label={field.label}
                  type={field.inputType}
                  value={value instanceof HousingNumber ? value.to(period!) : value}
                  onChange={transformer[value.constructor.name](key, field.period)}
                  InputProps={{
                    startAdornment: field.startAdornment && <InputAdornment position="start">{field.startAdornment}</InputAdornment>,
                    endAdornment: field.endAdornment && <InputAdornment position="end">{field.endAdornment}</InputAdornment>,
                  }}
                />
                <FormHelperText>{field.helper}</FormHelperText>
              </FormControl>
              <br />
            </React.Fragment>),
            field.rank
          ]);
          return;
        }

        addFormFields<T[keyof T]>(form[key] as DataForm<T[keyof T]>, data[key], (obj) => {
          data[key] = obj;
          onChange(data);
        })
      })
  }

  addFormFields(form, data, onChange);

  return (
    <div>
      {formFields.sort((a, b) => a[1] - b[1]).map(e => e[0])}
    </div>
  )
}

export class InputDialogData extends Data {
  label = "";
  plan: Plan = "house";

  clone() {
    const data = new InputDialogData();
    return copy(this, data);
  }
};

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
const BASE_FORM: Omit<DataForm<InputDialogData>, "housing"> = {
  label: {
    rank: 1,
    label: "Label",
    helper: "Logical label for the simulation",
    inputType: "text",
  },
  investment: {
    principle: {
      start: {
        rank: 2,
        label: "Investment Principle",
        helper: "How much money do you have currently (we expect you to take your down payment out of this money)",
        inputType: "number",
        startAdornment: "$"
      },
      rate: {
        rank: 2,
        label: "Average Return",
        helper: "What is the annual average rate of return of your portfolio?",
        inputType: "number",
        endAdornment: "%",
        period: "yearly"
      }
    },
    contribution: {
      rank: 3,
      label: "Monthly Contribution",
      helper: "How much do you contribute to your principle each month?",
      inputType: "number",
      startAdornment: "$",
      period: "monthly"
    }
  },
  inflation: {
    rank: 4,
    label: "Inflation",
    helper: "How much inflation per year?",
    inputType: "number",
    endAdornment: "%",
    period: "yearly"
  }
};

const HOUSE_FORM: DataForm<InputDialogData> = {
  ...BASE_FORM,
  housing: {
  } as DataForm<Housing>,
};

export function InputDialog({initialData, onSubmit, onClose, open}: InputDialogProps) {
  const [data, setData] = React.useState<InputDialogData>(initialData);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const form = generateForm(HOUSE_FORM, data, newData => setData(newData.clone()));

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
