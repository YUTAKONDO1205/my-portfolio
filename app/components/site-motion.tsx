"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

/* A route change is a plain cross-fade. No transform and no filter on the
   wrapper, so sticky and fixed descendants keep the viewport as their
   reference. */
export function RouteTemplateMotion({
  children,
  detail = false,
}: {
  children: ReactNode;
  detail?: boolean;
}) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      className={`route-template ${detail ? "route-template-detail" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
