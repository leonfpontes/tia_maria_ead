"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import SelfImprovementRoundedIcon from "@mui/icons-material/SelfImprovementRounded";
import { AppChrome } from "../../components/layout/AppChrome";
import { StatCard } from "../../components/layout/dash/StatCard";
import { SectionTitle } from "../../components/layout/dash/SectionTitle";
import { HeroSection } from "../../components/layout/hero/HeroSection";

export default function DashboardPage() {
  // Mocked user and stats
  const user = {
    nome: "Maria das Dores",
    email: "maria@exemplo.com",
    tipo: "aluno",
  };
  const statCards = [
    {
      title: "Tempo de estudo",
      value: "1h 55min",
      helperText: "Hoje na plataforma",
      trend: { label: "+30min vs ontem", positive: true },
      icon: AccessTimeRoundedIcon,
      tone: "primary" as const,
    },
    {
      title: "Práticas ativas",
      value: "2 trilhas",
      helperText: "Oxóssi e Ancestralidade",
      trend: { label: "Nova indicação", positive: true },
      icon: SelfImprovementRoundedIcon,
      tone: "success" as const,
    },
    {
      title: "Próxima gira",
      value: "Sábado 20h",
      helperText: "Agende presença",
      trend: { label: "Lembrete ativo", positive: true },
      icon: AccessTimeRoundedIcon,
      tone: "secondary" as const,
    },
  ];

  return (
    <AppChrome userName={user.nome} userEmail={user.email} userRole="Estudante">
      <Stack spacing={{ xs: 4, md: 6 }}>
        <HeroSection
          title="Bem-vinda de volta, Maria!"
          subtitle="Dashboard do Aluno"
          description="Acompanhe seu progresso, acesse as próximas aulas e confira novidades da casa."
          primaryAction={{ label: "Continuar estudos", onClick: () => {} }}
          secondaryAction={{ label: "Ver agenda de giras", onClick: () => {} }}
          highlights={["Mentoria com Pai Benedito às 20h", "Trilha Oxóssi atualizada"]}
        />

        <SectionTitle
          title="Resumo da jornada"
          subtitle="Principais indicadores do seu caminho hoje."
          chipLabel="Hoje"
        />
        <Grid container spacing={3}>
          {statCards.map((card) => (
            <Grid key={card.title} item xs={12} md={4}>
              <StatCard {...card} />
            </Grid>
          ))}
        </Grid>

        <Box sx={{
          borderRadius: 4,
          px: { xs: 3, md: 5 },
          py: { xs: 4, md: 5 },
          background: "linear-gradient(120deg, rgba(8,47,35,0.12), rgba(210,96,63,0.12))",
          border: "1px solid rgba(15,92,54,0.12)",
          boxShadow: "0 24px 48px -36px rgba(15,92,54,0.45)",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 3,
        }}>
          <Stack spacing={1.5}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Preparada para avançar?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Agende uma mentoria individual e receba direcionamentos personalizados para sua missão.
            </Typography>
          </Stack>
          <Button variant="contained" color="secondary" size="large">
            Agendar mentoria
          </Button>
        </Box>
      </Stack>
    </AppChrome>
  );
}
