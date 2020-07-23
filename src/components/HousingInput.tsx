import React from 'react';
import { 
  // IHousing,
  Plan as HousingTypes 
} from '../main'
// import { HousingNumber } from '../number'
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  // InputAdornment,
  // TextField
  // FilledInput
} from '@material-ui/core';


// plan: Plan;
// payment: HousingNumber;
// downPayment: number;
// chargeForRoom: HousingNumber;
// chargeForRoomIncrease: HousingNumber;
// extraBedrooms: number;
// utilityCost: HousingNumber;
export function HousingInput() {
  
  const DwellingInput = function(){
    return (
      <div>
        HousingInput
      </div>
    ); 
  }
  const ApartmentInput = function (){
    return (
      <div>
        {DwellingInput()}
        ApartmentInput
      </div>
    );
  }
  const HouseInput = function (){
    return (
      <div>
        {DwellingInput()}
        HouseInput
      </div>
    );
  }

  const [housingType, setHousingType] = React.useState('');

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as HousingTypes;
    setHousingType(value)
  };
  return (
    <div>
      <FormControl>
        <InputLabel id="select-housing-type">Housing Type</InputLabel>
        <Select
          labelId="select-housing-type"
          value={housingType}
          onChange={handleChange}
        >
          <MenuItem value={HousingTypes.house}>House</MenuItem>
          <MenuItem value={HousingTypes.rental}>Apartment</MenuItem>
        </Select>
        <FormHelperText>Select housing type to compare</FormHelperText>
      </FormControl>
      {
        housingType !== '' ? 
            housingType === HousingTypes.house ? 
                HouseInput()
              :
                ApartmentInput()
          : 
            <div/>
      }
    </div>
  );
}
