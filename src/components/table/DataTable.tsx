import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

import { TableColumn } from '../../types/data';
import { getNestedValue } from '../../utils/nestedGet';

interface Props<T> {
  data: T[];
  columns: TableColumn<T>[];
  totalCount: number;  // total before filtering
}

type SortDir = 'asc' | 'desc';

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  totalCount,
}: Props<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSort = (colKey: string) => {
    if (sortKey === colKey) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(colKey);
      setSortDir('asc');
    }
    setPage(0);
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aVal = getNestedValue(a, sortKey);
      const bVal = getNestedValue(b, sortKey);

      // handle nulls
      if (aVal == null) return sortDir === 'asc' ? 1 : -1;
      if (bVal == null) return sortDir === 'asc' ? -1 : 1;

      if (typeof aVal === 'string') {
        const cmp = aVal.toLowerCase().localeCompare(bVal.toLowerCase());
        return sortDir === 'asc' ? cmp : -cmp;
      }

      if (typeof aVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }

      if (typeof aVal === 'boolean') {
        return sortDir === 'asc'
          ? (aVal === bVal ? 0 : aVal ? -1 : 1)
          : (aVal === bVal ? 0 : aVal ? 1 : -1);
      }

      return 0;
    });
  }, [data, sortKey, sortDir]);

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(0);
  };

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey) return <ChevronsUpDown size={14} style={{ opacity: 0.4 }} />;
    return sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <Box>
      {/* Record count summary */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 1.5,
          px: 0.5,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing{' '}
          <strong style={{ color: '#1976d2' }}>{data.length}</strong>
          {' '}of{' '}
          <strong>{totalCount}</strong>{' '}records
        </Typography>

        {data.length !== totalCount && (
          <Chip
            label={`${totalCount - data.length} filtered out`}
            size="small"
            color="warning"
            variant="outlined"
          />
        )}
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {columns.map(col => (
                  <TableCell
                    key={col.key}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                    sx={{
                      fontWeight: 700,
                      bgcolor: 'grey.100',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      cursor: col.sortable ? 'pointer' : 'default',
                      '&:hover': col.sortable
                        ? { bgcolor: 'grey.200' }
                        : {},
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {col.label}
                      {col.sortable && <SortIcon colKey={col.key} />}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary" variant="body2">
                      No records match the current filters
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, rowIdx) => (
                  <TableRow
                    key={row.id ?? rowIdx}
                    hover
                    sx={{
                      '&:last-child td': { borderBottom: 0 },
                    }}
                  >
                    {columns.map(col => (
                      <TableCell key={col.key} sx={{ fontSize: 13 }}>
                        {col.render
                          ? col.render(row)
                          : renderCellValue(getNestedValue(row, col.key))}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>
    </Box>
  );
}

// Fallback cell renderer for values without a custom render function
function renderCellValue(val: any): React.ReactNode {
  if (val === null || val === undefined) return '—';
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (Array.isArray(val)) return val.join(', ');
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}
