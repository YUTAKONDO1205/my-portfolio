"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { researchProjects } from "../portfolio-data";

function getRouteLabel(pathname: string) {
  if (pathname === "/") {
    return {
      section: "Home",
      detail: "Portfolio Overview",
    };
  }

  if (pathname === "/research") {
    return {
      section: "Research",
      detail: "Project Index",
    };
  }

  const matchedProject = researchProjects.find(
    (project) => pathname === `/research/${project.slug}`,
  );

  if (matchedProject) {
    return {
      section: "Research Detail",
      detail: matchedProject.title,
    };
  }

  return {
    section: "Portfolio",
    detail: pathname,
  };
}

export function RouteIndicator() {
  const pathname = usePathname();

  const label = useMemo(() => getRouteLabel(pathname), [pathname]);

  return (
    <div className="route-indicator" aria-live="polite">
      <span className="route-indicator-label">{label.section}</span>
      <strong key={pathname} className="route-indicator-value">
        {label.detail}
      </strong>
    </div>
  );
}
