"use client";

import { useEffect, useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SvgIconComponent } from "@mui/icons-material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import Diversity3RoundedIcon from "@mui/icons-material/Diversity3Rounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import LiveTvRoundedIcon from "@mui/icons-material/LiveTvRounded";
import SelfImprovementRoundedIcon from "@mui/icons-material/SelfImprovementRounded";
import { useRouter } from "next/navigation";

import { ForgotPasswordDialog } from "../components/auth/ForgotPasswordDialog";
import { LoginDialog } from "../components/auth/LoginDialog";
import { AppChrome } from "../components/layout/AppChrome";
import { CourseCard } from "../components/layout/dash/CourseCard";
import { SectionTitle } from "../components/layout/dash/SectionTitle";
import { StatCard } from "../components/layout/dash/StatCard";
import { HeroSection } from "../components/layout/hero/HeroSection";

type AuthUser = {
  token: string;
  nome: string;
  email: string;
  tipo: "admin" | "aluno";
};

type StatDefinition = {
  title: string;
  value: string;
  helperText?: string;
  trend?: {
    label: string;
    positive?: boolean;
  };
  icon: SvgIconComponent;
  tone: "primary" | "secondary" | "success" | "neutral";
};

type FeaturedCourse = {
  title: string;
  description: string;
  duration: string;
  lessons: number;
  progress?: number;
  category?: string;
  ctaLabel: string;
  href: string;
};

