import { StateCreator } from 'zustand';

export interface FormSlice {
    systemData: {
        name: string;
        approved: boolean;
        category: string;
    } | null;
    userNameFeedback: string;
    userApprovedFeedback: boolean;
    userCategoryFeedback: string;
    submitError: string | null;
    submitSuccess: boolean;
    setUserNameFeedback: (feedback: string) => void;
    setUserApprovedFeedback: (approved: boolean) => void;
    setUserCategoryFeedback: (category: string) => void;
    submitFeedback: () => Promise<void>;
}

export const createFormSlice: StateCreator<FormSlice, [], [], FormSlice> = (set) => ({
    systemData: {
        name: 'System Name',
        approved: true,
        category: 'Option1',
    },
    userNameFeedback: '',
    userApprovedFeedback: false,
    userCategoryFeedback: '',
    submitError: null,
    submitSuccess: false,
    setUserNameFeedback: (feedback: string) => set({ userNameFeedback: feedback }),
    setUserApprovedFeedback: (approved: boolean) => set({ userApprovedFeedback: approved }),
    setUserCategoryFeedback: (category: string) => set({ userCategoryFeedback: category }),
    submitFeedback: async () => {
        try {
            // ...simulate successful submission...
            set({ submitSuccess: true, submitError: null });
        } catch (error) {
            set({ submitError: 'Submission failed', submitSuccess: false });
        }
    },
});
