'use client';

/**
 * Edit Mode Provider - Canva Style
 * Global state for inline visual editing
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { unregisterContent, saveAllDrafts, discardAllDrafts, getDraftCount } from '@/lib/cms-store';
import { useToast } from '@/components/ui/toaster';

interface PendingChange {
    original: string;
    current: string;
    type: 'text' | 'image' | 'media';
}

interface EditModeContextType {
    // Core edit mode
    editMode: boolean;
    toggleEditMode: () => void;
    setEditMode: (value: boolean) => void;
    canEdit: boolean;

    // Block selection (Canva-style)
    selectedBlockId: string | null;
    hoverBlockId: string | null;
    selectBlock: (id: string | null) => void;
    setHoverBlock: (id: string | null) => void;

    // Pending changes
    pendingChanges: Map<string, PendingChange>;
    hasUnsavedChanges: boolean;
    registerChange: (id: string, original: string, current: string, type?: 'text' | 'image' | 'media') => void;
    deleteContent: (id: string) => void;

    // Save/Cancel
    saveAllChanges: () => Promise<void>;
    discardAllChanges: () => void;
    getOriginalValue: (id: string) => string | null;
}

const EditModeContext = createContext<EditModeContextType>({
    editMode: false,
    toggleEditMode: () => { },
    setEditMode: () => { },
    canEdit: false,
    selectedBlockId: null,
    hoverBlockId: null,
    selectBlock: () => { },
    setHoverBlock: () => { },
    pendingChanges: new Map(),
    hasUnsavedChanges: false,
    registerChange: () => { },
    deleteContent: () => { },
    saveAllChanges: async () => { },
    discardAllChanges: () => { },
    getOriginalValue: () => null,
});

interface EditModeProviderProps {
    children: ReactNode;
    canAccessAdmin?: boolean;
}

const EDIT_MODE_STORAGE_KEY = 'phu-vinh-edit-mode';

export function EditModeProvider({ children, canAccessAdmin = false }: EditModeProviderProps) {
    const [editMode, setEditModeState] = useState(false);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [hoverBlockId, setHoverBlockId] = useState<string | null>(null);
    const [pendingChanges, setPendingChanges] = useState<Map<string, PendingChange>>(new Map());

    // Load persisted edit mode state or check URL param
    useEffect(() => {
        if (typeof window !== 'undefined' && canAccessAdmin) {
            const searchParams = new URLSearchParams(window.location.search);
            const editParam = searchParams.get('edit');

            if (editParam === 'true') {
                setEditModeState(true);
                localStorage.setItem(EDIT_MODE_STORAGE_KEY, 'true');
            } else {
                const stored = localStorage.getItem(EDIT_MODE_STORAGE_KEY);
                if (stored === 'true') {
                    setEditModeState(true);
                }
            }
        }
    }, [canAccessAdmin]);

    // If user loses admin access, turn off edit mode
    useEffect(() => {
        if (!canAccessAdmin && editMode) {
            setEditModeState(false);
            if (typeof window !== 'undefined') {
                localStorage.removeItem(EDIT_MODE_STORAGE_KEY);
            }
        }
    }, [canAccessAdmin, editMode]);

    // Clear selection when exiting edit mode
    useEffect(() => {
        if (!editMode) {
            setSelectedBlockId(null);
            setHoverBlockId(null);
        }
    }, [editMode]);

    // Handle click outside to deselect
    useEffect(() => {
        if (!editMode) return;

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Don't deselect if clicking on editable content or toolbar
            if (target.closest('[data-editable]') || target.closest('[data-toolbar]')) {
                return;
            }
            setSelectedBlockId(null);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [editMode]);

    // Keyboard shortcuts
    useEffect(() => {
        if (!editMode) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+S to save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (pendingChanges.size > 0) {
                    saveChanges();
                }
            }
            // Escape to deselect or exit
            if (e.key === 'Escape') {
                if (selectedBlockId) {
                    setSelectedBlockId(null);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [editMode, selectedBlockId, pendingChanges]);

    const setEditMode = useCallback((value: boolean) => {
        if (canAccessAdmin || !value) {
            setEditModeState(value);
            if (typeof window !== 'undefined') {
                if (value) {
                    localStorage.setItem(EDIT_MODE_STORAGE_KEY, 'true');
                } else {
                    localStorage.removeItem(EDIT_MODE_STORAGE_KEY);
                }
            }
        }
    }, [canAccessAdmin]);

    const toggleEditMode = useCallback(() => {
        if (canAccessAdmin) {
            setEditMode(!editMode);
        }
    }, [canAccessAdmin, editMode, setEditMode]);

    const selectBlock = useCallback((id: string | null) => {
        setSelectedBlockId(id);
    }, []);

    const setHoverBlock = useCallback((id: string | null) => {
        setHoverBlockId(id);
    }, []);

    const registerChange = useCallback((
        id: string,
        original: string,
        current: string,
        type: 'text' | 'image' | 'media' = 'text'
    ) => {
        setPendingChanges(prev => {
            const newMap = new Map(prev);
            const existing = newMap.get(id);
            const originalValue = existing?.original ?? original;

            if (current === originalValue) {
                newMap.delete(id);
            } else {
                newMap.set(id, { original: originalValue, current, type });
            }
            return newMap;
        });
    }, []);

    const getOriginalValue = useCallback((id: string): string | null => {
        return pendingChanges.get(id)?.original ?? null;
    }, [pendingChanges]);

    const deleteContent = useCallback((id: string) => {
        setPendingChanges(prev => {
            const newMap = new Map(prev);
            newMap.delete(id);
            return newMap;
        });
        unregisterContent(id);
    }, []);

    const { toast } = useToast();

    const saveChanges = useCallback(async () => {
        const result = saveAllDrafts();

        // In a real app, determine pageId dynamically. 
        // For this demo, we save 'home' as the prompt implies we are working on a page.
        // The mock API just logs it anyway.
        await import('@/lib/cms-store').then(m => m.savePageContent('home'));

        setPendingChanges(new Map());
        toast("Đã lưu thay đổi: Nội dung đã được cập nhật thành công.", "success");
    }, [toast]);

    const discardChanges = useCallback(() => {
        discardAllDrafts();
        setPendingChanges(new Map());
        // Force re-render by briefly toggling edit mode
        setEditModeState(false);
        setTimeout(() => setEditModeState(true), 0);
    }, []);

    const hasUnsavedChanges = pendingChanges.size > 0;

    return (
        <EditModeContext.Provider value={{
            editMode,
            toggleEditMode,
            setEditMode,
            canEdit: canAccessAdmin,
            selectedBlockId,
            hoverBlockId,
            selectBlock,
            setHoverBlock,
            pendingChanges,
            hasUnsavedChanges,
            registerChange,
            deleteContent,
            saveAllChanges: saveChanges,
            discardAllChanges: discardChanges,
            getOriginalValue,
        }}>
            {children}
        </EditModeContext.Provider>
    );
}

export function useEditMode() {
    return useContext(EditModeContext);
}
