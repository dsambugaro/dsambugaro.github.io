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
      'Backend developer shipping production software since 2019. Go services on PostgreSQL, and the specs, harnesses and feedback loops that keep AI agents honest.',
  },
  langSwitch: { label: 'Ler em português', short: 'PT' },
  theme: { toDark: 'Switch to dark theme', toLight: 'Switch to light theme' },
  role: 'Senior Software Engineer',
  country: 'Brazil',
  intro:
    'I’m a backend developer shipping production software since 2019. Most days that means Go services on PostgreSQL, and the specs, harnesses and feedback loops that keep AI agents honest while they help me build them.',
  linksLabel: 'Find me online',
  newTab: 'opens in a new tab',
};

const pt: Copy = {
  htmlLang: 'pt-BR',
  ogLocale: 'pt_BR',
  meta: {
    title: 'Danilo Sambugaro, Senior Software Engineer',
    description:
      'Desenvolvedor backend com software em produção desde 2019. Serviços em Go sobre PostgreSQL, e as specs, harnesses e loops de feedback que mantêm agentes de IA no trilho.',
  },
  langSwitch: { label: 'Read in English', short: 'EN' },
  theme: { toDark: 'Mudar para o tema escuro', toLight: 'Mudar para o tema claro' },
  role: 'Senior Software Engineer',
  country: 'Brasil',
  intro:
    'Sou desenvolvedor backend e coloco software em produção desde 2019. No dia a dia, isso quer dizer serviços em Go sobre PostgreSQL, e as specs, harnesses e loops de feedback que mantêm agentes de IA no trilho enquanto me ajudam a construí-los.',
  linksLabel: 'Onde me encontrar',
  newTab: 'abre em nova aba',
};

export const copy: Record<Lang, Copy> = { en, pt };
