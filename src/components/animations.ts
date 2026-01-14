import { Variants } from "framer-motion";

// Stagger container cho từng section
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

// Fade-up cơ bản cho item
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 0.61, 0.36, 1],
    },
  },
};

// Reveal từ trái
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.8, 0.25, 1],
    },
  },
};

// Reveal từ phải
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.8, 0.25, 1],
    },
  },
};

// Shimmer (dùng chung cho thẻ highlight)
export const shimmerOverlay: Variants = {
  initial: { x: "-120%" },
  animate: {
    x: "120%",
    transition: {
      repeat: Infinity,
      duration: 2.2,
      ease: "linear",
    },
  },
};

// Floating nhẹ nhàng cho icon / background
export const floating: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-6, 4, -6],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Zoom-in subtle khi xuất hiện
export const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

