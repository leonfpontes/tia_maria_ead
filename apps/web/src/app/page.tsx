"use client";

import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

import { ForgotPasswordDialog } from "../components/auth/ForgotPasswordDialog";
import { LoginDialog } from "../components/auth/LoginDialog";

type AuthUser = {
  token: string;
  nome: string;
  email: string;
  tipo: "admin" | "aluno";
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

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12 }}>
            <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
              <Stack spacing={3}>
                <Stack spacing={1}>
                  <Typography variant="h4" component="h1" fontWeight={800}>
                    Bem-vindo à Plataforma EAD Tia Maria
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Aqui você acessa cursos, materiais de estudo e experiências espirituais guiadas
                    pela Tia Maria e Cabocla Jupira. Faça login para entrar ou solicite a recuperação
                    de senha caso precise de ajuda.
                  </Typography>
                </Stack>

                {user ? (
                  <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                    <Stack spacing={1}>
                      <Typography variant="h6">Olá, {user.nome}!</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Seu acesso está ativo como {user.tipo.toLowerCase()}. Utilize o menu para navegar
                        pela plataforma ou saia da sessão se estiver em um dispositivo compartilhado.
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                        <Button variant="contained" color="primary" size="large" href="/dashboard">
                          Acessar dashboard
                        </Button>
                        <Button variant="outlined" onClick={handleLogout}>
                          Sair
                        </Button>
                      </Stack>
                    </Stack>
                  </Paper>
                ) : (
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={() => setLoginOpen(true)}
                    >
                      Fazer login
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      onClick={() => setForgotOpen(true)}
                    >
                      Recuperar senha
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>

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
