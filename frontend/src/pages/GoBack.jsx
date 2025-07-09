import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Box, Typography } from '@mui/material';

export default function GoBack({ message = "No resume data found or something went wrong. Please return to the previous step and try again." }) {
    const navigate = useNavigate();
    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
            <Typography variant="h6" color="textSecondary" gutterBottom>
                {message}
            </Typography>
            <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/upload')}
                sx={{ mt: 2 }}
            >
                Go Back
            </Button>
        </Box>
    );
}
