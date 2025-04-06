// types/devtools.ts
import { SvgIconComponent } from '@mui/icons-material';
import React from "react";

export type DevTool = {
    id: string;
    label: string;
    icon: SvgIconComponent;
    action: () => void;
    render?: () => React.ReactNode;
};
