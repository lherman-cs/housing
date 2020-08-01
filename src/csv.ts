export function decodeCSV<T extends any>(raw: string, model: T): T[] {
  const csvRows = raw.split('\n').map(row => row.split(','));
  const csvHeaders = csvRows[0];

  const csvModel = {} as any;
  for (let i = 0; i < csvHeaders.length; i++) {
    const csvHeader = csvHeaders[i];
    // first dot always represents root, ignoring.
    const keys = csvHeader.split(".").slice(1);
    let currentNode = csvModel;


    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      if (!(key in currentNode)) {
        currentNode[key] = j === keys.length - 1 ? i : {};
      }

      currentNode = currentNode[key];
    }
  }

  function fillCSVNode(csvNode: any, cols: string[]) {
    for (const key in csvNode) {
      const value = csvNode[key];

      if (typeof value === "number") {
        csvNode[key] = cols[value];
      } else {
        fillCSVNode(value, cols);
      }
    }

    return csvNode;
  }

  function fill(node: any, csvNode: any, model: any) {
    if (!node) {
      return;
    }

    for (const key in model) {
      const value = model[key];
      let t;

      if (typeof value.fromCSV === "function") {
        node[key] = value.fromCSV(csvNode[key]);
        continue;
      }

      switch (t = typeof value) {
        case "number":
          node[key] = Number(csvNode[key]);
          break;
        case "boolean":
          node[key] = Boolean(csvNode[key]);
          break;
        case "string":
          node[key] = csvNode[key];
          break;
        case "object":
          fill(node[key], csvNode[key], value);
          break;
        default:
          throw Error(`Unsupported type: ${t}`);
      }
    }
  }

  // ignore headers
  const csvBody = csvRows.slice(1);
  const csvNode = JSON.parse(JSON.stringify(csvModel));
  const rows = [];
  for (let i = 0; i < csvBody.length; i++) {
    // deep copy models
    const row = JSON.parse(JSON.stringify(model));

    fillCSVNode(csvNode, csvBody[i]);
    fill(row, csvNode, model);
    rows.push(row);
  }

  return rows;
}

export function encodeCSV(rows: any[]): string {
  const csvRows = [];
  const keys = {} as any;
  let keyCount = 0;

  function encode(tree: any): any {
    const m = {} as any;

    function visit(node: any, prefix: string) {
      if (!node) {
        return;
      }

      for (const key in node) {
        const newPrefix = `${prefix}.${key}`;
        const value = node[key];
        let encodedValue = null;

        if (typeof value.toCSV === "function") {
          encodedValue = value.toCSV();
        } else if (Array.isArray(value)) {
          // TODO
        } else if (typeof value === 'object') {
          visit(value, newPrefix);
        } else if (typeof value.toString === "function") {
          encodedValue = value.toString();
        } else {
          encodedValue = value;
        }

        if (encodedValue) {
          m[newPrefix] = encodedValue;

          if (!(newPrefix in keys)) {
            keys[newPrefix] = keyCount;
            keyCount++;
          }
        }
      }
    }

    visit(tree, "");
    return m;
  }

  for (const row of rows) {
    const m = encode(row);
    const csvCols = new Array(keyCount);

    for (const k in m) {
      const i = keys[k];
      csvCols[i] = m[k];
    }

    csvRows.push(csvCols);
  }

  return Object.keys(keys).join(",") + "\n"
    + csvRows.map(e => e.join(",")).join("\n");
}
