import { ProjectsClient } from "./ProjectsClient";

export const dynamic = "force-static";

export const metadata = {
  title: "Projects | Cat_yyy.Nexus()",
  description: "Showcase of my projects and experiments",
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
