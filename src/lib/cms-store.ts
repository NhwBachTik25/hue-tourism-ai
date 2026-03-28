'use client';

/**
 * Unified CMS Store - v2
 * Single source of truth for all content management
 * 
 * Architecture:
 * - contentRegistry: structured content with keys, types, hierarchy
 * - draftStore: in-memory edit session changes
 * - mediaStore: image/video with proper IDs
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export type ContentType = 'text' | 'richtext' | 'image' | 'video' | 'block' | 'section' | 'card' | 'gallery';

export interface ContentItem {
    contentKey: string;           // Unique stable ID
    contentType: ContentType;     // Type of content
    parentKey: string | null;     // For nested content
    orderIndex: number;           // For ordering within parent
    value: string;                // Content value or mediaId
    createdAt: number;            // Timestamp
    updatedAt: number;            // Timestamp
}

export interface MediaItem {
    id: string;
    type: 'image' | 'video';
    url: string;
    meta: {
        size?: number;
        duration?: number;
        alt?: string;
        width?: number;
        height?: number;
    };
    createdAt: number;
}

// ============================================
// STORAGE KEYS
// ============================================

const CONTENT_REGISTRY_KEY = 'cms_content_registry';
const MEDIA_REGISTRY_KEY = 'cms_media_registry';
const STORAGE_PREFIX = 'cms_content_';
const MEDIA_PREFIX = 'cms_media_';

// ============================================
// IN-MEMORY STORES
// ============================================

// Draft store (in-memory, cleared on page reload or discard)
const draftStore = new Map<string, string>();

// Content registry (loaded from localStorage)
let contentRegistry: Map<string, ContentItem> = new Map();

// Media registry (loaded from localStorage)
let mediaRegistry: Map<string, MediaItem> = new Map();

// Subscribers for reactive updates
const subscribers = new Set<() => void>();

// ============================================
// INITIALIZATION
// ============================================

function loadRegistries(): void {
    if (typeof window === 'undefined') return;

    try {
        // Load content registry
        const contentData = localStorage.getItem(CONTENT_REGISTRY_KEY);
        if (contentData) {
            const parsed = JSON.parse(contentData);
            contentRegistry = new Map(Object.entries(parsed));
        }

        // Load media registry
        const mediaData = localStorage.getItem(MEDIA_REGISTRY_KEY);
        if (mediaData) {
            const parsed = JSON.parse(mediaData);
            mediaRegistry = new Map(Object.entries(parsed));
        }
    } catch (e) {
        console.error('Failed to load CMS registries:', e);
    }
}

function saveContentRegistry(): void {
    if (typeof window === 'undefined') return;
    const obj = Object.fromEntries(contentRegistry);
    localStorage.setItem(CONTENT_REGISTRY_KEY, JSON.stringify(obj));
}

function saveMediaRegistry(): void {
    if (typeof window === 'undefined') return;
    const obj = Object.fromEntries(mediaRegistry);
    localStorage.setItem(MEDIA_REGISTRY_KEY, JSON.stringify(obj));
}

// Initialize on module load
if (typeof window !== 'undefined') {
    loadRegistries();
}

// ============================================
// SUBSCRIBERS
// ============================================

export function subscribe(callback: () => void): () => void {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
}

function notifySubscribers(): void {
    subscribers.forEach(cb => cb());
}

// ============================================
// KEY GENERATION
// ============================================

export function generateUniqueKey(prefix: string = 'block'): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}`;
}

// ============================================
// CONTENT REGISTRY (Structured)
// ============================================

/**
 * Register new content with full schema
 */
export function registerContent(item: Omit<ContentItem, 'createdAt' | 'updatedAt'>): ContentItem {
    const now = Date.now();
    const fullItem: ContentItem = {
        ...item,
        createdAt: now,
        updatedAt: now,
    };

    contentRegistry.set(item.contentKey, fullItem);
    saveContentRegistry();

    // Also save to legacy content store for compatibility
    setContent(item.contentKey, item.value);

    notifySubscribers();
    return fullItem;
}

/**
 * Update existing content
 */
