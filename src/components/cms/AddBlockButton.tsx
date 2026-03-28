'use client';

/**
 * AddBlockButton Component
 * UI for adding new content blocks in edit mode
 * 
 * Uses block factory - NO manual JSX insertion
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Type, FileText, Image, Video, Square, LayoutGrid, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditMode } from '@/components/providers/edit-mode-provider';
import { createEditableBlock, BlockType, getBlockTypeInfo, getSupportedBlockTypes } from '@/lib/block-factory';
import { cn } from '@/lib/utils';

interface AddBlockButtonProps {
    parentKey: string;
    types?: BlockType[];
    onBlockAdded?: (contentKey: string, type: BlockType) => void;
    className?: string;
    variant?: 'inline' | 'floating' | 'compact';
}

const BLOCK_ICONS: Record<BlockType, typeof Plus> = {
    text: Type,
    richtext: FileText,
    image: Image,
    video: Video,
    card: Square,
    section: LayoutGrid,
    gallery: Grid,
};

export function AddBlockButton({
    parentKey,
    types = ['text', 'image', 'video'],
    onBlockAdded,
    className,
    variant = 'inline',
}: AddBlockButtonProps) {
    const [showPicker, setShowPicker] = useState(false);

    let editMode = false;
    try {
        const ctx = useEditMode();
        editMode = ctx.editMode;
    } catch {
        // Not in EditModeProvider
    }

    // Don't render if not in edit mode
    if (!editMode) return null;

    const handleAddBlock = (type: BlockType) => {
        const contentKey = createEditableBlock(type, parentKey);
        setShowPicker(false);
        onBlockAdded?.(contentKey, type);
    };

    if (variant === 'compact') {
        return (
            <div className={cn("relative inline-flex", className)}>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPicker(!showPicker)}
                    className="gap-1 h-7 px-2 text-amber-500 hover:bg-amber-500/10"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="text-xs">Add</span>
                </Button>

                <AnimatePresence>
                    {showPicker && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -5 }}
                            className="absolute top-full left-0 mt-1 z-50 bg-card border border-border rounded-lg shadow-xl p-1 min-w-[120px]"
                        >
                            {types.map(type => {
                                const Icon = BLOCK_ICONS[type];
                                const info = getBlockTypeInfo(type);
                                return (
                                    <button
                                        key={type}
                                        onClick={() => handleAddBlock(type)}
                                        className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-amber-500/10 rounded transition-colors text-left"
                                    >
                                        <Icon className="w-4 h-4 text-amber-500" />
                                        <span>{info.label}</span>
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    if (variant === 'floating') {
        return (
            <div className={cn("fixed bottom-24 right-4 z-40", className)}>
                <Button
                    size="icon"
                    onClick={() => setShowPicker(!showPicker)}
                    className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 shadow-lg"
                >
                    <Plus className={cn("w-6 h-6 transition-transform", showPicker && "rotate-45")} />
                </Button>

                <AnimatePresence>
                    {showPicker && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute bottom-full right-0 mb-2 bg-card border border-border rounded-xl shadow-xl p-2 min-w-[160px]"
                        >
                            <p className="text-xs font-semibold text-muted-foreground px-2 py-1 mb-1">Add Block</p>
                            {types.map(type => {
                                const Icon = BLOCK_ICONS[type];
                                const info = getBlockTypeInfo(type);
                                return (
                                    <button
                                        key={type}
                                        onClick={() => handleAddBlock(type)}
                                        className="flex items-center gap-3 w-full px-2 py-2 hover:bg-amber-500/10 rounded-lg transition-colors text-left"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                            <Icon className="w-4 h-4 text-amber-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{info.label}</p>
                                            <p className="text-xs text-muted-foreground">{info.description}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // Default inline variant
    return (
        <div className={cn("relative", className)}>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowPicker(!showPicker)}
                className={cn(
                    "w-full py-3 border-2 border-dashed border-amber-500/30 rounded-lg",
                    "flex items-center justify-center gap-2 text-amber-500",
                    "hover:bg-amber-500/5 hover:border-amber-500/50 transition-all",
                    "cursor-pointer"
                )}
            >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add Content</span>
            </motion.button>

            <AnimatePresence>
                {showPicker && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setShowPicker(false)}
                        />

                        {/* Picker */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-card border border-border rounded-xl shadow-xl p-3 min-w-[280px]"
                        >
                            <p className="text-sm font-semibold mb-3">Choose block type</p>
                            <div className="grid grid-cols-2 gap-2">
                                {types.map(type => {
                                    const Icon = BLOCK_ICONS[type];
                                    const info = getBlockTypeInfo(type);
                                    return (
                                        <motion.button
                                            key={type}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleAddBlock(type)}
                                            className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-amber-500/50 hover:bg-amber-500/5 transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                                <Icon className="w-5 h-5 text-amber-500" />
                                            </div>
                                            <span className="text-sm font-medium">{info.label}</span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helper component for showing add button between items
export function AddBlockInline({
    parentKey,
    types = ['text', 'image'],
    onBlockAdded,
}: {
    parentKey: string;
    types?: BlockType[];
    onBlockAdded?: (contentKey: string, type: BlockType) => void;
}) {
    let editMode = false;
    try {
        const ctx = useEditMode();
        editMode = ctx.editMode;
    } catch {
        // Not in EditModeProvider
    }

    if (!editMode) return null;

    return (
        <div className="py-2 opacity-0 hover:opacity-100 transition-opacity">
            <AddBlockButton
                parentKey={parentKey}
                types={types}
                onBlockAdded={onBlockAdded}
                variant="compact"
            />
        </div>
    );
}
