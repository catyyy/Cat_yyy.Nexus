import { promises as fs } from 'fs';
import path from 'path';

export interface ProjectCard {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  detailImage: string;
  technologies: string[];
  longDescription: string;
  githubLink: string | null;
}

export async function getProjects(): Promise<ProjectCard[]> {
  try {
    const filePath = path.join(process.cwd(), 'projects.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read projects data:', error);
    return [];
  }
}