export function updateContentItem(contentKey: string, updates: Partial<Pick<ContentItem, 'value' | 'orderIndex'>>): ContentItem | null {
    const existing = contentRegistry.get(contentKey);
    if (!existing) return null;

    const updated: ContentItem = {
        ...existing,
        ...updates,
        updatedAt: Date.now(),
    };

    contentRegistry.set(contentKey, updated);
    saveContentRegistry();

    if (updates.value !== undefined) {
        setContent(contentKey, updates.value);
    }

    notifySubscribers();
    return updated;
}

/**
 * Unregister content and reindex siblings
 */
export function unregisterContent(contentKey: string): boolean {
    const item = contentRegistry.get(contentKey);
    if (!item) return false;

    const parentKey = item.parentKey;
    const orderIndex = item.orderIndex;

    // Delete the item
    contentRegistry.delete(contentKey);

    // Remove from legacy store
    removeContent(contentKey);

    // Reindex siblings
    if (parentKey !== null) {
        const siblings = getChildrenOf(parentKey);
        siblings.forEach((sibling, idx) => {
            if (sibling.orderIndex > orderIndex) {
                sibling.orderIndex = sibling.orderIndex - 1;
                contentRegistry.set(sibling.contentKey, sibling);
            }
        });
    }

    saveContentRegistry();
    notifySubscribers();
    return true;
}

/**
 * Get content item by key
 */
export function getContentItem(contentKey: string): ContentItem | null {
    return contentRegistry.get(contentKey) ?? null;
}

/**
 * Get children of a parent, ordered by orderIndex
 */
export function getChildrenOf(parentKey: string): ContentItem[] {
    const children: ContentItem[] = [];
    contentRegistry.forEach(item => {
        if (item.parentKey === parentKey) {
            children.push(item);
        }
    });
    return children.sort((a, b) => a.orderIndex - b.orderIndex);
}

/**
 * Get next order index for a parent
 */
export function getNextOrderIndex(parentKey: string | null): number {
    const children = parentKey ? getChildrenOf(parentKey) : [];
    if (children.length === 0) return 0;
    return Math.max(...children.map(c => c.orderIndex)) + 1;
}

/**
 * Reorder content within a parent
 */
export function reorderContent(parentKey: string, fromIndex: number, toIndex: number): void {
    const children = getChildrenOf(parentKey);

    // Find the item being moved
    const movingItem = children.find(c => c.orderIndex === fromIndex);
    if (!movingItem) return;

    // Update order indices
    children.forEach(child => {
        if (child.contentKey === movingItem.contentKey) {
            child.orderIndex = toIndex;
        } else if (fromIndex < toIndex) {
            // Moving down: shift items between from+1 and to up by 1
            if (child.orderIndex > fromIndex && child.orderIndex <= toIndex) {
                child.orderIndex--;
            }
        } else {
            // Moving up: shift items between to and from-1 down by 1
            if (child.orderIndex >= toIndex && child.orderIndex < fromIndex) {
                child.orderIndex++;
            }
        }
        contentRegistry.set(child.contentKey, child);
    });

    saveContentRegistry();
    notifySubscribers();
}

/**
 * Check if a content key exists
 */
export function hasContentKey(contentKey: string): boolean {
    return contentRegistry.has(contentKey);
}

/**
 * Get all content keys
 */
export function getAllContentItems(): ContentItem[] {
    return Array.from(contentRegistry.values());
}

// ============================================
// LEGACY CONTENT STORE (Simple key-value)
// ============================================

export function getContent(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(`${STORAGE_PREFIX}${key}`);
}

export function setContent(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, value);
    notifySubscribers();
}

export function removeContent(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    notifySubscribers();
}

export function getAllContentKeys(): string[] {
    if (typeof window === 'undefined') return [];
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(STORAGE_PREFIX)) {
            keys.push(key.replace(STORAGE_PREFIX, ''));
        }
    }
    return keys;
}

// ============================================
// DRAFT STORE (In-Memory)
// ============================================

export function getDraft(key: string): string | null {
    return draftStore.get(key) ?? null;
}

export function setDraft(key: string, value: string): void {
    draftStore.set(key, value);
    notifySubscribers();
}

export function hasDraft(key: string): boolean {
    return draftStore.has(key);
}

export function getDraftOrContent(key: string, defaultValue?: string): string {
    const draft = getDraft(key);
    if (draft !== null) return draft;

    const content = getContent(key);
    if (content !== null) return content;

    return defaultValue ?? '';
}

