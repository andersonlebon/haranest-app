'use client';

import * as React from 'react';
import Link from 'next/link';
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
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import ListAltIcon from '@mui/icons-material/ListAlt';

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
  const { user, signOut, profile } = useAuth(); // 🎯 integrated
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
            {user && profile && (
              <>
                <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
                  <Avatar
                    alt={profile?.fullName || 'User'}
                    src={profile?.avatarUrl || ''}
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
                      minWidth: 280,
                      maxWidth: 320,
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {/* Profile Header Section */}
                  <Box sx={{ px: 2, py: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <Avatar
                        alt={profile?.fullName || 'User'}
                        src={profile?.avatarUrl || ''}
                        sx={{
                          width: 48,
                          height: 48,
                          border: '2px solid rgba(255,255,255,0.3)',
                        }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography fontWeight={600} sx={{ fontSize: '0.95rem' }}>
                            {profile.fullName || 'User'}
                          </Typography>
                          {profile.isVerified && (
                            <VerifiedUserIcon sx={{ fontSize: 18, color: 'success.light' }} />
                          )}
                        </Box>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Profile Details */}
                    <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {profile.role && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                          <BadgeIcon sx={{ fontSize: 14, opacity: 0.8 }} />
                          <Typography variant="caption" sx={{ textTransform: 'capitalize', opacity: 0.9 }}>
                            {profile.role.replace(/_/g, ' ')}
                          </Typography>
                        </Box>
                      )}
                      {(profile.city || profile.country) && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                          <LocationOnIcon sx={{ fontSize: 14, opacity: 0.8 }} />
                          <Typography variant="caption" sx={{ opacity: 0.9 }}>
                            {[profile.city, profile.country].filter(Boolean).join(', ') || 'Not set'}
                          </Typography>
                        </Box>
                      )}
                      {profile.phoneNumber && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                          <PhoneIcon sx={{ fontSize: 14, opacity: 0.8 }} />
                          <Typography variant="caption" sx={{ opacity: 0.9 }}>
                            {profile.phoneNumber}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Divider />

                  {/* Navigation Links */}
                  <MenuItem 
                    component={Link}
                    href="/dashboard"
                    onClick={handleMenuClose}
                    sx={{ py: 1.5 }}
                  >
                    <DashboardIcon sx={{ mr: 2, fontSize: 20 }} />
                    Dashboard
                  </MenuItem>
                  
                  <MenuItem 
                    component={Link}
                    href="/dashboard/properties"
                    onClick={handleMenuClose}
                    sx={{ py: 1.5 }}
                  >
                    <ListAltIcon sx={{ mr: 2, fontSize: 20 }} />
                    My Properties
                  </MenuItem>

                  <MenuItem 
                    component={Link}
                    href="/properties"
                    onClick={handleMenuClose}
                    sx={{ py: 1.5 }}
                  >
                    <HomeIcon sx={{ mr: 2, fontSize: 20 }} />
                    Browse Listings
                  </MenuItem>

                  <MenuItem 
                    component={Link}
                    href="/profile"
                    onClick={handleMenuClose}
                    sx={{ py: 1.5 }}
                  >
                    <PersonIcon sx={{ mr: 2, fontSize: 20 }} />
                    My Profile
                  </MenuItem>

                  <MenuItem 
                    component={Link}
                    href="/settings"
                    onClick={handleMenuClose}
                    sx={{ py: 1.5 }}
                  >
                    <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
                    Settings
                  </MenuItem>

                  <Divider />

                  {/* Logout */}
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      signOut();
                    }}
                    sx={{ 
                      color: 'error.main', 
                      fontWeight: 600,
                      py: 1.5,
                      '&:hover': {
                        bgcolor: 'error.light',
                        color: 'error.contrastText',
                      }
                    }}
                  >
                    <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
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
