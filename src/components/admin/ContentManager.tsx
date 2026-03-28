'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Search, Plus, Edit3, Trash2, Eye, ExternalLink,
    Filter, ChevronDown, MoreVertical, MapPin, BookOpen,
    Utensils, Landmark, Calendar, GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Content types that can be managed
type ContentType = 'page' | 'destination' | 'article' | 'lesson' | 'story';

interface ContentItem {
    id: string;
    title: string;
    type: ContentType;
    slug: string;
    description: string;
    status: 'published' | 'draft';
    updatedAt: string;
    category?: string;
}

const contentTypeConfig: Record<ContentType, { label: string; icon: React.ElementType; color: string }> = {
    page: { label: 'Trang', icon: FileText, color: 'text-blue-400' },
    destination: { label: 'Điểm đến', icon: MapPin, color: 'text-green-400' },
    article: { label: 'Bài viết', icon: BookOpen, color: 'text-purple-400' },
    lesson: { label: 'Bài học', icon: GraduationCap, color: 'text-amber-400' },
    story: { label: 'Câu chuyện', icon: BookOpen, color: 'text-pink-400' },
};

// Default content items based on existing pages
const defaultContent: ContentItem[] = [
    { id: 'home', title: 'Trang chủ', type: 'page', slug: '/', description: 'Trang chính của website', status: 'published', updatedAt: new Date().toISOString() },
    { id: 'heritage', title: 'Di sản văn hóa', type: 'page', slug: '/heritage', description: 'Giới thiệu di sản văn hóa Phú Vinh', status: 'published', updatedAt: new Date().toISOString() },
    { id: 'destinations', title: 'Điểm đến', type: 'page', slug: '/destinations', description: 'Danh sách các điểm đến du lịch', status: 'published', updatedAt: new Date().toISOString() },
    { id: 'food', title: 'Ẩm thực', type: 'page', slug: '/food', description: 'Món ăn đặc sản địa phương', status: 'published', updatedAt: new Date().toISOString() },
    { id: 'crafts', title: 'Nghề truyền thống', type: 'page', slug: '/crafts', description: 'Các nghề thủ công truyền thống', status: 'published', updatedAt: new Date().toISOString() },
    { id: 'festivals', title: 'Lễ hội', type: 'page', slug: '/festivals', description: 'Các lễ hội văn hóa địa phương', status: 'published', updatedAt: new Date().toISOString() },
    { id: 'stories', title: 'Câu chuyện', type: 'page', slug: '/stories', description: 'Kho tàng câu chuyện di sản', status: 'published', updatedAt: new Date().toISOString() },
    { id: 'learning', title: 'Góc học tập', type: 'page', slug: '/learning', description: 'Bài học và quiz về di sản', status: 'published', updatedAt: new Date().toISOString() },
    { id: 'explore-3d', title: 'Khám phá 3D', type: 'page', slug: '/explore-3d', description: 'Bản đồ 3D tương tác', status: 'published', updatedAt: new Date().toISOString() },
    { id: 'trip-planner', title: 'Lên lịch trình', type: 'page', slug: '/trip-planner', description: 'AI lập kế hoạch du lịch', status: 'published', updatedAt: new Date().toISOString() },
];

export function ContentManager() {
    const [content, setContent] = useState<ContentItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<ContentType | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        // Load content from localStorage or use defaults
        const stored = localStorage.getItem('admin-content-items');
        if (stored) {
            setContent(JSON.parse(stored));
        } else {
            setContent(defaultContent);
            localStorage.setItem('admin-content-items', JSON.stringify(defaultContent));
        }
    }, []);

    const filteredContent = content.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || item.type === filterType;
        return matchesSearch && matchesType;
    });

    const handleDelete = (id: string) => {
        if (confirm('Bạn có chắc muốn xóa mục này?')) {
            const updated = content.filter(c => c.id !== id);
            setContent(updated);
            localStorage.setItem('admin-content-items', JSON.stringify(updated));
        }
    };

    const handleToggleStatus = (id: string) => {
        const updated = content.map(c =>
            c.id === id
                ? { ...c, status: c.status === 'published' ? 'draft' as const : 'published' as const }
                : c
        );
        setContent(updated);
        localStorage.setItem('admin-content-items', JSON.stringify(updated));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        Quản lý nội dung
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Chỉnh sửa các trang và bài viết trên website
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm nội dung..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2"
                >
                    <Filter className="w-4 h-4" />
                    Lọc
                    <ChevronDown className={cn("w-4 h-4 transition-transform", showFilters && "rotate-180")} />
                </Button>
            </div>

            {/* Filter chips */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-2"
                    >
                        <Button
                            size="sm"
                            variant={filterType === 'all' ? 'default' : 'outline'}
                            onClick={() => setFilterType('all')}
                        >
                            Tất cả
                        </Button>
                        {Object.entries(contentTypeConfig).map(([type, config]) => (
                            <Button
                                key={type}
                                size="sm"
                                variant={filterType === type ? 'default' : 'outline'}
                                onClick={() => setFilterType(type as ContentType)}
                                className="gap-1"
                            >
                                <config.icon className={cn("w-3 h-3", config.color)} />
                                {config.label}
                            </Button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content List */}
            <div className="space-y-3">
                {filteredContent.length === 0 ? (
                    <Card className="bg-card/50">
                        <CardContent className="p-12 text-center text-muted-foreground">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Không tìm thấy nội dung nào</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredContent.map((item, idx) => {
                        const config = contentTypeConfig[item.type];
                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Card className="bg-card/50 hover:bg-card transition-colors">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div className={cn(
                                                "w-10 h-10 rounded-lg flex items-center justify-center",
                                                "bg-secondary/50"
                                            )}>
                                                <Icon className={cn("w-5 h-5", config.color)} />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-medium truncate">{item.title}</h3>
                                                    <Badge
                                                        variant={item.status === 'published' ? 'default' : 'secondary'}
                                                        className={cn(
                                                            "text-[10px]",
                                                            item.status === 'published' && "bg-green-500/20 text-green-400"
                                                        )}
                                                    >
                                                        {item.status === 'published' ? 'Công khai' : 'Nháp'}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {item.description}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {config.label} • {item.slug}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <Link href={`${item.slug}?edit=true`} target="_blank">
                                                    <Button size="sm" variant="outline" className="gap-1.5">
                                                        <Edit3 className="w-3 h-3" />
                                                        Sửa
                                                    </Button>
                                                </Link>
                                                <Link href={item.slug} target="_blank">
                                                    <Button size="sm" variant="ghost">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleToggleStatus(item.id)}
                                                    className="text-muted-foreground"
                                                >
                                                    {item.status === 'published' ? 'Ẩn' : 'Công khai'}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-sm text-muted-foreground">
                <span>{filteredContent.length} mục</span>
                <span>•</span>
                <span>{content.filter(c => c.status === 'published').length} đã công khai</span>
                <span>•</span>
                <span>{content.filter(c => c.status === 'draft').length} nháp</span>
            </div>
        </div>
    );
}
