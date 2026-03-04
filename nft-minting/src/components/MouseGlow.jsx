/* src/components/MouseGlow.jsx */
import React, { useEffect, useState, useRef } from "react";

/**
 * Advanced Mouse Glow Effect
 * Features:
 * - Velocity-based size adaptation
 * - Trail effect (multiple glows)
 * - Optimized with requestAnimationFrame
 * - GPU accelerated via CSS transforms
 */
export default function MouseGlow() {
    const [mousePositions, setMousePositions] = useState([]);
    const lastPosition = useRef({ x: 0, y: 0, time: Date.now() });
    const requestRef = useRef();

    useEffect(() => {
        const updateMousePosition = (e) => {
            const now = Date.now();
            const dt = (now - lastPosition.current.time) / 1000;

            // Calculate velocity (pixels per second)
            // Avoid division by zero
            const safeDt = dt > 0 ? dt : 0.016;
            const vx = (e.clientX - lastPosition.current.x) / safeDt;
            const vy = (e.clientY - lastPosition.current.y) / safeDt;

            lastPosition.current = { x: e.clientX, y: e.clientY, time: now };

            setMousePositions(prev => {
                const newPos = {
                    x: e.clientX,
                    y: e.clientY,
                    vx: Math.abs(vx),
                    vy: Math.abs(vy)
                };

                // Keep trail of 2 positions + current = 3 total
                // Newest is first
                return [newPos, ...prev.slice(0, 2)];
            });
        };

        window.addEventListener('mousemove', updateMousePosition);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    // Use a portal or fixed positioning to ensure it's always on top/bottom
    // z-index 0 to be behind interactive elements but visible on background
    return (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            {mousePositions.map((pos, index) => {
                // Calculate velocity magnitude
                const velocity = Math.sqrt((pos.vx || 0) ** 2 + (pos.vy || 0) ** 2);

                // Base size 200px, max 300px based on speed
                // Stronger glow = smaller size but higher opacity
                const size = Math.min(200 + velocity * 0.05, 300);

                // Opacity fades for trail items
                // Opacity higher for "stronger" glow
                // Index 0 = 0.08 (subtle luxury glow)
                const opacity = 0.08 / Math.pow(2, index);

                // Blur increases for trail items to soften them
                const blur = 60 + index * 30; // Reduced blur for sharpness

                return (
                    <div
                        key={index}
                        className="absolute rounded-full will-change-transform"
                        style={{
                            left: 0,
                            top: 0,
                            width: `${size}px`,
                            height: `${size}px`,
                            // Centering via transform
                            transform: `translate3d(${pos.x - size / 2}px, ${pos.y - size / 2}px, 0)`,
                            background: `radial-gradient(circle, 
                rgba(201, 168, 76, ${opacity}) 0%, 
                rgba(201, 168, 76, ${opacity * 0.5}) 40%, 
                rgba(201, 168, 76, ${opacity * 0.1}) 70%, 
                transparent 80%)`,
                            filter: `blur(${blur}px)`,
                            // Transition for smooth resizing, but position is instant
                            transition: 'width 0.2s ease-out, height 0.2s ease-out, opacity 0.2s',
                            mixBlendMode: 'screen'
                        }}
                    />
                );
            })}
        </div>
    );
}
