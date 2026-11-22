# Prompt: recriação do site pessoal — dsambugaro.github.io

> Para o agente que vai executar: leia este arquivo inteiro antes de começar. Ele traz o objetivo, as restrições, o conteúdo conhecido, a ordem do trabalho e os critérios de aceite. Onde está escrito **perguntar ao usuário**, pare e pergunte; não invente.

---

## 1. Objetivo

Substituir o site atual (um build compilado de Create React App, sem código-fonte no repo) por um site pessoal novo, mantível, que apresente **Danilo Sambugaro (Danilo Sambugaro de Carlo)** como **Senior Software Engineer**.

Quem lê o site: recrutadores, tech leads e engenheiros avaliando uma contratação ou colaboração. Em menos de 10 segundos a pessoa precisa entender:
1. quem ele é e o nível dele (sênior);
2. em que tipo de problema ele é forte;
3. provas disso (experiência, projetos, artigo publicado);
4. como entrar em contato (e baixar o CV).

O site não pode ter "cara de template gerado por IA". Precisa ter uma direção visual própria, com acabamento de engenheiro sênior: rápido, acessível, sem excessos.

---

## 2. Restrições obrigatórias

### 2.1 GitHub Pages
- Repo: `git@github.com:dsambugaro/dsambugaro.github.io.git`, branch `master`. É um *user site*, servido na raiz `https://dsambugaro.github.io/`.
- Hoje o Pages serve os arquivos da raiz da branch `master` direto, sem build.
- **Stack recomendada: Astro (saída estática) + deploy por GitHub Actions** (`withastro/action` + `actions/deploy-pages`).
  - Consulte a documentação atual do Astro e da action pelo Context7 antes de configurar. Não confie em versões que você lembra.
  - Fixe versões exatas no `package.json` e no workflow.
  - O usuário precisa mudar **Settings → Pages → Source** para **GitHub Actions**. Você não consegue fazer isso; avise no relatório final com o passo exato.
- Se o usuário preferir não ter build, a alternativa é HTML + CSS + JS puros na raiz. Pergunte só se houver dúvida; o padrão é Astro.
- Zero dependência de backend. Nada de serviço pago.
- Inclua `.nojekyll` no artefato publicado, para o Pages não processar arquivos com `_`.

### 2.2 Preservar o que já está publicado (não quebrar URLs)
Estas pastas são apps independentes que já estão no ar. Elas devem continuar acessíveis **nas mesmas URLs, byte a byte iguais**:

| Caminho | O que é | Ação |
|---|---|---|
| `apps/stitch/` | "Stitch – Ferramentas para Crochê" (commits recentes) | **Manter**: mover para `public/apps/stitch/` sem alterar o conteúdo |
| `apps/stitch/pixel-art-analizer/` | "Analisador de Pixel Art" | **Manter** (vem junto com o anterior) |
| `tractian/` | Build antigo de um desafio técnico ("Challenge client") | **Perguntar ao usuário** se mantém ou remove. Até ele responder, mantenha em `public/tractian/` |

- Confirme depois do build que `dist/apps/stitch/index.html`, `dist/apps/stitch/pixel-art-analizer/index.html` e (se mantido) `dist/tractian/index.html` existem e são idênticos aos originais (compare com `diff -r` ou checksum).
- Atenção: **`/tractian/` já está quebrado em produção hoje** (verificado). O `tractian/index.html` pede `/static/css/2.00bb4513.chunk.css`, `/static/js/main.c0b059d6.chunk.js` etc. **na raiz do domínio**, mas esses arquivos estão em `tractian/static/`, e o `static/` da raiz tem outros hashes. Ao perguntar ao usuário (seção 4.1), ofereça: (a) remover o app; (b) consertar trocando `"/static/` por `"/tractian/static/` no `index.html` e conferindo `manifest.json`/favicon, o que exige testar no preview. Não decida sozinho.

