// File: components/common/Footer.tsx

import React from 'react';
import { Box, Typography, Link, Stack } from '@mui/material';

const Footer: React.FC = () => {
    return (
        <Box
            component="footer"
            sx={{
                mt: 'auto',
                py: 4,
                px: 3,
                backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                        ? theme.palette.grey[900]
                        : theme.palette.grey[100],
                borderTop: 1,
                borderColor: 'divider',
            }}
        >
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
                <Typography variant="body2" color="text.secondary">
                    © {new Date().getFullYear()} Search Site. All rights reserved.
                </Typography>

                <Stack direction="row" spacing={3}>
                    <Link href="/privacy" variant="body2" color="inherit" underline="hover">
                        Privacy
                    </Link>
                    <Link href="/terms" variant="body2" color="inherit" underline="hover">
                        Terms
                    </Link>
                    <Link href="/about" variant="body2" color="inherit" underline="hover">
                        About
                    </Link>
                </Stack>
            </Stack>
        </Box>
    );
};

export default Footer;