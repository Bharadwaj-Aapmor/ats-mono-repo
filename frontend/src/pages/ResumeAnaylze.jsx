import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { Box, Paper, Typography, Button, TextField, Grid } from '@mui/material'
import '../styles/resumeAnalysis.css'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import IconButton from '@mui/material/IconButton';
// import data from '../data.json'
import ScoreCard from '../helpers/ScoreCard';
import AnalysisCard from '../helpers/AnalaysisCard';
import grid from '../assets/grid.svg'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import { getCandidateDetailsByEmail } from '../services/getCandidateDetails';
import axios from 'axios'
import '../styles/loader.css'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import GoBack from './GoBack';


export default function ResumeAnaylze() {
    const location = useLocation();
    const navigate = useNavigate();
    const candidate_email = location.state?.email
    const [data, setData] = useState('')
    const [loading, setLoading] = useState(true)
    const [overallMatch, setOverallMatch] = useState(0)
    const [skillsMatch, setSkillsMatch] = useState(0)
    const [experienceMatch, setExperienceMatch] = useState(0)
    const [candidateDetails, setCandidateDetails] = useState([])
    const [skillsMatchDetails, setSkillsMatchDetails] = useState([])
    const [experienceDetails, setExperienceDetails] = useState([])

    useEffect(() => {
        async function getData() {
            setLoading(true)
            try {
                const response = await getCandidateDetailsByEmail(candidate_email)
                setData(response)
            } catch (e) {
                setData({})
            } finally {
                setLoading(false)
            }
        }
        getData();
    }, [candidate_email])
    // console.log(data)
    useEffect(() => {
        if (!data || !data.ats_analysis) return;
        const overall_match = data.ats_analysis?.overall_match_percentage || 0;
        const skills_match = data.ats_analysis?.skills_match_percentage || 0;
        const experience_match = data.ats_analysis?.experience_match_percentage || 0;
        const name = data.ats_analysis?.candidate_name || "Candidate Name";
        const experience = data.ats_analysis?.total_experience_years || "0 years";
        const current_role = data.ats_analysis?.current_role || "Not Specified";
        const higest_education = data.ats_analysis?.highest_education || "Not Specified";
        const email = data.ats_analysis?.Email || "Not Specified";
        const phone = data.ats_analysis?.Phone || "Not Specified";
        setOverallMatch(overall_match)
        setSkillsMatch(skills_match)
        setExperienceMatch(experience_match)
        setCandidateDetails([
            `Name: ${name}`,
            `Experience: ${experience} years`,
            `Current role: ${current_role}`,
            `Highest education: ${higest_education}`,
            `Email: ${email}`,
            `Phone: ${phone}`,
        ])
        const skills = data.ats_analysis?.matched_skills?.join(", ") || "No skills matched";
        setSkillsMatchDetails([
            "Matched Skills",
            skills,
            `Skills Match: ${skills_match}%`
        ])
        const experience_data = data.ats_analysis?.experience?.map((exp) => exp.position) || [];
        setExperienceDetails([
            "Previous Roles",
            ...experience_data.map((position) => `${position}`),
            `Experience Match:${experience_match}%`
        ])
    }, [data])

    const handleExportPDF = () => {
        if (!data || !data.ats_analysis) return;
        const doc = new jsPDF();

        const tableData = [
            ['Name', data.ats_analysis.candidate_name || ''],
            ['Email', data.ats_analysis.Email || ''],
            ['Phone', data.ats_analysis.Phone || ''],
            ['Overall Match', `${data.ats_analysis.overall_match_percentage || 0}%`],
            ['Skills Match', `${data.ats_analysis.skills_match_percentage || 0}%`],
            ['Experience Match', `${data.ats_analysis.experience_match_percentage || 0}%`],
            ['Total Experience', `${data.ats_analysis.total_experience_years || '0'} years`],
            ['Current Role', data.ats_analysis.current_role || ''],
            ['Highest Education', data.ats_analysis.highest_education || ''],
            ['Matched Skills', (data.ats_analysis.matched_skills || []).join(', ')],
            ['Missing Skills', (data.ats_analysis.missing_skills || []).join(', ')],
            ['Previous Roles', (data.ats_analysis.experience || []).map(e => e.position).join(', ')],
        ];

        doc.text('Resume Analysis Result', 14, 16);
        doc.autoTable({
            startY: 22,
            head: [['Field', 'Value']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [154, 101, 254] },
        });

        doc.save(`${data.ats_analysis.candidate_name || 'Candidate'}_Analysis.pdf`);
    }
    // If no candidate_email 
    if (!candidate_email) {
        return <GoBack message="No candidate selected. Please upload a resume first." />;
    }

    return (
        <div>

            <Box className="analysis-main" >
                <Navbar />
                <Box className='analysis-content'>
                    <Box className='analysis-header'>
                        <Box className='analysis-header-left'>
                            <IconButton onClick={() => navigate(-1)}><ArrowBackIosNewIcon /></IconButton>
                            <Typography variant='h5' className='analysis-heading' sx={{ fontWeight: "700", fontSize: "28px" }}>Resume Analysis Result</Typography>

                            {(() => {
                                const score = parseFloat(overallMatch);
                                if (!isNaN(score)) {
                                    if (score >= 80) {
                                        return (
                                            <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#00C28E', color: 'white', borderRadius: 1, px: 1, py: 0.5, fontWeight: 500, fontSize: '1rem' }}>
                                                <CheckCircleIcon sx={{ mr: 1, color: 'white' }} fontSize="small" /> Good Fit
                                            </Box>
                                        );
                                    } else if (score >= 60) {
                                        return (
                                            <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFC107', color: '#333', borderRadius: 1, px: 1, py: 0.5, fontWeight: 500, fontSize: '1rem' }}>
                                                <WarningAmberIcon sx={{ mr: 1, color: '#333' }} fontSize="small" /> Average Fit
                                            </Box>
                                        );
                                    } else {
                                        return (
                                            <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#F44336', color: 'white', borderRadius: 1, px: 1, py: 0.5, fontWeight: 500, fontSize: '1rem' }}>
                                                <ErrorIcon sx={{ mr: 1, color: 'white' }} fontSize="small" /> Low Fit
                                            </Box>
                                        );
                                    }
                                } else {
                                    return null;
                                }
                            })()}
                        </Box>
                        <Box className='analysis-header-right'>
                            <Button variant='contained' sx={{ textTransform: "none", backgroundColor: '#9a65fe', boxShadow: 'none' }} className='export-button'
                                onClick={handleExportPDF}
                            >Export</Button>
                        </Box>

                    </Box>

                    <Box>
                        <Typography gutterBottom className='analysis-subheading' sx={{ fontSize: "20px", fontWeight: "600", color: "#333", marginLeft: "30px" }}>
                            Match Score
                        </Typography>
                        <Grid container spacing={4} className='score-cards'>
                            <Grid size={{ xs: 12, md: 4 }} className='grid-item'>
                                <ScoreCard title="Overall Match" score={overallMatch} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }} className='grid-item'>
                                <ScoreCard title="Skills Match" score={skillsMatch} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <ScoreCard title="Experience Match" score={experienceMatch} />
                            </Grid>
                        </Grid>
                    </Box>

                    <Box>
                        <Grid container spacing={4} className='analysis-cards' >
                            <Grid size={{ xs: 12, md: 4 }} className='grid-item'>
                                <AnalysisCard title="Candidate Details" details={candidateDetails} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }} className='grid-item'>
                                <AnalysisCard title="Skills Match" details={skillsMatchDetails} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }} className='grid-item'>
                                <AnalysisCard title="Experience Match" details={experienceDetails} />
                            </Grid>

                        </Grid>
                    </Box>


                </Box>
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
            </Box>
        </div >
    )
}
