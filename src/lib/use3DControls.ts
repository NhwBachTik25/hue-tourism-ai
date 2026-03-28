'use client';

import { useState, useCallback, useEffect, RefObject } from 'react';

interface ControlState {
    rotation: { x: number; y: number };
    zoom: number;
    isDragging: boolean;
}

interface Use3DControlsOptions {
    initialRotation?: { x: number; y: number };
    initialZoom?: number;
    rotationSpeed?: number;
    minZoom?: number;
    maxZoom?: number;
    minRotationX?: number;
    maxRotationX?: number;
    snapAngle?: number;
    enableKeyboard?: boolean;
    enableTouch?: boolean;
}

interface Use3DControlsReturn extends ControlState {
    handlers: {
        onMouseDown: (e: React.MouseEvent) => void;
        onMouseMove: (e: React.MouseEvent) => void;
        onMouseUp: () => void;
        onMouseLeave: () => void;
        onTouchStart: (e: React.TouchEvent) => void;
        onTouchMove: (e: React.TouchEvent) => void;
        onTouchEnd: () => void;
        onWheel: (e: React.WheelEvent) => void;
    };
    zoomIn: () => void;
    zoomOut: () => void;
    resetView: () => void;
    setRotation: (rotation: { x: number; y: number }) => void;
    setZoom: (zoom: number) => void;
}

export function use3DControls(
    containerRef: RefObject<HTMLElement | null>,
    options: Use3DControlsOptions = {}
): Use3DControlsReturn {
    const {
        initialRotation = { x: 55, y: 0 },
        initialZoom = 1,
        rotationSpeed = 0.15, // Reduced from 0.3 for smoother motion
        minZoom = 0.5,
        maxZoom = 1.5,
        minRotationX = 30,
        maxRotationX = 80,
        snapAngle = 45,
        enableKeyboard = true,
        enableTouch = true,
    } = options;

    const [rotation, setRotationState] = useState(initialRotation);
    const [zoom, setZoomState] = useState(initialZoom);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const [touchStartDistance, setTouchStartDistance] = useState(0);
    const [initialTouchZoom, setInitialTouchZoom] = useState(1);

    // Snap to angle helper
    const snapToAngle = useCallback((value: number) => {
        return Math.round(value / snapAngle) * snapAngle;
    }, [snapAngle]);

    // Clamp zoom
    const clampZoom = useCallback((z: number) => {
        return Math.max(minZoom, Math.min(maxZoom, z));
    }, [minZoom, maxZoom]);

    // Clamp rotation X
    const clampRotationX = useCallback((x: number) => {
        return Math.max(minRotationX, Math.min(maxRotationX, x));
    }, [minRotationX, maxRotationX]);

    // Mouse handlers
    const onMouseDown = useCallback((e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
    }, []);

    const onMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return;

        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        setRotationState(prev => {
            let newX = clampRotationX(prev.x - deltaY * rotationSpeed);
            let newY = prev.y + deltaX * rotationSpeed;

            // Snap to angle if shift is pressed
            if (isShiftPressed) {
                newY = snapToAngle(newY);
            }

            return { x: newX, y: newY };
        });

        setDragStart({ x: e.clientX, y: e.clientY });
    }, [isDragging, dragStart, rotationSpeed, clampRotationX, isShiftPressed, snapToAngle]);

    const onMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const onMouseLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Touch handlers for mobile
    const getTouchDistance = (touches: React.TouchList) => {
        if (touches.length < 2) return 0;
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        if (!enableTouch) return;

        if (e.touches.length === 1) {
            setIsDragging(true);
            setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        } else if (e.touches.length === 2) {
            // Pinch zoom start
            setTouchStartDistance(getTouchDistance(e.touches));
            setInitialTouchZoom(zoom);
        }
    }, [enableTouch, zoom]);

    const onTouchMove = useCallback((e: React.TouchEvent) => {
        if (!enableTouch) return;

        if (e.touches.length === 1 && isDragging) {
            const deltaX = e.touches[0].clientX - dragStart.x;
            const deltaY = e.touches[0].clientY - dragStart.y;

            setRotationState(prev => ({
                x: clampRotationX(prev.x - deltaY * rotationSpeed * 0.5), // Slower on touch
                y: prev.y + deltaX * rotationSpeed * 0.5,
            }));

            setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        } else if (e.touches.length === 2 && touchStartDistance > 0) {
            // Pinch zoom
            const currentDistance = getTouchDistance(e.touches);
            const scale = currentDistance / touchStartDistance;
            setZoomState(clampZoom(initialTouchZoom * scale));
        }
    }, [enableTouch, isDragging, dragStart, rotationSpeed, clampRotationX, touchStartDistance, initialTouchZoom, clampZoom]);

    const onTouchEnd = useCallback(() => {
        setIsDragging(false);
        setTouchStartDistance(0);
    }, []);

    // Wheel handler for zoom
    const onWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoomState(prev => clampZoom(prev + delta));
    }, [clampZoom]);

    // Keyboard handler
    useEffect(() => {
        if (!enableKeyboard) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Track shift for snap-to-angle
            if (e.key === 'Shift') {
                setIsShiftPressed(true);
            }

            // WASD / Arrow navigation
            const rotationStep = 15;
            const zoomStep = 0.1;

            switch (e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    setRotationState(prev => ({
                        ...prev,
                        x: clampRotationX(prev.x + rotationStep),
                    }));
                    break;
                case 's':
                case 'arrowdown':
                    setRotationState(prev => ({
                        ...prev,
                        x: clampRotationX(prev.x - rotationStep),
                    }));
                    break;
                case 'a':
                case 'arrowleft':
                    setRotationState(prev => ({
                        ...prev,
                        y: prev.y - rotationStep,
                    }));
                    break;
                case 'd':
                case 'arrowright':
                    setRotationState(prev => ({
                        ...prev,
                        y: prev.y + rotationStep,
                    }));
                    break;
                case '+':
                case '=':
                    setZoomState(prev => clampZoom(prev + zoomStep));
                    break;
                case '-':
                case '_':
                    setZoomState(prev => clampZoom(prev - zoomStep));
                    break;
                case 'r':
                    // Reset view
                    setRotationState(initialRotation);
                    setZoomState(initialZoom);
                    break;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Shift') {
                setIsShiftPressed(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [enableKeyboard, clampRotationX, clampZoom, initialRotation, initialZoom]);

    // Public methods
    const zoomIn = useCallback(() => {
        setZoomState(prev => clampZoom(prev + 0.1));
    }, [clampZoom]);

    const zoomOut = useCallback(() => {
        setZoomState(prev => clampZoom(prev - 0.1));
    }, [clampZoom]);

    const resetView = useCallback(() => {
        setRotationState(initialRotation);
        setZoomState(initialZoom);
    }, [initialRotation, initialZoom]);

    const setRotation = useCallback((newRotation: { x: number; y: number }) => {
        setRotationState({
            x: clampRotationX(newRotation.x),
            y: newRotation.y,
        });
    }, [clampRotationX]);

    const setZoom = useCallback((newZoom: number) => {
        setZoomState(clampZoom(newZoom));
    }, [clampZoom]);

    return {
        rotation,
        zoom,
        isDragging,
        handlers: {
            onMouseDown,
            onMouseMove,
            onMouseUp,
            onMouseLeave,
            onTouchStart,
            onTouchMove,
            onTouchEnd,
            onWheel,
        },
        zoomIn,
        zoomOut,
        resetView,
        setRotation,
        setZoom,
    };
}
