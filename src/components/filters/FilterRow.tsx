import React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Trash2 } from 'lucide-react';

import {
  FilterCondition,
  FieldDefinition,
  Operator,
  FilterValue,
  DateRangeValue,
  NumberRangeValue,
} from '../../types/filter';
import { OPERATORS_BY_TYPE } from '../../utils/operatorConfig';

import TextFilterInput from './inputs/TextFilterInput';
import NumberFilterInput from './inputs/NumberFilterInput';
import DateRangeFilterInput from './inputs/DateRangeFilterInput';
import AmountRangeFilterInput from './inputs/AmountRangeFilterInput';
import SelectFilterInput from './inputs/SelectFilterInput';
import MultiSelectFilterInput from './inputs/MultiSelectFilterInput';
import BooleanFilterInput from './inputs/BooleanFilterInput';

interface Props {
  condition: FilterCondition;
  fields: FieldDefinition[];
  onChange: (updated: FilterCondition) => void;
  onRemove: () => void;
}

// Returns appropriate default value when field type changes
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

export default function FilterRow({ condition, fields, onChange, onRemove }: Props) {
  const selectedField = fields.find(f => f.key === condition.fieldKey);
  const operators = selectedField ? OPERATORS_BY_TYPE[selectedField.type] : [];

  const handleFieldChange = (e: SelectChangeEvent) => {
    const newFieldKey = e.target.value;
    const newField = fields.find(f => f.key === newFieldKey);
    if (!newField) return;

    const newOperators = OPERATORS_BY_TYPE[newField.type];
    onChange({
      ...condition,
      fieldKey: newFieldKey,
      operator: newOperators[0].value,
      value: defaultValueFor(newField.type),
    });
  };

  const handleOperatorChange = (e: SelectChangeEvent) => {
    onChange({ ...condition, operator: e.target.value as Operator });
  };

  const handleValueChange = (val: FilterValue) => {
    onChange({ ...condition, value: val });
  };

  const renderValueInput = () => {
    if (!selectedField) return null;

    switch (selectedField.type) {
      case 'text':
        return (
          <TextFilterInput
            value={condition.value as string}
            onChange={handleValueChange}
          />
        );

      case 'number':
        return (
          <NumberFilterInput
            value={condition.value as number | null}
            onChange={handleValueChange}
          />
        );

      case 'date':
        return (
          <DateRangeFilterInput
            value={condition.value as DateRangeValue}
            onChange={handleValueChange}
          />
        );

      case 'amount':
        return (
          <AmountRangeFilterInput
            value={condition.value as NumberRangeValue}
            onChange={handleValueChange}
          />
        );

      case 'select':
        return (
          <SelectFilterInput
            value={condition.value as string}
            onChange={handleValueChange}
            options={selectedField.options ?? []}
          />
        );

      case 'multiselect':
        return (
          <MultiSelectFilterInput
            value={condition.value as string[]}
            onChange={handleValueChange}
            options={selectedField.options ?? []}
          />
        );

      case 'boolean':
        return (
          <BooleanFilterInput
            value={condition.value as boolean}
            onChange={handleValueChange}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        flexWrap: 'wrap',
        py: 1,
        px: 1.5,
        borderRadius: 1,
        bgcolor: 'grey.50',
        border: '1px solid',
        borderColor: 'grey.200',
      }}
    >
      {/* Field selector */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <Select value={condition.fieldKey} onChange={handleFieldChange}>
          {fields.map(f => (
            <MenuItem key={f.key} value={f.key}>
              {f.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Operator selector */}
      {operators.length > 1 ? (
        <FormControl size="small" sx={{ minWidth: 170 }}>
          <Select value={condition.operator} onChange={handleOperatorChange}>
            {operators.map(op => (
              <MenuItem key={op.value} value={op.value}>
                {op.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        // When there's only one operator (date/amount "Between"), just show the label
        <Box
          sx={{
            fontSize: 13,
            color: 'text.secondary',
            px: 1.5,
            py: 0.75,
            bgcolor: 'white',
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: 1,
            whiteSpace: 'nowrap',
          }}
        >
          {operators[0]?.label}
        </Box>
      )}

      {/* Value input — changes based on field type */}
      {renderValueInput()}

      {/* Remove button */}
      <Tooltip title="Remove filter">
        <IconButton
          size="small"
          onClick={onRemove}
          sx={{ color: 'error.main', ml: 'auto' }}
        >
          <Trash2 size={16} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
