import React from 'react';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface Props {
  value: boolean;
  onChange: (val: boolean) => void;
}

export default function BooleanFilterInput({ value, onChange }: Props) {
  const handleChange = (e: SelectChangeEvent) => {
    onChange(e.target.value === 'true');
  };

  return (
    <FormControl size="small" sx={{ minWidth: 140 }}>
      <Select value={String(value)} onChange={handleChange}>
        <MenuItem value="true">True</MenuItem>
        <MenuItem value="false">False</MenuItem>
      </Select>
    </FormControl>
  );
}
