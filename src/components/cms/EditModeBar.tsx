'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, X, Edit3, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditMode } from '@/components/providers/edit-mode-provider';
import { useToast } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

export function EditModeBar() {
    const {
        editMode,
        hasUnsavedChanges,
        pendingChanges,
        saveAllChanges,
        discardAllChanges,
        setEditMode
    } = useEditMode();
    const toast = useToast();

    // CTRL+S to save
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!editMode) return;

            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }

            if (e.key === 'Escape' && hasUnsavedChanges) {
                e.preventDefault();
                const confirmed = window.confirm('Bạn có thay đổi chưa lưu. Bạn có chắc muốn hủy?');
                if (confirmed) {
                    handleDiscard();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [editMode, hasUnsavedChanges]);

    // Warn before leaving page with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = 'Bạn có thay đổi chưa lưu. Bạn có chắc muốn rời trang?';
                return e.returnValue;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    const handleSave = useCallback(async () => {
        try {
            await saveAllChanges();
            toast.success('Đã lưu tất cả thay đổi!');
        } catch {
            toast.error('Lỗi khi lưu. Vui lòng thử lại.');
        }
    }, [saveAllChanges, toast]);

    const handleDiscard = useCallback(() => {
        discardAllChanges();
        toast.info('Đã hủy tất cả thay đổi');
    }, [discardAllChanges, toast]);

    const handleExitEditMode = useCallback(() => {
        if (hasUnsavedChanges) {
            const confirmed = window.confirm('Bạn có thay đổi chưa lưu. Lưu trước khi thoát?');
            if (confirmed) {
                handleSave().then(() => setEditMode(false));
                return;
            }
        }
        setEditMode(false);
    }, [hasUnsavedChanges, handleSave, setEditMode]);

    if (!editMode) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className={cn(
                    "fixed bottom-0 left-0 right-0 z-50",
                    "bg-gradient-to-r from-amber-500/95 to-orange-500/95 backdrop-blur-xl",
                    "border-t border-amber-400/50 shadow-2xl shadow-amber-500/20"
                )}
            >
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    {/* Left: Edit Mode Badge */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
                            <Edit3 className="w-4 h-4 text-white" />
                            <span className="text-sm font-medium text-white">
                                CHẾ ĐỘ CHỈNH SỬA
                            </span>
                        </div>

                        {hasUnsavedChanges && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex items-center gap-1.5 text-white/90"
                            >
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm">
                                    {pendingChanges.size} thay đổi chưa lưu
                                </span>
                            </motion.div>
                        )}
                    </div>

                    {/* Right: Save/Cancel Buttons */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-white/70 hidden sm:block mr-2">
                            Ctrl+S để lưu
                        </span>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDiscard}
                            disabled={!hasUnsavedChanges}
                            className="gap-1.5 text-white hover:bg-white/20 disabled:opacity-50"
                        >
                            <X className="w-4 h-4" />
                            <span className="hidden sm:inline">Hủy</span>
                        </Button>

                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={!hasUnsavedChanges}
                            className="gap-1.5 bg-white text-amber-600 hover:bg-white/90 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>Lưu thay đổi</span>
                        </Button>

                        <div className="w-px h-6 bg-white/30 mx-1" />

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleExitEditMode}
                            className="text-white hover:bg-white/20"
                        >
                            Thoát
                        </Button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
