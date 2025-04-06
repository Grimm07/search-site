import React from 'react';
import {
    AppBar,
    Box,
    Paper,
    Toolbar,
    Typography,
    Container,
} from '@mui/material';
import SearchBar from '@/components/common/SearchBar';
import SearchResultsAccordion from '@/components/common/SearchResultsAccordion';
import DevToolLauncher from '@/components/dev/DevToolLauncher';
import { devToolRegistry } from '@/components/dev/registry';
import { useInteractionStore } from '@/store/useInteractionStore';
import ThemeToggle from '@/components/common/ThemeToggle';
import Footer from '@/components/common/Footer';

const HomePage: React.FC = () => {
    const { results } = useInteractionStore();

    const hasResults = results.length > 0;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static" elevation={hasResults ? 1 : 0}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Search Site
                    </Typography>
                    <ThemeToggle />
                </Toolbar>
            </AppBar>

            <Container
                maxWidth="md"
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: hasResults ? 'flex-start' : 'center',
                    py: hasResults ? 6 : 10,
                    gap: 6,
                }}
            >
                <Paper
                    elevation={hasResults ? 1 : 2}
                    sx={{
                        width: '100%',
                        p: 4,
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        transition: 'all 0.3s ease-in-out',
                    }}
                >
                    <SearchBar />
                    <DevToolLauncher tools={devToolRegistry} />
                </Paper>

                {hasResults && (
                    <Box
                        sx={{
                            width: '100%',
                            mt: 4,
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <SearchResultsAccordion />
                    </Box>
                )}
            </Container>

            <Footer />
        </Box>
    );
};

export default HomePage;