### 2.3 Remover o build antigo
Remova da raiz, **só depois que o site novo estiver funcionando localmente**: `index.html`, `static/`, `asset-manifest.json`, `manifest.json` antigo, `logo192.jpg`, `logo512.jpg` e o `favicon.ico` antigo.
- **Exceção:** os CVs em `static/media/cv_EN.c2d94961.pdf` e `static/media/cv_PT-BR.6ce4c9a1.pdf`. Copie-os para `public/cv/` antes de apagar (veja a seção 4.4).
- Atualize o `.gitignore` para Node/Astro (`node_modules/`, `dist/`, `.astro/`) e remova as entradas obsoletas de Jekyll/Sass.

### 2.4 Git
- Trabalhe numa branch nova (ex.: `redesign`). **Não faça push nem merge na `master` sem o usuário pedir.**
- Commits pequenos e descritivos (Conventional Commits, como o histórico já usa: `feat:`, `chore:`).

---

## 3. Skills disponíveis (use-as)

Estas skills estão instaladas em `~/.claude/skills/`. Siga o fluxo da seção 6. **Escolha UMA skill como dona da direção visual** e use as outras para refinar e revisar. Várias skills mandando na estética ao mesmo tempo geram resultado incoerente.

| Etapa | Skill | Uso |
|---|---|---|
| Direção visual (dona) | `web-design-engineer` | Escolher um dos estilos em `references/style-recipes/` (veja a seção 5) e construir a partir dele |
| Travar decisões | `tastemaker` | Opcional: registrar tokens e escolhas em `.tastemaker/style-lock.md` para manter consistência |
| Estrutura e texto | `landing-page-design` | Estrutura da página, hierarquia, SEO, regras de espaçamento e tipografia |
| Projetos | `case-study` | Estruturar cada projeto em destaque (contexto → problema → decisões → resultado) |
| Tipografia | `better-typography` | Escala tipográfica, line-height, wrapping, `font-feature-settings` |
| Cor | `better-colors` | Paleta, tokens semânticos, contraste em claro e escuro |
| Layout | `better-layout` | Grid, ordem de leitura, responsividade |
| Copy | `better-writing` | Textos curtos e diretos, sem clichê |
| Acabamento | `better-ui`, `emil-design-eng` | Raios, sombras, estados de hover/focus/press |
| Movimento | `animate`, `choreograph`, `animation-performance` | Pouca animação e com propósito (entrada do hero, transições sutis). Respeite `prefers-reduced-motion` |
| Mobile | `mobile-native` | 100dvh, tap highlight, safe areas, hover em touch |
| Gate anti-slop | `no-ai-design-slop` | Deixar ativo durante todo o trabalho de UI |
| Revisão final | `audit-ai-design-slop`, `better-accessibility`, `better-interface`, `/interface-review` | Auditoria antes de entregar |

Para dúvidas de API de bibliotecas e frameworks (Astro, etc.), use o Context7.

---

## 4. Conteúdo

### 4.1 Fontes e o problema de conteúdo desatualizado
- O site atual e os CVs em PDF são de **~2021** e dizem "Software Developer" / "estudante". **Estão desatualizados.** Hoje ele é **Senior Software Engineer**.
- O LinkedIn (`https://www.linkedin.com/in/dsambugaro/`) **bloqueia acesso automatizado** (HTTP 999). Não tente fazer scraping.
- **Antes de escrever qualquer copy, peça ao usuário** uma destas opções:
  1. o PDF do LinkedIn (Perfil → "Mais" → "Salvar como PDF"), salvo no repo em `content/linkedin.pdf` (e adicionado ao `.gitignore` se ele não quiser versionar); **ou**
  2. um texto colado com: cargo e empresa atuais, histórico de experiência (empresa, cargo, datas, 2–4 conquistas com impacto/números), stack principal, idiomas, localização e disponibilidade (remoto? aberto a propostas?).
- Pergunte também:
  - **2–4 projetos em destaque** (profissionais ou pessoais), com links quando existirem;
  - se tem **CV atualizado** (PDF EN e PT-BR) para substituir os de 2021;
  - foto: usar o avatar do GitHub (`https://avatars.githubusercontent.com/u/13372649`) ou uma nova? Se usar, baixe e sirva localmente; não faça hotlink;
  - quais redes manter (Instagram e Telegram ainda fazem sentido para o público profissional?);
  - o que fazer com `tractian/` (seção 2.2).
