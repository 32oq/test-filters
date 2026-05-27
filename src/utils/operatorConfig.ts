import { FieldType, OperatorOption } from '../types/filter';

// Maps each field type to the operators available for it
// This drives the operator dropdown in FilterRow
export const OPERATORS_BY_TYPE: Record<FieldType, OperatorOption[]> = {
  text: [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' },
    { value: 'doesNotContain', label: 'Does Not Contain' },
  ],
  number: [
    { value: 'eq', label: 'Equals' },
    { value: 'gt', label: 'Greater Than' },
    { value: 'lt', label: 'Less Than' },
    { value: 'gte', label: 'Greater Than or Equal' },
    { value: 'lte', label: 'Less Than or Equal' },
  ],
  date: [
    { value: 'between', label: 'Between' },
  ],
  amount: [
    { value: 'between', label: 'Between' },
  ],
  select: [
    { value: 'is', label: 'Is' },
    { value: 'isNot', label: 'Is Not' },
  ],
  multiselect: [
    { value: 'in', label: 'Includes Any Of' },
    { value: 'notIn', label: 'Excludes All Of' },
  ],
  boolean: [
    { value: 'is', label: 'Is' },
  ],
};
