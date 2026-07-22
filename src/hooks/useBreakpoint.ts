"use client";

import { useEffect, useState } from "react";
import { BREAKPOINTS, type Breakpoint } from "@/constants/breakpoint";

export function useBreakpoint() {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const lt = (bp: Breakpoint) => width !== null && width < BREAKPOINTS[bp];
  const lte = (bp: Breakpoint) => width !== null && width <= BREAKPOINTS[bp];
  const gt = (bp: Breakpoint) => width !== null && width > BREAKPOINTS[bp];
  const gte = (bp: Breakpoint) => width !== null && width >= BREAKPOINTS[bp];

  return { width, lt, lte, gt, gte };
}
