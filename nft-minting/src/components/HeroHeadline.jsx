import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function HeroHeadline({ text1, text2 }) {
    const [s1Chars, setS1Chars] = useState(0);
    const [showDot, setShowDot] = useState(false);
    const [dotVisible, setDotVisible] = useState(true);
    const [s2Chars, setS2Chars] = useState(0);
    const [s2Started, setS2Started] = useState(false);

    const s1Trimmed = text1.trim();
    const s1Text = s1Trimmed.endsWith(".") ? s1Trimmed.slice(0, -1) : s1Trimmed;
    const s2 = text2.trim();

    useEffect(() => {
        let isMounted = true;

        // Initial delay
        setTimeout(() => {
            if (!isMounted) return;

            // 1. Type Sentence 1
            let i = 0;
            const s1Interval = setInterval(() => {
                i++;
                setS1Chars(i);
                if (i >= s1Text.length) {
                    clearInterval(s1Interval);

                    // 2. Show dot and blink it
                    setShowDot(true);
                    setTimeout(() => {
                        if (!isMounted) return;
                        setDotVisible(false);
                        setTimeout(() => {
                            if (!isMounted) return;
                            setDotVisible(true);

                            // 3. Pause 1 second
                            setTimeout(() => {
                                if (!isMounted) return;
                                setS2Started(true);

                                // 4. Type Sentence 2
                                let j = 0;
                                const s2Interval = setInterval(() => {
                                    j++;
                                    setS2Chars(j);
                                    if (j >= s2.length) clearInterval(s2Interval);
                                }, 60);
                            }, 1000);
                        }, 400);
                    }, 400);
                }
            }, 60);
        }, 800);

        return () => { isMounted = false; };
    }, [s1Text, s2]);

    return (
        <h1 className="text-[2.2rem] leading-[1.1] md:text-7xl lg:text-8xl text-center font-playfair font-semibold !text-white mb-8 tracking-tight drop-shadow-lg break-words w-full max-w-full px-4 relative z-[30]">
            <span className="inline md:hidden">
                {s1Text}. <span className="text-gold-500 italic font-medium">{s2}</span>
            </span>
            <span className="hidden md:inline">
                <span>
                    {s1Chars === 0 ? s1Text : s1Text.split("").map((char, index) => (
                        <span key={`s1-${index}`} style={{ opacity: index < s1Chars ? 1 : 0 }}>
                            {char}
                        </span>
                    ))}
                </span>

                <span style={{ opacity: showDot && dotVisible ? 1 : 0 }} className="transition-opacity duration-150">
                    .
                </span>

                <br className="md:hidden" />

                <span className="text-gold-500 italic font-medium md:ml-3 inline relative">
                    {s2Started && s2Chars === 0 ? s2 : s2.split("").map((char, index) => (
                        <span key={`s2-${index}`} style={{ opacity: index < s2Chars ? 1 : 0 }}>
                            {char}
                        </span>
                    ))}
                    {s2Started && s2Chars < s2.length && (
                        <span className="typewriter-cursor absolute" />
                    )}
                </span>
            </span>
        </h1>
    );
}
