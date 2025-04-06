import { Toolbar, Box } from '@mui/material';
import { useState } from 'react';
import { devToolRegistry } from '@/components/dev/registry';
import DevToolButton from './DevToolButton';
import DevToolPanel from './DevToolPanel';

const DevToolbar = () => {
    const [activeToolId, setActiveToolId] = useState<string | null>(null);

    return (
        <Toolbar
            sx={{
                bgcolor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
                zIndex: 1100,
            }}
        >
            {devToolRegistry.map((tool) => {
                const isActive = activeToolId === tool.id;

                return (
                    <Box key={tool.id} sx={{ position: 'relative', mr: 2 }}>
                        <DevToolButton
                            tool={tool}
                            active={isActive}
                            onClick={() => setActiveToolId(isActive ? null : tool.id)}
                        />
                        {isActive && tool.render && (
                            <DevToolPanel>
                                {tool.render()} {/* ✅ function returns JSX */}
                            </DevToolPanel>
                        )}
                    </Box>
                );
            })}
        </Toolbar>
    );
};

export default DevToolbar;
