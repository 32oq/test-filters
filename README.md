# Filter System

A reusable, type-safe dynamic filter component built with React 18 + TypeScript + Material UI.

## Quick Start

```bash
# Requires Node 14+
npm install
npm start        # http://localhost:3000
npm run build    # production build
```

> **Note:** If the default Node on your machine is older, run with a newer binary:
> ```bash
> ~/.nvm/versions/node/v18.20.8/bin/node node_modules/.bin/react-scripts start
> ```

---

## Architecture

```
src/
├── types/
│   ├── filter.ts          # All filter-related TypeScript types
│   └── data.ts            # Employee / TableColumn interfaces
├── data/
│   └── employees.ts       # 55 sample records (varied across all field types)
├── services/
│   └── mockApi.ts         # Async wrapper simulating real API calls
├── utils/
│   ├── filterEngine.ts    # Core AND/OR filtering algorithms
│   ├── operatorConfig.ts  # Operator options per field type
│   ├── nestedGet.ts       # Dot-notation value accessor (e.g. address.city)
│   └── exportHelpers.ts   # CSV / JSON export
├── hooks/
│   └── useDebounce.ts     # Generic debounce hook
├── components/
│   ├── filters/
│   │   ├── FilterBuilder.tsx          # Main filter panel
│   │   ├── FilterRow.tsx              # One filter condition row
│   │   └── inputs/
│   │       ├── TextFilterInput.tsx
│   │       ├── NumberFilterInput.tsx
│   │       ├── DateRangeFilterInput.tsx
│   │       ├── AmountRangeFilterInput.tsx
│   │       ├── SelectFilterInput.tsx
│   │       ├── MultiSelectFilterInput.tsx
│   │       └── BooleanFilterInput.tsx
│   └── table/
│       └── DataTable.tsx  # Sortable, paginated table
└── pages/
    └── EmployeePage.tsx   # Wires fields + columns + filtering together
```

---

## Using FilterBuilder with a Different Table

The component is fully configuration-driven. To adapt it for any table, define field definitions and pass them in:

```tsx
const TRANSACTION_FIELDS: FieldDefinition[] = [
  { key: 'amount', label: 'Amount', type: 'amount' },
  { key: 'paymentMethod', label: 'Payment Method', type: 'select', options: [
    { label: 'Card', value: 'Card' },
    { label: 'Bank', value: 'Bank' },
    { label: 'UPI', value: 'UPI' },
  ]},
  { key: 'isRefunded', label: 'Refunded', type: 'boolean' },
];

// In your page:
const [conditions, setConditions] = useState<FilterCondition[]>([]);
const filtered = useMemo(
  () => applyFilters(transactions, conditions, TRANSACTION_FIELDS),
  [transactions, conditions]
);
```

No changes inside FilterBuilder or any input component needed.

---

## Supported Field Types & Operators

| Type          | Operators                                             | Input UI               |
|---------------|-------------------------------------------------------|------------------------|
| `text`        | Contains, Equals, Starts With, Ends With, Not Contain | Text field (debounced) |
| `number`      | =, >, <, ≥, ≤                                        | Number field           |
| `date`        | Between                                               | Two date pickers       |
| `amount`      | Between                                               | Min/max with $         |
| `select`      | Is, Is Not                                            | Dropdown               |
| `multiselect` | Includes Any Of, Excludes All Of                      | Checkbox multi-select  |
| `boolean`     | Is                                                    | True/False dropdown    |

---

## Filter Logic

- **AND between different fields** — all conditions on different fields must pass
- **OR within the same field** — two conditions on the same field: a record matches if either passes
- **Empty conditions are skipped** — unfilled rows don't affect results

---

## Bonus Features

- **Export to CSV / JSON** — exports the currently filtered dataset
- **Debounced text input** — 300ms delay on text fields
- **Sortable columns** — click any sortable column header
- **Pagination** — 5 / 10 / 25 / 50 rows per page
- **Nested object filtering** — dot notation `fieldKey` (e.g. `address.city`)
- **Array field filtering** — `skills` array with "Includes Any Of" intersection check

---

## Tech Stack

- React 18 + TypeScript
- Create React App (react-scripts 5)
- Material UI v9
- Day.js + @mui/x-date-pickers
- Lucide React (icons)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
