"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import { useRouter } from "next/navigation";

import { AppChrome } from "../../components/layout/AppChrome";
import { CourseCard } from "../../components/layout/dash/CourseCard";
import { SectionTitle } from "../../components/layout/dash/SectionTitle";
import { StatCard } from "../../components/layout/dash/StatCard";
import { fetchDashboard, type DashboardCertificate, type DashboardCourse } from "../../lib/api/dashboard";
import { useSsoSession } from "../../lib/auth/useSsoSession";
import { buildAccessWindow, formatDateLabel, isCourseActive } from "../../lib/formatting/courseAccess";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
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
    const token = session?.token;
    if (!token) {
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
        const message = err instanceof Error ? err.message : "Erro ao carregar seu painel.";
        setError(message);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadDashboard(token);
    return () => {
      ignore = true;
    };
  }, [handleLogout, session?.token, updateSession]);

  const activeCourses = useMemo(
    () => courses.filter((course) => isCourseActive(course) && course.ativo !== false),
    [courses]
  );

  const expiredCourses = useMemo(
    () => courses.filter((course) => course.expira_em && !isCourseActive(course)),
    [courses]
  );

  const nextExpiringCourse = useMemo(() => {
    return courses
      .filter((course) => course.expira_em && isCourseActive(course))
      .sort((a, b) => new Date(a.expira_em as string).getTime() - new Date(b.expira_em as string).getTime())[0];
  }, [courses]);

  const statCards = useMemo(
    () => [
      {
        title: "Cursos ativos",
        value: `${activeCourses.length}`,
        helperText: activeCourses.length === 1 ? "Curso disponível" : "Cursos disponíveis",
        icon: LibraryBooksRoundedIcon,
        tone: "primary" as const,
      },
      {
        title: "Certificados",
        value: `${certificates.length}`,
        helperText: certificates.length === 1 ? "Certificado conquistado" : "Certificados acumulados",
        icon: WorkspacePremiumRoundedIcon,
        tone: "secondary" as const,
      },
      {
        title: "Próximo encerramento",
        value: nextExpiringCourse ? formatDateLabel(nextExpiringCourse.expira_em as string) : "Sem prazo",
        helperText: nextExpiringCourse ? nextExpiringCourse.nome : "Nenhum curso próximo do vencimento",
        icon: AccessTimeRoundedIcon,
        tone: "success" as const,
      },
    ],
    [activeCourses.length, certificates.length, nextExpiringCourse]
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

  return (
    <AppChrome
      userName={session.nome ?? "Estudante"}
      userEmail={session.email ?? ""}
      userRole={session.tipo}
      onLogout={handleLogout}
    >
      <Stack spacing={4}>
        <SectionTitle
          title="Bem-vindo de volta"
          subtitle="Acompanhe seu progresso, acesse as próximas aulas e confira novidades da casa."
        />

        {loading && (
          <Stack direction="row" spacing={2} alignItems="center">
            <CircularProgress size={28} />
            <Typography variant="body2" color="text.secondary">
              Carregando seu painel...
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
          title="Cursos em andamento"
          subtitle="Continue sua jornada ou explore novos conhecimentos guiados pela Tia Maria."
          chipLabel={`${activeCourses.length}`}
        />

        {!loading && activeCourses.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Ainda não há cursos liberados para você. Assim que a equipe conceder acesso a uma nova trilha ela aparecerá aqui.
          </Alert>
        )}

        <Grid container spacing={3}>
          {activeCourses.slice(0, 3).map((course) => (
            <Grid key={course.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <CourseCard
                title={course.nome}
                description={course.descricao ?? "Conteúdo disponível para aprofundar sua caminhada."}
                duration={buildAccessWindow(course)}
                lessonsLabel={course.expira_em ? `Acesso até ${formatDateLabel(course.expira_em)}` : "Acesso contínuo"}
                ctaLabel="Ir para aulas"
                onCtaClick={() => router.push(`/aulas/${course.id}`)}
              />
            </Grid>
          ))}
        </Grid>

        {activeCourses.length > 3 && (
          <Box>
            <Button variant="outlined" onClick={() => router.push("/catalogo")}>Ver catálogo completo</Button>
          </Box>
        )}

        {expiredCourses.length > 0 && (
          <Stack spacing={2}>
            <SectionTitle
              title="Acessos encerrados"
              subtitle="Revise quais trilhas já encerraram e solicite uma nova liberação caso necessário."
              chipLabel={`${expiredCourses.length}`}
            />
            <Grid container spacing={3}>
              {expiredCourses.slice(0, 2).map((course) => (
                <Grid key={course.id} size={{ xs: 12, md: 6 }}>
                  <CourseCard
                    title={course.nome}
                    description={course.descricao ?? "Período encerrado."}
                    duration={buildAccessWindow(course)}
                    lessonsLabel={`Expirou em ${formatDateLabel(course.expira_em as string)}`}
                    ctaLabel="Solicitar nova liberação"
                    onCtaClick={() => router.push("/suporte")}
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>
        )}

        <SectionTitle
          title="Certificados"
          subtitle="Celebre suas conquistas e faça download quando precisar comprovar sua jornada."
          chipLabel={`${certificates.length}`}
        />

        {certificates.length === 0 ? (
          <Alert severity="info">
            Nenhum certificado disponível ainda. Assim que concluir um curso com certificação, ele aparecerá aqui.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {certificates.map((certificate) => (
              <Box
                key={certificate.id}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid rgba(15,92,54,0.08)",
                  background: "linear-gradient(120deg, rgba(16,185,129,0.12), rgba(15,92,54,0.05))",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {certificate.curso_nome}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Emitido em {formatDateLabel(certificate.conquistado_em)}
                </Typography>
                {certificate.url_certificado ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => window.open(certificate.url_certificado as string, "_blank", "noopener,noreferrer")}
                  >
                    Ver certificado
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Certificado disponível mediante solicitação à equipe.
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </AppChrome>
  );
}
