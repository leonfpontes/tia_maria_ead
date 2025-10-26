"use client";

import { useEffect, useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
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
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import YouTube from "@mui/icons-material/YouTube";
import Instagram from "@mui/icons-material/Instagram";
import { useRouter } from "next/navigation";

import { ForgotPasswordDialog } from "../components/auth/ForgotPasswordDialog";
import { LoginDialog } from "../components/auth/LoginDialog";
import { CatalogCourseCard } from "../components/catalog/CatalogCourseCard";
import { AppChrome } from "../components/layout/AppChrome";
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
        title: "Rituais guiados ao vivo",
        description: "Participe das giras virtuais e sinta a corrente sem sair de casa.",
        icon: LiveTvRoundedIcon,
      },
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
        <Paper
          sx={{
            borderRadius: 4,
            px: { xs: 3, md: 6 },
            py: { xs: 4, md: 6 },
            background: "linear-gradient(135deg, rgba(8,47,35,0.92) 0%, rgba(10,62,37,0.85) 55%, rgba(31,159,95,0.8) 100%)",
            color: "#f8fafc",
            display: "grid",
            gap: { xs: 4, md: 6 },
            gridTemplateColumns: { xs: "1fr", lg: "1.1fr 0.9fr" },
            overflow: "hidden",
          }}
        >
          <Stack spacing={2.5}>
            <Chip
              icon={<WorkspacePremiumRoundedIcon sx={{ color: "rgba(248,250,252,0.9)" }} />}
              label="Portal Sagrado Tia Maria"
              sx={{
                width: "fit-content",
                borderRadius: 999,
                fontWeight: 600,
                backgroundColor: "rgba(248,250,252,0.12)",
                color: "rgba(248,250,252,0.9)",
              }}
            />
            <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              Estudos, rituais e mentorias para fortalecer sua gira
            </Typography>
            <Typography variant="body1" sx={{ color: "rgba(248,250,252,0.85)", maxWidth: 520 }}>
              Mock inspirado na plataforma benchmark: unimos trilhas completas de Umbanda, encontros ao vivo e uma
              comunidade que caminha com fé.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={primaryCta.action}
                sx={{
                  px: 4,
                  borderRadius: 999,
                  fontWeight: 700,
                  boxShadow: "0 18px 40px rgba(15,92,54,0.35)",
                }}
              >
                {primaryCta.label}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={secondaryCta.action}
                sx={{
                  px: 4,
                  borderRadius: 999,
                  fontWeight: 700,
                  borderColor: "rgba(248,250,252,0.4)",
                  color: "rgba(248,250,252,0.9)",
                }}
              >
                {secondaryCta.label}
              </Button>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    display: "grid",
                    placeItems: "center",
                    backgroundColor: "rgba(248,250,252,0.18)",
                  }}
                >
                  <AccessTimeRoundedIcon fontSize="small" />
                </Box>
                <Typography variant="body2">Conteúdo on-demand e encontros semanais</Typography>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    display: "grid",
                    placeItems: "center",
                    backgroundColor: "rgba(248,250,252,0.18)",
                  }}
                >
                  <Diversity3RoundedIcon fontSize="small" />
                </Box>
                <Typography variant="body2">Comunidade acolhedora e mentorias personalizadas</Typography>
              </Stack>
            </Stack>
          </Stack>

          <Stack spacing={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "rgba(248,250,252,0.7)", letterSpacing: "0.14em" }}>
              Destaques da casa
            </Typography>
            <Stack spacing={2.5}>
              {showcases.map((item) => (
                <Paper
                  key={item.id}
                  sx={{
                    borderRadius: 3,
                    p: 3,
                    background: item.accent,
                    color: "#f8fafc",
                    boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
                  }}
                >
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={item.subtitle}
                        size="small"
                        sx={{
                          borderRadius: 999,
                          bgcolor: "rgba(248,250,252,0.18)",
                          color: "#f8fafc",
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        icon={<PlayArrowRoundedIcon fontSize="small" />}
                        label="Prévia"
                        size="small"
                        sx={{ borderRadius: 999, bgcolor: "rgba(248,250,252,0.16)", color: "#f8fafc" }}
                      />
                    </Stack>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2">{item.description}</Typography>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => router.push(item.href)}
                      sx={{ alignSelf: "flex-start", borderRadius: 999, fontWeight: 700, px: 3 }}
                    >
                      {item.ctaLabel}
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Stack>
        </Paper>

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
            borderRadius: 4,
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
                      borderRadius: 999,
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
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper
              sx={{
                height: "100%",
                borderRadius: 4,
                overflow: "hidden",
                border: "1px solid rgba(15,92,54,0.08)",
                boxShadow: "0 18px 45px -28px rgba(15,92,54,0.35)",
              }}
            >
              <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
                <Box
                  component="iframe"
                  src="https://www.youtube.com/embed/w3wQrtME5wc"
                  title="Apresentação Tia Maria"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
                borderRadius: 4,
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
                    borderRadius: 999,
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

        <Paper
          sx={{
            borderRadius: 999,
            px: { xs: 3, md: 5 },
            py: 3,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            background: "linear-gradient(120deg, rgba(31,159,95,0.12) 0%, rgba(251,191,36,0.18) 100%)",
            border: "1px solid rgba(15,92,54,0.12)",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Siga a Casa do Pai Benedito nas redes e acompanhe os novos rituais
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <IconButton color="primary" href="https://www.facebook.com/CasadoPaiBenedito/" target="_blank" rel="noreferrer">
              <FacebookRoundedIcon />
            </IconButton>
            <IconButton color="primary" href="https://www.youtube.com/channel/UCGNVZS02VR23_Ndwv16yJBQ" target="_blank" rel="noreferrer">
              <YouTube />
            </IconButton>
            <IconButton color="primary" href="https://www.instagram.com/casadopaibenedito/?hl=pt-br" target="_blank" rel="noreferrer">
              <Instagram />
            </IconButton>
          </Stack>
        </Paper>
      </Stack>
    );
  }

  const content = user ? (
    <AppChrome userName={user.nome} userEmail={user.email} userRole={userRoleLabel} onLogout={handleLogout}>
      {renderLandingContent(true)}
    </AppChrome>
  ) : (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={{ xs: 5, md: 7 }}>
        <HeroSection
          title="Sua jornada espiritual, acolhida online"
          subtitle="Plataforma Tia Maria"
          description="Mock para experimentarmos a nova cara do portal EAD sem perder a essência da Casa do Pai Benedito."
          primaryAction={{ label: "Fazer login", onClick: () => setLoginOpen(true) }}
          secondaryAction={{ label: "Recuperar senha", onClick: () => setForgotOpen(true) }}
          highlights={["Mentorias ao vivo com a Tia Maria", "Rituais gravados com guias", "Materiais exclusivos"]}
        />
        {renderLandingContent(false)}
      </Stack>
    </Container>
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
