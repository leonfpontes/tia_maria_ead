"use client";

import { useEffect, useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import Diversity3RoundedIcon from "@mui/icons-material/Diversity3Rounded";
import LiveTvRoundedIcon from "@mui/icons-material/LiveTvRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import Instagram from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useRouter } from "next/navigation";

import { ForgotPasswordDialog } from "../components/auth/ForgotPasswordDialog";
import { LoginDialog } from "../components/auth/LoginDialog";
import { CatalogCourseCard } from "../components/catalog/CatalogCourseCard";
import { AppChrome } from "../components/layout/AppChrome";
import { Carousel } from "../components/layout/Carousel";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { HeroSection } from "../components/layout/hero/HeroSection";

type AuthUser = {
  token: string;
  nome: string;
  email: string;
  tipo: "admin" | "aluno";
};

type Benefit = {
  title: string;
  description: string;
  icon: typeof LiveTvRoundedIcon;
};

type HighlightShowcase = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  href: string;
  accent: string;
};

type FeaturedCourse = {
  id: string;
  title: string;
  summary: string;
  price: string;
  oldPrice?: string;
  category: string;
  accent: string;
  tag?: string;
  lessonsLabel?: string;
  typeLabel?: string;
};

type StorySlice = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
};

const USER_STORAGE_KEY = "tia-maria-auth";

