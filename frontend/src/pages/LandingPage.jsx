import React, {
  useContext
} from "react";
import {
  Box,
  Card,
  CardContent,
  CssBaseline,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "../styles/landingpage.css";
import Carousel from "../components/Carousel";
import grid from "../assets/grid.svg";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const user = userContext && userContext.user ? userContext.user : userContext;
  const handleGetStarted = () => {
    navigate("/upload");
  }

  return (
    <div className="landing-page-main">
      <CssBaseline />
      {/* Background Box */}
      <Box className="BoxOne" sx={{
        height: {
          xs: '60px',  // or a smaller value like '80vh'
          md: '100%',
        }
      }}>
        <Box
          sx={{
            p: "20px",
            backgroundColor: "#ffffff90",
            borderRadius: 2,
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#ffffff",
              borderRadius: 1,
              gap: 2,
              minHeight: { xs: "auto", md: "84vh" },
              margin: "auto",
              width: "100%",
            }}
          >
            {/* Left Container */}
            <Box
              sx={{
                order: { xs: 2, md: 1 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: { xs: 2, md: 4 },
                ml: { xs: 0, md: "8%" },
                alignItems: { xs: "center", md: "flex-start" },
                textAlign: { xs: "center", md: "left" },
                px: { xs: 2, sm: 4 },
              }}
            >
              <Typography
                gutterBottom
                variant="body2"
                sx={{ color: "#9a64ff", fontWeight: 550 }}
              >
                Welcome {user.name}
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#1A1A1A",
                  fontSize: {
                    xs: "1.5rem", // mobile
                    sm: "2rem", // tablet
                    md: "2.5rem", // desktop
                  },
                }}
              >
                You’re just one step ahead <br />
                from enhancing your <br />
                hiring process.
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: "black",
                  fontWeight: 530,
                  fontSize: {
                    xs: "0.9rem",
                    sm: "1rem",
                    md: "1.1rem",
                  },
                }}
              >
                Unlock the future of work !
              </Typography>

              <Button
                variant="contained"
                className="my-button"
                sx={{
                  backgroundColor: "#00c28e",
                  borderRadius: "30px",
                  width: {
                    xs: "140px", // mobile
                    sm: "160px", // tablet
                    md: "175px", // desktop
                  },
                  height: {
                    xs: "38px",
                    sm: "42px",
                    md: "45px",
                  },
                  fontSize: {
                    xs: "0.8rem",
                    sm: "0.9rem",
                    md: "1rem",
                  },
                  fontWeight: 600,
                  textTransform: "none",
                  mb: 2,
                }}
                endIcon={<ArrowForwardIcon />}
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </Box>
            {/* Right Container */}
            <Box
              sx={{
                order: { xs: 1, md: 2 },
                width: { xs: "100%", md: "40%" },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: { xs: 1, sm: 2 },
                mt: { xs: 3, md: 0 },
              }}
            >
              <Carousel />
            </Box>
          </Box>
        </Box>
        {/* Carousel Images */}
        <img src={grid} alt="img" className="grid-left" />
        <img src={grid} alt="img" className="grid-right" />
        <img src={grid} alt="img" className="top-middle" />
      </Box>
    </div>
  );
}
