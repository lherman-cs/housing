import React from 'react';
import {
  Housing,
  House,
  Rental
} from '../api/math'
import {
  FormControl,
  FormHelperText,
  InputAdornment,
  TextField
} from '@material-ui/core';
import {buildTransformers} from '../api/transformer';

type HousingInputProps = {
  value: Housing,
  onChange: (value: Housing) => void,
};

function HousingInput({value, onChange}: HousingInputProps) {
  const housingTransformers = buildTransformers(value, onChange);

  return (
    <div>
      <FormControl variant="filled">
        <TextField
          label="Upfront Costs"
          id="standard-number"
          type="number"
          value={value.downPayment}
          onChange={housingTransformers.Number('downPayment')}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <FormHelperText>e.g. move-in fees, non-refundable fees, pizza + beer for your friends who helped you move</FormHelperText>
      </FormControl>
      <br />
      <FormControl variant="filled">
        <TextField
          label="Spare Rooms"
          id="standard-number"
          type="number"
          value={value.extraBedrooms}
          onChange={housingTransformers.Number('extraBedrooms')}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <FormHelperText>Fill this field if you plan to rent out your extra room(s)</FormHelperText>
      </FormControl>
      <br />
      <FormControl variant="filled">
        <TextField
          label="Charge per Room"
          id="standard-number"
          type="number"
          value={value.chargeForRoom.monthly()}
          onChange={housingTransformers.HousingNumber('chargeForRoom', 'monthly')}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <FormHelperText>How much you plan to charge for each spare room(s)</FormHelperText>
      </FormControl>
      <br />
      <FormControl variant="filled">
        <TextField
          label="Charge per Room"
          id="standard-number"
          type="number"
          value={value.chargeForRoomIncrease.yearly()}
          onChange={housingTransformers.HousingNumber('chargeForRoomIncrease', 'yearly')}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />
        <FormHelperText>How much you plan to increase the rent for your spare room(s) each year</FormHelperText>
      </FormControl>
      <br />
    </div>
  );
}


type HouseInputProps = {
  value: House,
  onChange: (value: House) => void
};

export function HouseInput({value, onChange}: HouseInputProps) {
  const houseTransformers = buildTransformers(value, onChange);

  return (
    <div>
      <HousingInput value={value} onChange={(v: Housing) => onChange({...value, ...v})} />
      <div>
        <FormControl variant="filled">
          <TextField
            label="Monthly Home Insurance"
            id="standard-number"
            type="number"
            value={value.insurance.monthly()}
            onChange={houseTransformers.HousingNumber('insurance', 'yearly')}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
          <FormHelperText>Expected home insurance monthly payment</FormHelperText>
        </FormControl>
        <br />
        <FormControl variant="filled">
          <TextField
            label="Monthly Property Taxes"
            id="standard-number"
            type="number"
            value={value.taxes.monthly()}
            onChange={houseTransformers.HousingNumber('taxes', 'yearly')}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
          <FormHelperText>Expected property taxes per month</FormHelperText>
        </FormControl>
        <br />
        <FormControl variant="filled">
          <TextField
            label="Annual Repair Cost"
            id="standard-number"
            type="number"
            value={value.repairCost.yearly()}
            onChange={houseTransformers.HousingNumber('repairCost', 'yearly')}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
          <FormHelperText>How much you expect to spend annually on home repairs</FormHelperText>
        </FormControl>
        <br />
        <FormControl variant="filled">
          <TextField
            label="House Price"
            id="standard-number"
            type="number"
            value={value.housePrice}
            onChange={houseTransformers.Number('housePrice')}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
          <FormHelperText>How much you expect to pay for the home</FormHelperText>
        </FormControl>
        <br />
        <FormControl variant="filled">
          <TextField
            label="Buying Closing Costs"
            id="standard-number"
            type="number"
            value={value.buyClosingCosts}
            onChange={houseTransformers.Number('buyClosingCosts')}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
          <FormHelperText>How much you expect to pay for closing costs when buying the home(percent)</FormHelperText>
        </FormControl>
        <br />
        <FormControl variant="filled">
          <TextField
            label="Selling Closing Costs"
            id="standard-number"
            type="number"
            value={value.sellClosingCosts}
            onChange={houseTransformers.Number('sellClosingCosts')}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
          <FormHelperText>How much you expect to pay for closing costs when selling the home (percent)</FormHelperText>
        </FormControl>
        <br />
        <FormControl variant="filled">
          <TextField
            label="Home Value Appreciation"
            id="standard-number"
            type="number"
            value={value.growthRate.yearly()}
            onChange={houseTransformers.HousingNumber('growthRate', 'yearly')}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,

            }}
          />
          <FormHelperText>How much you expect home value to go up each year</FormHelperText>
        </FormControl>
        <br />
        <FormControl variant="filled">
          <TextField
            label="HOA Fee"
            id="standard-number"
            type="number"
            value={value.hoaFee.monthly()}
            onChange={houseTransformers.HousingNumber('hoaFee', 'monthly')}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,

            }}
          />
          <FormHelperText>Home Owner's Association Monthly Fee</FormHelperText>
        </FormControl>
      </div>

    </div>
  );
}


type RentalInputProps = {
  value: Rental,
  onChange: (value: Rental) => void
};

export function RentalInput({value, onChange}: RentalInputProps) {
  const rentalTransformers = buildTransformers(value, onChange);

  return (
    <div>
      <HousingInput value={value} onChange={(v: Housing) => onChange({...value, ...v})} />
      <div>
        <FormControl variant="filled">
          <TextField
            label="Monthly Rent Payment"
            id="standard-number"
            type="number"
            value={value.payment.monthly()}
            onChange={rentalTransformers.HousingNumber('payment', 'monthly')}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </FormControl>
        <FormControl variant="filled">
          <TextField
            label="Payment Increase Rate"
            id="standard-number"
            type="number"
            value={value.paymentIncrease.yearly()}
            onChange={rentalTransformers.HousingNumber('paymentIncrease', 'yearly')}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,

            }}
          />
          <FormHelperText>How much you expect rent to go up annually</FormHelperText>
        </FormControl>
      </div>

    </div>
  );
}
