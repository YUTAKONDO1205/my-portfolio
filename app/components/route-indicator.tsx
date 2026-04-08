"use client";

import { useEffect, useMemo, useState } from "react";
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
    <div className="route-indicator" aria-live="polite">
      <span className="route-indicator-label">{label.section}</span>
      <strong key={pathname} className="route-indicator-value">
        {label.detail}
      </strong>
    </div>
  );
}
