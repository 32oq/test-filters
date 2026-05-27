import React from 'react';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { SelectOption } from '../../../types/filter';

interface Props {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
}

export default function SelectFilterInput({ value, onChange, options }: Props) {
  const handleChange = (e: SelectChangeEvent) => {
    onChange(e.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 180 }}>
      <Select
        value={value}
        onChange={handleChange}
        displayEmpty
      >
        <MenuItem value="">
          <em style={{ color: '#9e9e9e' }}>Select...</em>
        </MenuItem>
        {options.map(opt => (
          <MenuItem key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
