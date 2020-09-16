import {encodeCSV, decodeCSV} from "./csv";
import {HousingNumber} from "./number";
import {copy} from "./copy";


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

  it('should be fine with single row', function () {
    const obj = {
      key1: "value1",
      key2: {
        key3: "value2"
      }
    };

    const encoded = encodeCSV([obj]);
    const expectedHeaders = [".key1", ".key2.key3"];
    const expectedBody = [
      {".key1": "value1", ".key2.key3": "value2"}
    ];

    expectRows(encoded, expectedHeaders, expectedBody);
  })

  it('should be fine with multiple rows', function () {
    const obj1 = {
      key1: "value1",
      key2: {
        key3: "value2"
      }
    };

    const obj2 = {
      key1: "poop",
      key2: {
        key3: "value2"
      }
    };

    const encoded = encodeCSV([obj1, obj2]);
    const expectedHeaders = [".key1", ".key2.key3"];
    const expectedBody = [
      {".key1": "value1", ".key2.key3": "value2"},
      {".key1": "poop", ".key2.key3": "value2"}
    ];

    expectRows(encoded, expectedHeaders, expectedBody);
  })
});

describe("decodeCSV", function () {
  it('it should be fine with 1 row', function () {
    class Model {
      key1 = "";
      key2 = {
        key3: new HousingNumber(0, "monthly")
      };

      clone() {
        return new Model();
      }
    }
    const obj = {
      key1: "value1",
      key2: {
        key3: new HousingNumber(30, "yearly")
      }
    };

    const model = new Model();
    const encoded = encodeCSV([obj]);
    const decoded = decodeCSV(encoded, model);
    expect(decoded).toEqual([obj]);
  });

  it('it should be fine with multiple rows', function () {
    class Model {
      key1 = "";
      key2 = {
        key3: new HousingNumber(0, "monthly")
      };

      clone() {
        return new Model();
      }
    }

    const obj1 = {
      key1: "value1",
      key2: {
        key3: new HousingNumber(2, "monthly")
      }
    };

    const obj2 = {
      key1: "poop",
      key2: {
        key3: new HousingNumber(1, "monthly")
      }
    };

    const model = new Model();
    const encoded = encodeCSV([obj1, obj2]);
    const decoded = decodeCSV(encoded, model);
    expect(decoded).toEqual([obj1, obj2]);
  });
});
