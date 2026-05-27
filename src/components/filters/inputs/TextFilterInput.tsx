import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

// Local state so the field doesn't feel laggy while typing
// The parent gets the debounced value via onChange
export default function TextFilterInput({ value, onChange, placeholder = 'Enter value...' }: Props) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (local !== value) onChange(local);
    }, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local]);

  return (
    <TextField
      size="small"
      value={local}
      onChange={e => setLocal(e.target.value)}
      placeholder={placeholder}
      sx={{ minWidth: 180 }}
    />
  );
}
