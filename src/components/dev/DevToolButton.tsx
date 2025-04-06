
import { Button } from '@mui/material';
import { motion } from 'framer-motion';
import type { DevTool } from '@/types/devtools';

interface Props {
    tool: DevTool;
    active: boolean;
    onClick: () => void;
}

const DevToolButton: React.FC<Props> = ({ tool, active, onClick }) => {
    const Icon = tool.icon;

    return (
        <motion.div
            animate={{ scale: active ? 1.1 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <Button
                size="small"
                variant={active ? 'contained' : 'outlined'}
                startIcon={<Icon />}
                onClick={onClick}
                sx={{ textTransform: 'none' }}
            >
                {tool.label}
            </Button>
        </motion.div>
    );
};

export default DevToolButton;
