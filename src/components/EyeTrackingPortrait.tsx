import React, { useEffect, useRef } from 'react';

interface EyeTrackingPortraitProps {
    videoSrc: string;
    size?: number;
    maxDistance?: number;
    className?: string;
}

export function EyeTrackingPortrait({
    videoSrc,
    size = 300,
    maxDistance = 500,
    className = ''
}: EyeTrackingPortraitProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const X_STEPS = 10;
    const Y_STEPS = 10;
    const FPS = 60;

    useEffect(() => {
        const video = videoRef.current;
        const container = containerRef.current;

        if (!video || !container) return;

        let lastFrameTime = 0;
        let isNearVideo = false;

        const handlePointerMove = (e: PointerEvent) => {
            // Throttle updates to match FPS
            const now = performance.now();
            if (now - lastFrameTime < 1000 / FPS) return;
            lastFrameTime = now;

            // Wait for video to be ready
            if (video.readyState < 2) return;

            // Get video center position
            const rect = video.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate mouse direction from video center
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;

            // Calculate distance from center
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Only track when cursor is reasonably close (within 2x the maxDistance)
            if (distance > maxDistance * 2) {
                // Reset to center when too far
                if (isNearVideo) {
                    video.currentTime = (Y_STEPS * X_STEPS / 2) / FPS; // Center frame
                    isNearVideo = false;
                }
                return;
            }

            isNearVideo = true;

            // Normalize to -1 to 1 range
            const normalizedX = Math.max(-1, Math.min(1, deltaX / maxDistance));
            const normalizedY = Math.max(-1, Math.min(1, deltaY / maxDistance));

            // Map to video frame indices
            const xIndex = Math.round(((normalizedX + 1) / 2) * (X_STEPS - 1));
            const yIndex = Math.round(((normalizedY + 1) / 2) * (Y_STEPS - 1));

            // Calculate frame and seek video
            const frameIndex = yIndex * X_STEPS + xIndex;
            video.currentTime = frameIndex / FPS;
        };

        // Check if device is mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (!isMobile) {
            document.addEventListener('pointermove', handlePointerMove);
        }

        return () => {
            document.removeEventListener('pointermove', handlePointerMove);
        };
    }, [maxDistance]);

    return (
        <div
            ref={containerRef}
            className={`relative mx-auto ${className}`}
            style={{ width: size, height: size }}
        >
            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 via-purple-400 to-pink-400 opacity-60 blur-xl animate-pulse"></div>

            {/* Main container */}
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/30 shadow-2xl backdrop-blur-sm">
                <video
                    ref={videoRef}
                    src={videoSrc}
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                    style={{ objectFit: 'cover' }}
                />
            </div>

            {/* Subtle ring decoration */}
            <div className="absolute inset-0 rounded-full border-2 border-white/10 pointer-events-none"></div>
        </div>
    );
}

