// ⚠️ Error boundaries in React must be class components.
// This is not legacy code — React does not yet support error boundaries with hooks.
// Reference: https://reactjs.org/docs/error-boundaries.html
import {Component, ReactNode} from "react";
import {Box, Typography} from "@mui/material";

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundaryState = { hasError: boolean };

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <Box sx={{ p: 4 }}><Typography color="error">Something went wrong.</Typography></Box>;
        }
        return this.props.children;
    }
}
