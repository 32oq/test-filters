import React from 'react';
import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { DateRangeValue } from '../../../types/filter';

interface Props {
  value: DateRangeValue;
  onChange: (val: DateRangeValue) => void;
}

export default function DateRangeFilterInput({ value, onChange }: Props) {
  const fromVal = value.from ? dayjs(value.from) : null;
  const toVal = value.to ? dayjs(value.to) : null;

  const handleFrom = (date: Dayjs | null) => {
    onChange({ ...value, from: date ? date.format('YYYY-MM-DD') : null });
  };

  const handleTo = (date: Dayjs | null) => {
    onChange({ ...value, to: date ? date.format('YYYY-MM-DD') : null });
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <DatePicker
        label="From"
        value={fromVal}
        onChange={handleFrom}
        maxDate={toVal ?? undefined}
        slotProps={{
          textField: { size: 'small', sx: { width: 155 } },
        }}
      />
      <Box sx={{ color: 'text.secondary', fontSize: 13 }}>to</Box>
      <DatePicker
        label="To"
        value={toVal}
        onChange={handleTo}
        minDate={fromVal ?? undefined}
        slotProps={{
          textField: { size: 'small', sx: { width: 155 } },
        }}
      />
    </Box>
  );
}
