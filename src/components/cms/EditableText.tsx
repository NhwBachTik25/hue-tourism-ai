'use client';

/**
 * EditableText - Canva/PowerPoint Style
 * 
 * ✅ Shows original content
 * ✅ Click to edit directly on existing text
 * ✅ Cursor stays where you click  
 * ✅ Can type, delete, paste normally
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useEditMode } from '@/components/providers/edit-mode-provider';
import * as contentStorage from '@/lib/content-storage';
import { setDraft, getDraftOrContent } from '@/lib/cms-store';
import { cn } from '@/lib/utils';

interface EditableTextProps {
    id: string;
    defaultValue: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
    className?: string;
    allowRichText?: boolean;
}

export function EditableText({
    id,
    defaultValue,
    as = 'p',
    className,
    allowRichText = true
}: EditableTextProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [staticContent, setStaticContent] = useState(defaultValue);
    const contentRef = useRef<HTMLDivElement>(null);
    const originalContent = useRef<string>(defaultValue);
    const isInitialized = useRef(false);

    // Determine which HTML tag to use
    const Tag = as;

    let editMode = false;
    let selectedBlockId: string | null = null;
    let selectBlock: (id: string | null) => void = () => { };
    let setHoverBlock: (id: string | null) => void = () => { };
    let registerChange: (id: string, original: string, current: string, type?: 'text' | 'image' | 'media') => void = () => { };

    try {
        const ctx = useEditMode();
        editMode = ctx.editMode;
        selectedBlockId = ctx.selectedBlockId;
        selectBlock = ctx.selectBlock;
        setHoverBlock = ctx.setHoverBlock;
        registerChange = ctx.registerChange;
    } catch {
        // Not in EditModeProvider
    }

    const isSelected = selectedBlockId === id;

    // Load saved content on mount
    useEffect(() => {
        const savedContent = getDraftOrContent(id, defaultValue) || defaultValue;
        const storedOriginal = contentStorage.getContent(id) || defaultValue;

        originalContent.current = storedOriginal;
        setStaticContent(savedContent);
    }, [id, defaultValue]);

    // Set content in DOM when entering edit mode (ONLY ONCE per edit session)
    useEffect(() => {
        if (editMode && contentRef.current && !isInitialized.current) {
            const savedContent = getDraftOrContent(id, defaultValue) || defaultValue;
            contentRef.current.innerHTML = savedContent;
            isInitialized.current = true;
        }

        // Reset when exiting edit mode
        if (!editMode) {
            isInitialized.current = false;
            const currentContent = getDraftOrContent(id, defaultValue) || defaultValue;
            setStaticContent(currentContent);
        }
    }, [editMode, id, defaultValue]);

    // Handle input - save to draft
    const handleInput = useCallback(() => {
        if (!contentRef.current) return;

        const newContent = contentRef.current.innerHTML;
        setDraft(id, newContent);
        registerChange(id, originalContent.current, newContent, 'text');
    }, [id, registerChange]);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
        selectBlock(id);
    }, [id, selectBlock]);

    const handleBlur = useCallback(() => {
        setIsFocused(false);

        if (contentRef.current) {
            const currentContent = contentRef.current.innerHTML;
            if (currentContent !== originalContent.current) {
                contentStorage.saveContent(id, currentContent, 'user');
            }
            setStaticContent(currentContent);
        }
    }, [id]);

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        selectBlock(id);
    }, [id, selectBlock]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (allowRichText && (e.ctrlKey || e.metaKey)) {
            if (e.key === 'b') {
                e.preventDefault();
                document.execCommand('bold');
                handleInput();
            } else if (e.key === 'i') {
                e.preventDefault();
                document.execCommand('italic');
                handleInput();
            } else if (e.key === 'u') {
                e.preventDefault();
                document.execCommand('underline');
                handleInput();
            }
        }

        if (e.key === 'Enter' && !e.shiftKey && !['p', 'div'].includes(Tag)) {
            e.preventDefault();
            contentRef.current?.blur();
        }
    }, [Tag, allowRichText, handleInput]);

    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        if (!allowRichText) {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        }
    }, [allowRichText]);

    // Non-edit mode: static render
    if (!editMode) {
        return (
            <Tag
                className={className}
                dangerouslySetInnerHTML={{ __html: staticContent }}
            />
        );
    }

    // Edit mode: contentEditable (content set via useEffect)
    return (
        <Tag
            ref={contentRef as any}
            data-editable="text"
            data-block-id={id}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onMouseEnter={() => { setIsHovered(true); setHoverBlock(id); }}
            onMouseLeave={() => { setIsHovered(false); setHoverBlock(null); }}
            className={cn(
                className,
                "outline-none transition-all duration-150 cursor-text",
                "border border-dashed border-transparent",
                !isSelected && isHovered && "border-blue-400/50",
                isSelected && "border-solid border-blue-500 bg-blue-500/5",
                isFocused && "ring-2 ring-blue-500/30",
                "rounded px-0.5"
            )}
            style={{ minHeight: '1em' }}
        />
    );
}
