"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface FadeInUpProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeInUp({
  children,
  delay = 0,
  duration = 0.6,
  className = "",
}: FadeInUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      className={className}>
      {children}
    </motion.div>
  );
}

interface FadeInUpScrollProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  margin?:
    | `${number}px`
    | `${number}%`
    | `${number}px ${number}px`
    | `${number}px ${number}px ${number}px ${number}px`;
  className?: string;
}

export function FadeInUpScroll({
  children,
  delay = 0,
  duration = 0.5,
  margin = "-100px",
  className = "",
}: FadeInUpScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration, delay }}
      className={className}>
      {children}
    </motion.div>
  );
}

interface ScaleInScrollProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  margin?:
    | `${number}px`
    | `${number}%`
    | `${number}px ${number}px`
    | `${number}px ${number}px ${number}px ${number}px`;
  className?: string;
}

export function ScaleInScroll({
  children,
  delay = 0,
  duration = 0.5,
  margin = "-100px",
  className = "",
}: ScaleInScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ duration, delay }}
      className={className}>
      {children}
    </motion.div>
  );
}

interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay }}
      className={className}>
      {children}
    </motion.div>
  );
}

interface HoverLiftProps {
  children: React.ReactNode;
  liftAmount?: number;
  className?: string;
}

export function HoverLift({
  children,
  liftAmount = -8,
  className = "",
}: HoverLiftProps) {
  return (
    <motion.div
      whileHover={{ y: liftAmount, transition: { duration: 0.2 } }}
      className={className}>
      {children}
    </motion.div>
  );
}

interface HoverScaleProps {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}

export function HoverScale({
  children,
  scale = 1.05,
  className = "",
}: HoverScaleProps) {
  return (
    <motion.div whileHover={{ scale }} className={className}>
      {children}
    </motion.div>
  );
}

interface HoverScaleRotateProps {
  children: React.ReactNode;
  scale?: number;
  rotate?: number;
  className?: string;
}

export function HoverScaleRotate({
  children,
  scale = 1.1,
  rotate = 5,
  className = "",
}: HoverScaleRotateProps) {
  return (
    <motion.div
      whileHover={{ scale, rotate }}
      transition={{ type: "spring", stiffness: 300 }}
      className={className}>
      {children}
    </motion.div>
  );
}

interface ButtonHoverProps {
  children: React.ReactNode;
  className?: string;
}

export function ButtonHover({ children, className = "" }: ButtonHoverProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}>
      {children}
    </motion.div>
  );
}
