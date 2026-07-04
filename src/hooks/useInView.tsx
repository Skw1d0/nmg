// hooks/useInView.ts
import {useEffect, useRef, useState} from "react";

function useInView(options?: IntersectionObserverInit) {
    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(true);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // Direkt beim Mount prüfen: ist das Element schon sichtbar?
        const rect = element.getBoundingClientRect();
        const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (alreadyVisible) {
            setIsInView(true);
            setShouldAnimate(false); // keine Transition -> erscheint sofort
            return; // kein Observer nötig, Zustand ist schon final
        }

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                observer.disconnect();
            }
        }, {
            threshold: 0.15,
            ...options,
        });

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return {ref, isInView, shouldAnimate};
}

export default useInView;