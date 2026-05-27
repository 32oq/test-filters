// Core types for the filter system
// These types define everything - field definitions, operators, filter state

export type FieldType =
  | "text"
  | "number"
  | "date"
  | "amount"
  | "select"
  | "multiselect"
  | "boolean";

// Each operator has a label shown in UI and a value used in logic
export type TextOperator =
  | "equals"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "doesNotContain";

export type NumberOperator = "eq" | "gt" | "lt" | "gte" | "lte";
export type DateOperator = "between";
export type AmountOperator = "between";
export type SelectOperator = "is" | "isNot";
export type MultiSelectOperator = "in" | "notIn";
export type BooleanOperator = "is";

export type Operator =
  | TextOperator
  | NumberOperator
  | DateOperator
  | AmountOperator
  | SelectOperator
  | MultiSelectOperator
  | BooleanOperator;

// What a select/multiselect option looks like
export interface SelectOption {
  label: string;
  value: string | number | boolean;
}

// Field definition - this is what you pass to configure the filter system
// for any given table. Completely external, no hardcoding inside the component.
export interface FieldDefinition {
  key: string;           // the data key, supports dot notation like "address.city"
  label: string;         // shown in the field dropdown
  type: FieldType;
  options?: SelectOption[]; // only for select/multiselect
}

// A single filter condition - one row in the filter builder
export interface FilterCondition {
  id: string;            // unique id for react keys / removal
  fieldKey: string;
  operator: Operator;
  value: FilterValue;
}

// Value can be different things depending on field type
export type FilterValue =
  | string
  | number
  | boolean
  | string[]
  | DateRangeValue
  | NumberRangeValue
  | null;

export interface DateRangeValue {
  from: string | null;   // ISO date string
  to: string | null;
}

export interface NumberRangeValue {
  min: number | null;
  max: number | null;
}

// Operator config used to build the operator dropdown per field type
export interface OperatorOption {
  value: Operator;
  label: string;
}

// Props for the main filter builder component
export interface FilterBuilderProps {
  fields: FieldDefinition[];
  conditions: FilterCondition[];
  onChange: (conditions: FilterCondition[]) => void;
}
