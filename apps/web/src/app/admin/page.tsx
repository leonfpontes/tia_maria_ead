"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { useRouter } from "next/navigation";

import { AppChrome } from "../../components/layout/AppChrome";
import { SectionTitle } from "../../components/layout/dash/SectionTitle";
import { StatCard } from "../../components/layout/dash/StatCard";
import { fetchDashboard, type DashboardCertificate, type DashboardCourse } from "../../lib/api/dashboard";
import { useSsoSession } from "../../lib/auth/useSsoSession";
import { formatDateLabel, isCourseActive } from "../../lib/formatting/courseAccess";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const router = useRouter();
  const { session, initializing, logout, updateSession } = useSsoSession();
  const [courses, setCourses] = useState<DashboardCourse[]>([]);
  const [certificates, setCertificates] = useState<DashboardCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = useCallback(() => {
    setCourses([]);
    setCertificates([]);
    logout();
  }, [logout]);

  useEffect(() => {
    if (!session?.token) {
      return;
    }

    let ignore = false;
    async function loadDashboard(currentToken: string) {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDashboard(currentToken);
        if (ignore) {
          return;
        }

        const sanitizedCourses = Array.isArray(data?.cursos) ? data.cursos : [];
        const sanitizedCertificates = Array.isArray(data?.certificados) ? data.certificados : [];

        setCourses(sanitizedCourses);
        setCertificates(sanitizedCertificates);
        updateSession((previous) => ({
          token: currentToken,
          nome: data?.nome ?? previous?.nome,
          email: data?.email ?? previous?.email,
          tipo: data?.tipo ?? previous?.tipo,
        }));
      } catch (err) {
        if (ignore) {
          return;
        }
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
          handleLogout();
          return;
        }
        const message = err instanceof Error ? err.message : "Erro ao carregar dados administrativos.";
        setError(message);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadDashboard(session.token);
    return () => {
      ignore = true;
    };
  }, [handleLogout, session?.token, updateSession]);

  useEffect(() => {
    if (!initializing && session?.token && session?.tipo !== "admin") {
      router.replace("/dashboard");
    }
  }, [initializing, router, session?.tipo, session?.token]);

  const activeCourses = useMemo(
    () => courses.filter((course) => isCourseActive(course) && course.ativo !== false),
    [courses]
  );

  const inactiveCourses = useMemo(
    () => courses.filter((course) => course.ativo === false),
    [courses]
  );

  if (!session?.token) {
    if (initializing) {
      return (
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress color="primary" />
        </Box>
      );
    }
    return null;
  }

  if (!loading && session.tipo !== "admin") {
    return null;
  }

  const statCards = [
    {
      title: "Cursos ativos",
      value: `${activeCourses.length}`,
      helperText: "+ gestão de conteúdos",
      icon: LibraryBooksRoundedIcon,
      tone: "primary" as const,
    },
    {
      title: "Certificados emitidos",
      value: `${certificates.length}`,
      helperText: "histórico completo",
      icon: FactCheckRoundedIcon,
      tone: "secondary" as const,
    },
    {
      title: "Trilhas desativadas",
      value: `${inactiveCourses.length}`,
      helperText: "disponíveis para revisão",
      icon: SettingsRoundedIcon,
      tone: "neutral" as const,
    },
  ];

  return (
    <AppChrome
      userName={session.nome ?? "Equipe"}
      userEmail={session.email ?? ""}
      userRole={session.tipo}
      onLogout={handleLogout}
    >
      <Stack spacing={4}>
        <SectionTitle
          title="Painel administrativo"
          subtitle="Gerencie cursos, certificados e matrículas concedidas pela plataforma."
        />

        {loading && (
          <Stack direction="row" spacing={2} alignItems="center">
            <CircularProgress size={28} />
            <Typography variant="body2" color="text.secondary">
              Carregando indicadores...
            </Typography>
          </Stack>
        )}

        {error && !loading && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <Grid container spacing={3}>
            {statCards.map((stat) => (
              <Grid key={stat.title} size={{ xs: 12, md: 4 }}>
                <StatCard {...stat} />
              </Grid>
            ))}
          </Grid>
        )}

        <SectionTitle
          title="Acompanhamento rápido"
          subtitle="Veja a próxima ação recomendada para manter o catálogo sempre atualizado."
        />

        <Stack spacing={2}>
          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid rgba(15,92,54,0.08)",
              background: "linear-gradient(120deg, rgba(31,159,95,0.12), rgba(8,47,35,0.05))",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Próximo curso a revisar
            </Typography>
            {inactiveCourses.length > 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {inactiveCourses[0].nome} — desativado desde {formatDateLabel(inactiveCourses[0].liberado_em)}.
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Nenhum curso desativado no momento. Ótimo trabalho!
              </Typography>
            )}
            <Button variant="contained" onClick={() => router.push("/catalogo")}>Abrir catálogo do aluno</Button>
          </Box>

          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid rgba(15,92,54,0.08)",
              background: "linear-gradient(120deg, rgba(15,92,54,0.1), rgba(210,96,63,0.06))",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Certificados recentes
            </Typography>
            {certificates.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Ainda não há certificados emitidos. Assim que um aluno concluir uma trilha, você verá o registro aqui.
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Último certificado: {certificates[0].curso_nome} em {formatDateLabel(certificates[0].conquistado_em)}.
              </Typography>
            )}
            <Button variant="outlined" onClick={() => router.push("/certificados")}>Ver certificados completos</Button>
          </Box>

          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid rgba(15,92,54,0.08)",
              background: "linear-gradient(120deg, rgba(8,47,35,0.08), rgba(31,159,95,0.05))",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack spacing={0.5}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Próxima ação administrativa
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Revise matrículas manualmente ou conceda novos acessos para os cursos em destaque.
              </Typography>
            </Stack>
            <Button variant="contained" color="secondary" onClick={() => router.push("/configuracoes")}>Gerenciar acessos</Button>
          </Box>
        </Stack>

        <SectionTitle
          title="Equipe e matrículas"
          subtitle="Funções avançadas chegarão aqui: permissões, lotes de alunos e importações automáticas."
        />

        <Alert severity="info">
          Este painel administrativo ainda está em evolução. Novas seções serão adicionadas conforme as funcionalidades forem liberadas.
        </Alert>
      </Stack>
    </AppChrome>
  );
}
