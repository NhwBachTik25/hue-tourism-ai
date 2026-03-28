'use client';

/**
 * Block Factory
 * Creates new editable content blocks with proper registration
 * 
 * RULE: ALL "Add" buttons MUST use this factory.
 * NO manual JSX insertion without contentKey.
 */

import {
    ContentType,
    ContentItem,
    generateUniqueKey,
    registerContent,
    unregisterContent,
    getNextOrderIndex,
    getChildrenOf,
    reorderContent as cmsReorderContent,
    setDraft,
} from './cms-store';

// ============================================
// BLOCK TYPES
// ============================================

export type BlockType = 'text' | 'richtext' | 'image' | 'video' | 'card' | 'section' | 'gallery';

interface BlockConfig {
    type: BlockType;
    contentType: ContentType;
    defaultValue: string;
}

const BLOCK_CONFIGS: Record<BlockType, BlockConfig> = {
    text: {
        type: 'text',
        contentType: 'text',
        defaultValue: 'Click to edit text...',
    },
    richtext: {
        type: 'richtext',
        contentType: 'richtext',
        defaultValue: '<p>Click to edit text...</p>',
    },
    image: {
        type: 'image',
        contentType: 'image',
        defaultValue: '/placeholder-image.jpg',
    },
    video: {
        type: 'video',
        contentType: 'video',
        defaultValue: '',
    },
    card: {
        type: 'card',
        contentType: 'card',
        defaultValue: JSON.stringify({
            title: 'New Card',
            description: 'Card description',
            image: '/placeholder-image.jpg',
        }),
    },
    section: {
        type: 'section',
        contentType: 'section',
        defaultValue: JSON.stringify({
            title: 'New Section',
            subtitle: 'Section description',
        }),
    },
    gallery: {
        type: 'gallery',
        contentType: 'gallery',
        defaultValue: JSON.stringify({ images: [] }),
    },
};

// ============================================
// BLOCK FACTORY
// ============================================

/**
 * Create a new editable block and register it in the CMS store
 * 
 * @param type - Type of block to create
 * @param parentKey - Parent content key (null for root-level blocks)
 * @param initialValue - Optional initial value override
 * @returns The new contentKey
 */
export function createEditableBlock(
    type: BlockType,
    parentKey: string | null,
    initialValue?: string
): string {
    const config = BLOCK_CONFIGS[type];
    if (!config) {
        throw new Error(`Unknown block type: ${type}`);
    }

    const contentKey = generateUniqueKey(type);
    const orderIndex = getNextOrderIndex(parentKey);
    const value = initialValue ?? config.defaultValue;

    // Register in CMS store
    registerContent({
        contentKey,
        contentType: config.contentType,
        parentKey,
        orderIndex,
        value,
    });

    // Also set as draft so it shows immediately
    setDraft(contentKey, value);

    return contentKey;
}

/**
 * Create multiple blocks at once
 */
export function createMultipleBlocks(
    blocks: Array<{ type: BlockType; initialValue?: string }>,
    parentKey: string | null
): string[] {
    return blocks.map(block => createEditableBlock(block.type, parentKey, block.initialValue));
}

/**
 * Delete a block and its children
 */
export function deleteBlock(contentKey: string): boolean {
    // First delete all children recursively
    const children = getChildrenOf(contentKey);
    children.forEach(child => {
        deleteBlock(child.contentKey);
    });

    // Then delete the block itself
    return unregisterContent(contentKey);
}

/**
 * Duplicate a block
 */
export function duplicateBlock(contentKey: string, parentKey: string | null): string | null {
    // Get the original content
    const content = getChildrenOf(parentKey ?? '').find(c => c.contentKey === contentKey);
    if (!content) return null;

    // Create a new block with the same type and value
    const newKey = createEditableBlock(
        content.contentType as BlockType,
        parentKey,
        content.value
    );

    return newKey;
}

/**
 * Move a block up in order
 */
export function moveBlockUp(contentKey: string): boolean {
    const content = getChildrenOf('').find(c => c.contentKey === contentKey);
    if (!content || !content.parentKey) return false;

    const siblings = getChildrenOf(content.parentKey);
    const currentIndex = siblings.findIndex(s => s.contentKey === contentKey);

    if (currentIndex <= 0) return false;

    cmsReorderContent(content.parentKey, currentIndex, currentIndex - 1);
    return true;
}

/**
 * Move a block down in order
 */
export function moveBlockDown(contentKey: string): boolean {
    const content = getChildrenOf('').find(c => c.contentKey === contentKey);
    if (!content || !content.parentKey) return false;

    const siblings = getChildrenOf(content.parentKey);
    const currentIndex = siblings.findIndex(s => s.contentKey === contentKey);

    if (currentIndex === -1 || currentIndex >= siblings.length - 1) return false;

    cmsReorderContent(content.parentKey, currentIndex, currentIndex + 1);
    return true;
}

// ============================================
// BLOCK TYPE UTILITIES
// ============================================

/**
 * Get default value for a block type
 */
export function getDefaultValue(type: BlockType): string {
    return BLOCK_CONFIGS[type]?.defaultValue ?? '';
}

/**
 * Check if a type is valid
 */
export function isValidBlockType(type: string): type is BlockType {
    return type in BLOCK_CONFIGS;
}

/**
 * Get all supported block types
 */
export function getSupportedBlockTypes(): BlockType[] {
    return Object.keys(BLOCK_CONFIGS) as BlockType[];
}

/**
 * Get block type info
 */
export function getBlockTypeInfo(type: BlockType): {
    label: string;
    icon: string;
    description: string;
} {
    const info: Record<BlockType, { label: string; icon: string; description: string }> = {
        text: { label: 'Text', icon: 'Type', description: 'Simple text content' },
        richtext: { label: 'Rich Text', icon: 'FileText', description: 'Formatted text with styling' },
        image: { label: 'Image', icon: 'Image', description: 'Single image' },
        video: { label: 'Video', icon: 'Video', description: 'Video embed or upload' },
        card: { label: 'Card', icon: 'Square', description: 'Card with image, title, description' },
        section: { label: 'Section', icon: 'Layout', description: 'Section header' },
        gallery: { label: 'Gallery', icon: 'Grid', description: 'Image gallery' },
    };
    return info[type];
}
