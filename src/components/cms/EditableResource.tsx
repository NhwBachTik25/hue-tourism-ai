'use client';

import { EditableMedia } from './EditableMedia';

interface EditableResourceProps {
    id: string; // Key in JSON
    type: 'image' | 'video';
    defaultContent: string; // URL or content
    alt?: string;
    className?: string; // For styling
    containerClassName?: string;
}

/**
 * EditableResource - The unified "In-Context Editing" component
 * as requested in the "Visual Editor" architecture.
 * 
 * Wraps the robust EditableMedia component but exposes the exact API
 * requested by the prompt: id, type, defaultContent.
 */
export function EditableResource({
    id,
    type,
    defaultContent,
    alt,
    className,
    containerClassName
}: EditableResourceProps) {
    return (
        <EditableMedia
            id={id}
            type={type}
            defaultSrc={defaultContent}
            alt={alt}
            className={className}
            containerClassName={containerClassName}
        />
    );
}
