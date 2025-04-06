// components/SearchBar.tsx
import React, { useCallback, useState } from 'react';
import {
    TextField,
    Button,
    InputAdornment,
    Tooltip, Typography, Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {useInteractionStore} from "@/store/useInteractionStore";

const SearchBar = () => {
    const { query, setQuery, devMode, uploadedFile, list } = useInteractionStore();
    const [touched, setTouched] = useState(false);

    const handleSearch = useCallback(() => {
        if (!query && devMode === 'live') return; // optional validation

        switch (devMode) {
            case 'live':
                return list({ key: query });

            case 'mock':
                return list({ key: 'mock-key' });

            case 'replay':
                if (uploadedFile) {
                    const replayKey = uploadedFile.name.replace(/\.[^/.]+$/, '');
                    return list({ key: replayKey });
                }
                return;
        }
    }, [query, devMode, uploadedFile, list]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setTouched(true);
            handleSearch();
        }
    };

    return (
        <Tooltip title="Enter a document ID, email, UUID, or date" arrow placement="top-start">
            <Box>
                <Typography
                    variant="body2"
                    color={touched && devMode === 'live' && query.trim() === '' ? 'error' : 'text.secondary'}
                >
                    {touched && devMode === 'live' && query.trim() === ''
                        ? 'Please enter a search key'
                        : 'Press Enter or click Search'}
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search documents..."
                    value={query}
                    onChange={(e) => {
                        setTouched(true);
                        setQuery(e.target.value);
                    }}
                    onKeyDown={handleKeyPress}
                    error={touched && devMode === 'live' && query.trim() === ''}
                    size="small"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Tooltip title="Search">
                            <span>
                                <Button
                                    onClick={handleSearch}
                                    variant="contained"
                                    size="small"
                                    disabled={devMode === 'live' && !query.trim()}
                                    sx={{ minWidth: 'auto', px: 2 }}
                                >
                                    <SearchIcon fontSize="small" />
                                </Button>
                            </span>
                                </Tooltip>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
        </Tooltip>
    );

};

export default SearchBar;
