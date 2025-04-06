import React, { useCallback, useState } from 'react';
import {
    TextField,
    Button,
    InputAdornment,
    Tooltip,
    Typography,
    Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useInteractionStore } from '@/store/useInteractionStore';

interface SearchBarProps {
    searchValue?: string; // Allow an external search value to be passed in
}

const SearchBar: React.FC<SearchBarProps> = ({ searchValue }) => {
    const { query, setQuery, devMode, uploadedFile, list, setError} = useInteractionStore();
    const [touched, setTouched] = useState(false);

    const handleSearch = useCallback(() => {
        if (!query && devMode === 'live') return; // Validation for live mode

        // Handle different devModes to execute corresponding API calls
        switch (devMode) {
            case 'live':
                if (!query?.trim()) return;  // Avoid searching with empty query
                return list({ query: query }).catch((error) => {
                    // Handle error if list fails (e.g., 404)
                    setError(error.message); // Assuming you have an `error` setter in the store
                });

            case 'mock':
                return list({ query: 'mock-key' });

            case 'replay':
                if (uploadedFile) {
                    const replayKey = uploadedFile.name.replace(/\.[^/.]+$/, '');
                    return list({ query: replayKey });
                }
                return;
            default:
                return;
        }
    }, [query, devMode, uploadedFile, list]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setTouched(true);
            handleSearch(); // Trigger search on Enter key
        }
    };

    const handleButtonClick = () => {
        setTouched(true);
        handleSearch(); // Trigger search on button click
    };

    return (
        <Tooltip title="Enter a document ID, email, UUID, or date" arrow placement="top-start">
            <Box>
                <Typography
                    variant="body2"
                    color={touched && devMode === 'live' && (searchValue || query)?.trim() === '' ? 'error' : 'text.secondary'}
                >
                    {touched && devMode === 'live' && (searchValue || query)?.trim() === ''
                        ? 'Please enter a search key'
                        : 'Press Enter or click Search'}
                </Typography>

                {/* Search Input */}
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search documents..."
                    aria-label="searchbar"
                    value={searchValue !== undefined ? searchValue : query} // Use searchValue if passed, otherwise default to store query
                    onChange={(e) => {
                        setTouched(true);
                        setQuery(e.target.value); // Update store query
                    }}
                    onKeyDown={handleKeyPress}
                    error={touched && devMode === 'live' && (searchValue || query)?.trim() === ''}
                    size="small"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Tooltip title="Search">
                                    <span>
                                        <Button
                                            aria-label="search button"
                                            onClick={handleButtonClick} // Use the new handleButtonClick
                                            variant="contained"
                                            size="small"
                                            disabled={devMode === 'live' && !(searchValue || query)?.trim()}
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
