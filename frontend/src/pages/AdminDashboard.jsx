import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, TextField, Stack, Button, Select, MenuItem, } from '@mui/material';
import Navbar from '../components/Navbar';
import '../styles/adminDashboard.css'
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { DataGrid } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCandidateDetails, getCandidateDetailsByEmail, deleteCandidate } from '../services/getCandidateDetails';
import { styled } from '@mui/material/styles';
import candidatesSummary from '../candidatesSummary.json';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import CustomToolbar from '../utils/CustomToolbar';
import { useNavigate } from 'react-router-dom';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    // minWidth: '900px',
    '& .MuiDataGrid-root': {
        border: 'none',
        // minHeight: '400px',
    },
    '& .MuiDataGrid-columnHeaders': {
        color: '#fff',
        height: 40,
    },
    '& .MuiDataGrid-columnHeader': {
        backgroundColor: '#00C28E !important',
        border: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    '& .MuiDataGrid-columnHeader:last-of-type': {
        borderRight: 'none',
    },

    '.MuiDataGrid-columnSeparator': {
        display: 'none',
    },
    '&.MuiDataGrid-root': {
        border: 'none',
    },
}));

export default function AdminDashboard() {
    const [rows, setRows] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [experienceFilter, setExperienceFilter] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    async function clickName(row) {
        // console.log('Name clicked', row.email);
        const email = row.email
        navigate("/resume-analyze", { state: { email } });

    }
    async function clickDownLoad(row) {
        if (!row.fileURL) {
            alert('No resume file available for this candidate.');
            return;
        }

        window.open(row.fileURL, '_blank');
    }


    const columns = [
        {
            field: "sl",
            headerName: "SL No.",
            flex: 0.4,
            headerAlign: 'center',
            align: 'center',
            minWidth: 70,
        },
        {
            field: "score",
            headerName: "Score",
            flex: 0.5,
            headerAlign: 'center',
            align: 'center',
            minWidth: 70,
        },
        {
            field: "name",
            headerName: "Candidate Name",
            flex: 1,
            headerAlign: 'center',
            minWidth: 150,
            renderCell: (params) => (
                <span
                    className='candidate-name'
                    onClick={() => { clickName(params.row) }}
                >
                    {params.row.name || 'Unnamed Candidate'}
                </span>
            ),
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
            headerAlign: 'center',
            minWidth: 150,
        },
        {
            field: "skills",
            headerName: "Skills",
            flex: 1.2,
            headerAlign: 'center',
            minWidth: 200,
        },
        {
            field: "experience",
            headerName: "Experience",
            flex: 0.6,
            headerAlign: 'center',
            align: 'center',
            minWidth: 100,
        },
        {
            field: "education",
            headerName: "Education",
            flex: 1.1,
            headerAlign: 'center',
            minWidth: 150,
        },
        {
            field: "download",
            headerName: "Download",
            flex: 0.5,
            sortable: false,
            headerAlign: 'center',
            align: 'center',
            minWidth: 70,
            renderCell: (params) => (
                <IconButton onClick={() => clickDownLoad(params.row)}>
                    <DownloadIcon />
                </IconButton>
            ),
        },
        {
            field: "delete",
            headerName: "Delete",
            flex: 0.4,
            sortable: false,
            headerAlign: 'center',
            minWidth: 70,
            renderCell: (params) => (
                <IconButton onClick={() => {
                    if (window.confirm('Are you sure you want to delete this candidate?')) {
                        deleteCandidateById(params.row.id);
                    }
                }}>
                    <DeleteIcon />
                </IconButton>
            ),
            align: 'center',
        },
    ];

    async function deleteCandidateById(id) {
        try {
            const res = await deleteCandidate(id);
            if (res) {
                // console.log("Candidate deleted successfully");
                setRows((prevRows) => prevRows.filter((row) => row.id !== id));
            }
            // console.log(res);
        } catch (error) {
            console.error("Error deleting candidate:", error);
        }
    }

    useEffect(() => {
        const fetchCandidateDetails = async () => {
            setLoading(true);
            try {
                const data = await getCandidateDetails();
                // console.log(data);
                setRows(data.map((item, index) => {
                    {
                        // console.log(item);
                        return {
                            id: item._id,
                            sl: index + 1,
                            score: item?.ats_analysis?.overall_match_percentage !== undefined
                                ? `${item.ats_analysis.overall_match_percentage}%`
                                : 'N/A',

                            name: item?.ats_analysis?.candidate_name || 'Unnamed',
                            email: item?.ats_analysis?.Email || 'Email not provided',

                            skills: Array.isArray(item?.ats_analysis?.matched_skills)
                                ? item.ats_analysis.matched_skills.join(', ')
                                : 'No skills listed',

                            experience: item?.ats_analysis?.total_experience_years !== undefined
                                ? `${item.ats_analysis.total_experience_years} years`
                                : 'Experience not specified',

                            education: typeof item?.ats_analysis?.highest_education === 'string'
                                ? item.ats_analysis.highest_education
                                : item?.ats_analysis?.highest_education?.degree ||
                                item?.ats_analysis?.highest_education?.qualification ||
                                'Not mentioned',
                            fileURL: item?.file_url
                        }

                    }
                }));
                // const data = localStorage.getItem('cachedCandidates');
                // setRows(JSON.parse(data));
            } catch (error) {
                console.error("Error fetching candidate details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidateDetails();
    }, []);
    // console.log(rows)
    const filteredRows = useMemo(() => {
        if (!experienceFilter) return rows;
        return rows.filter((row) => {
            const yearsMatch = row.experience.match(/(\d+(\.\d+)?)/);
            if (!yearsMatch) return false;
            const years = parseFloat(yearsMatch[1]);
            switch (experienceFilter) {
                case '0-1':
                    return years <= 1;
                case '1-3':
                    return years >= 1 && years <= 3;
                case '3-5':
                    return years >= 3 && years <= 5;
                case '5+':
                    return years >= 5;
                default:
                    return true;
            }
        });
    }, [rows, experienceFilter]);



    return (
        <div>
            <Box className='admin-main' >
                <Navbar />
                <Box className='admin-content' >
                    <Box className='admin-header'>
                        <IconButton onClick={() => { navigate('/upload') }}><ArrowBackIosNewIcon /></IconButton>
                        <Typography variant='h5' className='analysis-heading' sx={{ fontWeight: "600", fontSize: "25px" }}>Recent Resumes</Typography>
                    </Box>
                    <Box className='admin-table-outside'>


                        <Box className='admin-table' sx={{ width: '100%', overflowX: { xs: 'auto', md: 'hidden' }, }}>
                            <StyledDataGrid
                                sx={{ minHeight: "70vh" }}
                                rowHeight={40}
                                rows={filteredRows}
                                columns={columns}
                                getRowId={(row) => row.sl}
                                loading={loading}
                                slots={{
                                    toolbar: CustomToolbar,
                                }}
                                slotProps={{
                                    toolbar: {
                                        experienceFilter,
                                        onExperienceChange: setExperienceFilter,
                                        searchText,
                                        setSearchText,
                                        selectedRows,
                                    },
                                    loadingOverlay: {
                                        variant: 'skeleton',
                                        noRowsVariant: 'skeleton',
                                    },
                                }}
                                onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
                                initialState={{
                                    pagination: {
                                        paginationModel: { pageSize: 10 },
                                    },
                                }}
                                filterModel={{
                                    items: [],
                                    quickFilterValues: searchText ? [searchText] : [],
                                }}
                                pageSizeOptions={[10]}
                                checkboxSelection
                                disableRowSelectionOnClick
                                disableColumnSelector
                                disableDensitySelector
                                columnBuffer={2}
                                disableColumnResize
                                disableColumnMenu
                                hideFooterSelectedRowCount
                                scrollbarSize={0}
                                showToolbar
                                autoHeight
                            // hideFooter

                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    )
}
