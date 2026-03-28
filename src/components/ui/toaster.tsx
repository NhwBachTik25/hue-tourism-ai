'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastVariant = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    variant: ToastVariant;
}

interface ToastContextType {
    toast: (message: string, variant?: ToastVariant) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        // Return a no-op version if not in provider (for SSR safety)
        return {
            toast: () => { },
            success: () => { },
            error: () => { },
            info: () => { },
        };
    }
    return context;
}

interface ToastProviderProps {
    children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const addToast = useCallback((message: string, variant: ToastVariant = 'info') => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setToasts(prev => [...prev, { id, message, variant }]);

        // Auto-dismiss after 3 seconds
        setTimeout(() => removeToast(id), 3000);
    }, [removeToast]);

    const contextValue: ToastContextType = {
        toast: addToast,
        success: (message: string) => addToast(message, 'success'),
        error: (message: string) => addToast(message, 'error'),
        info: (message: string) => addToast(message, 'info'),
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={removeToast} />
        </ToastContext.Provider>
    );
}

interface ToastContainerProps {
    toasts: Toast[];
    onDismiss: (id: string) => void;
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
    const getIcon = (variant: ToastVariant) => {
        switch (variant) {
            case 'success':
                return <CheckCircle2 className="w-5 h-5 text-green-400" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-400" />;
            case 'info':
            default:
                return <Info className="w-5 h-5 text-blue-400" />;
        }
    };

    const getStyles = (variant: ToastVariant) => {
        switch (variant) {
            case 'success':
                return 'bg-green-500/10 border-green-500/30';
            case 'error':
                return 'bg-red-500/10 border-red-500/30';
            case 'info':
            default:
                return 'bg-blue-500/10 border-blue-500/30';
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
            <AnimatePresence>
                {toasts.map(toast => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg",
                            getStyles(toast.variant)
                        )}
                    >
                        {getIcon(toast.variant)}
                        <span className="flex-1 text-sm font-medium">{toast.message}</span>
                        <button
                            onClick={() => onDismiss(toast.id)}
                            className="p-1 hover:bg-background/50 rounded transition-colors"
                        >
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
