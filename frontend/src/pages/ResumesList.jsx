import React, { useState, useEffect } from "react";
import Navbar from '../components/Navbar';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Stack,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Paper,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate, useLocation } from 'react-router-dom';
import grid from '../assets/grid.svg';
import { deleteCandidateForResumesList } from "../services/getCandidateDetails";
import GoBack from "./GoBack";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const scoreRanges = [
  { label: "All Scores", value: "" },
  { label: "10% - 20%", value: [10, 20] },
  { label: "20% - 30%", value: [20, 30] },
  { label: "30% - 40%", value: [30, 40] },
  { label: "40% - 50%", value: [40, 50] },
  { label: "50% - 60%", value: [50, 60] },
  { label: "60% - 70%", value: [60, 70] },
  { label: "70% - 80%", value: [70, 80] },
  { label: "80% - 90%", value: [80, 90] },
  { label: "90% - 100%", value: [90, 100] },
];

const ResumeResults = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedRange, setSelectedRange] = useState("");
  const [openDeleteAllDialog, setOpenDeleteAllDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const [resumeData, setRows] = useState([])

  const [data, setData] = useState(resumeData);

  const data_array = location.state?.response

  if (!data_array) {
    return <GoBack message="No candidate selected. Please upload a resume first." />;
  }

  useEffect(() => {
    setRows(
      data_array
        .filter((data) => data.data && data.data.email && data.data.email !== 'unknown')
        .map((data, index) => {
          return {
            id: data.data?._id || index + 1,
            sl: index + 1,
            score: `${data.data?.ats_score}%`,
            name: data.data?.candidate_name,
            email: data.data?.email,
            skills: Array.isArray(data?.data?.matched_skills)
              ? data.data.matched_skills.join(', ')
              : 'No skills listed',
            match: `${data.data?.skills_match_percentage}%`,
            contact: data.data?.contact,
            experience: data.data?.experience_years,
            education: data.data?.education
          };
        })
    );
  }, [data_array]);
  // console.log(rows)

  const handleDeleteRow = (id) => {
    setRows((prevRows) => prevRows.filter(row => row.id !== id));
  };

  const handleDeleteAll = () => {
    setData([]);
  };
  const buttonStyle = {
    backgroundColor: '#b2dfdb',
    color: '#00695c',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: '#a5d6a7',
    },
  };
  const filteredData = resumeData.filter((row) => {



    const inSearch = Object.values(row).some((value) =>
      value && value.toString().toLowerCase().includes(searchText.toLowerCase())
    );

    if (selectedRange && selectedRange !== "") {
      const [min, max] = JSON.parse(selectedRange);
      return inSearch && scoreValue >= min && scoreValue <= max;
    }

    return inSearch;
  });

  const handleExportExcel = () => {
    const exportData = data.map((row) => ({
      'SL No.': row.sl,
      Score: row.score,
      'Candidate Name': row.name,
      'Email ID': row.email,
      Skills: row.skills,
      Match: row.match,
      'Contact No.': row.contact,
      Experience: row.experience,
      Education: row.education,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Resume Results');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'ResumeResults.xlsx');
  };

  async function clickName(row) {
    console.log('Name clicked', row.email);
    const email = row.email
    navigate("/resume-analyze", { state: { email } });

  }

  const columns = [
    { field: 'sl', headerName: 'SL No.', width: 90 },
    { field: 'score', headerName: 'Score', width: 100 },
    {
      field: 'name',
      headerName: 'Candidate Name',
      width: 200,
      renderCell: (params) => (
        <span
          className='candidate-name'
          onClick={() => { clickName(params.row) }}
        >
          {params.row.name || 'Unnamed Candidate'}
        </span>
      ),
    },
    { field: 'email', headerName: 'Email ID', width: 200 },
    { field: 'skills', headerName: 'Skills', width: 250 },
    { field: 'match', headerName: 'Match', width: 100 },
    { field: 'contact', headerName: 'Contact No.', width: 150 },
    { field: 'experience', headerName: 'Experience', width: 150 },
    { field: 'education', headerName: 'Education', width: 150 },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.4,
      sortable: false,
      headerAlign: 'center',
      minWidth: 70,
      renderCell: (params) => (
        <IconButton onClick={() => {
          // console.log(params.id)
          setSelectedRowId(params.id);
          setOpenDialog(true);
        }}>
          <DeleteIcon color="error" />
        </IconButton>
      ),
      align: 'center',
    },
  ];

  async function deleteCandidateById(id) {
    try {
      console.log(id)
      const res = await deleteCandidateForResumesList(id);
      if (res) {
        console.log("Candidate deleted successfully");
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      }
      console.log(res);
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  }

  return (
    <div>
      <Box className="analysis-main">
        <Navbar />
        <Box className='analysis-content'>
          {/* Header */}
          <Box className="analysis-header" display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton onClick={() => { navigate(-1) }}><ArrowBackIosNewIcon /></IconButton>
              <Typography variant='h5' sx={{ fontWeight: 700, fontSize: "28px" }}>Resume Results</Typography>
            </Box>
            <TextField
              placeholder="Search candidate"
              size="small"
              variant="outlined"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{ width: isMobile ? '100%' : 250 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Main Content */}
          <Box sx={{ background: "linear-gradient(to bottom right, #e0f7fa, #e1bee7)", minHeight: "100vh", padding: 3, mt: 3 }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
              {/* <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ marginBottom: 2 }}>
                <Grid item xs={12} md="auto">
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Button variant="outlined">Scores ▼</Button>
                    <Button variant="outlined">Matched Skills</Button>
                    <Button variant="contained" onClick={() => navigate('/upload')} color="primary" startIcon={<CloudUploadIcon />}>Upload New Resume</Button>
                  </Stack>
                </Grid>
                <Grid item xs={12} md="auto">
                  <Button variant="contained" color="success" startIcon={<FileDownloadIcon />}>Export Results</Button>
                </Grid>
              </Grid> */}

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <TextField
                  select
                  value={selectedRange}
                  onChange={(e) => setSelectedRange(e.target.value)}
                  size="small"
                  variant="outlined"
                  sx={{
                    minWidth: 160,
                    backgroundColor: '#b2dfdb',
                    borderRadius: '8px',
                    '& .MuiSelect-select': {
                      color: '#00695c',
                      paddingY: '8px',
                      fontWeight: 600,
                    },
                    '& fieldset': {
                      border: 'none',
                    },
                  }}
                >
                  <MenuItem
                    value=""
                    sx={{
                      color: '#00695c',
                      fontWeight: 600,
                    }}
                  >
                    Scores
                  </MenuItem>
                  {scoreRanges
                    .filter((range) => range.value !== "") // prevent duplicate "Scores"
                    .map((range, index) => (
                      <MenuItem
                        key={index}
                        value={JSON.stringify(range.value)}
                        sx={{
                          color: '#00695c',
                          fontWeight: 600,
                        }}
                      >
                        {range.label}
                      </MenuItem>
                    ))}
                </TextField>


                <Button variant="contained" sx={buttonStyle}>
                  Matched Skills
                </Button>

                <Button
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  onClick={() => navigate('/upload')}
                  sx={buttonStyle}
                >
                  Upload New Resume
                </Button>

                <Button
                  variant="contained"
                  color="success"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleExportExcel}
                  sx={buttonStyle}
                >
                  Export Results
                </Button>
              </Stack>


              {/* DataGrid Table */}
              <Box sx={{ width: '100%', mt: 2 }}>
                <DataGrid
                  //autoHeight
                  rows={filteredData.map((row, index) => ({ id: row.sl, ...row }))}
                  columns={columns}
                  pageSize={10}
                  disableSelectionOnClick
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10, page: 0 },
                    },
                  }}
                  autoSizeOptions={{
                    includeOutliers: true,
                    expand: true,
                  }}
                  sx={{
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: '#4caf50',
                      color: '#fffff',
                      fontWeight: 'bold',
                    },
                  }}
                  pageSizeOptions={[10, 20, 50]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  disableColumnSelector
                />

              </Box>
              <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
              >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Are you sure you want to delete this resume entry?
                  </DialogContentText>
                  <Typography variant="body2" sx={{ color: '#e57373', mt: 1 }}>
                    * Deleted entries will not be recovered.
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDialog(false)} color="primary">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      deleteCandidateById(selectedRowId); // Pass the correct id
                      setOpenDialog(false);
                    }}
                    color="error"
                  >
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
              <Dialog
                open={openDeleteAllDialog}
                onClose={() => setOpenDeleteAllDialog(false)}
              >
                <DialogTitle>Confirm Delete All</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Are you sure you want to delete all resume entries?
                    {/* <br />
                    <strong style={{ color: 'red' }}>Deleted entries will not be recovered.</strong> */}
                  </DialogContentText>
                  <Typography variant="body2" sx={{ color: '#e57373', mt: 1 }}>
                    * Deleted entries will not be recovered.
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDeleteAllDialog(false)} color="primary">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      handleDeleteAll();
                      setOpenDeleteAllDialog(false);
                    }}
                    color="error"
                  >
                    Delete All
                  </Button>
                </DialogActions>
              </Dialog>
            </Paper>
          </Box>
        </Box>

        <div className='grids left-grid'>
          <img src={grid} alt="grid" />
        </div>
        <div className='grids right-grid'>
          <img src={grid} alt="grid" />
        </div>
      </Box>
    </div>
  );
};

export default ResumeResults;
