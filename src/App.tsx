import React from 'react';
import {
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

function App() {
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState<InputDialogData[]>([]);
  const [index, setIndex] = React.useState(-1);
  const [initialData, setInitialData] = React.useState<InputDialogData>(new InputDialogData());

  function handleDownloadCSV() {
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + encodeCSV(rows));
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
      setRows(decodeCSV(fr.result as string, new InputDialogData()));
    }
    fr.readAsText(file);
  }

  const handleSubmit = (data: InputDialogData) => {
    if (index < 0 || index >= rows.length) {
      setRows([
        ...rows,
        data
      ]);
    } else {
      rows[index] = data;
      setRows([...rows]);
    }
    setOpen(false);
  };

  function handleOpen() {
    setIndex(-1);
    setOpen(true);
  }

  function handleRemove(i: number) {
    const left = rows.slice(0, i) || [];
    const right = rows.slice(i + 1) || [];
    setRows([...left, ...right]);
  }

  function handleEdit(i: number) {
    setIndex(i);
    setInitialData(rows[i]);
    setOpen(true);
  }

  return (
    <div>
      <div style={{height: '40vh', width: '100%'}}>
        <NetWorthTrendline data={rows}></NetWorthTrendline>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Label</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (<TableRow key={i}>
              <TableCell align="center">{row.label}</TableCell>
              <TableCell align="center">
                <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                  <IconButton color="primary" aria-label="Edit" component="span" onClick={() => handleEdit(i)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="primary" aria-label="Remove" component="span" onClick={() => handleRemove(i)}>
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
