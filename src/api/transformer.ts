import {Period, HousingNumber} from "./number";

export function buildTransformers<T>(obj: T, onChange: (_: T) => void) {
  return {
    "HousingNumber": (prop: keyof T, type: Period) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        obj[prop] = new HousingNumber(Number(event.target.value), type) as unknown as T[keyof T];
        onChange(obj);
      },
    "Number": (prop: keyof T) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        obj[prop] = Number(event.target.value) as unknown as T[keyof T];
        onChange(obj);
      },
    "String": (prop: keyof T) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        obj[prop] = event.target.value as unknown as T[keyof T];
        onChange(obj);
      }
  };
}

