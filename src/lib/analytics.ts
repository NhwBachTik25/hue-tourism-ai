// Analytics service for tracking user interactions
// Stores data in localStorage for demo purposes

export interface AnalyticsEvent {
    type: 'page_view' | 'location_view' | 'story_play' | 'quiz_answer' | 'map_interaction' | 'ar_model_view';
    timestamp: string;
    data: Record<string, unknown>;
}

export interface LocationStats {
    locationId: string;
    views: number;
    storyPlays: number;
}

export interface QuizStats {
    questionId: string;
    correct: number;
    incorrect: number;
}

export interface AnalyticsSummary {
    totalPageViews: number;
    todayPageViews: number;
    locationStats: LocationStats[];
    quizStats: {
        totalAnswered: number;
        totalCorrect: number;
        questionStats: QuizStats[];
    };
    totalStoryPlays: number;
    mapInteractions: number;
}

const STORAGE_KEY = 'phu-vinh-analytics';
const VISIT_STATS_KEY = 'phu-vinh-visit-stats';

class AnalyticsService {
    private events: AnalyticsEvent[] = [];
    private isLoaded = false;

    constructor() {
        if (typeof window !== 'undefined') {
            this.load();
        }
    }

    private load() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                this.events = JSON.parse(stored);
            }
            this.isLoaded = true;
        } catch {
            this.events = [];
            this.isLoaded = true;
        }
    }

    private save() {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.events));
        } catch {
            // Storage full, remove old events
            this.events = this.events.slice(-500);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.events));
        }
    }

    track(type: AnalyticsEvent['type'], data: Record<string, unknown> = {}) {
        if (typeof window === 'undefined') return;

        const event: AnalyticsEvent = {
            type,
            timestamp: new Date().toISOString(),
            data,
        };

        this.events.push(event);
        this.save();

        // Update visit stats for admin dashboard compatibility
        if (type === 'page_view') {
            this.updateVisitStats();
        }
    }

    private updateVisitStats() {
        try {
            const today = new Date().toDateString();
            const stored = localStorage.getItem(VISIT_STATS_KEY);
            let stats = stored ? JSON.parse(stored) : { totalVisits: 0, todayVisits: 0, lastDate: '' };

            stats.totalVisits++;

            if (stats.lastDate === today) {
                stats.todayVisits++;
            } else {
                stats.todayVisits = 1;
                stats.lastDate = today;
            }

            localStorage.setItem(VISIT_STATS_KEY, JSON.stringify(stats));
        } catch {
            // Ignore errors
        }
    }

    trackPageView(page: string) {
        this.track('page_view', { page });
    }

    trackLocationView(locationId: string, locationName: string) {
        this.track('location_view', { locationId, locationName });
    }

    trackStoryPlay(locationId: string, locationName: string) {
        this.track('story_play', { locationId, locationName });
    }

    trackQuizAnswer(questionId: string, isCorrect: boolean) {
        this.track('quiz_answer', { questionId, isCorrect });
    }

    trackMapInteraction(action: string, locationId?: string) {
        this.track('map_interaction', { action, locationId });
    }

    trackARView(modelId: string, modelName: string) {
        this.track('ar_model_view', { modelId, modelName });
    }

    getSummary(): AnalyticsSummary {
        const today = new Date().toDateString();

        // Page views
        const pageViews = this.events.filter((e) => e.type === 'page_view');
        const todayPageViews = pageViews.filter(
            (e) => new Date(e.timestamp).toDateString() === today
        );

        // Location stats
        const locationViews = this.events.filter((e) => e.type === 'location_view');
        const storyPlays = this.events.filter((e) => e.type === 'story_play');

        const locationStatsMap = new Map<string, LocationStats>();
        locationViews.forEach((e) => {
            const id = e.data.locationId as string;
            const existing = locationStatsMap.get(id) || { locationId: id, views: 0, storyPlays: 0 };
            existing.views++;
            locationStatsMap.set(id, existing);
        });
        storyPlays.forEach((e) => {
            const id = e.data.locationId as string;
            const existing = locationStatsMap.get(id) || { locationId: id, views: 0, storyPlays: 0 };
            existing.storyPlays++;
            locationStatsMap.set(id, existing);
        });

        // Quiz stats
        const quizAnswers = this.events.filter((e) => e.type === 'quiz_answer');
        const questionStatsMap = new Map<string, QuizStats>();
        let totalCorrect = 0;

        quizAnswers.forEach((e) => {
            const id = e.data.questionId as string;
            const isCorrect = e.data.isCorrect as boolean;
            const existing = questionStatsMap.get(id) || { questionId: id, correct: 0, incorrect: 0 };
            if (isCorrect) {
                existing.correct++;
                totalCorrect++;
            } else {
                existing.incorrect++;
            }
            questionStatsMap.set(id, existing);
        });

        // Map interactions
        const mapInteractions = this.events.filter((e) => e.type === 'map_interaction');

        return {
            totalPageViews: pageViews.length,
            todayPageViews: todayPageViews.length,
            locationStats: Array.from(locationStatsMap.values()).sort((a, b) => b.views - a.views),
            quizStats: {
                totalAnswered: quizAnswers.length,
                totalCorrect,
                questionStats: Array.from(questionStatsMap.values()),
            },
            totalStoryPlays: storyPlays.length,
            mapInteractions: mapInteractions.length,
        };
    }

    getRecentEvents(limit = 50): AnalyticsEvent[] {
        return this.events.slice(-limit).reverse();
    }

    clearAll() {
        this.events = [];
        this.save();
    }

    getVisitStats(): { totalVisits: number; todayVisits: number; lastDate: string } {
        if (typeof window === 'undefined') {
            return { totalVisits: 0, todayVisits: 0, lastDate: '' };
        }
        try {
            const stored = localStorage.getItem(VISIT_STATS_KEY);
            if (stored) {
                const stats = JSON.parse(stored);
                // Check if lastDate is today, if not reset todayVisits
                const today = new Date().toDateString();
                if (stats.lastDate !== today) {
                    stats.todayVisits = 0;
                }
                return stats;
            }
        } catch {
            // Ignore
        }
        return { totalVisits: 0, todayVisits: 0, lastDate: '' };
    }
}

// Singleton instance
export const analytics = new AnalyticsService();
