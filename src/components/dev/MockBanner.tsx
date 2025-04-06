// src/components/common/MockBanner.tsx
import { Snackbar, Alert } from '@mui/material';
import { useInteractionStore } from '@/store/useInteractionStore';

const MockBanner = () => {
    const { mocksEnabled } = useInteractionStore();

    if (!mocksEnabled) return null;

    return (
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert severity="warning" variant="filled" sx={{ fontWeight: 600 }}>
                ⚠️ Mock API mode is active
            </Alert>
        </Snackbar>
    );
};

export default MockBanner;
