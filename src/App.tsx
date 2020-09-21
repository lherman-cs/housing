import React from 'react';
import {
  Checkbox,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  ButtonGroup,
} from '@material-ui/core';
import {Edit, Delete} from "@material-ui/icons";
import {InputDialog, InputDialogData} from './components/InputDialog';
import {NetWorthTrendline} from './components/NetWorthTrendline';
import {encodeCSV, decodeCSV} from './api/csv'

class Row {
  selected = true;
  data: InputDialogData;

  constructor(initialData?: InputDialogData) {
    if (!initialData) {
      initialData = new InputDialogData();
    }

    this.data = initialData;
  }
}

function App() {
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState<Row[]>([]);
  const [index, setIndex] = React.useState(-1);
  const [initialData, setInitialData] = React.useState<InputDialogData>(new InputDialogData());
  const selectedData = rows.filter(e => e.selected).map(e => e.data);

  function handleDownloadCSV() {
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + encodeCSV(rows.map(e => e.data)));
    window.open(encodedUri);
  }

  async function handleLoadCSV(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) {
      return;
    }

    const file = files[0];
    if (!file) {
      return;
    }

    const fr = new FileReader();
    fr.onload = () => {
      setRows(decodeCSV(fr.result as string, new InputDialogData()).map(e => new Row(e)));
    }
    fr.readAsText(file);
  }

  const handleSubmit = (data: InputDialogData) => {
    if (index < 0 || index >= rows.length) {
      setRows([
        ...rows,
        new Row(data.clone())
      ]);
    } else {
      rows[index] = new Row(data.clone());
      setRows([...rows]);
    }
    setOpen(false);
  };

  function handleOpen() {
    setIndex(-1);
    setOpen(true);
  }

  function handleRemove(e: React.ChangeEvent<HTMLInputElement>, i: number) {
    e.stopPropagation();
    const left = rows.slice(0, i) || [];
    const right = rows.slice(i + 1) || [];
    setRows([...left, ...right]);
  }

  function handleEdit(e: React.ChangeEvent<HTMLInputElement>, i: number) {
    e.stopPropagation();
    setIndex(i);
    setInitialData(rows[i].data);
    setOpen(true);
  }

  function handleSelectAll(checked: boolean) {
    setRows(rows.map(e => ({...e, selected: checked})));
  }

  function handleSelect(i: number) {
    rows[i].selected = !rows[i].selected;
    setRows([...rows]);
  }

  return (
    <div>
      <div style={{height: '40vh', width: '100%'}}>
        <NetWorthTrendline data={selectedData} years={50}></NetWorthTrendline>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedData.length > 0 && selectedData.length === rows.length}
                  onChange={e => handleSelectAll(e.target.checked)}
                  inputProps={{'aria-label': 'select all desserts'}}
                />
              </TableCell>
              <TableCell align="center">Label</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow
                key={i}
                hover
                onClick={() => handleSelect(i)}
                role="checkbox"
                aria-checked={row.selected}
                tabIndex={-1}
                selected={row.selected}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={row.selected}
                  />
                </TableCell>
                <TableCell align="center">{row.data.label}</TableCell>
                <TableCell align="center">
                  <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                    <IconButton id="action-edit" color="primary" aria-label="Edit" component="span" onClick={(e: any) => handleEdit(e, i)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="primary" aria-label="Remove" component="span" onClick={(e: any) => handleRemove(e, i)}>
                      <Delete />
                    </IconButton>
                  </ButtonGroup>

                </TableCell>
              </TableRow>)
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <InputDialog initialData={initialData} open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      <Button onClick={handleOpen}>Add</Button>
      <Button onClick={handleDownloadCSV}>Download as CSV</Button>
      <input
        accept="text/csv"
        id="contained-button-file"
        type="file"
        onChange={handleLoadCSV}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span">
          Load CSV
        </Button>
      </label>
    </div >
  );
}

export default App;
