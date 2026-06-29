import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

function generateToken(): string {
  return nanoid(24);
}

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base}-${nanoid(5).toLowerCase()}`;
}

const contents = [
  {
    week: "Semana 1",
    month: "Julho/2026",
    format: "Carrossel",
    title: "Fitas de LED em ambientes residenciais reais",
    pillar: "Aplicações reais",
    objective: "Mostrar a Eletrofitas integrada a projetos reais de iluminação residencial",
    mainIdea:
      "Apresentar um antes/depois de um ambiente residencial iluminado com fitas de LED Eletrofitas, destacando a transformação de sala de estar em ambiente acolhedor.",
    artText:
      "Página 1: foto do ambiente com a fita instalada. Página 2: detalhe da instalação no rodateto. Página 3: ambiente com luz acesa à noite.",
    caption:
      "Um ambiente transformado com luz certa no lugar certo. As fitas de LED Eletrofitas acompanham o projeto do início ao fim, entregando acabamento e conforto visual.",
    visualSuggestion: "Fotos reais do ambiente com iluminação quente, foco no contraste antes/depois.",
    clientValidationPoint: "Confirmar se o ambiente usado tem autorização de imagem do cliente final do projeto.",
    cta: "Veja mais projetos no nosso perfil",
    hashtags: ["#eletrofitas", "#iluminacaoled", "#arquitetura", "#designdeinteriores", "#led"],
  },
  {
    week: "Semana 1",
    month: "Julho/2026",
    format: "Reels",
    title: "Como a iluminação inteligente muda a rotina em casa",
    pillar: "Ambientes inteligentes",
    objective: "Demonstrar a integração das fitas de LED com automação residencial",
    mainIdea:
      "Vídeo curto mostrando cenas de luz sendo ajustadas por aplicativo em diferentes momentos do dia: manhã, tarde e noite.",
    artText: "Roteiro: 3 cenas curtas (manhã/tarde/noite) com transição suave entre as cores de temperatura de luz.",
    caption:
      "Luz que se adapta ao seu dia. Com as fitas de LED Eletrofitas integradas a sistemas inteligentes, cada momento tem a iluminação ideal.",
    visualSuggestion: "Vídeo vertical, ritmo dinâmico, app de automação em destaque na tela.",
    clientValidationPoint: "Validar se o aplicativo de automação mostrado pode ser exibido com a marca visível.",
    cta: "Conheça as soluções inteligentes Eletrofitas",
    hashtags: ["#casainteligente", "#eletrofitas", "#automacao", "#iluminacaoled", "#tecnologia"],
  },
  {
    week: "Semana 2",
    month: "Julho/2026",
    format: "Carrossel",
    title: "Por dentro do projeto: arquitetura e luz como parceiras",
    pillar: "Arquitetura",
    objective: "Aproximar a marca do público de arquitetura e design de interiores",
    mainIdea:
      "Mostrar como um projeto de arquitetura pensa a iluminação desde a planta baixa, com a fita de LED Eletrofitas como elemento estrutural do design.",
    artText:
      "Página 1: planta baixa com indicação dos pontos de luz. Página 2: render do ambiente. Página 3: foto da obra finalizada.",
    caption:
      "A luz faz parte do projeto desde o primeiro traço. Veja como a iluminação com fitas de LED Eletrofitas se integra à arquitetura do espaço.",
    visualSuggestion: "Composição com planta baixa, render 3D e foto real lado a lado.",
    clientValidationPoint: "Confirmar autorização do escritório de arquitetura para uso do projeto.",
    cta: "Fale com nosso time técnico",
    hashtags: ["#arquitetura", "#eletrofitas", "#projetodeiluminacao", "#design", "#led"],
  },
  {
    week: "Semana 2",
    month: "Julho/2026",
    format: "Post único",
    title: "Organização de ambientes com luz embutida",
    pillar: "Organização de ambientes",
    objective: "Mostrar o uso de fitas de LED em closets, armários e áreas de organização",
    mainIdea:
      "Destacar como a iluminação embutida com fitas de LED ajuda na praticidade e organização de closets e armários planejados.",
    artText: "Imagem única de um closet planejado com fita de LED iluminando prateleiras e nichos.",
    caption:
      "Organização também é sobre visibilidade. As fitas de LED Eletrofitas dão destaque a cada peça, com instalação discreta e acabamento limpo.",
    visualSuggestion: "Foto de closet planejado com luz quente nas prateleiras.",
    clientValidationPoint: "Verificar se o móvel utilizado é de parceiro que precisa ser creditado.",
    cta: "Confira a linha completa no site",
    hashtags: ["#organizacao", "#eletrofitas", "#closet", "#moveisplanejados", "#iluminacaoled"],
  },
  {
    week: "Semana 3",
    month: "Julho/2026",
    format: "Reels",
    title: "Bastidores: como nasce uma fita de LED Eletrofitas",
    pillar: "Bastidores",
    objective: "Gerar conexão e transparência mostrando o processo produtivo",
    mainIdea:
      "Vídeo de bastidores mostrando etapas da produção da fita de LED, desde a matéria-prima até o teste de qualidade final.",
    artText: "Roteiro: 4 cortes rápidos mostrando linha de produção, teste de luz e embalagem final.",
    caption:
      "Cada metro de fita de LED passa por etapas rigorosas até chegar até você. Conheça um pouco do processo por trás da qualidade Eletrofitas.",
    visualSuggestion: "Vídeo institucional, tom transparente e técnico, sem aparecer rostos sem autorização.",
    clientValidationPoint: "Confirmar quais áreas da fábrica podem ser filmadas e divulgadas.",
    cta: "Saiba mais sobre nosso processo de qualidade",
    hashtags: ["#bastidores", "#eletrofitas", "#producao", "#qualidade", "#led"],
  },
  {
    week: "Semana 3",
    month: "Julho/2026",
    format: "Carrossel",
    title: "Detalhes do material: o que garante durabilidade",
    pillar: "Detalhes do material",
    objective: "Educar sobre os diferenciais técnicos do material das fitas",
    mainIdea:
      "Explicar de forma visual os componentes técnicos da fita de LED: revestimento, chip, fita adesiva e proteção IP, sem entrar em comparações polêmicas.",
    artText:
      "Página 1: ilustração da estrutura da fita em camadas. Página 2: zoom no chip de LED. Página 3: selo de proteção IP utilizado.",
    caption:
      "Por dentro da fita de LED Eletrofitas: cada camada foi pensada para entregar durabilidade e estabilidade de cor ao longo do tempo.",
    visualSuggestion: "Ilustração técnica com cortes em camadas, estilo infográfico clean.",
    clientValidationPoint: "Validar especificações técnicas exatas antes da publicação.",
    cta: "Veja as especificações completas",
    hashtags: ["#eletrofitas", "#tecnologialed", "#durabilidade", "#materiais", "#led"],
  },
  {
    week: "Semana 4",
    month: "Julho/2026",
    format: "Post único",
    title: "Linha completa Eletrofitas em um único lugar",
    pillar: "Linha completa",
    objective: "Apresentar o portfólio completo de produtos da marca",
    mainIdea:
      "Imagem organizada mostrando as diferentes linhas de fitas de LED disponíveis, por temperatura de cor e aplicação.",
    artText: "Grid com 6 variações de produto, etiquetas indicando temperatura de cor e uso recomendado.",
    caption:
      "Da luz quente e acolhedora à luz fria para ambientes técnicos: conheça a linha completa de fitas de LED Eletrofitas.",
    visualSuggestion: "Grid organizado em grade, paleta de cores consistente com a identidade da marca.",
    clientValidationPoint: "Confirmar nomes oficiais e códigos de cada linha de produto exibida.",
    cta: "Encontre o produto ideal para seu projeto",
    hashtags: ["#eletrofitas", "#linhadeled", "#iluminacao", "#produtos", "#led"],
  },
  {
    week: "Semana 4",
    month: "Julho/2026",
    format: "Carrossel",
    title: "Projetos comerciais: luz que valoriza a marca do cliente",
    pillar: "Projetos comerciais",
    objective: "Mostrar aplicações em lojas, escritórios e espaços comerciais",
    mainIdea:
      "Apresentar um projeto comercial (loja ou escritório) iluminado com fitas de LED Eletrofitas, destacando vitrines e identidade visual.",
    artText:
      "Página 1: fachada iluminada. Página 2: vitrine com destaque de produtos. Página 3: ambiente interno do espaço comercial.",
    caption:
      "Iluminação que reforça a identidade de um espaço comercial. Veja como a Eletrofitas participa de projetos que valorizam marcas e produtos.",
    visualSuggestion: "Fotos noturnas e diurnas do espaço comercial, com foco na vitrine.",
    clientValidationPoint: "Confirmar autorização do estabelecimento comercial para divulgação das imagens.",
    cta: "Solicite um projeto para seu negócio",
    hashtags: ["#projetocomercial", "#eletrofitas", "#iluminacaoled", "#vitrine", "#arquitetura"],
  },
  {
    week: "Semana 5",
    month: "Agosto/2026",
    format: "Reels",
    title: "Inovação em iluminação: o que vem por aí",
    pillar: "Inovação",
    objective: "Posicionar a marca como referência em inovação no setor de iluminação LED",
    mainIdea:
      "Vídeo curto apresentando uma novidade técnica da Eletrofitas (ex: nova tonalidade ou melhoria de eficiência energética), com tom institucional e informativo.",
    artText: "Roteiro: abertura com o produto, explicação rápida do diferencial, fechamento com a marca.",
    caption:
      "Inovação contínua é o que move a Eletrofitas. Conheça as novidades que estão chegando para tornar seus projetos ainda mais eficientes.",
    visualSuggestion: "Vídeo com estética futurista, iluminação azulada de fundo, produto em destaque central.",
    clientValidationPoint: "Confirmar quais informações sobre a novidade já podem ser divulgadas publicamente.",
    cta: "Fique por dentro das novidades Eletrofitas",
    hashtags: ["#inovacao", "#eletrofitas", "#iluminacaoled", "#tecnologia", "#led"],
  },
  {
    week: "Semana 5",
    month: "Agosto/2026",
    format: "Carrossel",
    title: "Design do produto: a fita pensada em cada detalhe",
    pillar: "Design do produto",
    objective: "Valorizar o design e a estética do produto em si",
    mainIdea:
      "Apresentar o design físico da fita de LED Eletrofitas: discrição, flexibilidade, acabamento e facilidade de instalação.",
    artText:
      "Página 1: fita enrolada destacando flexibilidade. Página 2: detalhe do acabamento da fita instalada. Página 3: comparação de tamanho com objeto cotidiano para noção de escala.",
    caption:
      "Discreta, flexível e com acabamento impecável: assim é a fita de LED Eletrofitas, pensada para se integrar a qualquer projeto sem perder qualidade.",
    visualSuggestion: "Still de produto em fundo neutro, boa iluminação de estúdio.",
    clientValidationPoint: "Validar se o produto fotografado é a versão mais atual da linha.",
    cta: "Conheça o produto de perto",
    hashtags: ["#designdeproduto", "#eletrofitas", "#led", "#iluminacao", "#inovacao"],
  },
];

async function main() {
  const existing = await prisma.project.findFirst({ where: { name: "Eletrofitas" } });
  if (existing) {
    console.log(`Projeto "Eletrofitas" já existe (slug: ${existing.slug}). Seed não duplicado.`);
    return;
  }

  const project = await prisma.project.create({
    data: {
      name: "Eletrofitas",
      title: "Linha Editorial Eletrofitas — Julho/Agosto 2026",
      period: "Julho - Agosto 2026",
      slug: generateSlug("Eletrofitas"),
      token: generateToken(),
      contentItems: {
        create: contents.map((c, index) => ({ ...c, sortOrder: index })),
      },
    },
  });

  console.log("Projeto criado com sucesso:");
  console.log(`  Nome: ${project.name}`);
  console.log(`  Slug: ${project.slug}`);
  console.log(`  Token: ${project.token}`);
  console.log(`  Link: /aprovacao/${project.slug}?token=${project.token}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
