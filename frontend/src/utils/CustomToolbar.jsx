import React from 'react';
import { Toolbar, ExportCsv } from '@mui/x-data-grid';
import { Box, Select, MenuItem, Button, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import '../styles/adminDashboard.css';



export default function CustomToolbar({ experienceFilter, onExperienceChange, searchText, setSearchText }) {
  return (
    <Toolbar sx={{ backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }} className='tool-bar'>
      <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <InputBase
            sx={{ backgroundColor: '#fff', borderRadius: '4px', padding: '5px 5px', width: 250, border: '1px solid #ccc', fontSize: 14, height: 30 }}
            startAdornment={<SearchIcon sx={{ color: 'gray', mr: 1 }} />}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by name, email, skills..."
            value={searchText}
            inputProps={{
              'aria-label': 'Search by name, email, skills...',
              sx: {
                color: 'black',
                width: '100%',
                '::placeholder': {
                  color: 'gray',
                  opacity: 0.7,
                },

              },
            }}
          />
          <Select
            value={experienceFilter}
            onChange={(e) => onExperienceChange(e.target.value)}
            displayEmpty
            size="small"
            sx={{
              minWidth: 140,
              height: 30,
              fontSize: 14,
              color: '#00C28E',
              backgroundColor: '#E1FFF5',
              border: 'none',
              boxShadow: 'none',
              '& fieldset': {
                border: 'none !important',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none !important',
              },
              '& .MuiSelect-icon': {
                color: '#00C28E',
              },
            }}
          >
            <MenuItem sx={{ color: "#00C28E", fontSize: 14, }} value="">All Experience</MenuItem>
            <MenuItem sx={{ color: "#00C28E", fontSize: 14, }} value="0-1">0-1 years</MenuItem>
            <MenuItem sx={{ color: "#00C28E", fontSize: 14, }} value="1-3">1-3 years</MenuItem>
            <MenuItem sx={{ color: "#00C28E", fontSize: 14, }} value="3-5">3-5 years</MenuItem>
            <MenuItem sx={{ color: "#00C28E", fontSize: 14, }} value="5+">5+ years</MenuItem>
          </Select>
        </Box>

        <ExportCsv
          options={{
            fileName: 'resume-data',
            // delimiter: ';',
            utf8WithBom: true,
          }}
        >
          <Box
            component="span"
            role="button"
            tabIndex={0}
            sx={{
              backgroundColor: '#00C28E',
              color: '#fff',
              borderRadius: '4px',
              fontSize: 12,
              height: 30,
              px: 1,
              cursor: 'pointer',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
              border: 'none',
              userSelect: 'none',
              gap: 0,
              '&:hover': {
                backgroundColor: '#009e73',
              },
            }}
          >
            <DownloadIcon sx={{ fontSize: 18, mr: 0.5 }} />
            Download
          </Box>
        </ExportCsv>
      </Box>
    </Toolbar >
  );
}
