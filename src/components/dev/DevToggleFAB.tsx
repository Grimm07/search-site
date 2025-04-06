import React, { useState, useEffect } from 'react';
import {
    Fab,
    Box,
    Fade,
    ClickAwayListener,
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import CloseIcon from '@mui/icons-material/Close';
import DevPanel from './DevToolPanel';
import { DevTools } from '@/DevTools'; // Example content

const DevToggleFAB: React.FC = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('dev_panel_open');
        if (saved === 'true') setOpen(true);
    }, []);

    useEffect(() => {
        localStorage.setItem('dev_panel_open', open.toString());
    }, [open]);

    const handleToggle = () => setOpen((prev) => !prev);
    const handleClose = () => setOpen(false);

    return (
        <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1400 }}>
            <Fab
                color="secondary"
                aria-label="Toggle Dev Panel"
                onClick={handleToggle}
                sx={{ boxShadow: 3 }}
            >
                {open ? <CloseIcon /> : <BuildIcon />}
            </Fab>

            <Fade in={open}>
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 72,
                        right: 0,
                        zIndex: 1399,
                    }}
                >
                    <ClickAwayListener onClickAway={handleClose}>
                        <Box>
                            <DevPanel>
                                <DevTools /> {/* You can replace with any children */}
                            </DevPanel>
                        </Box>
                    </ClickAwayListener>
                </Box>
            </Fade>
        </Box>
    );
};

export default DevToggleFAB;
