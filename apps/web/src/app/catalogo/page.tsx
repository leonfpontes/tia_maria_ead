"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

import { AppChrome } from "../../components/layout/AppChrome";
import { CourseCard } from "../../components/layout/dash/CourseCard";
import { SectionTitle } from "../../components/layout/dash/SectionTitle";
import { fetchDashboard, type DashboardCourse } from "../../lib/api/dashboard";
import { useSsoSession } from "../../lib/auth/useSsoSession";
import { buildAccessWindow, formatDateLabel, isCourseActive } from "../../lib/formatting/courseAccess";

export const dynamic = "force-dynamic";

export default function CatalogoPage() {
  const router = useRouter();
  const { session, initializing, logout, updateSession } = useSsoSession();
  const [courses, setCourses] = useState<DashboardCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = useCallback(() => {
    setCourses([]);
    logout();
  }, [logout]);

  useEffect(() => {
    const token = session?.token;
    if (!token) {
      return;
    }

    let ignore = false;
    async function loadDashboard(authToken: string) {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDashboard(authToken);
        if (ignore) {
          return;
        }

        const sanitizedCourses = Array.isArray(data?.cursos) ? data.cursos : [];

        setCourses(sanitizedCourses);
        updateSession((previous) => ({
          token: authToken,
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
        const message = err instanceof Error ? err.message : "Erro ao carregar cursos.";
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
          title="Catálogo personalizado"
          subtitle="Aqui você encontra os cursos liberados para o seu perfil."
          chipLabel={`${activeCourses.length} liberado${activeCourses.length === 1 ? "" : "s"}`}
        />

        {loading && (
          <Stack direction="row" spacing={2} alignItems="center">
            <CircularProgress size={28} />
            <Typography variant="body2" color="text.secondary">
              Carregando seus cursos...
            </Typography>
          </Stack>
        )}

        {error && !loading && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {!loading && !error && activeCourses.length === 0 && (
          <Alert severity="info">
            Nenhum curso está liberado para o seu usuário neste momento. Quando a equipe habilitar novos conteúdos, eles aparecerão aqui automaticamente.
          </Alert>
        )}

        <Grid container spacing={3}>
          {activeCourses.map((course) => (
            <Grid key={course.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <CourseCard
                title={course.nome}
                description={course.descricao ?? "Conteúdo disponível para aprofundar sua caminhada."}
                duration={buildAccessWindow(course)}
                lessonsLabel={course.expira_em ? `Acesso até ${formatDateLabel(course.expira_em)}` : "Acesso contínuo"}
                ctaLabel="Acessar curso"
                onCtaClick={() => router.push(`/aulas/${course.id}`)}
              />
            </Grid>
          ))}
        </Grid>

        {expiredCourses.length > 0 && (
          <Stack spacing={2}>
            <SectionTitle
              title="Acessos encerrados"
              subtitle="Estes cursos tiveram o período de acesso finalizado. Procure a equipe se precisar de uma nova liberação."
              chipLabel={`${expiredCourses.length}`}
            />
            <Grid container spacing={3}>
              {expiredCourses.map((course) => (
                <Grid key={course.id} size={{ xs: 12, sm: 6, lg: 4 }}>
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
      </Stack>
    </AppChrome>
  );
}
