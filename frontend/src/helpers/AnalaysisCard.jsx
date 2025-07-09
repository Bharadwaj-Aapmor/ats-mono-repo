import React from 'react'
import '../styles/resumeAnalysis.css'
import { Box, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


export default function AnalysisCard({ title, details }) {
    return (
        <div className='box-container'>

            <Box className='outer-box'>
                <Box className='inner-box'>
                    <Typography className='title' >
                        {title}
                        {/* <ArrowDropDownIcon className='arrow-icon' /> */}
                    </Typography>
                    {
                        details.map((detail, index) => (

                            <Typography key={index} className='detail'>
                                {detail}
                            </Typography>

                        ))
                    }
                </Box>
            </Box>
        </div>
    )
}
