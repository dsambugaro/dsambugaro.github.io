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
  joy: string;
};

const en: Copy = {
  htmlLang: 'en',
  ogLocale: 'en_US',
  meta: {
    title: 'Danilo Sambugaro, Senior Software Engineer',
    description:
      'Backend developer building services and APIs since 2019, from a product need to a system running in production, working alongside AI agents.',
  },
  langSwitch: { label: 'Ler em português', short: 'PT' },
  theme: { toDark: 'Switch to dark theme', toLight: 'Switch to light theme' },
  role: 'Senior Software Engineer',
  country: 'Brazil',
  intro:
    'I’m a backend developer building services and APIs since 2019. I take a product need, shape the backend behind it and keep it running in production, working alongside AI agents with clear specs and checks at every step.',
  linksLabel: 'Find me online',
  newTab: 'opens in a new tab',
  joy: 'Party mode',
};

const pt: Copy = {
  htmlLang: 'pt-BR',
  ogLocale: 'pt_BR',
  meta: {
    title: 'Danilo Sambugaro, Senior Software Engineer',
    description:
      'Desenvolvedor backend que constrói serviços e APIs desde 2019, da necessidade de produto ao sistema rodando em produção, junto com agentes de IA.',
  },
  langSwitch: { label: 'Read in English', short: 'EN' },
  theme: { toDark: 'Mudar para o tema escuro', toLight: 'Mudar para o tema claro' },
  role: 'Senior Software Engineer',
  country: 'Brasil',
  intro:
    'Sou desenvolvedor backend e construo serviços e APIs desde 2019. Pego uma necessidade de produto, desenho o backend por trás dela e mantenho tudo rodando em produção, trabalhando junto com agentes de IA, com specs claras e verificação em cada etapa.',
  linksLabel: 'Onde me encontrar',
  newTab: 'abre em nova aba',
  joy: 'Modo festa',
};

export const copy: Record<Lang, Copy> = { en, pt };
