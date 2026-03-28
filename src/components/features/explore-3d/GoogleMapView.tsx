'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Location type matching the explore-3d locations
interface Location {
    id: string;
    name: { vi: string; en: string };
    description: { vi: string; en: string };
    position: { x: number; y: number; z: number };
    building: { width: number; height: number; depth: number; color: string };
    icon: string;
    href: string;
    category: { vi: string; en: string };
    coordinates?: { lat: number; lng: number };
    relatedQuizIds?: string[];
}

interface GoogleMapViewProps {
    locations: Location[];
    selectedLocationId: string | null;
    onLocationSelect: (location: Location) => void;
    language: 'vi' | 'en';
    className?: string;
}

// Map location IDs to real GPS coordinates (Phu Vinh, Hue area)
const locationCoordinates: Record<string, { lat: number; lng: number }> = {
    'thap-cham': { lat: 16.4892, lng: 107.6951 },
    'bien-vinh-thanh': { lat: 16.4850, lng: 107.7150 },
    'bien-phu-dien': { lat: 16.4950, lng: 107.7050 },
    'dam-tam-giang': { lat: 16.4700, lng: 107.6800 },
    'lang-an-bang': { lat: 16.4750, lng: 107.7200 },
    'dinh-ha-thanh': { lat: 16.4820, lng: 107.6900 },
    'nuoc-ot-vinh-xuan': { lat: 16.4800, lng: 107.7100 },
};

// Default center for Phu Vinh area
const defaultCenter = { lat: 16.4850, lng: 107.7000 };

declare global {
    interface Window {
        google?: typeof google;
        initGoogleMapsCallback?: () => void;
    }
}

export function GoogleMapView({
    locations,
    selectedLocationId,
    onLocationSelect,
    language,
    className = '',
}: GoogleMapViewProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

    // Load Google Maps script
    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            // Fallback to embed mode if no API key
            setError('no-api-key');
            return;
        }

        if (window.google?.maps) {
            setIsLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMapsCallback`;
        script.async = true;
        script.defer = true;

        window.initGoogleMapsCallback = () => {
            setIsLoaded(true);
        };

        script.onerror = () => {
            setError('failed-to-load');
        };

        document.head.appendChild(script);

        return () => {
            delete window.initGoogleMapsCallback;
        };
    }, []);

    // Initialize map
    useEffect(() => {
        if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

        const map = new google.maps.Map(mapRef.current, {
            center: defaultCenter,
            zoom: 13,
            mapTypeId: 'hybrid',
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }],
                },
            ],
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                position: google.maps.ControlPosition.TOP_RIGHT,
            },
            streetViewControl: false,
            fullscreenControl: true,
        });

        mapInstanceRef.current = map;
        infoWindowRef.current = new google.maps.InfoWindow();

        // Create markers for each location
        locations.forEach((location) => {
            const coords = locationCoordinates[location.id];
            if (!coords) return;

            const marker = new google.maps.Marker({
                position: coords,
                map,
                title: location.name[language],
                icon: {
                    url: `data:image/svg+xml,${encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                            <circle cx="20" cy="20" r="18" fill="${location.building.color}" stroke="white" stroke-width="3"/>
                            <text x="20" y="26" text-anchor="middle" font-size="16">${location.icon}</text>
                        </svg>
                    `)}`,
                    scaledSize: new google.maps.Size(40, 40),
                    anchor: new google.maps.Point(20, 20),
                },
                animation: google.maps.Animation.DROP,
            });

            marker.addListener('click', () => {
                onLocationSelect(location);

                // Show info window
                const content = `
                    <div style="padding: 8px; max-width: 200px;">
                        <h3 style="margin: 0 0 4px; font-weight: bold; font-size: 14px;">
                            ${location.icon} ${location.name[language]}
                        </h3>
                        <p style="margin: 0; font-size: 12px; color: #666;">
                            ${location.category[language]}
                        </p>
                    </div>
                `;
                infoWindowRef.current?.setContent(content);
                infoWindowRef.current?.open(map, marker);

                // Bounce animation
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(() => marker.setAnimation(null), 750);
            });

            markersRef.current.push(marker);
        });
    }, [isLoaded, locations, language, onLocationSelect]);

    // Highlight selected marker
    useEffect(() => {
        if (!selectedLocationId || !mapInstanceRef.current) return;

        const coords = locationCoordinates[selectedLocationId];
        if (coords) {
            mapInstanceRef.current.panTo(coords);
            mapInstanceRef.current.setZoom(15);

            // Find and animate the marker
            const markerIndex = locations.findIndex((l) => l.id === selectedLocationId);
            if (markerIndex >= 0 && markersRef.current[markerIndex]) {
                const marker = markersRef.current[markerIndex];
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(() => marker.setAnimation(null), 1500);
            }
        }
    }, [selectedLocationId, locations]);

    // Reset view function
    const resetView = useCallback(() => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo(defaultCenter);
            mapInstanceRef.current.setZoom(13);
        }
    }, []);

    // Open directions in Google Maps
    const openDirections = useCallback(() => {
        if (selectedLocationId) {
            const coords = locationCoordinates[selectedLocationId];
            if (coords) {
                window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`,
                    '_blank'
                );
            }
        }
    }, [selectedLocationId]);

    // Fallback embed mode when no API key
    if (error === 'no-api-key') {
        const center = selectedLocationId
            ? locationCoordinates[selectedLocationId] || defaultCenter
            : defaultCenter;

        return (
            <div className={`relative ${className}`}>
                <div className="absolute top-2 left-2 z-10">
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                        <MapPin className="w-3 h-3 mr-1" />
                        {language === 'vi' ? 'Chế độ xem đơn giản' : 'Simple View Mode'}
                    </Badge>
                </div>
                <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d${center.lng}!3d${center.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1s${language}!2svn!4v1`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-xl"
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex items-center justify-center bg-card/50 rounded-xl ${className}`}>
                <p className="text-muted-foreground">
                    {language === 'vi' ? 'Không thể tải bản đồ' : 'Failed to load map'}
                </p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className={`flex items-center justify-center bg-card/50 rounded-xl ${className}`}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-3"
                >
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                        {language === 'vi' ? 'Đang tải bản đồ...' : 'Loading map...'}
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            <div ref={mapRef} className="w-full h-full rounded-xl" />

            {/* Control buttons */}
            <div className="absolute bottom-4 left-4 flex gap-2">
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={resetView}
                    className="bg-background/90 backdrop-blur"
                >
                    <MapPin className="w-4 h-4 mr-1" />
                    {language === 'vi' ? 'Đặt lại' : 'Reset'}
                </Button>
                {selectedLocationId && (
                    <Button
                        size="sm"
                        onClick={openDirections}
                        className="bg-green-500 hover:bg-green-600"
                    >
                        <Navigation className="w-4 h-4 mr-1" />
                        {language === 'vi' ? 'Chỉ đường' : 'Directions'}
                    </Button>
                )}
            </div>
        </div>
    );
}