type Benefit = {
  title: string;
  description: string;
  icon: SvgIconComponent;
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

  const statCards = useMemo<StatDefinition[]>(
    () => [
      {
        title: "Tempo de estudo",
        value: "2h 40min",
        helperText: "Hoje na plataforma",
        trend: { label: "+45min vs ontem", positive: true },
        icon: AccessTimeRoundedIcon,
        tone: "primary",
      },
      {
        title: "Práticas ativas",
        value: "3 trilhas",
        helperText: "Oxóssi, Cabocla Jupira e Ancestralidade",
        trend: { label: "1 nova indicação", positive: true },
        icon: SelfImprovementRoundedIcon,
        tone: "success",
      },
      {
        title: "Próxima gira",
        value: "Hoje 20h",
        helperText: "Agende presença com antecedência",
        trend: { label: "Lembrete ativo", positive: true },
        icon: EventAvailableRoundedIcon,
        tone: "secondary",
      },
    ],
    []
  );

  const featuredCourses = useMemo<FeaturedCourse[]>(
    () => [
      {
        title: "Rituais com a Cabocla Jupira",
        description: "Aprofunde-se nas ervas e rezas conduzidas pela Cabocla Jupira.",
        duration: "1h 45min",
        lessons: 8,
        progress: 72,
        category: "Mediunidade",
        ctaLabel: "Retomar aulas",
        href: "/aulas/cabocla-jupira",
      },
      {
        title: "Trilha de Oxóssi",
        description: "Integre cantos, oferendas e fundamentos da força de Oxóssi.",
        duration: "2h 10min",
        lessons: 10,
        progress: 40,
        category: "Trilhas sagradas",
        ctaLabel: "Continuar trilha",
        href: "/aulas/trilha-oxossi",
      },
      {
        title: "Fundamentos de Umbanda",
        description: "Fortaleça sua base doutrinária com estudos guiados por Tia Maria.",
        duration: "3h 05min",
        lessons: 14,
        category: "Formação",
        ctaLabel: "Explorar conteúdo",
        href: "/catalogo",
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
  const firstName = user?.nome.split(" ")[0] ?? "amiga(o)";

  const content = user ? (
    <AppChrome userName={user.nome} userEmail={user.email} userRole={userRoleLabel} onLogout={handleLogout}>
      <Stack spacing={{ xs: 4, md: 6 }}>
        <HeroSection
          title="Sua jornada está em expansão"
          subtitle="Bem-vinda de volta"
          description={`Continue seu caminho, ${firstName}. Os guias prepararam novos rituais para você.`}
          primaryAction={{ label: "Continuar estudos", onClick: () => router.push("/aulas") }}
          secondaryAction={{ label: "Ver agenda de giras", onClick: () => router.push("/agenda") }}
          highlights={["Mentoria com Pai Benedito às 20h", "Trilha Oxóssi atualizada", "Materiais extras liberados"]}
        />

        <SectionTitle
          title="Resumo da jornada"
          subtitle="Acompanhe os principais indicadores da sua caminhada de hoje."
          chipLabel="Hoje"
        />
        <Grid container spacing={3}>
          {statCards.map((card) => (
            <Grid key={card.title} size={{ xs: 12, md: 4 }}>
              <StatCard
                title={card.title}
                value={card.value}
                helperText={card.helperText}
                trend={card.trend}
                icon={card.icon}
                tone={card.tone}
              />
            </Grid>
          ))}
        </Grid>

        <SectionTitle
          title="Trilhas recomendadas"
          subtitle="Sugestões alinhadas aos seus últimos estudos e práticas."
          chipLabel="Sugestões"
        />
        <Grid container spacing={3}>
          {featuredCourses.map((course) => (
            <Grid key={course.title} size={{ xs: 12, md: 4 }}>
              <CourseCard
                title={course.title}
                description={course.description}
                duration={course.duration}
                lessons={course.lessons}
                progress={course.progress}
                category={course.category}
                ctaLabel={course.ctaLabel}
                onCtaClick={() => router.push(course.href)}
              />
            </Grid>
          ))}
        </Grid>

        <Paper
          sx={{
            borderRadius: 4,
            px: { xs: 3, md: 5 },
            py: { xs: 4, md: 5 },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 3,
            background: "linear-gradient(120deg, rgba(8,47,35,0.12), rgba(210,96,63,0.12))",
            border: "1px solid rgba(15,92,54,0.12)",
            boxShadow: "0 24px 48px -36px rgba(15,92,54,0.45)",
          }}
        >
          <Stack spacing={1.5}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Preparada para avançar?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Agende uma mentoria individual com Tia Maria e receba direcionamentos personalizados para sua missão.
            </Typography>
          </Stack>
          <Button variant="contained" color="secondary" size="large" onClick={() => router.push("/mentorias")}>
            Agendar mentoria
          </Button>
        </Paper>
      </Stack>
    </AppChrome>
  ) : (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={{ xs: 5, md: 7 }}>
        <HeroSection
          title="Sua jornada espiritual, acolhida online"
          subtitle="Plataforma Tia Maria"
          description="A plataforma reúne cursos, rituais e mentorias que aproximam você da corrente da Tia Maria e da Cabocla Jupira."
          primaryAction={{ label: "Fazer login", onClick: () => setLoginOpen(true) }}
          secondaryAction={{ label: "Recuperar senha", onClick: () => setForgotOpen(true) }}
          highlights={["Mentorias ao vivo com a Tia Maria", "Rituais gravados com guias", "Materiais exclusivos da corrente"]}
        />

        <SectionTitle
          title="Viva a experiência"
          subtitle="Descubra como a plataforma apoia seu desenvolvimento mediúnico com cuidado e propósito."
        />
        <Grid container spacing={3}>
          {guestBenefits.map((benefit) => (
            <Grid key={benefit.title} size={{ xs: 12, md: 4 }}>
              <Paper
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  border: "1px solid rgba(15,92,54,0.08)",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(248,250,252,0.96) 100%)",
                  p: { xs: 3, md: 4 },
                  boxShadow: "0 24px 40px -32px rgba(15, 92, 54, 0.25)",
                }}
              >
                <Stack spacing={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "20%",
                      display: "grid",
                      placeItems: "center",
                      backgroundColor: "rgba(31,159,95,0.12)",
                      color: "primary.main",
                    }}
                  >
                    <benefit.icon fontSize="medium" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {benefit.description}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
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
