import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { NumberRangeValue } from '../../../types/filter';

interface Props {
  value: NumberRangeValue;
  onChange: (val: NumberRangeValue) => void;
}

export default function AmountRangeFilterInput({ value, onChange }: Props) {
  const handleMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const num = raw === '' ? null : Number(raw);
    onChange({ ...value, min: num !== null && !isNaN(num) ? num : null });
  };

  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const num = raw === '' ? null : Number(raw);
    onChange({ ...value, max: num !== null && !isNaN(num) ? num : null });
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <TextField
        size="small"
        type="number"
        placeholder="Min"
        value={value.min !== null ? value.min : ''}
        onChange={handleMin}
        sx={{ width: 130 }}
        slotProps={{
          input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
          htmlInput: { min: 0, step: 1000 },
        }}
      />
      <Box sx={{ color: 'text.secondary', fontSize: 13 }}>–</Box>
      <TextField
        size="small"
        type="number"
        placeholder="Max"
        value={value.max !== null ? value.max : ''}
        onChange={handleMax}
        sx={{ width: 130 }}
        slotProps={{
          input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
          htmlInput: { min: 0, step: 1000 },
        }}
      />
    </Box>
  );
}