- **Nunca invente** cargos, datas, métricas, empresas ou depoimentos. Se faltar um dado, deixe um TODO visível no código e liste-o no relatório final.

### 4.2 O que já se sabe (do site atual e do CV de 2021)
- **Nome:** Danilo Sambugaro (nome completo: Danilo Sambugaro de Carlo)
- **Local:** Paraná, Brasil
- **E-mail:** dan.sambugaro@gmail.com (já é público no site atual)
- **Links:** GitHub `https://github.com/dsambugaro` · LinkedIn `https://www.linkedin.com/in/dsambugaro/` · Instagram `http://instagram.com/dsambugaro` · Telegram `https://t.me/dsambugaro`
- **Formação:** Bacharelado em Ciência da Computação, UTFPR – Campo Mourão (início em 2016). Pergunte o ano de conclusão.
- **Empresas citadas:** Tractian (empregador na época do site atual), Relevant Solutions (Software Developer, abr/2019 – fev/2021: React, Java, IoT com ESP32/Raspberry Pi em C/Java/Python, design de PCB).
- **Publicação:** D. Carlo, D. Andrade, R. Liberato, A. Schwerz. *"An Exploratory Study of PostgreSQL Open Source Data Replication Tools"*, Proceedings of the 15th Regional Database School (ERBD), Chapecó, 2019, pp. 11–20. DOI: https://doi.org/10.5753/erbd.2019.8474
- **Personalidade e interesses** (bom material para o "Sobre", reescrito em tom sênior): primeiro "Hello World" em ~2012; entusiasta de Linux e Open Source; lado maker (Raspberry Pi, Arduino, ESP32); "everyone always has something to learn and something to teach".
- **Projetos pessoais no próprio site:** Stitch – ferramentas para crochê e o analisador de pixel art (`/apps/stitch/`). Bom candidato a projeto em destaque: mostra produto, front-end e processamento de imagem.

### 4.3 Seções da página (one-page, com âncoras)
1. **Hero:** nome, "Senior Software Engineer", uma frase de posicionamento específica (nada de "passionate developer"), CTA principal (contato) e secundário (CV).
2. **Sobre:** 2–3 parágrafos curtos.
3. **Experiência:** timeline enxuta (empresa, cargo, período, 2–3 bullets de impacto).
4. **Projetos em destaque:** 2–4 itens no formato da skill `case-study`, incluindo o Stitch.
5. **Publicação:** o artigo do ERBD 2019 com o link do DOI.
6. **Stack / habilidades:** lista agrupada (linguagens, front, back, infra/dados, IoT). **Sem barras de proficiência** (o CV antigo usa; é um clichê que não comunica nada).
7. **Contato:** e-mail, LinkedIn, GitHub e download do CV.

### 4.4 Idiomas
- O site atual é bilíngue (bandeiras US/BR). Mantenha **EN (padrão) + PT-BR**.
- Com Astro: use o i18n nativo, com rotas `/` (EN) e `/pt/` (PT-BR). Toggle de idioma acessível, com `hreflang` e `lang` corretos.
- Sirva os CVs em `/cv/danilo-sambugaro-cv-en.pdf` e `/cv/danilo-sambugaro-cv-pt-br.pdf`. Se o usuário não mandar versões novas, use as antigas renomeadas e registre que estão desatualizadas.

---

## 5. Direção visual

- Público técnico. Referências que combinam com o perfil (escolha uma em `web-design-engineer/references/style-recipes/`, justifique e **pergunte ao usuário antes de construir**, mostrando 2–3 opções em uma frase cada):
  - `linear.md`: escuro, preciso, produto de engenharia;
  - `stripe-press.md`: editorial, tipografia forte, sério;
  - `vignelli-swiss-helvetica.md`: grid suíço, limpo, atemporal;
  - `dieter-rams-braun.md`: funcional, "menos, porém melhor", combina com o lado maker/hardware.
