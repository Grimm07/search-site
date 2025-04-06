import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    useMediaQuery,
    useTheme,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';
import { Link } from '@tanstack/react-router';
import MenuIcon from '@mui/icons-material/Menu';
import ThemeToggle from './ThemeToggle';

const NavBar: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [elevate, setElevate] = useState(false);

    useEffect(() => {
        const handleScroll = () => setElevate(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AppBar position="sticky" color="default" elevation={elevate ? 4 : 1}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* Logo */}
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Search<span style={{ color: theme.palette.primary.main }}>Site</span>
                </Typography>

                {!isMobile ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button component={Link} to="/" color="inherit">Home</Button>
                        <Button component={Link} to="/other" color="inherit">Other</Button>
                        <ThemeToggle />
                    </Box>
                ) : (
                    <>
                        <IconButton edge="end" color="inherit" onClick={() => setDrawerOpen(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                            <Box sx={{ width: 250 }} onClick={() => setDrawerOpen(false)}>
                                <List>
                                    <ListItem button component={Link} to="/">
                                        <ListItemText primary="Home" />
                                    </ListItem>
                                    <ListItem button component={Link} to="/other">
                                        <ListItemText primary="Other" />
                                    </ListItem>
                                </List>
                                <Divider />
                                <Box sx={{ p: 2 }}>
                                    <ThemeToggle />
                                </Box>
                            </Box>
                        </Drawer>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
