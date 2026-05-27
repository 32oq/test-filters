import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';

interface Props {
  value: number | null;
  onChange: (val: number | null) => void;
  placeholder?: string;
}

export default function NumberFilterInput({ value, onChange, placeholder = 'Enter number...' }: Props) {
  const [local, setLocal] = useState(value !== null ? String(value) : '');

  useEffect(() => {
    setLocal(value !== null ? String(value) : '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocal(raw);
    const parsed = raw === '' ? null : Number(raw);
    // don't fire onChange for things like "1." (user still typing)
    if (raw === '' || (!isNaN(parsed as number) && !raw.endsWith('.'))) {
      onChange(parsed);
    }
  };

  return (
    <TextField
      size="small"
      type="number"
      value={local}
      onChange={handleChange}
      placeholder={placeholder}
      sx={{ minWidth: 140 }}
      slotProps={{ htmlInput: { step: 'any' } }}
    />
  );
}
