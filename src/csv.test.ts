import {encodeCSV, decodeCSV} from "./csv";
import {HousingNumber} from "./number";


describe('encodeCSV', function () {
  function expectRows(actual: string, expectedHeaders: string[], expectedBody: any[]) {
    const rows = actual.split("\n");
    const headers = rows[0].split(",");
    const body = rows.slice(1);

    expect(headers).toEqual(expect.arrayContaining(expectedHeaders));

    let i = 0;
    for (const row of body) {
      const cols = row.split(",");
      const expectedCols = expectedBody[i];

      let j = 0;
      for (const col of cols) {
        const actualHeader = headers[j];
        expect(col).toEqual(expectedCols[actualHeader]);
        j++;
      }

      i++;
    }
  }

  it('Happy Path', function () {
    const obj = {
      key1: "value1",
      key2: {
        key3: "value2"
      }
    };

    const encoded = encodeCSV([obj]);
    console.log(encoded);
    const expectedHeaders = [".key1", ".key2.key3"];
    const expectedBody = [
      {".key1": "value1", ".key2.key3": "value2"}
    ];

    expectRows(encoded, expectedHeaders, expectedBody);
  })
});

describe("decodeCSV", function () {
  it('Happy Path', function () {
    const obj = {
      key1: "value1",
      key2: {
        key3: new HousingNumber(30, "yearly")
      }
    };

    const model = {
      key1: "",
      key2: {
        key3: new HousingNumber(0, "monthly")
      }
    };

    const encoded = encodeCSV([obj]);
    const decoded = decodeCSV(encoded, model);
    expect(decoded).toEqual([obj]);
  });
});
