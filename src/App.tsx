import React from 'react';
import {Button} from '@material-ui/core';
import {InputDialog, InputDialogData} from './components/InputDialog';

function App() {
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (data: InputDialogData) => {
    console.log({data});
    setOpen(false);
  };

  return (
    <div>
      <InputDialog open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      <Button onClick={() => setOpen(true)}>Add</Button>
    </div>
  );
}

export default App;
