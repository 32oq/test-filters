import {
  FilterCondition,
  FieldDefinition,
  FilterValue,
  DateRangeValue,
  NumberRangeValue,
  TextOperator,
  NumberOperator,
  SelectOperator,
  MultiSelectOperator,
} from '../types/filter';
import { getNestedValue } from './nestedGet';

// Checks if a single filter condition is satisfied for a given record
function evaluateCondition(record: any, condition: FilterCondition, field: FieldDefinition): boolean {
  const fieldValue = getNestedValue(record, condition.fieldKey);
  const { operator, value } = condition;

  switch (field.type) {
    case 'text': {
      // skip if nothing typed yet
      if (!value && value !== false) return true;
      const str = String(fieldValue ?? '').toLowerCase();
      const filterStr = String(value).toLowerCase().trim();
      if (!filterStr) return true;

      switch (operator as TextOperator) {
        case 'equals': return str === filterStr;
        case 'contains': return str.includes(filterStr);
        case 'startsWith': return str.startsWith(filterStr);
        case 'endsWith': return str.endsWith(filterStr);
        case 'doesNotContain': return !str.includes(filterStr);
        default: return true;
      }
    }

    case 'number': {
      if (value === null || value === undefined || value === '') return true;
      const numField = Number(fieldValue);
      const numFilter = Number(value);
      if (isNaN(numField) || isNaN(numFilter)) return true;

      switch (operator as NumberOperator) {
        case 'eq': return numField === numFilter;
        case 'gt': return numField > numFilter;
        case 'lt': return numField < numFilter;
        case 'gte': return numField >= numFilter;
        case 'lte': return numField <= numFilter;
        default: return true;
      }
    }

    case 'date': {
      const range = value as DateRangeValue;
      if (!range || (!range.from && !range.to)) return true;

      const ts = fieldValue ? new Date(fieldValue as string).getTime() : null;
      if (!ts || isNaN(ts)) return true;

      const fromTs = range.from ? new Date(range.from).getTime() : null;
      const toTs = range.to ? new Date(range.to).getTime() : null;

      if (fromTs && toTs) return ts >= fromTs && ts <= toTs;
      if (fromTs) return ts >= fromTs;
      if (toTs) return ts <= toTs;
      return true;
    }

    case 'amount': {
      const range = value as NumberRangeValue;
      if (!range || (range.min === null && range.max === null)) return true;

      const numField = Number(fieldValue);
      if (isNaN(numField)) return true;

      if (range.min !== null && range.max !== null) return numField >= range.min && numField <= range.max;
      if (range.min !== null) return numField >= range.min;
      if (range.max !== null) return numField <= range.max;
      return true;
    }

    case 'select': {
      if (value === null || value === undefined || value === '') return true;
      const strField = String(fieldValue ?? '');

      switch (operator as SelectOperator) {
        case 'is': return strField === String(value);
        case 'isNot': return strField !== String(value);
        default: return true;
      }
    }

    case 'multiselect': {
      const filterVals = value as string[];
      if (!filterVals || filterVals.length === 0) return true;

      // field might be an array (skills) or scalar (department filtered via multiselect)
      const fieldArr = Array.isArray(fieldValue)
        ? (fieldValue as any[]).map(String)
        : [String(fieldValue ?? '')];

      switch (operator as MultiSelectOperator) {
        case 'in':
          // record must have at least one of the selected filter values
          return filterVals.some(fv => fieldArr.includes(String(fv)));
        case 'notIn':
          // record must have none of the selected filter values
          return !filterVals.some(fv => fieldArr.includes(String(fv)));
        default: return true;
      }
    }

    case 'boolean': {
      if (value === null || value === undefined) return true;
      // value stored as boolean true/false from the input
      return Boolean(fieldValue) === Boolean(value);
    }

    default:
      return true;
  }
}

// Main filtering function.
// Logic: AND between different fields, OR within the same field
// (if you add two conditions on "name", a record matches if EITHER passes)
export function applyFilters<T extends Record<string, any>>(
  data: T[],
  conditions: FilterCondition[],
  fields: FieldDefinition[]
): T[] {
  const activeConditions = conditions.filter(c => !isEmptyCondition(c, fields));
  if (!activeConditions.length) return data;

  // Build a quick lookup map for field definitions
  const fieldMap: Record<string, FieldDefinition> = {};
  fields.forEach(f => { fieldMap[f.key] = f; });

  // Group conditions by fieldKey for OR logic within the same field
  const grouped: Record<string, FilterCondition[]> = {};
  activeConditions.forEach(c => {
    if (!grouped[c.fieldKey]) grouped[c.fieldKey] = [];
    grouped[c.fieldKey].push(c);
  });

  return data.filter(record => {
    // Every field group must pass (AND)
    return Object.entries(grouped).every(([fieldKey, fieldConditions]) => {
      const field = fieldMap[fieldKey];
      if (!field) return true;
      // At least one condition in this group must pass (OR)
      return fieldConditions.some(cond => evaluateCondition(record, cond, field));
    });
  });
}

// A condition is "empty" if the user hasn't filled in a meaningful value yet
function isEmptyCondition(cond: FilterCondition, fields: FieldDefinition[]): boolean {
  const field = fields.find(f => f.key === cond.fieldKey);
  if (!field) return true;

  const v: FilterValue = cond.value;

  switch (field.type) {
    case 'text':
      return !v || String(v).trim() === '';
    case 'number':
      return v === null || v === undefined || v === '';
    case 'date': {
      const r = v as DateRangeValue;
      return !r || (!r.from && !r.to);
    }
    case 'amount': {
      const r = v as NumberRangeValue;
      return !r || (r.min === null && r.max === null);
    }
    case 'select':
      return !v || v === '';
    case 'multiselect':
      return !v || (v as string[]).length === 0;
    case 'boolean':
      return v === null || v === undefined;
    default:
      return false;
  }
}
