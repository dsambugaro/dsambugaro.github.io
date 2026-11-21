// Site copy, EN + PT-BR. Every fact here comes from the LinkedIn export (Nov 2026),
// the 2021 CV, or the owner's own notes. Do not add roles, dates or metrics that
// are not confirmed. Open content gaps are marked with TODO(content).

export type Lang = 'en' | 'pt';

export const person = {
  name: 'Danilo Sambugaro',
  fullName: 'Danilo Sambugaro de Carlo',
  email: 'dan.sambugaro@gmail.com',
  github: 'https://github.com/dsambugaro',
  linkedin: 'https://www.linkedin.com/in/dsambugaro/',
  site: 'https://dsambugaro.github.io',
  doi: 'https://doi.org/10.5753/erbd.2019.8474',
};

export const cvPath: Record<Lang, string> = {
  en: '/cv/danilo-sambugaro-cv-en.pdf',
  pt: '/cv/danilo-sambugaro-cv-pt-br.pdf',
};

type Role = {
  title: string;
  period: string;
  notes?: string[];
};

type Job = {
  company: string;
  place?: string;
  roles: Role[];
};

type SkillGroup = { label: string; items: string[] };

export type Copy = {
  htmlLang: string;
  ogLocale: string;
  meta: { title: string; description: string };
  nav: { about: string; experience: string; skills: string; contact: string; skip: string };
  langSwitch: { label: string; target: string; short: string };
  theme: { toDark: string; toLight: string; dark: string; light: string };
  hero: {
    role: string;
    company: string;
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    location: string;
  };
  about: { title: string; paragraphs: string[] };
  experience: { title: string; jobs: Job[]; present: string };
  skills: { title: string; groups: SkillGroup[] };
  education: {
    title: string;
    items: { school: string; course: string; period: string }[];
  };
  publication: { title: string; cite: string; venue: string; link: string };
  languages: { title: string; items: { name: string; level: string }[] };
  contact: { title: string; text: string; email: string; cv: string };
  footer: { source: string };
  cv: { title: string; summary: string };
};