- **Evite** (o gate `no-ai-design-slop` vai cobrar): gradiente roxo-azul genérico, glassmorphism sem motivo, cards idênticos em grade 3×N, emoji como ícone, "Hi, I'm X 👋", fundo de partículas, animação em todo scroll, badges de tecnologia coloridos em excesso, barras de skill.
- Uma assinatura visual sutil ligada à identidade dele é bem-vinda: um detalhe de terminal/Linux, uma referência a circuito/PCB ou um detalhe de grid. Precisa ser **uma só** e discreta.
- Tema claro e escuro via `prefers-color-scheme`, com toggle opcional que persiste em `localStorage` (envolvido em try/catch).
- Fontes: no máximo 2 famílias, self-hosted (ex.: via `@fontsource`), com `font-display: swap` e subset latin.
- Ícones: SVG inline. **Não** use a Font Awesome inteira, como o site atual faz (~2 MB de fontes).

---

## 6. Ordem do trabalho

1. **Ler o repo** (`git log`, a estrutura e esta seção 2) e criar a branch `redesign`.
2. **Coletar conteúdo** (seção 4.1). Pare e pergunte. Faça todas as perguntas **de uma vez**, numa lista única.
3. **Propor a direção visual** (seção 5): 2–3 opções, uma frase cada. Espere a escolha.
4. **Scaffold do Astro**, mover `apps/` (e `tractian/`, se mantido) para `public/`, configurar i18n e o workflow do Pages.
5. **Tokens primeiro:** cor (`better-colors`), tipografia (`better-typography`), espaçamento e raios. Defina tudo em CSS custom properties. Opcional: registrar em `.tastemaker/style-lock.md`.
6. **Construir as seções** na ordem da 4.3, com `landing-page-design` e `better-layout`; textos com `better-writing`; projetos com `case-study`.
7. **Movimento** por último e com parcimônia (`animate`, `choreograph`).
8. **SEO e metadados:** `<title>` e `description` por idioma, Open Graph e Twitter card (gerar uma imagem OG estática 1200×630), `canonical`, `hreflang`, `sitemap` (`@astrojs/sitemap`), `robots.txt`, favicon SVG + PNG, `manifest.webmanifest` mínimo, JSON-LD `Person` com `sameAs` (GitHub e LinkedIn).
9. **Remover o build antigo** (seção 2.3).
10. **Revisão:** `audit-ai-design-slop`, `better-accessibility`, `better-interface`, `/interface-review`. Corrija o que for apontado.
11. **Verificação** (seção 7) e **relatório final**.

---

## 7. Critérios de aceite (verifique de verdade, não presuma)

- [ ] `npm run build` sem erros nem warnings relevantes; `npm run preview` serve o site.
- [ ] Rotas `/` e `/pt/` funcionam; o toggle de idioma leva à página equivalente.
- [ ] `/apps/stitch/`, `/apps/stitch/pixel-art-analizer/` (e `/tractian/`, se mantido) carregam no preview e são idênticos aos originais.
- [ ] CVs baixam pelos novos caminhos.
- [ ] Lighthouse (mobile) ≥ 95 em Performance, Accessibility, Best Practices e SEO. Rode via `npx lighthouse` contra o preview e cole os números no relatório.
- [ ] JS enviado ao cliente: idealmente ~0 KB além do toggle de tema/idioma (Astro sem frameworks de UI, a menos que haja motivo).
- [ ] Navegação 100% por teclado, foco visível, contraste AA em ambos os temas, `prefers-reduced-motion` respeitado.
- [ ] Layout sem scroll horizontal de 320px a 1920px; teste em 375px, 768px, 1280px e 1920px. Se houver browser automatizado disponível, tire screenshots.
- [ ] Nenhum dado inventado; todos os TODOs de conteúdo listados.
- [ ] Workflow `.github/workflows/deploy.yml` válido, com versões fixas e `permissions` mínimas (`pages: write`, `id-token: write`, `contents: read`).
- [ ] Nenhum push ou merge feito sem autorização.

## 8. Relatório final ao usuário

Em português, curto:
1. o que foi feito e a direção visual escolhida;
2. os números do Lighthouse;
3. **passos manuais dele:** mudar Pages Source para GitHub Actions; fazer merge/push da branch `redesign`; conferir o deploy na aba Actions;
4. TODOs de conteúdo pendentes;
5. decisões que ficaram para ele (ex.: `tractian/`).

---

*Este arquivo é só a especificação. Remova-o (ou mova para `docs/`) antes do merge, para ele não ser publicado.*
