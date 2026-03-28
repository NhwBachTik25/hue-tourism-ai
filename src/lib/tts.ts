// Text-to-Speech service using Web Speech API
// No API key required - works in modern browsers

export interface TTSOptions {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: SpeechSynthesisVoice;
}

export interface TTSState {
    isPlaying: boolean;
    isPaused: boolean;
    currentWord: number;
    progress: number;
}

type TTSCallback = (state: TTSState) => void;

class TTSService {
    private synth: SpeechSynthesis | null = null;
    private utterance: SpeechSynthesisUtterance | null = null;
    private voices: SpeechSynthesisVoice[] = [];
    private callbacks: Set<TTSCallback> = new Set();
    private currentText: string = '';
    private words: string[] = [];
    private currentWordIndex: number = 0;
    private isInitialized: boolean = false;

    constructor() {
        if (typeof window !== 'undefined') {
            this.synth = window.speechSynthesis;
            this.loadVoices();
        }
    }

    private loadVoices() {
        if (!this.synth) return;

        const loadVoicesList = () => {
            this.voices = this.synth!.getVoices();
            this.isInitialized = true;
        };

        loadVoicesList();

        // Chrome loads voices asynchronously
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = loadVoicesList;
        }
    }

    getVietnameseVoice(): SpeechSynthesisVoice | null {
        // Try to find a Vietnamese voice
        const vnVoice = this.voices.find(
            (v) => v.lang.includes('vi') || v.lang.includes('VI')
        );
        if (vnVoice) return vnVoice;

        // Fallback to any available voice
        return this.voices[0] || null;
    }

    getEnglishVoice(): SpeechSynthesisVoice | null {
        const enVoice = this.voices.find(
            (v) => v.lang.includes('en-US') || v.lang.includes('en-GB')
        );
        if (enVoice) return enVoice;

        return this.voices.find((v) => v.lang.includes('en')) || this.voices[0] || null;
    }

    getVoices(): SpeechSynthesisVoice[] {
        return this.voices;
    }

    isSupported(): boolean {
        return typeof window !== 'undefined' && 'speechSynthesis' in window;
    }

    subscribe(callback: TTSCallback): () => void {
        this.callbacks.add(callback);
        return () => this.callbacks.delete(callback);
    }

    private notify(state: Partial<TTSState>) {
        const fullState: TTSState = {
            isPlaying: this.utterance !== null && !this.synth?.paused,
            isPaused: this.synth?.paused || false,
            currentWord: this.currentWordIndex,
            progress: this.words.length > 0 ? this.currentWordIndex / this.words.length : 0,
            ...state,
        };
        this.callbacks.forEach((cb) => cb(fullState));
    }

    speak(text: string, options: TTSOptions = {}): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.synth || !this.isSupported()) {
                reject(new Error('Speech synthesis not supported'));
                return;
            }

            // Stop any current speech
            this.stop();

            this.currentText = text;
            this.words = text.split(/\s+/).filter((w) => w.length > 0);
            this.currentWordIndex = 0;

            this.utterance = new SpeechSynthesisUtterance(text);

            // Set options
            this.utterance.lang = options.lang || 'vi-VN';
            this.utterance.rate = options.rate || 1;
            this.utterance.pitch = options.pitch || 1;
            this.utterance.volume = options.volume || 1;

            // Set voice
            if (options.voice) {
                this.utterance.voice = options.voice;
            } else {
                const voice = options.lang?.includes('en')
                    ? this.getEnglishVoice()
                    : this.getVietnameseVoice();
                if (voice) this.utterance.voice = voice;
            }

            // Event handlers
            this.utterance.onstart = () => {
                this.notify({ isPlaying: true, isPaused: false });
            };

            this.utterance.onend = () => {
                this.currentWordIndex = this.words.length;
                this.notify({ isPlaying: false, isPaused: false, progress: 1 });
                this.utterance = null;
                resolve();
            };

            this.utterance.onerror = (event) => {
                this.notify({ isPlaying: false, isPaused: false });
                this.utterance = null;
                reject(event.error);
            };

            this.utterance.onpause = () => {
                this.notify({ isPaused: true });
            };

            this.utterance.onresume = () => {
                this.notify({ isPaused: false });
            };

            // Track word boundaries (approximate)
            this.utterance.onboundary = (event) => {
                if (event.name === 'word') {
                    // Estimate word index from character index
                    const charIndex = event.charIndex;
                    let wordCount = 0;
                    let charCount = 0;
                    for (const word of this.words) {
                        charCount += word.length + 1; // +1 for space
                        if (charCount > charIndex) break;
                        wordCount++;
                    }
                    this.currentWordIndex = wordCount;
                    this.notify({
                        currentWord: wordCount,
                        progress: wordCount / this.words.length,
                    });
                }
            };

            this.synth.speak(this.utterance);
        });
    }

    pause(): void {
        if (this.synth && this.synth.speaking) {
            this.synth.pause();
            this.notify({ isPaused: true });
        }
    }

    resume(): void {
        if (this.synth && this.synth.paused) {
            this.synth.resume();
            this.notify({ isPaused: false });
        }
    }

    stop(): void {
        if (this.synth) {
            this.synth.cancel();
            this.utterance = null;
            this.currentWordIndex = 0;
            this.notify({ isPlaying: false, isPaused: false, progress: 0, currentWord: 0 });
        }
    }

    setRate(rate: number): void {
        if (this.utterance) {
            this.utterance.rate = Math.max(0.5, Math.min(2, rate));
        }
    }

    getWords(): string[] {
        return this.words;
    }

    getCurrentWordIndex(): number {
        return this.currentWordIndex;
    }
}

// Singleton instance
export const tts = new TTSService();

// React hook for TTS
export function useTTS() {
    return tts;
}
