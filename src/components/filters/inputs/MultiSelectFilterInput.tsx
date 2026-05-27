import React from 'react';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { SelectOption } from '../../../types/filter';

interface Props {
  value: string[];
  onChange: (val: string[]) => void;
  options: SelectOption[];
}

export default function MultiSelectFilterInput({ value, onChange, options }: Props) {
  const handleChange = (e: SelectChangeEvent<string[]>) => {
    const raw = e.target.value;
    onChange(typeof raw === 'string' ? raw.split(',') : raw);
  };

  const renderSelected = (selected: string[]) => {
    if (!selected.length) return <em style={{ color: '#9e9e9e' }}>Select options...</em>;
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selected.map(val => {
          const opt = options.find(o => String(o.value) === val);
          return <Chip key={val} label={opt?.label ?? val} size="small" />;
        })}
      </Box>
    );
  };

  return (
    <FormControl size="small" sx={{ minWidth: 220 }}>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        renderValue={renderSelected}
        displayEmpty
        MenuProps={{
          slotProps: { paper: { style: { maxHeight: 300 } } },
        }}
      >
        {options.map(opt => {
          const strVal = String(opt.value);
          return (
            <MenuItem key={strVal} value={strVal}>
              <Checkbox checked={value.includes(strVal)} size="small" />
              <ListItemText primary={opt.label} />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
