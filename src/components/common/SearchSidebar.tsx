import React from 'react';
import { Box, List, ListItemButton, ListItemText, Typography, Divider } from '@mui/material';

interface SidebarItem {
    id: string;
    label: string;
}

interface SearchSidebarProps {
    items: SidebarItem[];
    onSelect: (id: string) => void;
}

const SearchSidebar: React.FC<SearchSidebarProps> = ({ items, onSelect }) => {
    if (!items.length) return null;

    return (
        <Box
            sx={{
                width: 240,
                borderRight: 1,
                borderColor: 'divider',
                height: '100%',
                position: 'sticky',
                top: 64, // below AppBar
                bgcolor: 'background.paper',
                overflowY: 'auto',
            }}
        >
            <Typography variant="subtitle1" p={2}>
                Alternative Results
            </Typography>
            <Divider />
            <List>
                {items.map((item) => (
                    <ListItemButton key={item.id} onClick={() => onSelect(item.id)}>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );
};

export default SearchSidebar;
