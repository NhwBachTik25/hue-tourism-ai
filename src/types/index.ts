export interface Document {
    id: string;
    content: string;
    source: string;
    category: 'destinations' | 'food' | 'crafts' | 'festivals' | 'general';
    chunks: DocumentChunk[];
}

export interface DocumentChunk {
    id: string;
    content: string;
    documentId: string;
    source: string;
    category: string;
    index: number;
}

export interface SearchResult {
    chunk: DocumentChunk;
    score: number;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    context?: string;
}

export interface ChatSession {
    id: string;
    messages: ChatMessage[];
    createdAt: Date;
    lastActivity: Date;
}
