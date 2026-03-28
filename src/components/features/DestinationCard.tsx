'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star } from 'lucide-react';

interface DestinationCardProps {
    title: string;
    description: string;
    image: string;
    location: string;
    rating?: number;
    category?: string;
    href: string;
}

export function DestinationCard({
    title,
    description,
    image,
    location,
    rating,
    category,
    href,
}: DestinationCardProps) {
    return (
        <Link href={href}>
            <motion.div
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <Card className="overflow-hidden bg-card border-border/50 card-hover">
                    <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {category && (
                            <Badge className="absolute top-3 left-3 bg-primary/90 hover:bg-primary">
                                {category}
                            </Badge>
                        )}
                        {rating && (
                            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 rounded-full px-2 py-1">
                                <Star className="w-3 h-3 fill-accent text-accent" />
                                <span className="text-xs font-medium text-white">{rating}</span>
                            </div>
                        )}
                    </div>
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {description}
                        </p>
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span className="text-xs">{location}</span>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </Link>
    );
}
