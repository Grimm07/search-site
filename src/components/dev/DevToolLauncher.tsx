import React, { useState } from 'react';
import {
    IconButton,
    Tooltip,
    Box,
    useTheme,
    Paper,
    ClickAwayListener,
} from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import { AnimatePresence, motion } from 'framer-motion';
import type { DevTool } from '@/types/devtools';

interface DevToolLauncherProps {
    tools: DevTool[];
}

const DevToolLauncher: React.FC<DevToolLauncherProps> = ({ tools }) => {
    const [open, setOpen] = useState(false);
    const [activeToolId, setActiveToolId] = useState<string | null>(null);
    const theme = useTheme();

    if (!import.meta.env.DEV) return null;

    const toggle = () => {
        setOpen(!open);
        if (open) setActiveToolId(null);
    };

    const handleToolClick = (tool: DevTool) => {
        if (tool.render) {
            setActiveToolId(activeToolId === tool.id ? null : tool.id);
        } else {
            tool.action?.();
            setOpen(false);
        }
    };

    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Box sx={{ position: 'fixed', top: 72, right: 20, zIndex: 1400 }}>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <IconButton
                        onClick={toggle}
                        sx={{
                            bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                            boxShadow: 3,
                            '&:hover': { bgcolor: 'primary.light' },
                        }}
                    >
                        <BugReportIcon />
                    </IconButton>
                </motion.div>

                <AnimatePresence>
                    {open &&
                        tools.map((tool, index) => (
                            <motion.div
                                key={tool.id}
                                initial={{ opacity: 0, y: 0 }}
                                animate={{ opacity: 1, y: (index + 1) * 56 }}
                                exit={{ opacity: 0, y: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                style={{ position: 'absolute', right: 0 }}
                            >
                                <Tooltip title={tool.label} placement="left">
                                    <span>
                                        <Paper
                                            elevation={4}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 48,
                                                height: 48,
                                                borderRadius: '50%',
                                                bgcolor: theme.palette.background.paper,
                                                cursor: 'pointer',
                                                boxShadow: 3,
                                            }}
                                            onClick={() => handleToolClick(tool)}
                                        >
                                        <tool.icon fontSize="small" />
                                    </Paper>
                                    </span>
                                </Tooltip>

                                {/* If renderable, show panel under the icon */}
                                {activeToolId === tool.id && tool.render && (
                                    tool.render()
                                )}

                            </motion.div>
                        ))}
                </AnimatePresence>
            </Box>
        </ClickAwayListener>
    );
};

export default DevToolLauncher;