export default function HomePage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(USER_STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as AuthUser;
      setUser(parsed);
    } catch (error) {
      console.warn("Falha ao carregar dados armazenados", error);
      window.localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const shouldOpenLogin = params.get("login") === "1";
    const shouldOpenForgot = params.get("forgot") === "1";

    if (shouldOpenLogin) {
      setLoginOpen(true);
    }

    if (shouldOpenForgot) {
      setForgotOpen(true);
    }

    if (shouldOpenLogin || shouldOpenForgot) {
      router.replace("/", { scroll: false });
    }
  }, [router]);

  function handleLoginSuccess(payload: AuthUser) {
    setUser(payload);
    setLoginOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(payload));
    }
  }

  function handleLogout() {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(USER_STORAGE_KEY);
      window.localStorage.removeItem("tia-maria-token");
    }
  }

  const showcases = useMemo<HighlightShowcase[]>(
    () => [
      {
        id: "obi",
        title: "Obi: O Oráculo dos Orixás",
        subtitle: "Tradição Yorubá",
        description: "Aprenda a consagrar o Obi, interpretar respostas e conduzir orientações com firmeza.",
        ctaLabel: "Explorar curso",
        href: "/catalogo",
        accent: "linear-gradient(135deg, #a83256 0%, #f5a623 100%)",
      },
      {
        id: "ogum",
        title: "Ogum: Caminhos de Força",
        subtitle: "Matriz Yorubá + Umbanda",
        description: "Vivencie fundamentos, cantos e rituais que ativam a proteção de Ogum na sua caminhada.",
        ctaLabel: "Ver detalhes",
        href: "/catalogo",
        accent: "linear-gradient(135deg, #0f172a 0%, #22d3ee 100%)",
      },
      {
        id: "magia",
        title: "Magia do Tambor",
        subtitle: "Curimba e cantos",
        description: "Toques e pontos para conduzir giras com potência sonora e respeito ancestral.",
        ctaLabel: "Assistir aula introdutória",
        href: "/catalogo",
        accent: "linear-gradient(135deg, #1f2937 0%, #f59e0b 100%)",
      },
    ],
    []
  );

  const storySlices = useMemo<StorySlice[]>(
    () => [
      {
        eyebrow: "Umbanda viva",
        title: "Conheça a Escola Tia Maria",
        paragraphs: [
          "Somos um terreiro-escola que compartilha saberes de Umbanda e tradições afro-brasileiras com amor, seriedade e acolhimento.",
          "Nosso objetivo é fortalecer a corrente mediúnica e espiritual, oferecendo trilhas de estudo que unem teoria, prática e vivências guiadas.",
        ],
      },
      {
        eyebrow: "Para quem",
        title: "Formação para médiuns e simpatizantes",
        paragraphs: [
          "Tem conteúdo para quem está dando os primeiros passos, para quem já conduz gira e para quem busca se reconectar com a espiritualidade.",
          "A plataforma apresenta trilhas por Orixá, workshops temáticos, mentorias individuais e uma comunidade ativa com encontros ao vivo.",
        ],
      },
    ],
    []
  );

  const featuredCourses = useMemo<FeaturedCourse[]>(
    () => [
      {
        id: "obi-destaque",
        title: "Obi: O Oráculo dos Orixás",
        summary: "Curso completo com leitura, consagração e práticas para orientar consultas.",
        price: "R$ 147,00",
        category: "Teologia de Umbanda",
        accent: "linear-gradient(135deg, #a83256 0%, #f5a623 100%)",
        tag: "Mais vendido",
        lessonsLabel: "24 aulas • 7 módulos",
        typeLabel: "Curso",
      },
      {
        id: "ogum-destaque",
        title: "Ogum: Da tradição Yorubá à Umbanda",
        summary: "Fundamentos, cantos e rituais que ativam o guerreiro em sua jornada.",
        price: "R$ 127,00",
        category: "Teologia de Umbanda",
        accent: "linear-gradient(135deg, #0f172a 0%, #22d3ee 100%)",
        tag: "Novo",
        lessonsLabel: "18 aulas • 6 módulos",
        typeLabel: "Curso",
      },
      {
        id: "combo-esquerda",
        title: "Combo Mistérios da Esquerda",
        summary: "Coleção especial com Exus e Pombagiras, rituais e padês exclusivos.",
        price: "R$ 247,00",
        oldPrice: "R$ 297,00",
        category: "Combos Especiais",
        accent: "linear-gradient(135deg, #581c87 0%, #f97316 100%)",
        tag: "Combo",
        lessonsLabel: "54 aulas • 3 cursos",
        typeLabel: "Combo",
      },
      {
        id: "magia-tambor",
        title: "Magia do Tambor – Curimba online",
        summary: "Aprenda toques e cantos para conduzir giras com potência e respeito.",
        price: "R$ 125,00",
        category: "Rituais e Trabalhos",
        accent: "linear-gradient(135deg, #1f2937 0%, #f59e0b 100%)",
        lessonsLabel: "16 aulas • 5 módulos",
        typeLabel: "Curso",
      },
      {
        id: "quartinha",
        title: "Quartinha: Fundamento e prática",
        summary: "Consagração, limpeza e manutenção das quartinhas no altar.",
        price: "R$ 107,00",
        category: "Rituais e Trabalhos",
        accent: "linear-gradient(135deg, #0b3b60 0%, #38bdf8 100%)",
        lessonsLabel: "15 aulas • 5 módulos",
        typeLabel: "Curso",
      },
      {
        id: "mentoria",
        title: "Mentoria individual com Tia Maria",
        summary: "Sessões online para direcionar sua missão espiritual com carinho e firmeza.",
        price: "R$ 180,00",
        category: "Consultas e Atendimentos",
        accent: "linear-gradient(135deg, #1e293b 0%, #fcd34d 100%)",
        tag: "Agenda aberta",
        lessonsLabel: "Sessão ao vivo • 60 minutos",
        typeLabel: "Atendimento",
      },
    ],
    []
  );

  const guestBenefits = useMemo<Benefit[]>(
    () => [
      {
        title: "Mentorias personalizadas",
        description: "Receba orientação direta da Tia Maria para seguir com firmeza.",
        icon: AutoAwesomeRoundedIcon,
      },
      {
        title: "Comunidade acolhedora",
        description: "Caminhe junto de outras médiuns em encontros e grupos de estudo.",
        icon: Diversity3RoundedIcon,
      },
    ],
    []
  );

  const userRoleLabel = user?.tipo === "admin" ? "Administração" : user ? "Estudante" : undefined;

  function renderLandingContent(isAuthenticated: boolean) {
    const primaryCta = isAuthenticated
      ? { label: "Ir para o catálogo", action: () => router.push("/catalogo") }
      : { label: "Entrar na plataforma", action: () => setLoginOpen(true) };
    const secondaryCta = isAuthenticated
      ? { label: "Acessar painel", action: () => router.push("/dashboard") }
      : { label: "Recuperar senha", action: () => setForgotOpen(true) };

    return (
      <Stack spacing={{ xs: 4, md: 6 }}>
        <Stack spacing={2}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Cursos, combos e vivências em destaque
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Seleção mockada inspirada no benchmark enviado. Assim visualizamos a nova vitrine logo na home.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {featuredCourses.map((course) => (
            <Grid key={course.id} size={{ xs: 12, md: 6, xl: 4 }}>
              <CatalogCourseCard {...course} />
            </Grid>
          ))}
        </Grid>

        <Paper
          sx={{
            borderRadius: 2,
            p: { xs: 3, md: 5 },
            background: "linear-gradient(120deg, rgba(248,250,252,0.96) 0%, rgba(255,255,255,0.98) 100%)",
            border: "1px solid rgba(15,92,54,0.08)",
          }}
        >
          <Grid container spacing={4}>
            {storySlices.map((slice) => (
              <Grid key={slice.title} size={{ xs: 12, md: 6 }}>
                <Stack spacing={2.5}>
                  <Chip
                    label={slice.eyebrow}
                    size="small"
                    sx={{
                      width: "fit-content",
                      borderRadius: 8,
                      fontWeight: 600,
                      backgroundColor: "rgba(31,159,95,0.12)",
                      color: "#0f5c36",
                    }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {slice.title}
                  </Typography>
                  <Stack spacing={1.5}>
                    {slice.paragraphs.map((paragraph) => (
                      <Typography key={paragraph} variant="body2" color="text.secondary">
                        {paragraph}
                      </Typography>
                    ))}
                  </Stack>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
            <Paper
              sx={{
                width: '100%',
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid rgba(15,92,54,0.08)",
                boxShadow: "0 18px 45px -28px rgba(15,92,54,0.35)",
              }}
            >
              <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
                <Box
                  component="iframe"
                  src="https://www.youtube.com/embed/4JqU5m5xeHo?list=RD4JqU5m5xeHo"
                  title="🕊🙏 Melhores Pontos de Umbanda (Orixás, caboclos, pretos velhos, baianos, boiadeiros, manlandros...)"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                />
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper
              sx={{
                height: "100%",
                borderRadius: 2,
                border: "1px solid rgba(15,92,54,0.08)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(248,250,252,0.96) 100%)",
                p: { xs: 3, md: 4 },
              }}
            >
              <Stack spacing={2}>
                <Chip
                  label="Por dentro da plataforma"
                  size="small"
                  sx={{
                    width: "fit-content",
                    borderRadius: 8,
                    fontWeight: 600,
                    backgroundColor: "rgba(31,159,95,0.12)",
                    color: "#0f5c36",
                  }}
                />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Aprimore-se com ritualística, teoria e prática
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cursos completos, combos temáticos, workshops gravados e mentorias ao vivo. Tudo mockado para que
                  você visualize a jornada mediúnica com base, responsabilidade e acolhimento.
                </Typography>
                <Stack spacing={1.5}>
                  {guestBenefits.map((benefit) => (
                    <Stack key={benefit.title} direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 14,
                          display: "grid",
                          placeItems: "center",
                          backgroundColor: "rgba(15,92,54,0.08)",
                          color: "primary.main",
                        }}
                      >
                        <benefit.icon fontSize="small" />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {benefit.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {benefit.description}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

      </Stack>
    );
  }

  const content = user ? (
    <AppChrome userName={user.nome} userEmail={user.email} userRole={userRoleLabel} onLogout={handleLogout}>
      {renderLandingContent(true)}
    </AppChrome>
  ) : (
    <>
      <Header />
      <Carousel />
      <Box
        sx={{
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          py: 8,
          px: 4,
          backgroundColor: '#f8f9fa',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center" maxWidth="lg" mx="auto">
          <Box sx={{ flex: '0 0 70%', pr: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#1976d2' }}>
              Sobre o Terreiro Tia Maria
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.7, color: '#333' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </Typography>
          </Box>
          <Box sx={{ flex: '0 0 30%', display: 'flex', justifyContent: 'center' }}>
            <Box
              component="img"
              src="/Logo_Terr_White-removebg-preview.png"
              alt="Logo Terreiro Tia Maria"
              sx={{
                width: '100%',
                maxWidth: 300,
                height: 'auto',
                border: '4px solid #1976d2',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
            />
          </Box>
        </Stack>
      </Box>
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Stack spacing={{ xs: 5, md: 7 }}>
          {renderLandingContent(false)}
        </Stack>
      </Container>
      <Footer />
    </>
  );

  return (
    <>
      {content}
      <LoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onForgotPassword={() => {
          setLoginOpen(false);
          setForgotOpen(true);
        }}
        onSuccess={handleLoginSuccess}
      />

      <ForgotPasswordDialog open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </>
  );
}
