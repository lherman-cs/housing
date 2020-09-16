import React from 'react';
import {
  InputLabel,
  Select,
  MenuItem,
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
import {Data, House, Plan, Rental} from '../api/math';
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

  clone() {
    const data = new InputDialogData();
    return copy(this, data);
  }
};

function generateFormTemplate(plan: Plan): DataForm<InputDialogData> {
  const base: DataForm<InputDialogData> = {
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
    },
    housing: {
      downPayment: {
        rank: 5,
        label: "Upfront Costs",
        helper: "e.g. move-in fees, non-refundable fees, pizza + beer for your friends who helped you move",
        inputType: "number",
        startAdornment: "$"
      },
      extraBedrooms: {
        rank: 5,
        label: "Spare Rooms",
        helper: "How much you plan to charge for each spare room(s)",
        inputType: "number"
      },
      chargeForRoom: {
        rank: 5,
        label: "Charge per Room",
        helper: "",
        inputType: "number",
        period: 'monthly'
      },
      chargeForRoomIncrease: {
        rank: 5,
        label: "Charge for room increase per year?",
        helper: "How much you plan to increase the rent for your spare room(s) each year",
        inputType: "number",
        endAdornment: "%",
        period: "yearly"
      }
    }
  };

  const house: DataForm<House> = {
    repairCost: {
      rank: 6,
      label: "Annual Repair Cost",
      helper: "How much you expect to spend annually on home repairs",
      inputType: "number",
      startAdornment: "$",
      period: "yearly"
    },
    housePrice: {
      rank: 6.1,
      label: "House Price",
      helper: "How much you expect to pay for the home",
      inputType: "number",
      startAdornment: "$"
    },
    buyClosingCosts: {
      rank: 6.2,
      label: "Buying Closing Costs",
      helper: "How much you expect to pay for closing costs when buying the home(percent)",
      inputType: "number",
      endAdornment: "%"
    },
    sellClosingCosts: {
      rank: 6.3,
      label: "Selling Closing Costs",
      helper: "How much you expect to pay for closing costs when selling the home(percent)",
      inputType: "number",
      endAdornment: "%"
    },
    growthRate: {
      rank: 6.4,
      label: "Home Value Appreciation",
      helper: "How much you expect home value to go up each year",
      inputType: "number",
      endAdornment: "%",
      period: "yearly"
    },
    hoaFee: {
      rank: 6.5,
      label: "HOA Fee",
      helper: "Home Owner's Association Monthly Fee",
      inputType: "number",
      startAdornment: "$",
      period: "monthly"
    }
  };

  const rental: DataForm<Rental> = {
    payment: {
      rank: 6.1,
      label: "Monthly Rent Payment",
      helper: "How much do you pay rent every month?",
      inputType: "number",
      startAdornment: "$",
      period: "monthly"
    },
    paymentIncrease: {
      rank: 6.2,
      label: "Payment Increase Rate",
      helper: "How much you expect rent to go up annually",
      inputType: "number",
      endAdornment: "%",
      period: "yearly"
    }
  };

  switch (plan) {
    case "house":
      base.housing!.house = house;
      break;
    case "rental":
      base.housing!.rental = rental;
      break;
    default:
      throw new Error(`Unsupported plan: ${plan}`);
  }

  return base;
}

export function InputDialog({initialData, onSubmit, onClose, open}: InputDialogProps) {
  const [data, setData] = React.useState<InputDialogData>(initialData);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const template = generateFormTemplate(data.housing.plan);
  const form = generateForm(template, data, newData => setData(newData.clone()));
  const handlePlanChange = (event: React.ChangeEvent<{value: unknown}>) => {
    const value = event.target.value as Plan;
    data.housing.plan = value;
    setData(data.clone());
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
      <DialogContent>
        <FormControl>
          <InputLabel id="select-housing-type">Housing Type</InputLabel>
          <Select
            labelId="select-housing-type"
            value={data.housing.plan}
            onChange={handlePlanChange}
          >
            <MenuItem value={'house'}>House</MenuItem>
            <MenuItem value={'rental'}>Apartment</MenuItem>
          </Select>
          <FormHelperText>Select housing type to compare</FormHelperText>
        </FormControl>
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
