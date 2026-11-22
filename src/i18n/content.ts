// Site copy, EN + PT-BR. Facts come from the LinkedIn export (Nov 2026) and the
// owner's own notes. Do not add roles, dates or metrics that are not confirmed.

export type Lang = 'en' | 'pt';

export const person = {
  name: 'Danilo Sambugaro',
  fullName: 'Danilo Sambugaro de Carlo',
  github: 'https://github.com/dsambugaro',
  linkedin: 'https://www.linkedin.com/in/dsambugaro/',
  site: 'https://dsambugaro.github.io',
  // Used in the JSON-LD Person (knowsAbout). Topics, not tools.
  knowsAbout: [
    'Software engineering',
    'Backend development',
    'API design',
    'Microservices',
    'Databases',
    'AI engineering',
    'Agentic software development',
    'Spec engineering',
    'Harness engineering',
  ],
};

export type Copy = {
  htmlLang: string;
  ogLocale: string;
  meta: { title: string; description: string; keywords: string[] };
  langSwitch: { label: string; short: string };
  theme: { toDark: string; toLight: string };
  role: string;
  country: string;
  intro: string;
  linksLabel: string;
  newTab: string;
  mood: string;
};

const en: Copy = {
  htmlLang: 'en',
  ogLocale: 'en_US',
  meta: {
    title: 'Danilo Sambugaro · Software Engineer',
    description:
      'Senior backend developer from Brazil, shipping services and APIs since 2019, with AI engineering: coding agents, specs, harnesses and feedback loops.',
    keywords: [
      'Danilo Sambugaro',
      'senior software engineer',
      'backend developer',
      'backend engineer',
      'software developer',
      'API development',
      'microservices',
      'AI engineering',
      'agentic development',
      'AI coding agents',
      'spec engineering',
      'harness engineering',
      'Brazil',
    ],
  },
  langSwitch: { label: 'Ler em português', short: 'PT' },
  theme: { toDark: 'Switch to dark theme', toLight: 'Switch to light theme' },
  role: 'Senior Software Engineer',
  country: 'Brazil',
  intro:
    'I’m a backend developer who has been shipping services and APIs for more than {years} years. I take a product need, shape the backend behind it and keep it running in production, working alongside AI agents with clear specs and checks at every step.',
  linksLabel: 'Find me online',
  newTab: 'opens in a new tab',
  mood: 'Gray mode',
};

const pt: Copy = {
  htmlLang: 'pt-BR',
  ogLocale: 'pt_BR',
  meta: {
    title: 'Danilo Sambugaro · Software Engineer',
    description:
      'Desenvolvedor backend sênior no Brasil, colocando serviços e APIs em produção desde 2019, com engenharia de IA: agentes, specs, harnesses e loops de feedback.',
    keywords: [
      'Danilo Sambugaro',
      'engenheiro de software sênior',
      'desenvolvedor backend',
      'engenheiro backend',
      'desenvolvedor de software',
      'desenvolvimento de APIs',
      'microsserviços',
      'engenharia de IA',
      'desenvolvimento com agentes de IA',
      'agentes de IA',
      'spec engineering',
      'harness engineering',
      'Brasil',
    ],
  },
  langSwitch: { label: 'Read in English', short: 'EN' },
  theme: { toDark: 'Mudar para o tema escuro', toLight: 'Mudar para o tema claro' },
  role: 'Senior Software Engineer',
  country: 'Brasil',
  intro:
    'Sou desenvolvedor backend e coloco serviços e APIs em produção há mais de {years} anos. Pego uma necessidade de produto, desenho o backend por trás dela e mantenho tudo rodando, trabalhando junto com agentes de IA, com specs claras e verificação em cada etapa.',
  linksLabel: 'Onde me encontrar',
  newTab: 'abre em nova aba',
  mood: 'Modo cinza',
};

export const copy: Record<Lang, Copy> = { en, pt };

// First job started in April 2019. The page shows "more than N years", so N is the
// number of full years since then. The page script repeats this in the browser, so the
// number stays right without a rebuild.
export const careerStart = { year: 2019, month: 3 }; // month is 0-based (3 = April)

export function fullYearsSince(now = new Date()): number {
  const years = now.getFullYear() - careerStart.year;
  return now.getMonth() < careerStart.month ? years - 1 : years;
}
