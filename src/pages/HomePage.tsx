import React from 'react';
import {
    AppBar,
    Box,
    Paper,
    Toolbar,
    Typography,
    Container,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchBar from '@/components/common/SearchBar';
import SearchResultsAccordion from '@/components/common/SearchResultsAccordion';
import DevToolLauncher from '@/components/dev/DevToolLauncher';
import { devToolRegistry } from '@/components/dev/registry';
import { useInteractionStore } from '@/store/useInteractionStore';
import ThemeToggle from '@/components/common/ThemeToggle';
import Footer from '@/components/common/Footer';
import {AnimatePresence, motion} from 'framer-motion';
import ErrorBanner from "@/components/common/ErrorBanner";
import MockBanner from "@/components/dev/MockBanner";
import Spinner from "@/components/common/Spinner";

const MotionPaper = motion.create(Paper);

const HomePage: React.FC = () => {
    const { results, searchState, error } = useInteractionStore();
    const hasResults = results.length > 0;

    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const handleSelect = (id: string) => {
        const result = results.find((r) => r.docId === id);
        if (result) {
            useInteractionStore.setState({ currentDocument: result });
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static" elevation={hasResults ? 1 : 0}>
                <Toolbar>
                    {hasResults && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setDrawerOpen(true)}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Search Site
                    </Typography>
                    <ThemeToggle />
                </Toolbar>
            </AppBar>
            {/*This is the drawer where extra results can go, such as if there are alternatives to the provided search*/}
            <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 250 }} role="presentation">
                    <Typography variant="h6" sx={{ p: 2 }}>
                        Results
                    </Typography>
                    <List>
                        {results.map((r) => (
                            <ListItemButton key={r.docId} onClick={() => handleSelect(r.docId)}>
                                <ListItemText primary={String(r.summary?.Title ?? r.docId)} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <motion.div layout>
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

                    <MotionPaper
                        elevation={hasResults ? 1 : 2}
                        animate={{ marginTop: searchState === 'results' ? '0px' : '64px' }}
                        transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
                        sx={{
                            width: '100%',
                            p: 4,
                            borderRadius: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                        }}
                    >
                        <SearchBar />
                    </MotionPaper>

                    <MockBanner />
                    <DevToolLauncher tools={devToolRegistry} />
                    {searchState === 'noResults' && (
                        <ErrorBanner
                            status={404}
                            title="No Results Found"
                            message="We couldn't find any documents matching your search."
                        />
                    )}

                    {searchState === 'idle' && error && (
                        <ErrorBanner
                            status={500}
                            title="Something went wrong"
                            message={error}
                        />
                    )}

                    {(searchState === 'searching' || hasResults) && (
                        <AnimatePresence>
                            {(searchState === 'searching' || hasResults) && (
                                <MotionPaper
                                    key="resultsBox"
                                    initial={{ y: '100%', opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: '100%', opacity: 0 }}
                                    transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
                                    sx={{
                                        maxWidth: '900px',
                                        width: '100%',
                                        mt: 4,
                                        p: 3,
                                        borderRadius: 2,
                                        backgroundColor: 'background.paper',
                                        boxShadow: 3,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                    }}

                                >
                                    {searchState === 'searching' && <Spinner size={36} />}
                                    {searchState === 'results' && <SearchResultsAccordion />}
                                </MotionPaper>
                            )}
                        </AnimatePresence>

                    )}


                </Container>
            </motion.div>

            <Footer />
        </Box>
    );
};

export default HomePage;