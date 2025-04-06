// src/store/slices/uiPreferencesSlice.ts
import { StateCreator } from 'zustand';
import { CheckboxOption } from '@/config/checkboxOptions';
import { DropdownConfig } from '@/config/dropdownOptions';

export interface UIPreferencesSlice {
    checkboxes: Record<string, boolean>;
    dropdowns: Record<string, string>;
    setCheckbox: (id: string, value: boolean) => void;
    setDropdown: (id: string, value: string) => void;
    initUIPreferences: (checkboxes: CheckboxOption[], dropdowns: DropdownConfig[]) => void;
}

export const createUIPreferencesSlice: StateCreator<UIPreferencesSlice> = (set) => ({
    checkboxes: {},
    dropdowns: {},

    setCheckbox: (id, value) => set((state) => ({
        checkboxes: { ...state.checkboxes, [id]: value }
    })),

    setDropdown: (id, value) => set((state) => ({
        dropdowns: { ...state.dropdowns, [id]: value }
    })),

    initUIPreferences: (checkboxes, dropdowns) =>
        set(() => ({
            checkboxes: Object.fromEntries(
                checkboxes.map(opt => [opt.id, opt.defaultChecked ?? false])
            ),
            dropdowns: Object.fromEntries(
                dropdowns.map(opt => [opt.id, opt.defaultValue ?? opt.options[0]])
            ),
        })),
});
