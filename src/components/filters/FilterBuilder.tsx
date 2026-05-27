import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { Plus, SlidersHorizontal, X } from 'lucide-react';

import { FilterBuilderProps, FilterCondition, FilterValue, DateRangeValue, NumberRangeValue } from '../../types/filter';
import { OPERATORS_BY_TYPE } from '../../utils/operatorConfig';
import FilterRow from './FilterRow';

let _nextId = 1;
function generateId() {
  return `filter_${_nextId++}_${Date.now()}`;
}

function defaultValueFor(type: string): FilterValue {
  switch (type) {
    case 'text': return '';
    case 'number': return null;
    case 'date': return { from: null, to: null } as DateRangeValue;
    case 'amount': return { min: null, max: null } as NumberRangeValue;
    case 'select': return '';
    case 'multiselect': return [];
    case 'boolean': return true;
    default: return '';
  }
}

export default function FilterBuilder({ fields, conditions, onChange }: FilterBuilderProps) {
  const addFilter = () => {
    if (!fields.length) return;

    const firstField = fields[0];
    const newCondition: FilterCondition = {
      id: generateId(),
      fieldKey: firstField.key,
      operator: OPERATORS_BY_TYPE[firstField.type][0].value,
      value: defaultValueFor(firstField.type),
    };
    onChange([...conditions, newCondition]);
  };

  const updateCondition = (id: string, updated: FilterCondition) => {
    onChange(conditions.map(c => (c.id === id ? updated : c)));
  };

  const removeCondition = (id: string) => {
    onChange(conditions.filter(c => c.id !== id));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <Paper
      variant="outlined"
      sx={{ borderRadius: 2, overflow: 'hidden' }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          py: 1.5,
          bgcolor: 'primary.main',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SlidersHorizontal size={18} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Filter
          </Typography>
          {conditions.length > 0 && (
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.25)',
                borderRadius: '50%',
                width: 22,
                height: 22,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {conditions.length}
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {conditions.length > 0 && (
            <Tooltip title="Clear all filters">
              <Button
                size="small"
                variant="text"
                onClick={clearAll}
                startIcon={<X size={14} />}
                sx={{ color: 'rgba(255,255,255,0.85)', textTransform: 'none', fontSize: 13 }}
              >
                Clear all
              </Button>
            </Tooltip>
          )}
          <Button
            size="small"
            variant="contained"
            onClick={addFilter}
            startIcon={<Plus size={14} />}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              textTransform: 'none',
              fontSize: 13,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              boxShadow: 'none',
            }}
          >
            Add Filter
          </Button>
        </Box>
      </Box>

      <Divider />

      {/* Filter rows */}
      <Box sx={{ p: 2 }}>
        {conditions.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 3,
              color: 'text.secondary',
            }}
          >
            <SlidersHorizontal size={32} style={{ opacity: 0.25, marginBottom: 8 }} />
            <Typography variant="body2" color="text.secondary">
              No filters applied — click <strong>Add Filter</strong> to get started
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {conditions.length > 1 && (
              <Typography variant="caption" color="text.secondary" sx={{ pl: 0.5 }}>
                AND between different fields · OR within the same field
              </Typography>
            )}
            {conditions.map(condition => (
              <FilterRow
                key={condition.id}
                condition={condition}
                fields={fields}
                onChange={updated => updateCondition(condition.id, updated)}
                onRemove={() => removeCondition(condition.id)}
              />
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
}