export function getAllDraftKeys(): string[] {
    return Array.from(draftStore.keys());
}

export function getDraftCount(): number {
    return draftStore.size;
}

export function clearDraft(key: string): void {
    draftStore.delete(key);
    notifySubscribers();
}

export function clearAllDrafts(): void {
    draftStore.clear();
    notifySubscribers();
}

// ============================================
// SAVE / DISCARD WITH VALIDATION
// ============================================

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

/**
 * Validate all drafts before saving
 */
export function validateBeforeSave(): ValidationResult {
    const errors: string[] = [];

    draftStore.forEach((value, key) => {
        // Check if key follows valid format
        if (!key || key.trim() === '') {
            errors.push(`Invalid content key: empty key`);
        }

        // Check for broken media references (starts with media:)
        if (value.startsWith('media:')) {
            const mediaId = value.replace('media:', '');
            if (!mediaRegistry.has(mediaId)) {
                errors.push(`Broken media reference: ${mediaId} for content ${key}`);
            }
        }
    });

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Save all drafts to persisted content (with validation)
 */
export function saveAllDrafts(): { saved: number; keys: string[]; errors?: string[] } {
    const validation = validateBeforeSave();
    if (!validation.valid) {
        return { saved: 0, keys: [], errors: validation.errors };
    }

    const keys: string[] = [];
    draftStore.forEach((value, key) => {
        setContent(key, value);

        // Update content registry if exists
        const item = contentRegistry.get(key);
        if (item) {
            item.value = value;
            item.updatedAt = Date.now();
            contentRegistry.set(key, item);
        }

        keys.push(key);
    });

    const count = keys.length;
    draftStore.clear();
    saveContentRegistry();
    notifySubscribers();

    return { saved: count, keys };
}

/**
 * Discard all drafts (revert to persisted)
 */
export function discardAllDrafts(): number {
    const count = draftStore.size;
    draftStore.clear();
    notifySubscribers();
    return count;
}

// ============================================
// MEDIA STORE (Global)
// ============================================

/**
 * Upload media and register in store
 */
export async function uploadMedia(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const url = reader.result as string;
            const id = generateUniqueKey('media');

            const mediaItem: MediaItem = {
                id,
                type: file.type.startsWith('video/') ? 'video' : 'image',
                url,
                meta: {
                    size: file.size,
                    alt: file.name.replace(/\.[^/.]+$/, ''),
                },
                createdAt: Date.now(),
            };

            mediaRegistry.set(id, mediaItem);
            saveMediaRegistry();

            // Also save to legacy format for compatibility
            localStorage.setItem(`${MEDIA_PREFIX}${id}`, url);

            notifySubscribers();
            resolve(id);
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Get media item by ID
 */
export function getMediaItem(id: string): MediaItem | null {
    return mediaRegistry.get(id) ?? null;
}

/**
 * Get media URL by ID
 */
export function getMediaUrl(id: string): string | null {
    const item = mediaRegistry.get(id);
    if (item) return item.url;

    // Fallback to legacy storage
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(`${MEDIA_PREFIX}${id}`);
}

/**
 * Get media by ID (legacy)
 */
export function getMedia(key: string): string | null {
    // First check registry
    const item = mediaRegistry.get(key);
    if (item) return item.url;

    // Fallback to direct localStorage
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(`${MEDIA_PREFIX}${key}`);
}

/**
 * Set media URL (legacy)
 */
export function setMedia(key: string, url: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${MEDIA_PREFIX}${key}`, url);
    notifySubscribers();
}

/**
 * Remove media
 */
export function removeMedia(key: string): void {
    mediaRegistry.delete(key);
    saveMediaRegistry();

    if (typeof window !== 'undefined') {
        localStorage.removeItem(`${MEDIA_PREFIX}${key}`);
    }
    notifySubscribers();
}

/**
 * Get all media items
 */
export function getAllMediaItems(): MediaItem[] {
    return Array.from(mediaRegistry.values());
}

export function getAllMediaKeys(): string[] {
    if (typeof window === 'undefined') return [];
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(MEDIA_PREFIX)) {
            keys.push(key.replace(MEDIA_PREFIX, ''));
        }
    }
    return keys;
}

/**
 * Bind media to content
 */
export function bindMediaToContent(contentKey: string, mediaId: string): void {
    const mediaUrl = getMediaUrl(mediaId);
    if (mediaUrl) {
        setDraft(contentKey, mediaUrl);
    }
}

// ============================================
// EXPORT / IMPORT
// ============================================

export function exportAll(): {
    content: Record<string, string>;
    media: Record<string, string>;
    registry: Record<string, ContentItem>;
    mediaRegistry: Record<string, MediaItem>;
} {
    const content: Record<string, string> = {};
    const media: Record<string, string> = {};

    getAllContentKeys().forEach(key => {
        const value = getContent(key);
        if (value) content[key] = value;
    });

    getAllMediaKeys().forEach(key => {
        const value = getMedia(key);
        if (value) media[key] = value;
    });

    return {
        content,
        media,
        registry: Object.fromEntries(contentRegistry),
        mediaRegistry: Object.fromEntries(mediaRegistry),
    };
}

export function importAll(data: {
    content?: Record<string, string>;
    media?: Record<string, string>;
    registry?: Record<string, ContentItem>;
    mediaRegistry?: Record<string, MediaItem>;
}): void {
    if (data.content) {
        Object.entries(data.content).forEach(([key, value]) => {
            setContent(key, value);
        });
    }
    if (data.media) {
        Object.entries(data.media).forEach(([key, url]) => {
            setMedia(key, url);
        });
    }
    if (data.registry) {
        contentRegistry = new Map(Object.entries(data.registry));
        saveContentRegistry();
    }
    if (data.mediaRegistry) {
        mediaRegistry = new Map(Object.entries(data.mediaRegistry));
        saveMediaRegistry();
    }
    notifySubscribers();
}

// ============================================
// REACT HOOKS
// ============================================

import { useSyncExternalStore, useCallback } from 'react';

export function useCmsContent(key: string, defaultValue: string = ''): [string, (value: string) => void] {
    const getSnapshot = useCallback(() => {
        return getDraftOrContent(key, defaultValue);
    }, [key, defaultValue]);

    const value = useSyncExternalStore(subscribe, getSnapshot, () => defaultValue);

    const setValue = useCallback((newValue: string) => {
        setDraft(key, newValue);
    }, [key]);

    return [value, setValue];
}

export function useDraftCount(): number {
    const getSnapshot = useCallback(() => getDraftCount(), []);
    return useSyncExternalStore(subscribe, getSnapshot, () => 0);
}

export function useHasUnsavedChanges(): boolean {
    const count = useDraftCount();
    return count > 0;
}

export function useMediaLibrary(): MediaItem[] {
    const getSnapshot = useCallback(() => getAllMediaItems(), []);
    return useSyncExternalStore(subscribe, getSnapshot, () => []);
}

// ============================================
// PAGE CONTENT API (Requested by Visual Editor Prompt)
// ============================================

export interface PageContent {
    page_id: string;
    elements: Record<string, {
        type: 'image' | 'video' | 'text';
        src?: string;
        content?: string;
        alt?: string;
    }>;
}

/**
 * Get structured JSON for a specific page
 * Aggregates all keys starting with the page_id
 */
export function getPageContent(pageId: string): PageContent {
    const elements: PageContent['elements'] = {};

    // Find all keys belonging to this page (convention: pageId.elementId)
    const allKeys = getAllContentKeys(); // Includes legacy keys

    allKeys.forEach(key => {
        if (key.startsWith(`${pageId}.`) || key === pageId) {
            const value = getContent(key) || '';
            const type = value.match(/\.(jpg|png|gif|webp)$/i) ? 'image' :
                value.match(/\.(mp4|webm)$/i) ? 'video' : 'text';

            // Clean key name
            const shortKey = key;

            elements[shortKey] = {
                type,
                [type === 'text' ? 'content' : 'src']: value
            };
        }
    });

    return {
        page_id: pageId,
        elements
    };
}

/**
 * Mock implementation of "Content API" - POST (update) page content
 */
export async function savePageContent(pageId: string): Promise<{ success: boolean; message: string }> {
    // In a real app, this would POST to /api/content
    // For now, we simulate a delay and rely on the fact that 
    // changes are already in localStorage via optimistic UI.

    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`[API] Saved content for page: ${pageId}`, getPageContent(pageId));
            resolve({ success: true, message: 'Content saved successfully' });
        }, 800);
    });
}
