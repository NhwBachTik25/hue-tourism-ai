'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Zap, Target, MapPin, RefreshCw, BookOpen, Star } from 'lucide-react';
import { useLanguage } from '@/components/providers/language-provider';
import InteractiveNotebook from '@/components/learning/InteractiveNotebook';
import { hoaRound1Pairs, hoaRound2Data, hoaRound3Data, ameQuizData, type Round1Pair, type Round2TF, type Round3MCQ, type AmeRoundQuestion } from '@/data/fixed-games';

// Utils
function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
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
                        {lang === 'vi' ? 'VÒNG 1: GIẢI MÃ NGÔI ĐÌNH CỔ' : 'ROUND 1: ANCIENT TEMPLE DECODING'}
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
                        {lang === 'vi' ? 'VÒNG 2: NHÀ KHẢO CỔ TÀI BA' : 'ROUND 2: MASTER ARCHAEOLOGIST'}
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
// ROUND 3: MULTIPLE CHOICE (Trắc nghiệm Game 1)
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
        if (idx === data[currentQ].answer) setScore(s => s + 10);
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
                        {lang === 'vi' ? 'VÒNG 3: KHÁM PHÁ BIỂN PHÚ DIÊN' : 'ROUND 3: PHU DIEN BEACH DISCOVERY'}
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
                    {q.options.map((opt, idx) => {
                        const isCorrect = idx === q.answer;
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
                                {opt}
                            </button>
                        )
                    })}
                </div>

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
// FULL MCQ GAME (Game 2 - Ame)
// -----------------------------------------------------
function FullMCQGame({ data, onComplete }: { data: AmeRoundQuestion[], onComplete: (score: number) => void }) {
    const { language } = useLanguage();
    const lang = language as 'vi' | 'en';
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [answered, setAnswered] = useState(false);
    const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

    useEffect(() => {
        setTimeLeft(10);
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
        if (idx === data[currentQ].answer) setScore(s => s + 10);
    };

    const nextQuestion = () => {
        if (currentQ < data.length - 1) setCurrentQ(c => c + 1);
        else onComplete(score);
    };

    if (currentQ >= data.length) return null;
    const q = data[currentQ];

    // Dynamic Theme based on question index (1-8: Cổ điển, 9-16: Khảo cổ, 17-24: Biển xanh)
    let themeClass = "bg-gradient-to-br from-[#0a1a1a] to-[#0d2525] border-teal-700/50 shadow-2xl";
    let badgeClass = "bg-teal-900 border-teal-700 text-teal-300";
    let timerBgClass = timeLeft > 5 ? 'bg-teal-500' : timeLeft > 2 ? 'bg-amber-500' : 'bg-red-500';
    let optMutedClass = "bg-[#1a202c]/60 text-teal-100/80 border-teal-900/50 hover:bg-[#2d3748]/60 hover:border-teal-700/50";

    if (currentQ >= 8 && currentQ < 16) {
        themeClass = "bg-gradient-to-br from-[#2a1810] to-[#1a1205] border-amber-700/50 shadow-2xl";
        badgeClass = "bg-amber-900 border-amber-700 text-amber-300";
        timerBgClass = timeLeft > 5 ? 'bg-amber-500' : timeLeft > 2 ? 'bg-orange-500' : 'bg-red-500';
        optMutedClass = "bg-[#2a1810]/60 text-amber-100/80 border-amber-900/50 hover:bg-[#3d2417]/60 hover:border-amber-700/50";
    } else if (currentQ >= 16) {
        themeClass = "bg-[#09090b] border-zinc-800 shadow-2xl";
        badgeClass = "bg-zinc-900 border-zinc-700 text-zinc-300";
        timerBgClass = timeLeft > 5 ? 'bg-cyan-500' : timeLeft > 2 ? 'bg-amber-500' : 'bg-red-500';
        optMutedClass = "bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700 hover:text-white";
    }

    const timerPercent = (timeLeft / 10) * 100;

    return (
        <Card className={`p-4 md:p-6 relative overflow-hidden text-foreground transition-all duration-500 ${themeClass}`}>
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
            <div className="relative z-10">
                <div className="text-center mb-4">
                    <Badge variant="outline" className={`px-4 py-1 ${badgeClass}`}>
                        {q.round}
                    </Badge>
                </div>
                
                <div className="mb-6 mt-2">
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden shadow-inner">
                        <motion.div className={`h-full ${timerBgClass}`}
                            animate={{ width: `${timerPercent}%` }} transition={{ duration: 0.3 }} />
                    </div>
                    <p className="text-center text-sm font-bold mt-1 text-muted-foreground">{timeLeft}s</p>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg md:text-xl font-medium text-center text-white leading-relaxed min-h-[60px]">
                        {q.q}
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {q.options.map((opt, idx) => {
                        const isCorrect = idx === q.answer;
                        const isSelected = selectedOpt === idx;
                        return (
                            <button key={idx} disabled={answered} onClick={() => handleAnswer(idx)}
                                className={`p-4 rounded-xl font-medium text-left transition-all border
                                    ${!answered 
                                        ? `${optMutedClass} cursor-pointer`
                                        : isCorrect 
                                            ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] z-10'
                                            : isSelected 
                                                ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 animate-shake'
                                                : 'bg-black/30 border-transparent text-gray-500 opacity-50'}
                                `}>
                                {opt}
                            </button>
                        )
                    })}
                </div>

                {answered && (
                    <div className="text-center mt-2">
                        <Button onClick={nextQuestion} variant="outline" className="px-8 border-zinc-700 hover:bg-zinc-800 hover:text-white transition-all bg-black/20">
                            {currentQ < data.length - 1 ? (lang === 'vi' ? 'Tiếp Hiện Tại' : 'Next Question') : (lang === 'vi' ? 'Xem Kết Quả Chung Cuộc' : 'View Final Results')} <ArrowRight className="ml-2 w-4 h-4"/>
                        </Button>
                    </div>
                )}
                
                <div className="flex justify-between text-muted-foreground font-medium mt-6 border-t border-white/10 pt-4">
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
    const [activeTab, setActiveTab] = useState<'games' | 'notebook'>('games');
    
    // Status
    const [status, setStatus] = useState<'menu' | 'loading' | 'hoa_r1' | 'hoa_r2' | 'hoa_r3' | 'ame' | 'end'>('menu');
    const [totalScore, setTotalScore] = useState(0);
    const [maxScore, setMaxScore] = useState(0);

    useEffect(() => { setMounted(true); }, []);

    const startGame1 = () => {
        setStatus('loading');
        setTimeout(() => {
            setTotalScore(0);
            setMaxScore(240); // 8 cặp (80), 8 TF (80), 8 MCQ (80)
            setStatus('hoa_r1');
        }, 500);
    };

    const startGame2 = () => {
        setStatus('loading');
        setTimeout(() => {
            setTotalScore(0);
            setMaxScore(240); // 24 MCQ (240)
            setStatus('ame');
        }, 500);
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
                            {lang === 'vi' ? 'Xã Phú Vinh, Thành phố Huế' : 'Phu Vinh Commune, Hue City'}
                        </h2>
                    </motion.div>
                </div>
                
                <div className="flex justify-center mb-6 z-20 relative">
                    <div className="bg-background/50 backdrop-blur-md p-1.5 rounded-2xl border border-border/50 inline-flex shadow-lg mb-2 flex-wrap justify-center gap-2">
                        <button 
                            onClick={() => { setActiveTab('games'); setStatus('menu'); }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'games' ? 'bg-primary text-primary-foreground shadow-md scale-100' : 'text-muted-foreground hover:bg-foreground/5 scale-95'}`}
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
                        {activeTab === 'games' && status === 'menu' && (
                            <motion.div key="menu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <Card className="bg-card/50 backdrop-blur-md border-border/50 shadow-2xl p-6 md:p-10 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-teal-500" />
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Brain className="w-5 h-5 text-primary" />
                                        </div>
                                        <h3 className="font-bold text-2xl text-foreground">{lang === 'vi' ? 'Khám Phá Di Sản Quê Hương' : 'Discover Homeland Heritage'}</h3>
                                    </div>
                                    <div className="bg-accent/30 p-5 rounded-xl border border-accent mb-8 leading-relaxed text-muted-foreground">
                                        <p className="mb-2"><strong>Giới thiệu:</strong> Chào mừng các em học sinh trường THCS An Bằng - Vinh An đến với chuyến phiêu lưu kỳ thú! Cùng khám phá vẻ đẹp lịch sử, văn hóa và thiên nhiên quê hương mình nhé.</p>
                                        <p>Bạn có thể chọn 1 trong 2 chế độ chơi dưới đây:</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <Button onClick={startGame1} className="w-full h-auto flex flex-col items-center justify-center bg-teal-900/40 hover:bg-teal-800/60 border border-teal-700/50 text-teal-50 font-medium py-8 px-4 rounded-2xl transition-all shadow-lg text-center group">
                                            <Star className="mb-3 w-8 h-8 text-teal-400 group-hover:scale-110 transition-transform" />
                                            <span className="text-lg font-bold block mb-1">{lang === 'vi' ? 'Chế độ Đa Dạng' : 'Mixed Mode'}</span>
                                            <span className="text-sm text-teal-300/70 font-normal">3 Vòng: Ghép cặp, Đúng/Sai, Trắc Nghiệm</span>
                                        </Button>

                                        <Button onClick={startGame2} className="w-full h-auto flex flex-col items-center justify-center bg-amber-900/40 hover:bg-amber-800/60 border border-amber-700/50 text-amber-50 font-medium py-8 px-4 rounded-2xl transition-all shadow-lg text-center group">
                                            <Zap className="mb-3 w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform" />
                                            <span className="text-lg font-bold block mb-1">{lang === 'vi' ? 'Chế độ Trắc Nghiệm' : 'MCQ Mode'}</span>
                                            <span className="text-sm text-amber-300/70 font-normal">Thử thách 24 câu hỏi liên tục theo chủ đề</span>
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {activeTab === 'games' && status === 'loading' && (
                            <motion.div key="loading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-card/50 backdrop-blur rounded-[20px] p-12 border border-border/50 shadow-2xl">
                                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                                    {lang === 'vi' ? 'Đang chuẩn bị chặng đường...' : 'Preparing journey...'}
                                </h3>
                            </motion.div>
                        )}

                        {/* GAME 1 FLOW */}
                        {activeTab === 'games' && status === 'hoa_r1' && (
                            <motion.div key="hoa_r1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <Round1Matching data={hoaRound1Pairs} onComplete={s => { setTotalScore(curr => curr + s); setStatus('hoa_r2'); }} />
                            </motion.div>
                        )}

                        {activeTab === 'games' && status === 'hoa_r2' && (
                            <motion.div key="hoa_r2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <Round2TF data={hoaRound2Data} onComplete={s => { setTotalScore(curr => curr + s); setStatus('hoa_r3'); }} />
                            </motion.div>
                        )}

                        {activeTab === 'games' && status === 'hoa_r3' && (
                            <motion.div key="hoa_r3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <Round3MCQ data={hoaRound3Data} onComplete={s => { setTotalScore(curr => curr + s); setStatus('end'); }} />
                            </motion.div>
                        )}

                        {/* GAME 2 FLOW */}
                        {activeTab === 'games' && status === 'ame' && (
                            <motion.div key="ame" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <FullMCQGame data={ameQuizData} onComplete={s => { setTotalScore(curr => curr + s); setStatus('end'); }} />
                            </motion.div>
                        )}

                        {/* END SCREEN */}
                        {activeTab === 'games' && status === 'end' && (
                            <motion.div key="end" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card/50 backdrop-blur rounded-3xl p-8 md:p-12 shadow-2xl border border-border/50 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-amber-500 to-teal-500" />
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 mt-4">
                                    <Target className="w-10 h-10 text-primary" />
                                </div>
                                <h1 className="text-3xl font-bold mb-3 text-foreground tracking-tight">
                                    {lang === 'vi' ? '🎉 CHÚC MỪNG CÁC NHÀ THÁM HIỂM! 🎉' : '🎉 CONGRATULATIONS EXPLORERS! 🎉'}
                                </h1>
                                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
                                    {lang === 'vi' 
                                        ? 'Các em thân mến, qua 3 vòng chơi vừa rồi, chúng ta đã cùng nhau du hành qua những dấu ấn thời gian của quê hương xã Phú Vinh: từ vẻ đẹp tâm linh của đình làng Hà Thanh, nét bí ẩn của Tháp Chăm Phú Diên cho đến bức tranh thiên nhiên hiền hòa của biển. Mong rằng các em sẽ luôn bảo vệ và tự hào về di sản quê hương!' 
                                        : 'Through these rounds, we have traveled through time exploring Phu Vinh commune: from the spiritual beauty of Ha Thanh temple, the mystery of Phu Dien Cham Tower to the peaceful nature of the sea. Always protect and be proud of your homeland!'}
                                </p>
                                
                                <div className="inline-block bg-accent/30 border border-accent px-10 py-6 rounded-2xl mb-8 text-center">
                                    <span className="block text-sm text-muted-foreground uppercase tracking-widest mb-1">{lang === 'vi' ? 'Điểm Số Chung Cuộc' : 'Final Score'}</span>
                                    <span className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-teal-400">{totalScore}</span>
                                    <span className="text-xl font-bold text-muted-foreground">/{maxScore}</span>
                                </div>

                                {/* Giao lưu cuối giờ */}
                                <div className="text-left bg-black/20 border border-border/50 rounded-xl p-6 mb-8">
                                    <h3 className="font-bold text-lg mb-3 text-amber-400 flex items-center gap-2">
                                        <Star className="w-5 h-5" /> 
                                        {lang === 'vi' ? 'Giao lưu cuối giờ & Viết vào sổ tay:' : 'Final Reflection & Write in Notebook:'}
                                    </h3>
                                    <ol className="list-decimal pl-5 space-y-2 text-foreground/90 font-medium">
                                        <li className="text-rose-400">{lang === 'vi' ? 'Trong suốt chuyến hành trình vừa qua, em ấn tượng nhất với địa danh nào tại xã Phú Vinh? Vì sao?' : 'Which location impressed you the most? Why?'}</li>
                                        <li className="text-teal-400">{lang === 'vi' ? 'Em học được điều gì mới mẻ về lịch sử và cảnh đẹp quê hương mình sau trò chơi?' : 'What new things did you learn about your homeland?'}</li>
                                        <li className="text-blue-400">{lang === 'vi' ? 'Em dự định sẽ làm những việc gì cụ thể để góp phần giữ gìn di sản và cảnh quan quê hương luôn sạch đẹp?' : 'What actions will you take to protect the environment?'}</li>
                                    </ol>
                                    <div className="mt-4 pt-4 border-t border-white/10 text-center">
                                        <Button onClick={() => { setStatus('menu'); setActiveTab('notebook'); }} variant="secondary" className="bg-amber-600/20 hover:bg-amber-600/40 text-amber-100 border-amber-500/30">
                                            <BookOpen className="mr-2 w-4 h-4" /> {lang === 'vi' ? 'Ghi lại vào Sổ Tay' : 'Write in Notebook'}
                                        </Button>
                                    </div>
                                </div>
                                
                                <Button onClick={() => setStatus('menu')} variant="outline" className="w-full md:w-auto px-10 py-6 text-base font-medium transition-all hover:bg-accent hover:text-accent-foreground border-border text-foreground rounded-xl">
                                    <RefreshCw className="mr-2 w-4 h-4" /> {lang === 'vi' ? 'Chơi Lại Từ Đầu' : 'Play Again'}
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
