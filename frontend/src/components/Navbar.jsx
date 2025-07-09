import React, { useState, useRef, useContext } from 'react'
import { Box, Button, Typography } from '@mui/material'
import logo from '../assets/aapmor-logo.png'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../styles/navbar.css'
import Fade from '@mui/material/Fade';
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import { IconButton, Dialog, Slide } from '@mui/material';
import UserContext from '../context/UserContext';
import AccessTags from '../utils/accessTags';
import HasAccess from '../utils/accessControl';
import { axiosInstance } from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'

export default function Navbar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const userContext = useContext(UserContext);
  const user = userContext && userContext.user ? userContext.user : userContext;
  // console.log(user)
  const iconRef = useRef(null);
  const handleClick = () => {
    const rect = iconRef.current.getBoundingClientRect();
    const top = rect.bottom;
    const left = Math.min(rect.left, window.innerWidth - 330);
    setPosition({ top, left });
    setOpen(true);
  };


  const handleClose = () => setOpen(false);

  const handleLogout = async () => {
    try {
      Cookies.remove('token');
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <Box className='navbar'>
      <Box className='navbar-logo'>
        <img src={logo} alt="aapmor logo" style={{ height: "60px" }} />
      </Box>
      <Box>
        <Box className='navbar-content'>
          <Typography sx={{ pr: 1, fontWeight: "500", color: "#333" }}>{user.name}</Typography>

          <Box>

            <IconButton ref={iconRef} onClick={handleClick}>
              <AccountCircleIcon sx={{ fontSize: "32px" }} />
            </IconButton>



            <Dialog
              open={open}
              onClose={handleClose}
              TransitionComponent={Slide}
              keepMounted

              PaperProps={{
                sx: {
                  position: 'absolute',
                  top: position.top,
                  left: position.left,
                  m: 0,
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  overflow: 'visible',
                  width: '280px',
                }
              }}
              BackdropProps={{
                sx: {
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                }
              }}
            >
              <Box className='outer-box-menu'>
                <Box className='inner-box-menu'>
                  <Typography sx={{ color: '#333' }}>{user.name}</Typography>
                  <Typography sx={{ color: '#333' }}>{user.email}</Typography>

                  {/* {HasAccess(user, [AccessTags.ATS_PRD_ADMIN, AccessTags.ATS_PRD_USER]) && ( */}
                  <Button
                    // startIcon={<Logout />}
                    onClick={() => { navigate('/admin') }}
                    variant='contained'
                    sx={{ backgroundColor: "#00C28E", my: 1 }}

                  >Admin DashBoard</Button>

                  {/* )} */}
                  <Button
                    startIcon={<Logout />}
                    onClick={handleLogout}
                    variant='contained'
                    sx={{ backgroundColor: "#00C28E", my: 1 }}
                  >Logout</Button>
                </Box>
              </Box>
            </Dialog>

          </Box>
        </Box>
      </Box>
    </Box>
  )
}
