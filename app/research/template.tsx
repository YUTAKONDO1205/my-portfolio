import { RouteTemplateMotion } from "../components/site-motion";

export default function ResearchTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteTemplateMotion detail>{children}</RouteTemplateMotion>;
}
