'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Zap, Target, MapPin, RefreshCw, BookOpen } from 'lucide-react';
import { useLanguage } from '@/components/providers/language-provider';
import InteractiveNotebook from '@/components/learning/InteractiveNotebook';
import { QUIZ_BANK } from '@/data/quiz-bank';

// Utils
function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Interfaces
interface Round1Pair { left: string; right: string; }
interface Round2TF { q: string; ans: boolean; }
interface Round3MCQ { q: string; opts: string[]; ans: number; exp: string; }
interface QuizData {
    round1: Round1Pair[];
    round2: Round2TF[];
    round3: Round3MCQ[];
}

// -----------------------------------------------------
// ROUND 1: MATCHING (Ghép Cặp)
// -----------------------------------------------------
function Round1Matching({ data, onComplete }: { data: Round1Pair[], onComplete: (score: number) => void }) {
    const { language } = useLanguage();
    const lang = language as 'vi' | 'en';
    const [timeLeft, setTimeLeft] = useState(60);
    const [shuffledLeft, setShuffledLeft] = useState<string[]>([]);
    const [shuffledRight, setShuffledRight] = useState<string[]>([]);
    const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
    const [selectedRight, setSelectedRight] = useState<number | null>(null);
    const [matched, setMatched] = useState<Set<number>>(new Set());
    const [wrong, setWrong] = useState<{ l: number; r: number } | null>(null);
    const [score, setScore] = useState(0);
    const [complete, setComplete] = useState(false);

    useEffect(() => {
        setShuffledLeft(shuffle(data.map(x => x.left)));
        setShuffledRight(shuffle(data.map(x => x.right)));
    }, [data]);

    useEffect(() => {
        if (complete) return;
        if (timeLeft <= 0) {
            setComplete(true);
            return;
        }
        const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearTimeout(t);
    }, [timeLeft, complete]);

    const checkMatch = useCallback((leftIdx: number, rightIdx: number) => {
        const leftText = shuffledLeft[leftIdx];
        const rightText = shuffledRight[rightIdx];
        const pairIdx = data.findIndex(p => p.left === leftText && p.right === rightText);

        if (pairIdx !== -1) {
            setMatched(prev => new Set(prev).add(pairIdx));
            setScore(s => s + 10);
            if (matched.size + 1 >= data.length) {
                setComplete(true);
            }
        } else {
            setWrong({ l: leftIdx, r: rightIdx });
            setTimeout(() => setWrong(null), 800);
        }
        setSelectedLeft(null);
        setSelectedRight(null);
    }, [shuffledLeft, shuffledRight, data, matched]);

    useEffect(() => {
        if (selectedLeft !== null && selectedRight !== null) {
            checkMatch(selectedLeft, selectedRight);
        }
    }, [selectedLeft, selectedRight, checkMatch]);

    const isLeftMatched = (idx: number) => data.some((p, i) => matched.has(i) && p.left === shuffledLeft[idx]);
    const isRightMatched = (idx: number) => data.some((p, i) => matched.has(i) && p.right === shuffledRight[idx]);
    const timerPercent = (timeLeft / 60) * 100;

    return (
        <Card className="p-4 md:p-6 bg-gradient-to-br from-[#0a1a1a] to-[#0d2525] border-teal-700/50 shadow-2xl relative overflow-hidden text-foreground">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
            <div className="relative z-10">
                <div className="text-center mb-4">
                    <Badge className="bg-teal-600/80 text-white hover:bg-teal-700 border-teal-500 text-sm px-4 py-1">
                        {lang === 'vi' ? 'VÒNG 1: GHÉP CẶP DI SẢN' : 'ROUND 1: HERITAGE MATCHING'}
                    </Badge>
                </div>
                {!complete ? (
                    <>
                        <div className="mb-4">
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                                <motion.div className={`h-full ${timeLeft > 20 ? 'bg-teal-500' : timeLeft > 10 ? 'bg-amber-500' : 'bg-red-500'}`}
                                    animate={{ width: `${timerPercent}%` }} transition={{ duration: 0.3 }} />
                            </div>
                            <p className="text-center text-sm font-bold mt-1 text-muted-foreground">{timeLeft}s</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                                {shuffledLeft.map((text, idx) => {
                                    const isMatched = isLeftMatched(idx);
                                    const isWrong = wrong?.l === idx;
                                    return (
                                        <button key={`l-${idx}`} disabled={isMatched} onClick={() => setSelectedLeft(idx)}
                                            className={`w-full p-3 rounded-lg text-sm font-medium transition-all shadow-sm border-2 text-left
                                                ${isMatched ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 pointer-events-none opacity-50 scale-95' :
                                                isWrong ? 'bg-rose-500/20 text-rose-400 border-rose-500 animate-shake' :
                                                selectedLeft === idx ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-[inset_0_0_10px_rgba(251,191,36,0.2)]' :
                                                'bg-[#1a202c]/60 text-amber-100/80 border-amber-900/50 hover:bg-[#2d3748]/60 hover:border-amber-700/50 cursor-pointer'}`}>
                                            {text}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="space-y-2">
                                {shuffledRight.map((text, idx) => {
                                    const isMatched = isRightMatched(idx);
                                    const isWrong = wrong?.r === idx;
                                    return (
                                        <button key={`r-${idx}`} disabled={isMatched} onClick={() => setSelectedRight(idx)}
                                            className={`w-full p-3 rounded-lg text-sm font-medium transition-all shadow-sm border-2 text-left
                                                ${isMatched ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 pointer-events-none opacity-50 scale-95' :
                                                isWrong ? 'bg-rose-500/20 text-rose-400 border-rose-500 animate-shake' :
                                                selectedRight === idx ? 'bg-teal-500/20 text-teal-300 border-teal-500 shadow-[inset_0_0_10px_rgba(45,212,191,0.2)]' :
                                                'bg-[#1a202c]/60 text-teal-100/80 border-teal-900/50 hover:bg-[#2d3748]/60 hover:border-teal-700/50 cursor-pointer'}`}>
                                            {text}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex justify-between text-muted-foreground font-medium border-t border-teal-900/50 pt-3">
                            <span>{lang === 'vi' ? 'Tiến trình' : 'Progress'}: {matched.size}/{data.length}</span>
                            <span>{lang === 'vi' ? 'Điểm' : 'Score'}: {score}</span>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <h3 className="text-2xl font-bold mb-4 text-emerald-400">
                            {lang === 'vi' ? 'Hoàn Tất Vòng 1!' : 'Round 1 Completed!'}
                        </h3>
                        <p className="text-lg text-muted-foreground mb-6">{lang === 'vi' ? 'Điểm của bạn:' : 'Your Score:'} <span className="font-bold text-white text-xl">{score}</span></p>
                        <Button onClick={() => onComplete(score)} className="bg-teal-600 hover:bg-teal-700 font-bold px-8 transition-transform hover:scale-105">
                            {lang === 'vi' ? 'Tiếp tục Vòng 2' : 'Continue to Round 2'} <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
}

// -----------------------------------------------------
// ROUND 2: TRUE / FALSE
// -----------------------------------------------------
function Round2TF({ data, onComplete }: { data: Round2TF[], onComplete: (score: number) => void }) {
    const { language } = useLanguage();
    const lang = language as 'vi' | 'en';
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [answered, setAnswered] = useState(false);
    const [userChoice, setUserChoice] = useState<boolean | null>(null);

    useEffect(() => {
        setTimeLeft(10);
        setAnswered(false);
        setUserChoice(null);
    }, [currentQ]);

    useEffect(() => {
        if (answered || currentQ >= data.length) return;
        if (timeLeft <= 0) {
            setAnswered(true);
            return;
        }
        const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearTimeout(t);
    }, [timeLeft, answered, currentQ, data.length]);

    const handleAnswer = (choice: boolean) => {
        if (answered) return;
        setAnswered(true);
        setUserChoice(choice);
        if (choice === data[currentQ].ans) setScore(s => s + 10);
    };

    const nextQuestion = () => {
        if (currentQ < data.length - 1) setCurrentQ(c => c + 1);
        else onComplete(score);
    };

    if (currentQ >= data.length) return null;
    const q = data[currentQ];
    const timerPercent = (timeLeft / 10) * 100;

    return (
        <Card className="p-4 md:p-6 bg-gradient-to-br from-[#2a1810] to-[#1a1205] border-amber-700/50 shadow-2xl relative overflow-hidden text-foreground">
            <div className="absolute inset-0 bg-grid-amber-500/[0.02] bg-[size:32px_32px]" />
            <div className="relative z-10">
                <div className="text-center mb-4">
                    <Badge className="bg-amber-600/80 text-white hover:bg-amber-700 border-amber-500 text-sm px-4 py-1">
                        {lang === 'vi' ? 'VÒNG 2: NHÀ KHẢO CỔ (ĐÚNG/SAI)' : 'ROUND 2: ARCHAEOLOGIST (T/F)'}
                    </Badge>
                </div>
                
                <div className="mb-8 mt-2">
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                        <motion.div className={`h-full ${timeLeft > 5 ? 'bg-amber-500' : timeLeft > 2 ? 'bg-orange-500' : 'bg-red-500'}`}
                            animate={{ width: `${timerPercent}%` }} transition={{ duration: 0.3 }} />
                    </div>
                    <p className="text-center text-sm font-bold mt-1 text-muted-foreground">{timeLeft}s</p>
                </div>

                <div className="min-h-[120px] flex items-center justify-center mb-8 px-4 py-8 bg-black/20 rounded-2xl border border-amber-900/30">
                    <h3 className="text-xl md:text-2xl font-bold text-center text-amber-50/90 leading-relaxed">
                        {q.q}
                    </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-8 mb-6">
                    <button disabled={answered} onClick={() => handleAnswer(true)}
                        className={`py-8 px-4 rounded-2xl text-xl font-bold border-2 transition-all 
                            ${!answered 
                                ? 'bg-[#1a202c]/80 text-emerald-400 border-emerald-900/50 hover:bg-emerald-900/20 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] cursor-pointer' 
                                : userChoice === true 
                                    ? (q.ans === true ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105' : 'bg-red-600 border-red-500 text-white animate-shake')
                                    : q.ans === true ? 'bg-emerald-600/50 border-emerald-500/50 text-white scale-105' : 'bg-[#1a202c]/50 border-gray-800 text-gray-500'}
                        `}>
                        {lang === 'vi' ? 'ĐÚNG ✔️' : 'TRUE ✔️'}
                    </button>
                    <button disabled={answered} onClick={() => handleAnswer(false)}
                        className={`py-8 px-4 rounded-2xl text-xl font-bold border-2 transition-all 
                            ${!answered 
                                ? 'bg-[#1a202c]/80 text-rose-400 border-rose-900/50 hover:bg-rose-900/20 hover:border-rose-500/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.1)] cursor-pointer' 
                                : userChoice === false 
                                    ? (q.ans === false ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105' : 'bg-red-600 border-red-500 text-white animate-shake')
                                    : q.ans === false ? 'bg-emerald-600/50 border-emerald-500/50 text-white scale-105' : 'bg-[#1a202c]/50 border-gray-800 text-gray-500'}
                        `}>
                        {lang === 'vi' ? 'SAI ❌' : 'FALSE ❌'}
                    </button>
                </div>

                {answered && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-6">
                        <Button onClick={nextQuestion} className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 transition-transform hover:scale-105">
                            {currentQ < data.length - 1 ? (lang === 'vi' ? 'Câu tiếp theo' : 'Next Question') : (lang === 'vi' ? 'Tiến vào Vòng 3' : 'Enter Round 3')} <ArrowRight className="ml-2 w-4 h-4"/>
                        </Button>
                    </motion.div>
                )}
                
                <div className="flex justify-between text-muted-foreground font-medium mt-6 border-t border-amber-900/50 pt-4">
                    <span>{lang === 'vi' ? 'Câu hỏi' : 'Question'}: {currentQ + 1}/{data.length}</span>
                    <span>{lang === 'vi' ? 'Điểm hiện tại' : 'Current Score'}: {score}</span>
                </div>
            </div>
        </Card>
    );
}

// -----------------------------------------------------
// ROUND 3: MULTIPLE CHOICE (Trắc nghiệm)
// -----------------------------------------------------
function Round3MCQ({ data, onComplete }: { data: Round3MCQ[], onComplete: (score: number) => void }) {
    const { language } = useLanguage();
    const lang = language as 'vi' | 'en';
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [answered, setAnswered] = useState(false);
    const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

    useEffect(() => {
        setTimeLeft(15);
        setAnswered(false);
        setSelectedOpt(null);
    }, [currentQ]);

    useEffect(() => {
        if (answered || currentQ >= data.length) return;
        if (timeLeft <= 0) {
            setAnswered(true);
            return;
        }
        const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearTimeout(t);
    }, [timeLeft, answered, currentQ, data.length]);

    const handleAnswer = (idx: number) => {
        if (answered) return;
        setSelectedOpt(idx);
        setAnswered(true);
        if (idx === data[currentQ].ans) setScore(s => s + 10);
    };

    const nextQuestion = () => {
        if (currentQ < data.length - 1) setCurrentQ(c => c + 1);
        else onComplete(score);
    };

    if (currentQ >= data.length) return null;
    const q = data[currentQ];
    const timerPercent = (timeLeft / 15) * 100;

    return (
        <Card className="p-4 md:p-6 bg-[#09090b] border-zinc-800 shadow-2xl relative overflow-hidden text-foreground">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
            <div className="relative z-10">
                <div className="text-center mb-4">
                    <Badge variant="outline" className="bg-zinc-900 border-zinc-700 text-zinc-300 px-4 py-1">
                        {lang === 'vi' ? 'VÒNG 3: TRUY CẤU TẬN CÙNG (TRẮC NGHIỆM)' : 'ROUND 3: DEEP DIVE (MCQ)'}
                    </Badge>
                </div>
                
                <div className="mb-6 mt-2">
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                        <motion.div className={`h-full ${timeLeft > 7 ? 'bg-cyan-500' : timeLeft > 3 ? 'bg-amber-500' : 'bg-red-500'}`}
                            animate={{ width: `${timerPercent}%` }} transition={{ duration: 0.3 }} />
                    </div>
                    <p className="text-center text-sm font-bold mt-1 text-muted-foreground">{timeLeft}s</p>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg md:text-xl font-medium text-center text-zinc-100 leading-relaxed min-h-[60px]">
                        {q.q}
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {q.opts.map((opt, idx) => {
                        const letter = String.fromCharCode(65 + idx);
                        const isCorrect = idx === q.ans;
                        const isSelected = selectedOpt === idx;
                        return (
                            <button key={idx} disabled={answered} onClick={() => handleAnswer(idx)}
                                className={`p-4 rounded-xl font-medium text-left transition-all border
                                    ${!answered 
                                        ? 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700 hover:text-white cursor-pointer'
                                        : isCorrect 
                                            ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] z-10'
                                            : isSelected 
                                                ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 animate-shake'
                                                : 'bg-zinc-900/30 border-zinc-800/50 text-zinc-600 opacity-50'}
                                `}>
                                <span className="mr-3 font-bold opacity-70">{letter}.</span> {opt}
                            </button>
                        )
                    })}
                </div>

                <AnimatePresence>
                    {answered && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                            <div className="bg-cyan-950/30 p-4 rounded-xl mb-6 text-sm border border-cyan-900/50 text-cyan-200/80 leading-relaxed">
                                <span className="text-cyan-400 font-semibold mr-2">{lang === 'vi' ? 'Giải thích:' : 'Explanation:'}</span>
                                {q.exp}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {answered && (
                    <div className="text-center mt-2">
                        <Button onClick={nextQuestion} variant="outline" className="px-8 border-zinc-700 hover:bg-zinc-800 hover:text-white transition-all">
                            {currentQ < data.length - 1 ? (lang === 'vi' ? 'Tiếp Hiện Tại' : 'Next Question') : (lang === 'vi' ? 'Xem Kết Quả Chung Cuộc' : 'View Final Results')} <ArrowRight className="ml-2 w-4 h-4 text-muted-foreground"/>
                        </Button>
                    </div>
                )}
                
                <div className="flex justify-between text-muted-foreground font-medium mt-6 border-t border-zinc-800 pt-4">
                    <span>{lang === 'vi' ? 'Câu hỏi' : 'Question'}: {currentQ + 1}/{data.length}</span>
                    <span>{lang === 'vi' ? 'Điểm' : 'Score'}: {score}</span>
                </div>
            </div>
        </Card>
    );
}

// -----------------------------------------------------
// MAIN PAGE
// -----------------------------------------------------
function LearningPageContent() {
    const { language } = useLanguage();
    const lang = language as 'vi' | 'en';
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<'ai' | 'notebook'>('ai');
    
    // Status
    const [status, setStatus] = useState<'menu' | 'loading' | 'round1' | 'round2' | 'round3' | 'end'>('menu');
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [totalScore, setTotalScore] = useState(0);

    useEffect(() => { setMounted(true); }, []);

    const handleGenerate = async () => {
        setStatus('loading');
        
        setTimeout(() => {
            try {
                if (!QUIZ_BANK || QUIZ_BANK.length === 0) {
                    throw new Error('Chưa tạo xong bộ đề, vui lòng thử lại sau giây lát!');
                }
                const randomIdx = Math.floor(Math.random() * QUIZ_BANK.length);
                const d = QUIZ_BANK[randomIdx];
                setQuizData({
                    round1: d.round1 || [],
                    round2: d.round2 || [],
                    round3: d.round3 || []
                });
                setTotalScore(0);
                setStatus('round1');
            } catch (e: any) {
                console.error('Generator error:', e.message);
                alert(e.message || 'Error details viewable in console.');
                setStatus('menu');
            }
        }, 600); // Short simulated loading time
    };

    if (!mounted) {
        return <div className="min-h-screen pt-14 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
    }

    return (
        <div className="min-h-screen pt-14 pb-20 relative">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:64px_64px] pointer-events-none" />
            <div className="relative z-10 px-4 md:px-8 max-w-4xl mx-auto py-12">
                <div className="text-center mb-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-amber-400">
                            {lang === 'vi' ? 'Hành Trình Khám Phá' : 'Discovery Journey'}
                        </h1>
                        <h2 className="text-xl md:text-2xl font-medium text-muted-foreground flex items-center justify-center">
                            <MapPin className="w-5 h-5 mr-2 text-amber-500" />
                            {lang === 'vi' ? 'Di Sản Văn Hóa Việt Nam' : 'Vietnamese Cultural Heritage'}
                        </h2>
                    </motion.div>
                </div>
                
                <div className="flex justify-center mb-6 z-20 relative">
                    <div className="bg-background/50 backdrop-blur-md p-1.5 rounded-2xl border border-border/50 inline-flex shadow-lg mb-2 flex-wrap justify-center">
                        <button 
                            onClick={() => setActiveTab('ai')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'ai' ? 'bg-primary text-primary-foreground shadow-md scale-100' : 'text-muted-foreground hover:bg-foreground/5 scale-95'}`}
                        >
                            <Brain className="w-5 h-5" />
                            {lang === 'vi' ? 'Thử Thách Kiến Thức' : 'Knowledge Challenge'}
                        </button>
                        <button 
                            onClick={() => setActiveTab('notebook')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'notebook' ? 'bg-amber-600 text-white shadow-md shadow-amber-900/20 scale-100' : 'text-muted-foreground hover:bg-foreground/5 scale-95'}`}
                        >
                            <BookOpen className="w-5 h-5" />
                            {lang === 'vi' ? 'Sổ Tay Lưu Niệm' : 'Souvenir Notebook'}
                        </button>
                    </div>
                </div>

                <div className="mt-4 relative">
                    <AnimatePresence mode="wait">
                        {activeTab === 'ai' && status === 'menu' && (
                            <motion.div key="menu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <Card className="bg-card/50 backdrop-blur-md border-border/50 shadow-2xl p-6 md:p-10 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-teal-500" />
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Brain className="w-5 h-5 text-primary" />
                                        </div>
                                        <h3 className="font-bold text-2xl text-foreground">{lang === 'vi' ? 'Thử Thách Kiến Thức' : 'Knowledge Challenge'}</h3>
                                    </div>
                                    <div className="bg-accent/30 p-5 rounded-xml border border-accent mb-8">
                                        <p className="mb-3 font-medium text-foreground">💡 <strong>Điều lệ 3 Vòng (Sinh ngẫu nhiên):</strong></p>
                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                            <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-teal-500 mr-2" /> Vòng 1: Cặp Dữ Kiện Định Mệnh (60s)</li>
                                            <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-500 mr-2" /> Vòng 2: Phán Đoán Chân Lý Đoản (10s)</li>
                                            <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-cyan-500 mr-2" /> Vòng 3: Truy Vấn Sâu Về Bản Chất (15s)</li>
                                        </ul>
                                    </div>

                                    <div className="space-y-5">
                                        <Button onClick={handleGenerate} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-6 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 text-lg">
                                            <Zap className="mr-2 w-6 h-6" />
                                            {lang === 'vi' ? 'Bắt Đầu Thử Thách Khám Phá' : 'Start Discovery Challenge'}
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {activeTab === 'ai' && status === 'loading' && (
                            <motion.div key="loading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-card/50 backdrop-blur rounded-[20px] p-12 border border-border/50 shadow-2xl">
                                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                                    {lang === 'vi' ? 'Đang trích xuất Bộ Câu Hỏi Ngẫu Nhiên...' : 'Extracting Random Question Set...'}
                                </h3>
                                <p className="text-muted-foreground text-sm">{lang === 'vi' ? 'Rất nhanh thôi...' : 'Almost ready...'}</p>
                            </motion.div>
                        )}

                        {activeTab === 'ai' && status === 'round1' && quizData?.round1 && (
                            <motion.div key="r1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <Round1Matching data={quizData.round1} onComplete={s => { setTotalScore(curr => curr + s); setStatus('round2'); }} />
                            </motion.div>
                        )}

                        {activeTab === 'ai' && status === 'round2' && quizData?.round2 && (
                            <motion.div key="r2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <Round2TF data={quizData.round2} onComplete={s => { setTotalScore(curr => curr + s); setStatus('round3'); }} />
                            </motion.div>
                        )}

                        {activeTab === 'ai' && status === 'round3' && quizData?.round3 && (
                            <motion.div key="r3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <Round3MCQ data={quizData.round3} onComplete={s => { setTotalScore(curr => curr + s); setStatus('end'); }} />
                            </motion.div>
                        )}

                        {activeTab === 'ai' && status === 'end' && (
                            <motion.div key="end" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card/50 backdrop-blur rounded-3xl p-8 md:p-12 shadow-2xl border border-border/50 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-amber-500 to-teal-500" />
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 mt-4">
                                    <Target className="w-10 h-10 text-primary" />
                                </div>
                                <h1 className="text-3xl font-bold mb-3 text-foreground tracking-tight">
                                    {lang === 'vi' ? 'CHỨNG NHẬN KHÁM PHÁ!' : 'CERTIFICATE OF DISCOVERY!'}
                                </h1>
                                <p className="text-muted-foreground mb-6 text-sm">{lang === 'vi' ? 'Bạn đã xuất sắc vượt qua cả 3 bài thử thách.' : 'You successfully completed all 3 trials.'}</p>
                                
                                <div className="inline-block bg-accent/30 border border-accent px-8 py-5 rounded-2xl mb-10 text-center">
                                    <span className="block text-sm text-muted-foreground uppercase tracking-widest mb-1">{lang === 'vi' ? 'Tổng Điểm Tích Lũy' : 'Total Accumulated Score'}</span>
                                    <span className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-teal-400">{totalScore}</span>
                                </div>
                                
                                <Button onClick={() => setStatus('menu')} variant="outline" className="w-full md:w-auto px-10 py-6 text-base font-medium transition-all hover:bg-accent hover:text-accent-foreground border-border text-foreground rounded-xl">
                                    <RefreshCw className="mr-2 w-4 h-4" /> {lang === 'vi' ? 'Chinh Phục Thử Thách Lần Nữa' : 'Start New Challenge'}
                                </Button>
                            </motion.div>
                        )}

                        {activeTab === 'notebook' && (
                            <motion.div key="notebook" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-6">
                                <InteractiveNotebook />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default function LearningPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen pt-14 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <LearningPageContent />
        </Suspense>
    );
}
