import { Employee } from '../types/data';

// Basic CSV export for the filtered employee dataset
export function exportToCSV(data: Employee[], filename = 'employees.csv') {
  const headers = [
    'ID', 'Name', 'Email', 'Department', 'Role', 'Salary',
    'Active', 'Rating', 'Join Date', 'Last Review',
    'City', 'State', 'Projects', 'Skills',
  ];

  const rows = data.map(emp => [
    emp.id,
    emp.name,
    emp.email,
    emp.department,
    emp.role,
    emp.salary,
    emp.isActive ? 'Yes' : 'No',
    emp.performanceRating,
    emp.joinDate,
    emp.lastReview,
    emp.address.city,
    emp.address.state,
    emp.projects,
    emp.skills.join('; '),
  ]);

  const escape = (val: any) => `"${String(val).replace(/"/g, '""')}"`;

  const csv = [headers.map(escape), ...rows.map(r => r.map(escape))]
    .map(r => r.join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// Export filtered data as JSON (bonus feature)
export function exportToJSON(data: Employee[], filename = 'employees.json') {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
