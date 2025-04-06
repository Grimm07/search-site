// theme/mui.d.ts
import '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        custom: {
            navbar: string;
        };
    }
    interface PaletteOptions {
        custom?: {
            navbar?: string;
        };
    }
}