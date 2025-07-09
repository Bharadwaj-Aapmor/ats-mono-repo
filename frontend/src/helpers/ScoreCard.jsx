import { Box } from '@mui/material'
import React from 'react'
import { Paper, Typography, Button, Grid } from '@mui/material'
import '../styles/resumeAnalysis.css'

export default function ScoreCard({ title, score }) {
    return (
        <div className='box-container'>
            <Box className='score-card'>
                <Typography gutterBottom className='score-title' variant='h6' fontWeight={550} fontSize={20}
                    sx={{ color: '#333' }}
                >{title}</Typography>
                <Typography className='score' sx={{ fontSize: "32px", fontWeight: "600", color: '#00c28e', pb: 0.5 }}>{score}%</Typography>
                <Typography className='score-percentage'
                    sx={{ fontSize: "12px", color: "#929292" }}
                >/100%</Typography>
            </Box>
        </div>
    )
}
