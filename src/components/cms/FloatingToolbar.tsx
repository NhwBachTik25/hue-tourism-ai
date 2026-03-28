'use client';

/**
 * FloatingToolbar - Canva Style
 * Appears near selected block with contextual actions
 */

import { useEffect, useState, useRef } from 'react';
import { Bold, Italic, Underline, Trash2, Save, X } from 'lucide-react';
import { useEditMode } from '@/components/providers/edit-mode-provider';
import { cn } from '@/lib/utils';

export function FloatingToolbar() {
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [blockType, setBlockType] = useState<'text' | 'image' | 'video' | null>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);

    let editMode = false;
    let selectedBlockId: string | null = null;
    let hasUnsavedChanges = false;
    let saveAllChanges: () => Promise<void> = async () => { };
    let discardAllChanges: () => void = () => { };

    try {
        const ctx = useEditMode();
        editMode = ctx.editMode;
        selectedBlockId = ctx.selectedBlockId;
        hasUnsavedChanges = ctx.hasUnsavedChanges;
        saveAllChanges = ctx.saveAllChanges;
        discardAllChanges = ctx.discardAllChanges;
    } catch {
        return null;
    }

    // Position toolbar near selected block
    useEffect(() => {
        if (!selectedBlockId) return;

        const block = document.querySelector(`[data-block-id="${selectedBlockId}"]`);
        if (!block) return;

        const rect = block.getBoundingClientRect();
        const type = block.getAttribute('data-editable') as 'text' | 'image' | 'video';
        setBlockType(type);

        // Position above the block
        setPosition({
            top: rect.top + window.scrollY - 50,
            left: rect.left + window.scrollX + (rect.width / 2),
        });
    }, [selectedBlockId]);

    if (!editMode || !selectedBlockId) return null;

    const handleBold = () => {
        document.execCommand('bold');
    };

    const handleItalic = () => {
        document.execCommand('italic');
    };

    const handleUnderline = () => {
        document.execCommand('underline');
    };

    const handleSave = async () => {
        await saveAllChanges();
    };

    const handleCancel = () => {
        discardAllChanges();
    };

    return (
        <div
            ref={toolbarRef}
            data-toolbar
            className="fixed z-50 flex items-center gap-1 bg-gray-900 text-white rounded-lg shadow-xl px-2 py-1.5 -translate-x-1/2"
            style={{
                top: Math.max(10, position.top),
                left: position.left,
            }}
        >
            {/* Text formatting buttons */}
            {blockType === 'text' && (
                <>
                    <button
                        onClick={handleBold}
                        className="p-1.5 hover:bg-white/20 rounded transition-colors"
                        title="Bold (Ctrl+B)"
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleItalic}
                        className="p-1.5 hover:bg-white/20 rounded transition-colors"
                        title="Italic (Ctrl+I)"
                    >
                        <Italic className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleUnderline}
                        className="p-1.5 hover:bg-white/20 rounded transition-colors"
                        title="Underline (Ctrl+U)"
                    >
                        <Underline className="w-4 h-4" />
                    </button>
                    <div className="w-px h-5 bg-white/30 mx-1" />
                </>
            )}

            {/* Save/Cancel - only show when changes exist */}
            {hasUnsavedChanges && (
                <>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-1 px-2 py-1 bg-green-500 hover:bg-green-600 rounded text-xs font-medium transition-colors"
                    >
                        <Save className="w-3 h-3" />
                        Save
                    </button>
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-1 px-2 py-1 hover:bg-white/20 rounded text-xs transition-colors"
                    >
                        <X className="w-3 h-3" />
                        Cancel
                    </button>
                </>
            )}
        </div>
    );
}
