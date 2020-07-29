import React from 'react';
import { FormControl, MenuItem, Select, FormHelperText, InputLabel, TextField, InputAdornment } from '@material-ui/core';
import { HouseInput, RentalInput } from './components/HousingInput'
import { Plan, IHouse, IHousing, IRental, IInvestment, investmentLoss } from './main';
import { HousingNumber } from "./number";
import { InvestmentInput } from './components/InvestmentInput';

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
  hoaFee: new HousingNumber(250, "monthly")
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

function App() {
  const [housingType, setHousingType] = React.useState<Plan>('house');
  const [house, setHouse] = React.useState<IHouse>(DEFAULT_HOUSE);
  const [rental, setRental] = React.useState<IRental>(DEFAULT_RENTAL);
  const [investment, setInvestment] = React.useState<IInvestment>(DEFAULT_INVESTMENT);
  const [years, setYears] = React.useState<number>(DEFAULT_PROJECTED_YEARS);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as Plan;
    setHousingType(value);
  };

  let HousingInput;
  console.log({housingType});
  debugger;
  switch (housingType) {
    case "house":
      HousingInput = <HouseInput value={house} onChange={setHouse}/>
      break;
    case "rental":
      HousingInput = <RentalInput value={rental} onChange={setRental}/>
      break;
  }

  return (
    <div>
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
      <InvestmentInput value={investment} onChange={setInvestment}/>
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
      <h1>Investment Lost: {investmentLoss(house, investment, years)}</h1>
      <pre>
        { JSON.stringify({house, investment}, null, 2)}
      </pre>
    </div>
  );
}

export default App;
