import React, { useState, useEffect, useContext } from 'react'
import { Box, Paper, Typography, Button, TextField, Grid } from '@mui/material'
import Navbar from '../components/Navbar'
import '../styles/upload.css'
import '../styles/loader.css'
import grid from '../assets/grid.svg'
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import PublishIcon from '@mui/icons-material/Publish';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import validateJobDescription from '../utils/validateJD'
import CloseIcon from '@mui/icons-material/Close';
import { parseResume } from '../services/parseResume'
import UserContext from '../context/UserContext'



export default function Upload() {
    const navigate = useNavigate();
    const [description, setDescription] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    // const formData = new FormData();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');
    const [helperText, setHelperText] = useState('');
    const [touched, setTouched] = useState(false);
    const [loading, setLoading] = useState(false)
    const { user } = useContext(UserContext);

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
    })


    const showSnackbar = (message, severity = 'error') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    }

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    }
    // console.log(data.ats_analysis.missing_skills);


    const handleRemoveFile = (index) => {
        const newFileNames = [...fileNames];
        const newSelectedFiles = [...selectedFiles];
        newFileNames.splice(index, 1);
        newSelectedFiles.splice(index, 1);
        setFileNames(newFileNames);
        setSelectedFiles(newSelectedFiles);
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const validTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        for (let file of files) {
            if (!validTypes.includes(file.type)) {
                alert('Only PDF or DOC files are allowed.');
                event.target.value = '';
                return;
            }
        }
        setSelectedFiles(files);
        setFileNames(files.map(f => f.name));
    };

    const handleAnalyze = async () => {
        const error = validateJobDescription(description);
        if (error) {
            showSnackbar(error);
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            selectedFiles.forEach(file => {
                formData.append('resumes', file); // use 'resumes' as key for multiple files
            });
            formData.append('job_description', description);
            const response = await parseResume(formData);

            // expects array of results
            if (response.length === 1) {
                const email = response[0].data.email;
                console.log(response)
                // console.log(response[0] )
                if (email) {
                    showSnackbar("All resumes analyzed successfully!", 'success');
                    navigate("/resume-analyze", { state: { email } });
                } else {
                    showSnackbar("Could not extract email try another resume", 'error')
                }
            }
            else {
                showSnackbar("All resumes analyzed successfully!", 'success');
                navigate("/resumes-list", { state: { response } });
                // console.log(response)
            }

            // showSnackbar("All resumes analyzed successfully!", 'success');
            // navigate("/resume-analyze", { state: { data } });
        } catch (error) {
            console.error("Error analyzing resumes:", error);
            showSnackbar("Failed to analyze one or more resumes. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const error = validateJobDescription(description);
        if (error) {
            setHelperText(error);
        } else {
            setHelperText('');
        }
    }, [description])


    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });



    return (

        <>

            <Box className='upload-main'>
                <Navbar />
                <Box className='upload-container'>
                    <Typography gutterBottom variant="h6" className='welcome-user' sx={{ color: '#8638e6', fontWeight: "bold", fontSize: "24px", mb: "2%", mt: "2%" }}>
                        Welcome {user.name},
                    </Typography>
                    <Grid container spacing={5} className="upload-inputs">
                        <Grid size={{ xs: 12, md: 6 }} className='upload-description inputs'>
                            <Box className='jd-box'>
                                <ContentPasteIcon className='icons' sx={{ fontSize: 35, mr: 1, }} />
                                <Typography sx={{ fontSize: "20px", fontWeight: "bold" }} className='jd-heading'>Add Your Job Description</Typography>
                            </Box>
                            <Box sx={{
                                border: '1px solid  #B2BEB5',
                                borderRadius: '5px',
                                padding: 1,
                                backgroundColor: 'white',
                            }}
                            >

                                <TextField
                                    className="jd-input"
                                    placeholder="Paste Or Type Your Job Description"
                                    required
                                    variant="standard" // Removes the border completely
                                    multiline
                                    fullWidth
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                        if (!touched) setTouched(true);
                                    }}
                                    onBlur={() => setTouched(true)}
                                    InputProps={{
                                        disableUnderline: true,
                                        sx: {
                                            height: '15rem',
                                            alignItems: 'flex-start',
                                            padding: 0,
                                        },
                                    }}
                                    sx={{
                                        '& .MuiInputBase-inputMultiline': {
                                            padding: '16px',
                                            overflowY: 'auto',
                                            height: '100%',
                                            resize: 'none',
                                            boxSizing: 'border-box',
                                        },
                                        backgroundColor: 'white',
                                    }}
                                />


                            </Box>
                            {touched && helperText && (
                                <Typography sx={{ color: 'red', mt: 0.5, fontSize: '0.875rem' }}>
                                    {helperText}
                                </Typography>
                            )}
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }} className='upload-resume inputs'>
                            <Box className='jd-box'>
                                <AttachFileIcon className='icons' sx={{ fontSize: 35, mr: 1, }} />

                                <Typography sx={{ fontSize: "20px", fontWeight: "bold" }} className='jd-heading'>Upload Your Resume</Typography>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: 'white',
                                border: '2px dashed #00C28E',
                                minHeight: '16rem',
                                maxHeight: '16rem',
                                borderRadius: '5px',
                                width: '100%',
                                mb: '10px',
                                gap: 2

                            }}
                            >
                                {(fileNames.length === 0 || fileNames.length === 1) ?
                                    <>
                                        < PublishIcon sx={{
                                            fontSize: 75,
                                            backgroundColor: '#E1FFF5',
                                            color: '#00C28E',
                                            borderRadius: "50%",
                                            padding: "15px"

                                        }} />

                                        <Typography variant="h7" color="black">
                                            Upload Your Resume
                                        </Typography>
                                        <Typography sx={{ color: 'grey' }} variant="h7">
                                            {' Support Format be .PDF,DOC Only(Less than 2 MB)'}
                                        </Typography>
                                        {!fileNames.length > 0 && (
                                            <Button
                                                component="label"
                                                variant="contained"
                                                className='Upload'
                                                type="file"
                                                onChange={handleFileChange}
                                                // startIcon={<CloudUploadIcon />}
                                                sx={{
                                                    backgroundColor: '#dbdbdb', color: 'black', height: '30px',
                                                    minWidth: '130px', marginTop: '10px', padding: '4px 8px', fontSize: '15px',
                                                    lineHeight: 1, textTransform: "none", boxShadow: 'none'
                                                }}
                                            >
                                                Choose File
                                                <VisuallyHiddenInput type="file" accept=".pdf,.doc,.docx" multiple />
                                            </Button>
                                        )}
                                        {fileNames.length > 0 && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px', gap: 1 }}>
                                                <Typography variant="body2" sx={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {fileNames}
                                                </Typography>
                                                <IconButton aria-label="delete" onClick={() => { handleRemoveFile(0) }} size="small" color="error">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </>
                                    :
                                    <Box sx={{ width: '100%', px: 2, py: 1, overflowY: 'auto', maxHeight: '14rem' }}>
                                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px', mb: 1 }}>Uploaded Resumes</Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            {fileNames.map((fileName, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        backgroundColor: '#f9f9f9',
                                                        borderRadius: '6px',
                                                        padding: '6px 10px',
                                                        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                                                        width: '100%',
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            maxWidth: '80%',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            fontSize: '14px'
                                                        }}
                                                    >
                                                        {fileName}
                                                    </Typography>
                                                    <IconButton
                                                        aria-label="delete"
                                                        onClick={() => handleRemoveFile(index)}
                                                        size="small"
                                                        color="error"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>

                                }
                            </Box>
                            <Box> <Button sx={{ float: "right", mt: 1, backgroundColor: "#00C28E", textTransform: "none", boxShadow: 'none' }}
                                onClick={handleAnalyze}

                                disabled={!selectedFiles.length || !description.trim()}
                                variant='contained'>< SendIcon sx={{ mr: 1 }} />Analyze</Button></Box>


                        </Grid>
                    </Grid>
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={4000}
                        onClose={handleSnackbarClose}
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        sx={{ top: { xs: 10, sm: 0 } }}
                    >
                        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', mt: 2 }}>
                            {snackbarMessage}
                        </Alert>

                    </Snackbar>
                </Box >
                <div className='grids left-grid'>
                    <img src={grid} alt="grid" />
                </div>
                <div className='grids right-grid'>
                    <img src={grid} alt="grid" />
                </div>

                {loading &&

                    <div className="loader">
                        <div className="justify-content-center jimu-primary-loading"></div>
                    </div>
                }

            </Box >
        </>
    )
}
