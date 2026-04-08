import { RouteTemplateMotion } from "./components/site-motion";

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteTemplateMotion>{children}</RouteTemplateMotion>;
}
