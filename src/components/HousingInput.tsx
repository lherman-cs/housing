import React from 'react';
import { 
  IHousing,
  IHouse,
  IRental
} from '../main'
import { HousingNumber, Period } from '../number'
import { 
  FormControl,
  FormHelperText,
  InputAdornment,
  TextField
} from '@material-ui/core';

type HousingInputProps = {
  value: IHousing,
  onChange: (value: IHousing) => void,
};

function HousingInput({ value, onChange }: HousingInputProps) {
  const transformers = {
    "HousingNumber" : (prop: keyof IHousing, type: Period) => 
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
          ...value,
          [prop]: new HousingNumber(Number(event.target.value), type)
        });
      },
    "Number": (prop: keyof IHousing) => 
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
          label="Monthly Payment"
          id="standard-number"
          type="number"
          value={value.payment.monthly()}
          onChange={transformers.HousingNumber('payment', 'monthly')}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          />
        <FormHelperText>e.g. rent, morgage</FormHelperText>
      </FormControl>
      <br/>
      <FormControl variant="filled">
        <TextField
          label="Upfront Costs"
          id="standard-number"
          type="number"
          value={value.downPayment}
          onChange={transformers.Number('downPayment')}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          />
        <FormHelperText>e.g. move-in fees, non-refundable fees, down payment</FormHelperText>
      </FormControl>
      <br/>
      <FormControl variant="filled">
        <TextField
          label="Spare Rooms"
          id="standard-number"
          type="number"
          value={value.extraBedrooms}
          onChange={transformers.Number('extraBedrooms')}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          />
        <FormHelperText>Fill this field if you plan to rent out your extra room(s)</FormHelperText>
      </FormControl>
      <br/>
      <FormControl variant="filled">
        <TextField
          label="Charge per Room"
          id="standard-number"
          type="number"
          value={value.chargeForRoom.monthly()}
          onChange={transformers.HousingNumber('chargeForRoom', 'monthly')}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          />
        <FormHelperText>How much you plan to charge for each spare room(s)</FormHelperText>
      </FormControl>
      <br/>
      <FormControl variant="filled">
        <TextField
          label="Charge per Room"
          id="standard-number"
          type="number"
          value={value.chargeForRoomIncrease.yearly()}
          onChange={transformers.HousingNumber('chargeForRoomIncrease', 'yearly')}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          />
        <FormHelperText>How much you plan to increase the rent for your spare room(s) each year</FormHelperText>
      </FormControl>
      <br/>
    </div>
  );
}


type HouseInputProps = {
  value: IHouse,
  onChange: (value: IHouse) => void
};

export function HouseInput({value, onChange} : HouseInputProps) {
  const transformers = {
    "HousingNumber" : (prop: keyof IHouse, type: Period) => 
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
          ...value,
          [prop]: new HousingNumber(Number(event.target.value), type)
        });
      },
    "Number": (prop: keyof IHouse) => 
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
          ...value,
          [prop]: Number(event.target.value)
        });
      }
  }

  return (
    <div>
      <HousingInput value={value} onChange={(v: IHousing) => onChange({...value, ...v})}/>
      <div>
      <FormControl variant="filled">
        <TextField
          label="Repair Cost"
          id="standard-number"
          type="number"
          value={value.repairCost.yearly()}
          onChange={transformers.HousingNumber('repairCost', 'yearly')}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          />
      </FormControl>
      <br/>
      <FormControl variant="filled">
        <TextField
          label="House Price"
          id="standard-number"
          type="number"
          value={value.housePrice}
          onChange={transformers.Number('housePrice')}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          />
      </FormControl>
      <br/>
      <FormControl variant="filled">
        <TextField
          label="Growth Rate"
          id="standard-number"
          type="number"
          value={value.growthRate.yearly()}
          onChange={transformers.HousingNumber('growthRate', 'yearly')}
          InputProps={{
             endAdornment: <InputAdornment position="end">%</InputAdornment>,

          }}
          />
      </FormControl>
      <br/>
      <FormControl variant="filled">
        <TextField
          label="HOA Fee"
          id="standard-number"
          type="number"
          value={value.hoaFee.monthly()}
          onChange={transformers.HousingNumber('hoaFee', 'monthly')}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,

          }}
          />
      </FormControl>
      </div>
      
    </div>
  );
}


type RentalInputProps = {
  value: IRental,
  onChange: (value: IRental) => void
};

export function RentalInput({value, onChange} : RentalInputProps) {
  const transformers = {
    "HousingNumber" : (prop: keyof IRental, type: Period) => 
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
          ...value,
          [prop]: new HousingNumber(Number(event.target.value), type)
        });
      }
  };

  return (
    <div>
      <HousingInput value={value} onChange={(v: IHousing) => onChange({...value, ...v})}/>
      <div>
      <FormControl variant="filled">
        <TextField
          label="Payment Increase Rate"
          id="standard-number"
          type="number"
          value={value.paymentIncrease.yearly()}
          onChange={transformers.HousingNumber('paymentIncrease', 'yearly')}
          InputProps={{
             endAdornment: <InputAdornment position="end">%</InputAdornment>,

          }}
          />
      </FormControl>
      </div>
      
    </div>
  );
}