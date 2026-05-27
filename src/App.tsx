import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Users } from 'lucide-react';
import EmployeePage from './pages/EmployeePage';

function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Top nav */}
      <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar variant="dense" sx={{ gap: 1.5 }}>
          <Users size={20} />
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.3px' }}>
            FilterSystem
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7, ml: 0.5 }}>
            v1.0
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <EmployeePage />
      </Container>
    </Box>
  );
}

export default App;
