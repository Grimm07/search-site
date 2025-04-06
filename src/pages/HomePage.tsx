import React from 'react';
import {AppBar, Box, Button, Paper, Toolbar, Typography} from '@mui/material';
import SearchBar from '@/components/common/SearchBar';
import SearchResultsAccordion from '@/components/common/SearchResultsAccordion';
import { devToolRegistry } from '@/components/dev/registry';
import DevToolLauncher from '@/components/dev/DevToolLauncher';
import {useInteractionStore} from "@/store/useInteractionStore";
import {Link, Outlet} from "@tanstack/react-router";
import ThemeToggle from "@/components/common/ThemeToggle";
import Footer from "@/components/common/Footer";

const HomePage: React.FC = () => {
    const { results } = useInteractionStore();
    return ( <Box sx={{flexGrow: 1}}>
        <AppBar
            position="static"
        >
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Search Site
                </Typography>
                <Button color="inherit" component={Link} to="/">
                    Home
                </Button>
                <ThemeToggle />
            </Toolbar>
        </AppBar>
        <Box>
            <Box sx={(theme) => ({
                padding: theme.spacing(2),
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: '100vh', p: 8
            })}
            >
                <Paper sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6, p: 5, borderRadius: 1, boxShadow: 1 }}>
                    <SearchBar />
                    <DevToolLauncher tools={devToolRegistry} />
                </Paper>
            </Box>

        </Box>
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}
            >
                {results.length > 0 && (<Paper
                    sx={{
                        width: '100%',
                        maxWidth: 960,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        p: 6,
                        borderRadius: 1,
                        boxShadow: 1,
                    }}
                >
                    {results.length > 0 && (
                        <SearchResultsAccordion />
                    )}
                </Paper>)}
            </Box>

            <DevToolLauncher tools={devToolRegistry} />
        </Box>

        <Outlet />

    <Footer />
</Box>);
};

export default HomePage;
