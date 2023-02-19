import React, { useState } from 'react';
import { TextField, Button } from "@mui/material";

function Snippet() {
  const [value, setValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('/api/my-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: value })
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Handle successful response
    }).catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Enter some text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
}

export default Snippet;