const en: Copy = {
  htmlLang: 'en',
  ogLocale: 'en_US',
  meta: {
    title: 'Danilo Sambugaro, Senior Software Engineer',
    description:
      'Senior Software Engineer at Tractian. Backend systems in Go and PostgreSQL, and the specs, harnesses and feedback loops that AI coding agents work inside.',
  },
  nav: {
    about: 'About',
    experience: 'Experience',
    skills: 'Skills',
    contact: 'Contact',
    skip: 'Skip to content',
  },
  langSwitch: { label: 'Ler em português', target: 'pt', short: 'PT' },
  theme: { toDark: 'Switch to dark theme', toLight: 'Switch to light theme', dark: 'Dark', light: 'Light' },
  hero: {
    role: 'Senior Software Engineer',
    company: 'Tractian',
    lead: 'I build backend systems in Go and PostgreSQL, and the specs, harnesses and feedback loops that AI coding agents work inside.',
    ctaPrimary: 'Email me',
    ctaSecondary: 'Download CV (PDF)',
    location: 'Campo Mourão, Paraná, Brazil',
  },
  about: {
    title: 'About',
    paragraphs: [
      'I joined Tractian in 2021 as a backend engineer, led a team as tech lead from 2022 to 2023, and have been a senior software engineer since. Most of my work is Go services on PostgreSQL, in a microservices architecture.',
      'I write software with AI agents every day. The engineering I care about is around them: specs precise enough to act on, harnesses that check what comes out, and loops that keep a change honest from first draft to merge.',
      'Before backend, I worked on IoT products with ESP32 and Raspberry Pi, and designed a few PCBs along the way. I studied electrotechnics before computer science, and I am still a Linux and open-source enthusiast. My first Hello World was in 2012.',
    ],
  },
  experience: {
    title: 'Experience',
    present: 'Present',
    jobs: [
      {
        company: 'Tractian',
        roles: [
          {
            title: 'Senior Software Engineer',
            period: 'Oct 2023 – Present',
            notes: [
              'Backend services in Go on PostgreSQL, in a microservices architecture.',
              'AI-agent-driven development: writing specs, building harnesses and designing the feedback loops agents run in.',
              // TODO(content): add 1–2 outcomes with real impact or numbers.
            ],
          },
          {
            title: 'Tech Lead',
            period: 'Feb 2022 – Oct 2023',
            // TODO(content): team size, scope and 1–2 outcomes from the tech lead period.
          },
          {
            title: 'Backend Engineer',
            period: 'Jul 2021 – Feb 2022',
            // TODO(content): what you built as backend engineer.
          },
        ],
      },
      {
        company: 'Produtec',
        place: 'Maringá, PR',
        roles: [
          {
            title: 'Software Developer',
            period: 'Mar 2021 – Jun 2021',
            // TODO(content): stack and scope at Produtec.
          },
        ],
      },
      {
        company: 'Relevant Solutions',
        place: 'Araruna, PR',
        roles: [
          {
            title: 'Software Developer',
            period: 'Apr 2019 – Feb 2021',
            notes: [
              'IoT products on ESP32 and Raspberry Pi, in C, Java and Python.',
              'Web products with React on the front end and Java on the back end.',
              'Designed printed circuit boards for some of the devices.',
            ],
          },
        ],
      },
    ],
  },
  skills: {
    title: 'Skills',
    groups: [
      { label: 'Backend', items: ['Go', 'Microservices', 'Java'] },
      { label: 'Data', items: ['PostgreSQL', 'SQL', 'Data replication'] },
      {
        label: 'AI-assisted engineering',
        items: ['Agentic development', 'Spec engineering', 'Harness engineering', 'Loop engineering'],
      },
      { label: 'Also worked with', items: ['Python', 'C', 'JavaScript', 'React', 'Shell'] },
      { label: 'Hardware', items: ['ESP32', 'Raspberry Pi', 'Arduino', 'PCB design'] },
      { label: 'Tools', items: ['Linux', 'Git'] },
    ],
  },
  education: {
    title: 'Education',
    items: [
      {
        school: 'Federal University of Technology – Paraná (UTFPR)',
        course: 'BSc in Computer Science',
        period: '2016 – 2026',
      },
      {
        school: 'SENAI Campo Mourão',
        course: 'Technical course in electrotechnics',
        period: '2012 – 2013',
      },
    ],
  },
  publication: {
    title: 'Publication',
    cite: 'An Exploratory Study of PostgreSQL Open Source Data Replication Tools',
    venue:
      'D. Carlo, D. Andrade, R. Liberato, A. Schwerz. Proceedings of the 15th Regional Database School (ERBD), Chapecó, 2019, pp. 11–20.',
    link: 'Read on SBC OpenLib (DOI)',
  },
  languages: {
    title: 'Languages',
    items: [
      { name: 'Portuguese', level: 'Native' },
      { name: 'English', level: 'TOEFL iBT, B1' },
    ],
  },
  contact: {
    title: 'Contact',
    text: 'Email is the fastest way to reach me.',
    email: 'Email',
    cv: 'CV (PDF)',
  },
  footer: { source: 'Source on GitHub' },
  cv: {
    title: 'Danilo Sambugaro, CV',
    summary:
      'Senior Software Engineer at Tractian. Backend systems in Go and PostgreSQL in a microservices architecture, built with AI coding agents: specs, harnesses and feedback loops.',
  },
};

