'use client';

import { useRef } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { ProjectCard } from '@/lib/projects';

export default function ProjectInitializer({ projects }: { projects: ProjectCard[] }) {
  const initialized = useRef(false);
  if (!initialized.current) {
    useProjectStore.setState({ projects });
    initialized.current = true;
  }
  return null;
}
