'use client';

import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Container,
  Drawer,
  MenuItem,
  Divider,
  Typography,
  Avatar,
  Menu,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ColorModeIconDropdown from '../shared/thems';
import { useAuth } from '@/context/AuthContext';
import { useThemeContext } from '@/context/ThemeContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const { user, signOut } = useAuth(); // 🎯 integrated
  const { mode, toggleMode } = useThemeContext();


  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  // Avatar menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'primary.main',
                textDecoration: 'none',
              }}
              component="a"
              href="/"
            >
              <img 
                src="/Haranest-Logo.png" 
                alt="" 
                width={120} 
                height={40}
              />
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, ml: 4 }}>
            <Button variant="text" color="info" size="small" href="/properties">
              Listings
            </Button>
            <Button variant="text" color="info" size="small" href="/agents">
              Agents
            </Button>
            <Button variant="text" color="info" size="small" href="/dashboard">
              Dashboard
            </Button>
            <Button variant="text" color="info" size="small" href="/about">
              About
            </Button>
          </Box>

          {/* Desktop Actions */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>

            {/* If NOT authenticated */}
            {!user && (
              <>
                <Button color="primary" variant="text" size="small" href="/login">
                  Sign in
                </Button>
                <Button color="primary" variant="contained" size="small" href="/login">
                  Sign up
                </Button>
              </>
            )}

            {/* If authenticated show Avatar */}
            {user && (
              <>
                <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
                  <Avatar
                    alt={user.fullName || 'User'}
                    src={user.avatarUrl || ''}
                    sx={{
                      width: 40,
                      height: 40,
                      border: '2px solid rgba(255,255,255,0.4)',
                      boxShadow: 1,
                    }}
                  />
                </IconButton>
                 {/* Theme Switcher */}
                  <IconButton onClick={toggleMode} color="inherit">
                    {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                  </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 4,
                    sx: {
                      mt: 1.5,
                      borderRadius: 3,
                      minWidth: 220,
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography fontWeight={600}>{user.fullName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>

                  <Divider />

                  <MenuItem component="a" href="/profile">Profile</MenuItem>
                  <MenuItem component="a" href="/dashboard">Dashboard</MenuItem>

                  <Divider />

                  <MenuItem
                    onClick={() => {
                      signOut();
                      handleMenuClose();
                    }}
                    sx={{ color: 'error.main', fontWeight: 600 }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}          </Box>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>

        </StyledToolbar>
      </Container>

      {/* Drawer for Mobile */}
      <Drawer
        anchor="top"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: { top: 'var(--template-frame-height, 0px)' },
        }}
      >
        <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <MenuItem href="/properties" component="a">Listings</MenuItem>
          <MenuItem href="/agents" component="a">Agents</MenuItem>
          <MenuItem href="/dashboard" component="a">Dashboard</MenuItem>
          <MenuItem href="/about" component="a">About</MenuItem>

          <Divider sx={{ my: 2 }} />

          <MenuItem>
            <Button color="primary" variant="contained" fullWidth href="/login">
              Sign up
            </Button>
          </MenuItem>
          <MenuItem>
            <Button color="primary" variant="outlined" fullWidth href="/login">
              Sign in
            </Button>
          </MenuItem>
        </Box>
      </Drawer>
    </AppBar>
  );
}
