import {  Period, HousingNumber} from "./number";

export function buildTransformers<T>(obj: T, onChange: (_: T) => void) {
    return {
        "HousingNumber": (prop: keyof T, type: Period) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
          ...obj,
          [prop]: new HousingNumber(Number(event.target.value), type)
        });
      },
    "Number": (prop: keyof T) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
          ...obj,
          [prop]: Number(event.target.value)
        });
      }
  };
}
    