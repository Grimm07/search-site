// devtools/registry.ts
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InputIcon from '@mui/icons-material/Input';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { DevTool } from '@/types/devtools';
import FileUploadTrigger from "@/components/dev/FileUploadTrigger";

export const devToolRegistry: DevTool[] = [
    {
        id: 'upload-file',
        label: 'Upload File',
        icon: UploadFileIcon,
        render: () => <FileUploadTrigger />,
            action: () => {
            console.log('🚀 Upload File Tool Triggered');
        },
    },
    {
        id: 'inject-key',
        label: 'Inject Key',
        icon: InputIcon,
        action: () => {
            console.log('🔑 Injecting mock search key');
        },
    },
    {
        id: 'view-store',
        label: 'View Store',
        icon: VisibilityIcon,
        render: () => <FileUploadTrigger />,
        action: () => {
            console.log('🧠 Zustand store snapshot here');
        },
    },
];
