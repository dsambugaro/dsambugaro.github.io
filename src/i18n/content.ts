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
    'Spec-driven development',
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
  // Paragraphs. The first one holds the {years} placeholder.
  intro: string[];
  tags: string[];
  // Small icon nodes in the graph, one per area of work.
  areas: Record<'database' | 'server' | 'ai' | 'events' | 'cluster' | 'chip' | 'api' | 'cloud', string>;
  linksLabel: string;
  newTab: string;
  portrait: string;
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
      'spec-driven development',
      'harness engineering',
      'Brazil',
    ],
  },
  langSwitch: { label: 'Ler em português', short: 'PT' },
  theme: { toDark: 'Switch to dark theme', toLight: 'Switch to light theme' },
  role: 'Senior Software Engineer',
  country: 'Brazil',
  intro: [
    'I build backend systems that have to keep working as they grow. For more than {years} years I’ve worked on distributed services, event-driven flows, APIs and services where performance matters.',
    'I like problems without an obvious answer: I start from the constraints, weigh the trade-offs, design the system and see it through to reliable software in production. I also build with AI coding agents, using spec-driven development and harness engineering to guide them with clear specs, the right context and automated checks.',
  ],
  tags: ['distributed systems', 'event-driven', 'AI agents', 'maker'],
  areas: {
    database: 'databases',
    server: 'backend',
    ai: 'AI agents',
    events: 'event-driven',
    cluster: 'distributed systems',
    chip: 'maker',
    api: 'APIs',
    cloud: 'cloud',
  },
  linksLabel: 'Find me online',
  newTab: 'opens in a new tab',
  portrait: 'Change the accent colour',
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
      'spec-driven development',
      'harness engineering',
      'Brasil',
    ],
  },
  langSwitch: { label: 'Read in English', short: 'EN' },
  theme: { toDark: 'Mudar para o tema escuro', toLight: 'Mudar para o tema claro' },
  role: 'Senior Software Engineer',
  country: 'Brasil',
  intro: [
    'Construo sistemas backend que precisam continuar funcionando enquanto crescem. Há mais de {years} anos trabalho com serviços distribuídos, fluxos orientados a eventos, APIs e serviços em que performance importa.',
    'Gosto de problemas sem resposta óbvia: começo pelas restrições, avalio os trade-offs, desenho o sistema e acompanho até ele virar software confiável em produção. Também desenvolvo com agentes de IA, usando spec-driven development e harness engineering para guiá-los com specs claras, o contexto certo e verificações automáticas.',
  ],
  tags: ['sistemas distribuídos', 'event-driven', 'agentes de IA', 'maker'],
  areas: {
    database: 'bancos de dados',
    server: 'backend',
    ai: 'agentes de IA',
    events: 'event-driven',
    cluster: 'sistemas distribuídos',
    chip: 'maker',
    api: 'APIs',
    cloud: 'cloud',
  },
  linksLabel: 'Onde me encontrar',
  newTab: 'abre em nova aba',
  portrait: 'Trocar a cor de destaque',
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
