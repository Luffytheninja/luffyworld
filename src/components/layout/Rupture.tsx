'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface RuptureProps {
    type: 'invert' | 'distort' | 'spatial';
    children: React.ReactNode;
}

export default function Rupture({ type, children }: RuptureProps) {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end start"]
    });

    const filterValue = useTransform(scrollYProgress, [0, 0.4, 0.5, 0.6, 1], ["blur(0px)", "blur(0px)", "blur(12px) brightness(1.2)", "blur(0px)", "blur(0px)"]);
    const skewValue = useTransform(scrollYProgress, [0, 0.4, 0.5, 0.6, 1], [0, 0, 15, 0, 0]);
    const invertValue = useTransform(scrollYProgress, [0, 0.4, 0.5, 0.6, 1], [0, 0, 1, 0, 0]);

    // Move useTransform outside getFilter
    const invertTransform = useTransform(invertValue, (v) => v > 0 ? `invert(${v})` : 'none');

    const combinedFilter = type === 'distort' ? filterValue : type === 'invert' ? invertTransform : 'none';

    return (
        <div ref={container} className="relative w-full py-40 overflow-hidden">
            <motion.div
                style={{
                    filter: combinedFilter,
                    skewX: type === 'distort' ? skewValue : 0,
                }}
                className="rupture-transition"
            >
                {children}
            </motion.div>

            {/* Visual Marker for the Rupture */}
            <motion.div
                style={{ scaleX: scrollYProgress }}
                className="absolute top-0 left-0 right-0 h-px bg-rupture origin-left opacity-20"
            />
        </div>
    );
}
