/**
 * Content Storage Service
 * Provides versioned localStorage storage with history and rollback
 */

const STORAGE_PREFIX = 'cms_content_';
const HISTORY_PREFIX = 'cms_history_';
const MAX_HISTORY = 20;

export interface ContentVersion {
    value: string;
    timestamp: number;
    source: 'user' | 'ai';
}

export interface ContentHistory {
    versions: ContentVersion[];
    currentIndex: number;
}

/**
 * Get content from storage
 */
export function getContent(id: string): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(`${STORAGE_PREFIX}${id}`);
}

/**
 * Save content with version history
 */
export function saveContent(id: string, value: string, source: 'user' | 'ai' = 'user'): void {
    if (typeof window === 'undefined') return;

    // Save current value
    localStorage.setItem(`${STORAGE_PREFIX}${id}`, value);

    // Add to history
    const history = getHistory(id);
    const newVersion: ContentVersion = {
        value,
        timestamp: Date.now(),
        source
    };

    // Truncate future versions if we're in the middle of history
    const truncatedVersions = history.versions.slice(0, history.currentIndex + 1);
    truncatedVersions.push(newVersion);

    // Limit history size
    if (truncatedVersions.length > MAX_HISTORY) {
        truncatedVersions.shift();
    }

    const newHistory: ContentHistory = {
        versions: truncatedVersions,
        currentIndex: truncatedVersions.length - 1
    };

    localStorage.setItem(`${HISTORY_PREFIX}${id}`, JSON.stringify(newHistory));
}

/**
 * Get version history for content
 */
export function getHistory(id: string): ContentHistory {
    if (typeof window === 'undefined') {
        return { versions: [], currentIndex: -1 };
    }

    const stored = localStorage.getItem(`${HISTORY_PREFIX}${id}`);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return { versions: [], currentIndex: -1 };
        }
    }
    return { versions: [], currentIndex: -1 };
}

/**
 * Undo to previous version
 */
export function undo(id: string): string | null {
    const history = getHistory(id);
    if (history.currentIndex <= 0) return null;

    const newIndex = history.currentIndex - 1;
    const previousVersion = history.versions[newIndex];

    // Update current index
    history.currentIndex = newIndex;
    localStorage.setItem(`${HISTORY_PREFIX}${id}`, JSON.stringify(history));

    // Update current content
    localStorage.setItem(`${STORAGE_PREFIX}${id}`, previousVersion.value);

    return previousVersion.value;
}

/**
 * Redo to next version
 */
export function redo(id: string): string | null {
    const history = getHistory(id);
    if (history.currentIndex >= history.versions.length - 1) return null;

    const newIndex = history.currentIndex + 1;
    const nextVersion = history.versions[newIndex];

    // Update current index
    history.currentIndex = newIndex;
    localStorage.setItem(`${HISTORY_PREFIX}${id}`, JSON.stringify(history));

    // Update current content
    localStorage.setItem(`${STORAGE_PREFIX}${id}`, nextVersion.value);

    return nextVersion.value;
}

/**
 * Rollback to a specific version
 */
export function rollback(id: string, versionIndex: number): string | null {
    const history = getHistory(id);
    if (versionIndex < 0 || versionIndex >= history.versions.length) return null;

    const targetVersion = history.versions[versionIndex];

    // Update current index
    history.currentIndex = versionIndex;
    localStorage.setItem(`${HISTORY_PREFIX}${id}`, JSON.stringify(history));

    // Update current content
    localStorage.setItem(`${STORAGE_PREFIX}${id}`, targetVersion.value);

    return targetVersion.value;
}

/**
 * Check if undo is available
 */
export function canUndo(id: string): boolean {
    const history = getHistory(id);
    return history.currentIndex > 0;
}

/**
 * Check if redo is available
 */
export function canRedo(id: string): boolean {
    const history = getHistory(id);
    return history.currentIndex < history.versions.length - 1;
}

/**
 * Clear all content and history for an ID
 */
export function clearContent(id: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`${STORAGE_PREFIX}${id}`);
    localStorage.removeItem(`${HISTORY_PREFIX}${id}`);
}

/**
 * Get all content IDs
 */
export function getAllContentIds(): string[] {
    if (typeof window === 'undefined') return [];

    const ids: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(STORAGE_PREFIX)) {
            ids.push(key.replace(STORAGE_PREFIX, ''));
        }
    }
    return ids;
}

/**
 * Export all content as JSON
 */
export function exportAllContent(): Record<string, string> {
    const ids = getAllContentIds();
    const content: Record<string, string> = {};
    ids.forEach(id => {
        const value = getContent(id);
        if (value) content[id] = value;
    });
    return content;
}

/**
 * Import content from JSON
 */
export function importContent(data: Record<string, string>): void {
    Object.entries(data).forEach(([id, value]) => {
        saveContent(id, value, 'user');
    });
}
