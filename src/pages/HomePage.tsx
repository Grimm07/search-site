import React from 'react';
import { AppBar, Box, Button, Paper, Toolbar, Typography } from '@mui/material';
import SearchBar from '@/components/common/SearchBar';
import { useInteractionStore } from '@/store/useInteractionStore';
import { Link } from '@tanstack/react-router';
import ThemeToggle from '@/components/common/ThemeToggle';
import Footer from '@/components/common/Footer';
import DevToolLauncher from '@/components/dev/DevToolLauncher'; // Ensure this is imported
import { devToolRegistry } from '@/components/dev/registry'; // Ensure this is imported

const HomePage: React.FC = () => {
    // Access `query` and `viewSections` state from the store
    const { query, viewSections } = useInteractionStore();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
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
                <Box
                    sx={{
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        minHeight: '100vh',
                    }}
                >
                    <DevToolLauncher tools={devToolRegistry} />
                    <Paper
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6,
                            padding: '2rem',
                            borderRadius: 1,
                            boxShadow: 1,
                        }}
                    >
                        {/* Search Bar */}
                        <SearchBar searchValue={query} />
                    </Paper>

                    {/* Render dynamic view sections */}
                    {viewSections && (
                        <Box mt={4}>
                            <Typography variant="h6" mb={2}>
                                View Sections
                            </Typography>
                            <Paper
                                sx={{
                                    width: '100%',
                                    padding: '2rem',
                                    backgroundColor: '#f6f8fa',
                                    borderRadius: '5px',
                                }}
                            >
                                <pre>{JSON.stringify(viewSections, null, 2)}</pre>
                            </Paper>
                        </Box>
                    )}
                </Box>
            </Box>

            <Footer />
        </Box>
    );
};

export default HomePage;