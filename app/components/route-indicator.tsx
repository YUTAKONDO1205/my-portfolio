"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { researchProjects } from "../portfolio-data";

function getRouteLabel(pathname: string) {
  if (pathname === "/") {
    return {
      section: "ホーム",
      detail: "ポートフォリオ概要",
    };
  }

  if (pathname === "/research") {
    return {
      section: "研究",
      detail: "研究インデックス",
    };
  }

  const matchedProject = researchProjects.find(
    (project) => pathname === `/research/${project.slug}`,
  );

  if (matchedProject) {
    return {
      section: "研究詳細",
      detail: matchedProject.title,
    };
  }

  return {
    section: "ポートフォリオ",
    detail: pathname,
  };
}

export function RouteIndicator() {
  const pathname = usePathname();
  const [isCompactViewport, setIsCompactViewport] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const updateViewport = () => {
      setIsCompactViewport(mediaQuery.matches);
    };

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
    };
  }, []);

  const label = useMemo(() => getRouteLabel(pathname), [pathname]);

  if (isCompactViewport) {
    return null;
  }

  return (
    <motion.div
      className="route-indicator"
      aria-live="polite"
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.52,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <span className="route-indicator-label">{label.section}</span>
      <AnimatePresence mode="wait">
        <motion.strong
          key={pathname}
          className="route-indicator-value"
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {label.detail}
        </motion.strong>
      </AnimatePresence>
    </motion.div>
  );
}
