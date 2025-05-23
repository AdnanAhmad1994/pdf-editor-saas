import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';

const Header = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { sm: 'none' } }}
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PDF Editor SaaS
        </Typography>
        
        <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <Button color="inherit" component={RouterLink} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={RouterLink} to="/documents">
            My Documents
          </Button>
          <Button color="inherit" component={RouterLink} to="/editor">
            PDF Editor
          </Button>
          <Button color="inherit" component={RouterLink} to="/form-filler">
            Form Filler
          </Button>
        </Box>
        
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-label="account"
          onClick={handleUserMenuOpen}
        >
          <AccountCircleIcon />
        </IconButton>
        
        {/* Mobile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose} component={RouterLink} to="/">
            Dashboard
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component={RouterLink} to="/documents">
            My Documents
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component={RouterLink} to="/editor">
            PDF Editor
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component={RouterLink} to="/form-filler">
            Form Filler
          </MenuItem>
        </Menu>
        
        {/* User Menu */}
        <Menu
          anchorEl={userMenuAnchorEl}
          open={Boolean(userMenuAnchorEl)}
          onClose={handleUserMenuClose}
        >
          <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleUserMenuClose}>Settings</MenuItem>
          <MenuItem onClick={handleUserMenuClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
