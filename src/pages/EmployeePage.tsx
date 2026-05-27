import React, { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import { Download, FileJson, FileText } from 'lucide-react';

import { FilterCondition, FieldDefinition } from '../types/filter';
import { Employee, TableColumn } from '../types/data';
import { fetchEmployees } from '../services/mockApi';
import { applyFilters } from '../utils/filterEngine';
import { exportToCSV, exportToJSON } from '../utils/exportHelpers';
import FilterBuilder from '../components/filters/FilterBuilder';
import DataTable from '../components/table/DataTable';

// ─── Field definitions for the employee table ────────────────────────────────
// Pass these to FilterBuilder to get filters for any set of columns you want.
// To adapt this page for a different table, just change FIELDS and COLUMNS below.

const DEPARTMENT_OPTIONS = [
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Sales', value: 'Sales' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'HR', value: 'HR' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Operations', value: 'Operations' },
  { label: 'Design', value: 'Design' },
  { label: 'Product', value: 'Product' },
];

const SKILLS_OPTIONS = [
  'React', 'TypeScript', 'Node.js', 'GraphQL', 'Python', 'Django',
  'PostgreSQL', 'Docker', 'AWS', 'Terraform', 'CI/CD', 'Java',
  'Spring Boot', 'Redis', 'Go', 'Rust', 'Kafka', 'MongoDB',
  'JavaScript', 'CSS', 'HTML', 'Selenium', 'Cypress', 'Jest',
  'Kubernetes', 'Machine Learning', 'TensorFlow',
  'Salesforce', 'CRM', 'B2B Sales', 'Lead Generation', 'Negotiation',
  'Strategic Partnerships', 'Cold Calling',
  'SEO', 'Google Analytics', 'HubSpot', 'Content Strategy', 'Ahrefs',
  'Copywriting', 'Social Media', 'PPC', 'Email Marketing',
  'Recruitment', 'HRIS', 'Payroll', 'Employee Relations', 'Talent Acquisition',
  'Employer Branding',
  'Financial Modeling', 'Excel', 'SAP', 'Budgeting', 'QuickBooks',
  'Tax Compliance', 'GAAP',
  'Project Management', 'Lean', 'Supply Chain', 'Six Sigma',
  'Figma', 'Sketch', 'Adobe XD', 'Illustrator', 'Photoshop',
  'Design Systems', 'User Research', 'Prototyping',
  'Agile', 'Jira', 'Product Strategy', 'Roadmapping', 'Scrum',
  'SQL', 'Data Analysis',
].map(s => ({ label: s, value: s }));

const STATE_OPTIONS = [
  { label: 'California', value: 'CA' },
  { label: 'Texas', value: 'TX' },
  { label: 'New York', value: 'NY' },
  { label: 'Washington', value: 'WA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Florida', value: 'FL' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Minnesota', value: 'MN' },
];

const EMPLOYEE_FIELDS: FieldDefinition[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'department', label: 'Department', type: 'select', options: DEPARTMENT_OPTIONS },
  { key: 'role', label: 'Role', type: 'text' },
  { key: 'salary', label: 'Salary', type: 'amount' },
  { key: 'joinDate', label: 'Join Date', type: 'date' },
  { key: 'isActive', label: 'Active Status', type: 'boolean' },
  { key: 'skills', label: 'Skills', type: 'multiselect', options: SKILLS_OPTIONS },
  { key: 'address.city', label: 'City', type: 'text' },
  { key: 'address.state', label: 'State', type: 'select', options: STATE_OPTIONS },
  { key: 'projects', label: 'Projects', type: 'number' },
  { key: 'lastReview', label: 'Last Review', type: 'date' },
  { key: 'performanceRating', label: 'Rating', type: 'number' },
];

// ─── Column definitions for the table display ────────────────────────────────

const EMPLOYEE_COLUMNS: TableColumn<Employee>[] = [
  { key: 'id', label: '#', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'department', label: 'Department', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  {
    key: 'salary', label: 'Salary', sortable: true,
    render: row => `$${row.salary.toLocaleString()}`,
  },
  {
    key: 'isActive', label: 'Status',
    render: row => (
      <Chip
        label={row.isActive ? 'Active' : 'Inactive'}
        size="small"
        color={row.isActive ? 'success' : 'default'}
        variant="outlined"
        sx={{ fontSize: 12 }}
      />
    ),
  },
  {
    key: 'performanceRating', label: 'Rating', sortable: true,
    render: row => `${row.performanceRating} / 5`,
  },
  { key: 'joinDate', label: 'Join Date', sortable: true },
  {
    key: 'address', label: 'Location',
    render: row => `${row.address.city}, ${row.address.state}`,
  },
  {
    key: 'skills', label: 'Skills',
    render: row => {
      const shown = row.skills.slice(0, 2);
      const extra = row.skills.length - shown.length;
      return (
        <Tooltip title={row.skills.join(', ')} placement="top">
          <span>
            {shown.join(', ')}
            {extra > 0 && <span style={{ color: '#1976d2', marginLeft: 4 }}>+{extra}</span>}
          </span>
        </Tooltip>
      );
    },
  },
];

// ─── Page component ───────────────────────────────────────────────────────────

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conditions, setConditions] = useState<FilterCondition[]>([]);
  const [exportAnchor, setExportAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    fetchEmployees()
      .then(setEmployees)
      .catch(() => setError('Failed to load employee data'))
      .finally(() => setLoading(false));
  }, []);

  // Filtering is done via useMemo so it recomputes only when data or conditions change
  const filteredData = useMemo(
    () => applyFilters(employees, conditions, EMPLOYEE_FIELDS),
    [employees, conditions]
  );

  const handleExportCSV = () => {
    exportToCSV(filteredData, 'employees_filtered.csv');
    setExportAnchor(null);
  };

  const handleExportJSON = () => {
    exportToJSON(filteredData, 'employees_filtered.json');
    setExportAnchor(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
  }

  return (
    <Box>
      {/* Page header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Employee Directory
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Browse and filter {employees.length} employee records
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          startIcon={<Download size={15} />}
          onClick={e => setExportAnchor(e.currentTarget)}
          disabled={filteredData.length === 0}
        >
          Export ({filteredData.length})
        </Button>

        <Menu
          anchorEl={exportAnchor}
          open={Boolean(exportAnchor)}
          onClose={() => setExportAnchor(null)}
        >
          <MenuItem onClick={handleExportCSV}>
            <FileText size={15} style={{ marginRight: 8 }} />
            Export as CSV
          </MenuItem>
          <MenuItem onClick={handleExportJSON}>
            <FileJson size={15} style={{ marginRight: 8 }} />
            Export as JSON
          </MenuItem>
        </Menu>
      </Box>

      {/* Filter panel */}
      <Box sx={{ mb: 3 }}>
        <FilterBuilder
          fields={EMPLOYEE_FIELDS}
          conditions={conditions}
          onChange={setConditions}
        />
      </Box>

      {/* Data table */}
      <DataTable
        data={filteredData}
        columns={EMPLOYEE_COLUMNS}
        totalCount={employees.length}
      />
    </Box>
  );
}
