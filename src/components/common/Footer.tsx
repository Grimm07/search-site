// components/Footer.tsx
import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

interface FooterProps {
    text?: string;
}

const Footer: React.FC<FooterProps> = ({ text }) => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                borderTop: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    {text || `© ${new Date().getFullYear()} SearchSite. All rights reserved.`}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Link href="/privacy" underline="hover" color="inherit">Privacy</Link>
                    <Link href="/terms" underline="hover" color="inherit">Terms</Link>
                    <Link href="https://github.com/your-org" underline="hover" color="inherit">GitHub</Link>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
