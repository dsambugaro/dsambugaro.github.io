// Site copy, EN + PT-BR. Facts come from the LinkedIn export (Nov 2026) and the
// owner's own notes. Do not add roles, dates or metrics that are not confirmed.

export type Lang = 'en' | 'pt';

export const person = {
  name: 'Danilo Sambugaro',
  fullName: 'Danilo Sambugaro de Carlo',
  github: 'https://github.com/dsambugaro',
  linkedin: 'https://www.linkedin.com/in/dsambugaro/',
  site: 'https://dsambugaro.github.io',
};

export type Copy = {
  htmlLang: string;
  ogLocale: string;
  meta: { title: string; description: string };
  langSwitch: { label: string; short: string };
  theme: { toDark: string; toLight: string };
  role: string;
  country: string;
  intro: string;
  linksLabel: string;
  newTab: string;
};

const en: Copy = {
  htmlLang: 'en',
  ogLocale: 'en_US',
  meta: {
    title: 'Danilo Sambugaro, Senior Software Engineer',
    description:
      'Senior Software Engineer at Tractian. Backend systems in Go and PostgreSQL, and the specs, harnesses and feedback loops that AI coding agents work inside.',
  },
  langSwitch: { label: 'Ler em português', short: 'PT' },
  theme: { toDark: 'Switch to dark theme', toLight: 'Switch to light theme' },
  role: 'Senior Software Engineer',
  country: 'Brazil',
  intro:
    'Backend engineer at Tractian since 2021. I build systems in Go and PostgreSQL, and the specs, harnesses and feedback loops that AI coding agents work inside.',
  linksLabel: 'Find me online',
  newTab: 'opens in a new tab',
};

const pt: Copy = {
  htmlLang: 'pt-BR',
  ogLocale: 'pt_BR',
  meta: {
    title: 'Danilo Sambugaro, Senior Software Engineer',
    description:
      'Senior Software Engineer na Tractian. Sistemas de backend em Go e PostgreSQL, e as specs, harnesses e loops de feedback em que agentes de IA trabalham.',
  },
  langSwitch: { label: 'Read in English', short: 'EN' },
  theme: { toDark: 'Mudar para o tema escuro', toLight: 'Mudar para o tema claro' },
  role: 'Senior Software Engineer',
  country: 'Brasil',
  intro:
    'Engenheiro de backend na Tractian desde 2021. Construo sistemas em Go e PostgreSQL, e as specs, harnesses e loops de feedback em que agentes de IA trabalham.',
  linksLabel: 'Onde me encontrar',
  newTab: 'abre em nova aba',
};

export const copy: Record<Lang, Copy> = { en, pt };
