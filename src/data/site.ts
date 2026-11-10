export const site = {
  name: 'JULIO CESAR',
  email: 'Juliusggrdev@proton.me',
  github: 'https://github.com/Juliusggr',
  githubUser: 'Juliusggr',
  linkedin: '' as string,
  title: {
    es: 'Julio Cesar — Desarrollador Web y Software',
    en: 'Julio Cesar — Web & Software Developer',
  },
  description: {
    es: 'Desarrollador web y de software. Aplicaciones de extremo a extremo con TypeScript, React, Astro, Rust y Node.js.',
    en: 'Web and software developer. End-to-end applications with TypeScript, React, Astro, Rust, and Node.js.',
  },
} as const;

export type Lang = 'es' | 'en';

export type Project = {
  repo: string;
  title: string;
  href: string;
  featured: boolean;
  description: Record<Lang, string>;
  stack: Record<Lang, [string, string, string]>;
};

/**
 * Curated work. Only public, verifiable projects belong here.
 * Add a real entry and it joins the featured grid (two columns once there are two or more).
 */
export const projects: Project[] = [
  {
    repo: 'fablecraft',
    title: 'Fablecraft',
    href: 'https://github.com/Juliusggr/fablecraft',
    featured: true,
    description: {
      es: 'Un sandbox de vóxeles en el navegador, construido desde cero: sin librerías y sin assets externos.',
      en: 'A voxel sandbox in the browser, built from scratch: no libraries and no external assets.',
    },
    stack: {
      es: ['Navegador', 'Sin librerías', 'Sin assets'],
      en: ['Browser', 'No libraries', 'No assets'],
    },
  },
];

export const moreProjects: { name: string; href: string }[] = [];
