import fs from 'fs';
import path from 'path';
import { Document, DocumentChunk, SearchResult } from '@/types';

// Simple text processing utilities
function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics for matching
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(token => token.length > 1);
}

function calculateTF(term: string, tokens: string[]): number {
    const count = tokens.filter(t => t === term).length;
    return count / tokens.length;
}

function calculateIDF(term: string, documents: string[][]): number {
    const docsWithTerm = documents.filter(doc => doc.includes(term)).length;
    if (docsWithTerm === 0) return 0;
    return Math.log(documents.length / docsWithTerm);
}

function cosineSimilarity(vec1: Map<string, number>, vec2: Map<string, number>): number {
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;

    vec1.forEach((val, key) => {
        mag1 += val * val;
        if (vec2.has(key)) {
            dotProduct += val * (vec2.get(key) || 0);
        }
    });

    vec2.forEach(val => {
        mag2 += val * val;
    });

    const magnitude = Math.sqrt(mag1) * Math.sqrt(mag2);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
}

class RAGEngine {
    private documents: Document[] = [];
    private chunks: DocumentChunk[] = [];
    private tokenizedChunks: string[][] = [];
    private initialized = false;

    async initialize(): Promise<void> {
        if (this.initialized) return;

        const dataDir = path.join(process.cwd(), 'data');
        const categories = ['destinations', 'food', 'crafts', 'festivals', 'general'] as const;

        for (const category of categories) {
            const filePath = path.join(dataDir, `${category}.md`);

            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf-8');
                const doc: Document = {
                    id: category,
                    content,
                    source: `${category}.md`,
                    category,
                    chunks: []
                };

                // Split into chunks by sections (## headers)
                const sections = content.split(/(?=^## )/gm);

                sections.forEach((section, index) => {
                    if (section.trim().length > 50) {
                        const chunk: DocumentChunk = {
                            id: `${category}-${index}`,
                            content: section.trim(),
                            documentId: category,
                            source: doc.source,
                            category,
                            index
                        };
                        doc.chunks.push(chunk);
                        this.chunks.push(chunk);
                        this.tokenizedChunks.push(tokenize(section));
                    }
                });

                this.documents.push(doc);
            }
        }

        this.initialized = true;
        console.log(`RAG Engine initialized with ${this.chunks.length} chunks from ${this.documents.length} documents`);
    }

    search(query: string, topK: number = 5): SearchResult[] {
        if (!this.initialized) {
            throw new Error('RAG Engine not initialized');
        }

        const queryTokens = tokenize(query);
        const results: SearchResult[] = [];

        // Build query TF-IDF vector
        const queryVector = new Map<string, number>();
        const uniqueQueryTerms = [...new Set(queryTokens)];

        uniqueQueryTerms.forEach(term => {
            const tf = calculateTF(term, queryTokens);
            const idf = calculateIDF(term, this.tokenizedChunks);
            queryVector.set(term, tf * idf);
        });

        // Calculate similarity for each chunk
        this.chunks.forEach((chunk, index) => {
            const chunkTokens = this.tokenizedChunks[index];
            const chunkVector = new Map<string, number>();
            const uniqueChunkTerms = [...new Set(chunkTokens)];

            uniqueChunkTerms.forEach(term => {
                const tf = calculateTF(term, chunkTokens);
                const idf = calculateIDF(term, this.tokenizedChunks);
                chunkVector.set(term, tf * idf);
            });

            // Calculate cosine similarity
            const similarity = cosineSimilarity(queryVector, chunkVector);

            // Add keyword matching boost
            let keywordBoost = 0;
            queryTokens.forEach(token => {
                if (chunk.content.toLowerCase().includes(token)) {
                    keywordBoost += 0.1;
                }
            });

            const finalScore = similarity + Math.min(keywordBoost, 0.5);

            if (finalScore > 0.01) {
                results.push({ chunk, score: finalScore });
            }
        });

        // Sort by score and return top-k
        return results
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);
    }

    getContextForQuery(query: string, maxTokens: number = 3000): string {
        const results = this.search(query, 5);

        if (results.length === 0) {
            return '';
        }

        let context = '=== DỮ LIỆU THAM KHẢO ===\n\n';
        let currentLength = 0;

        for (const result of results) {
            const chunkText = `[Nguồn: ${result.chunk.category}]\n${result.chunk.content}\n\n---\n\n`;
            const chunkLength = chunkText.length;

            if (currentLength + chunkLength > maxTokens * 4) { // Rough estimate: 4 chars per token
                break;
            }

            context += chunkText;
            currentLength += chunkLength;
        }

        return context;
    }

    getStats(): { documents: number; chunks: number } {
        return {
            documents: this.documents.length,
            chunks: this.chunks.length
        };
    }
}

// Singleton instance
let ragEngineInstance: RAGEngine | null = null;

export async function getRAGEngine(): Promise<RAGEngine> {
    if (!ragEngineInstance) {
        ragEngineInstance = new RAGEngine();
        await ragEngineInstance.initialize();
    }
    return ragEngineInstance;
}

export type { RAGEngine };
