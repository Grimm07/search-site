// devtools/registry.ts
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import type { DevTool } from '@/types/devtools';
import FileUploadTrigger from "@/components/dev/FileUploadTrigger";
import { useInteractionStore } from '@/store/useInteractionStore';
import { worker } from '@/mocks/browser';

/**
 * NOTE: RENDER FUNCTION IS NOT A REACT FUNCTION AND WILL NOT BEHAVE LIKE ONE
 * THIS MEANS NO ACCESS TO STORES INSIDE THE RENDER FUNCTION
 * */

// todo bug - mock enable button should give a visual indicator it is toggled. Also should actually execute the action
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
        id: 'toggleMocks',
        label: 'Mock APIs',
        icon: CodeOffIcon, // Static icon for launcher button
        render: () => null, // This is now a safe component
        action: async () => {
            const { mocksEnabled, setMocksEnabled } = useInteractionStore.getState();
            const next = !mocksEnabled;
            console.log(`MOCK ENABLED: ${next}`)
            if (next) {
                await worker.start({ onUnhandledRequest: 'bypass' });
                console.info('✅ Mock API enabled');
            } else {
                worker.stop();
                console.info('❌ Mock API disabled');
            }

            setMocksEnabled(next);
            sessionStorage.setItem('mocksEnabled', String(next));
        },
    }
];