const pt: Copy = {
  htmlLang: 'pt-BR',
  ogLocale: 'pt_BR',
  meta: {
    title: 'Danilo Sambugaro, Senior Software Engineer',
    description:
      'Senior Software Engineer na Tractian. Sistemas de backend em Go e PostgreSQL, e as specs, harnesses e loops de feedback em que agentes de IA trabalham.',
  },
  nav: {
    about: 'Sobre',
    experience: 'Experiência',
    skills: 'Habilidades',
    contact: 'Contato',
    skip: 'Pular para o conteúdo',
  },
  langSwitch: { label: 'Read in English', target: 'en', short: 'EN' },
  theme: { toDark: 'Mudar para o tema escuro', toLight: 'Mudar para o tema claro', dark: 'Escuro', light: 'Claro' },
  hero: {
    role: 'Senior Software Engineer',
    company: 'Tractian',
    lead: 'Construo sistemas de backend em Go e PostgreSQL, e as specs, harnesses e loops de feedback em que agentes de IA trabalham.',
    ctaPrimary: 'Enviar e-mail',
    ctaSecondary: 'Baixar CV (PDF)',
    location: 'Campo Mourão, Paraná, Brasil',
  },
  about: {
    title: 'Sobre',
    paragraphs: [
      'Entrei na Tractian em 2021 como backend engineer, liderei um time como tech lead de 2022 a 2023 e desde então sou senior software engineer. A maior parte do meu trabalho são serviços em Go sobre PostgreSQL, numa arquitetura de microsserviços.',
      'Escrevo software com agentes de IA todos os dias. A engenharia que me interessa está em volta deles: specs precisas o bastante para virar ação, harnesses que verificam o resultado e loops que mantêm a mudança correta do primeiro rascunho ao merge.',
      'Antes do backend, trabalhei com produtos de IoT em ESP32 e Raspberry Pi, e desenhei algumas placas de circuito no caminho. Fiz técnico em eletrotécnica antes da computação e continuo entusiasta de Linux e open source. Meu primeiro Hello World foi em 2012.',
    ],
  },
  experience: {
    title: 'Experiência',
    present: 'Atual',
    jobs: [
      {
        company: 'Tractian',
        roles: [
          {
            title: 'Senior Software Engineer',
            period: 'out 2023 – atual',
            notes: [
              'Serviços de backend em Go sobre PostgreSQL, numa arquitetura de microsserviços.',
              'Desenvolvimento guiado por agentes de IA: escrita de specs, construção de harnesses e desenho dos loops de feedback em que os agentes rodam.',
              // TODO(content): adicionar 1–2 resultados com impacto ou números reais.
            ],
          },
          {
            title: 'Tech Lead',
            period: 'fev 2022 – out 2023',
            // TODO(content): tamanho do time, escopo e 1–2 resultados do período como tech lead.
          },
          {
            title: 'Backend Engineer',
            period: 'jul 2021 – fev 2022',
            // TODO(content): o que foi construído como backend engineer.
          },
        ],
      },
      {
        company: 'Produtec',
        place: 'Maringá, PR',
        roles: [
          {
            title: 'Software Developer',
            period: 'mar 2021 – jun 2021',
            // TODO(content): stack e escopo na Produtec.
          },
        ],
      },
      {
        company: 'Relevant Solutions',
        place: 'Araruna, PR',
        roles: [
          {
            title: 'Software Developer',
            period: 'abr 2019 – fev 2021',
            notes: [
              'Produtos de IoT em ESP32 e Raspberry Pi, com C, Java e Python.',
              'Produtos web com React no front-end e Java no back-end.',
              'Desenho de placas de circuito impresso para alguns dos dispositivos.',
            ],
          },
        ],
      },
    ],
  },
  skills: {
    title: 'Habilidades',
    groups: [
      { label: 'Backend', items: ['Go', 'Microsserviços', 'Java'] },
      { label: 'Dados', items: ['PostgreSQL', 'SQL', 'Replicação de dados'] },
      {
        label: 'Engenharia com IA',
        items: ['Desenvolvimento com agentes', 'Spec engineering', 'Harness engineering', 'Loop engineering'],
      },
      { label: 'Também usei', items: ['Python', 'C', 'JavaScript', 'React', 'Shell'] },
      { label: 'Hardware', items: ['ESP32', 'Raspberry Pi', 'Arduino', 'Desenho de PCB'] },
      { label: 'Ferramentas', items: ['Linux', 'Git'] },
    ],
  },
  education: {
    title: 'Formação',
    items: [
      {
        school: 'Universidade Tecnológica Federal do Paraná (UTFPR)',
        course: 'Bacharelado em Ciência da Computação',
        period: '2016 – 2026',
      },
      {
        school: 'SENAI Campo Mourão',
        course: 'Técnico em Eletrotécnica',
        period: '2012 – 2013',
      },
    ],
  },
  publication: {
    title: 'Publicação',
    cite: 'An Exploratory Study of PostgreSQL Open Source Data Replication Tools',
    venue:
      'D. Carlo, D. Andrade, R. Liberato, A. Schwerz. Anais da 15ª Escola Regional de Banco de Dados (ERBD), Chapecó, 2019, pp. 11–20.',
    link: 'Ler na SBC OpenLib (DOI)',
  },
  languages: {
    title: 'Idiomas',
    items: [
      { name: 'Português', level: 'Nativo' },
      { name: 'Inglês', level: 'TOEFL iBT, B1' },
    ],
  },
  contact: {
    title: 'Contato',
    text: 'E-mail é o jeito mais rápido de falar comigo.',
    email: 'E-mail',
    cv: 'CV (PDF)',
  },
  footer: { source: 'Código no GitHub' },
  cv: {
    title: 'Danilo Sambugaro, CV',
    summary:
      'Senior Software Engineer na Tractian. Sistemas de backend em Go e PostgreSQL numa arquitetura de microsserviços, construídos com agentes de IA: specs, harnesses e loops de feedback.',
  },
};

export const copy: Record<Lang, Copy> = { en, pt };
