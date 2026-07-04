// components/AnimatedCard.tsx
import {Box} from "@mui/material";
import useInView from "../hooks/useInView";

function AnimatedCard({children, delay = 0}: { children: React.ReactNode; delay?: number }) {
    const {ref, isInView, shouldAnimate} = useInView();

    return (
        <Box
            ref={ref}
            sx={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0)" : "translateY(24px)",
                transition: shouldAnimate
                    ? `opacity 0.5s ease-out ${delay}s, transform 0.5s ease-out ${delay}s`
                    : "none",
            }}
        >
            {children}
        </Box>
    )
}

export default AnimatedCard;