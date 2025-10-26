"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

import { CatalogCourseCard } from "../components/catalog/CatalogCourseCard";
import { AppChrome } from "../components/layout/AppChrome";

type AuthUser = {
  token: string;
  nome: string;
  email: string;
  tipo: "admin" | "aluno";
};

type HeroBanner = {
  id: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  background: string;
};

type FeaturedCourse = {
  id: string;
  title: string;
  summary: string;
  price: string;
  category: string;
  accent: string;
  tag?: string;
  lessonsLabel?: string;
  typeLabel?: string;
};

const USER_STORAGE_KEY = "tia-maria-auth";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
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

  const navLinks = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: "Cursos", href: "/catalogo" },
      { label: "Combo Esquerda", href: "#" },
      { label: "Combo Mineral", href: "#" },
      { label: "Atendimento", href: "#" },
    ],
    []
  );

  const heroBanners = useMemo<HeroBanner[]>(
    () => [
      {
        id: "obi",
        title: "Obi: O Oráculo dos Orixás",
        description: "Aprenda a consagrar o Obi, interpretar respostas e conduzir orientações com firmeza.",
        cta: "CLIQUE AQUI E INSCREVA-SE",
        href: "/catalogo",
        background: "linear-gradient(135deg, rgba(9,46,33,0.92), rgba(34,152,96,0.85))",
      },
      {
        id: "ogum",
        title: "Ogum: Caminhos de Força",
        description: "Fundamentos, cantos e rituais que ativam a proteção de Ogum na sua caminhada.",
        cta: "CLIQUE AQUI E INSCREVA-SE",
        href: "/catalogo",
        background: "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,64,175,0.84))",
      },
      {
        id: "curimba",
        title: "Magia do Tambor",
        description: "Toques e pontos para conduzir giras com potência sonora e respeito ancestral.",
        cta: "CLIQUE AQUI E INSCREVA-SE",
        href: "/catalogo",
        background: "linear-gradient(135deg, rgba(88,28,135,0.92), rgba(249,115,22,0.86))",
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
        id: "curimba",
        title: "Magia do Tambor – Curimba online",
        summary: "Aprenda toques e cantos para conduzir giras com potência e respeito.",
        price: "R$ 125,00",
        category: "Rituais e Trabalhos",
        accent: "linear-gradient(135deg, #1f2937 0%, #f59e0b 100%)",
        lessonsLabel: "16 aulas • 5 módulos",
        typeLabel: "Curso",
      },
      {
        id: "oxum",
        title: "Oxum, a Senhora da prosperidade",
        summary: "Estudo completo sobre a força de Oxum na Umbanda.",
        price: "R$ 137,00",
        category: "Teologia de Umbanda",
        accent: "linear-gradient(135deg, #0ea5e9 0%, #9333ea 100%)",
        lessonsLabel: "22 aulas • 6 módulos",
        typeLabel: "Curso",
      },
    ],
    []
  );

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert("Login mockado somente para storytelling.");
  };

  const handleRegisterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert("Cadastro mockado – utilize a plataforma real para enviar dados.");
  };

  if (user) {
    return (
      <AppChrome userName={user.nome} userEmail={user.email} userRole={user.tipo === "admin" ? "Administração" : "Estudante"}>
        <Box sx={{ p: { xs: 3, md: 5 } }}>
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              border: "1px solid rgba(15,92,54,0.12)",
              background: "linear-gradient(135deg, rgba(31,159,95,0.1) 0%, rgba(251,191,36,0.12) 100%)",
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Você já está conectado na Escola Tia Maria
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Esta rota reproduz apenas o visual público. Use os botões abaixo para seguir para as telas reais.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button variant="contained" onClick={() => router.push("/dashboard")}>Ir para o painel</Button>
                <Button variant="outlined" onClick={() => router.push("/catalogo")}>Explorar catálogo</Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </AppChrome>
    );
  }

  return (
    <Box sx={{ bgcolor: "#eff4f5" }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: "#0b1f1a" }}>
        <Toolbar sx={{ justifyContent: "space-between", gap: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 180,
                height: 48,
                borderRadius: 2,
                background: "url(https://media.eadbox.com/system/uploads/saas/logo/5a69d696d62b690043d7b38f/308X84.png) center/contain no-repeat",
              }}
            />
          </Stack>
          <Stack direction="row" spacing={3} alignItems="center" sx={{ display: { xs: "none", md: "flex" } }}>
            {navLinks.map((item) => (
              <Link
                key={item.label}
                component="button"
                type="button"
                color="inherit"
                underline="none"
                sx={{ fontWeight: 600, letterSpacing: 0.4 }}
                onClick={() => router.push(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" color="inherit" onClick={() => setActiveTab("register")}>
              Criar conta
            </Button>
            <Button variant="contained" color="secondary" onClick={() => setActiveTab("login")}>Entrar</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 6, md: 8 } }}>
        <Stack spacing={{ xs: 6, md: 8 }}>
          <Paper
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              background: heroBanners[0]?.background,
              color: "#f8fafc",
              minHeight: { xs: 280, md: 360 },
              position: "relative",
              p: { xs: 4, md: 6 },
              boxShadow: "0 32px 60px -32px rgba(8,47,35,0.6)",
            }}
          >
            <Stack spacing={2} sx={{ maxWidth: 440 }}>
              <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 2 }}>
                Plataforma para estudos e pesquisas sobre Umbanda
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                {heroBanners[0]?.title}
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(248,250,252,0.85)" }}>
                {heroBanners[0]?.description}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{ width: "fit-content", fontWeight: 700 }}
                onClick={() => router.push(heroBanners[0]?.href ?? "/catalogo")}
              >
                {heroBanners[0]?.cta}
              </Button>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ position: "absolute", bottom: 24, right: 24 }}>
              {heroBanners.map((banner) => (
                <Paper
                  key={banner.id}
                  sx={{
                    px: 2.5,
                    py: 1,
                    borderRadius: 999,
                    background: "rgba(248,250,252,0.16)",
                    color: "#f8fafc",
                    border: "1px solid rgba(248,250,252,0.24)",
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {banner.title}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Paper>

          <Grid container spacing={4} alignItems="stretch">
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                sx={{
                  borderRadius: 4,
                  p: { xs: 3, md: 4 },
                  background: "linear-gradient(135deg, rgba(247,255,247,0.95), rgba(209,250,229,0.9))",
                  border: "1px solid rgba(12,83,49,0.14)",
                  height: "100%",
                }}
              >
                <Stack spacing={2.5}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f3b28" }}>
                    A Umbanda
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    A Umbanda é uma religião espiritualista e magista nascida no Brasil, que baseia-se no culto a Deus,
                    aos Orixás e aos Guias Espirituais. Compartilhamos conhecimento para estimular irmãos umbandistas a
                    estudarem e desenvolverem consciência religiosa verdadeiramente de Umbanda.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Seja bem-vindo à <strong>Casa do Pai Benedito EAD</strong> – uma referência viva para estudiosos e
                    praticantes que buscam fundamento e responsabilidade em sua jornada.
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                sx={{
                  borderRadius: 4,
                  p: { xs: 3, md: 4 },
                  height: "100%",
                  background: "linear-gradient(135deg, rgba(8,47,35,0.9), rgba(10,62,37,0.86))",
                  color: "#f8fafc",
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Destaques da casa
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(248,250,252,0.78)" }}>
                    Cursos, combos e jornadas que seguem a mesma vitrine do portal oficial. Todo conteúdo aqui é mockado
                    para facilitar a visualização do redesign.
                  </Typography>
                  <Stack spacing={1.5}>
                    {heroBanners.map((banner) => (
                      <Paper
                        key={banner.id}
                        sx={{
                          p: 2.5,
                          borderRadius: 3,
                          background: "rgba(248,250,252,0.12)",
                          border: "1px solid rgba(248,250,252,0.18)",
                          color: "#f8fafc",
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {banner.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(248,250,252,0.7)" }}>
                          {banner.description}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Paper sx={{ borderRadius: 4, p: { xs: 3, md: 5 }, border: "1px solid rgba(12,83,49,0.14)" }}>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Acesse sua conta
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  O layout replica as abas de Login e Cadastro do portal EADBox original. Todos os campos são mockados;
                  nenhum dado é enviado.
                </Typography>
              </Stack>

              <Tabs
                value={activeTab}
                onChange={(_, value) => setActiveTab(value)}
                textColor="primary"
                indicatorColor="primary"
                sx={{ borderBottom: 1, borderColor: "divider" }}
              >
                <Tab label="Login" value="login" sx={{ fontWeight: 600 }} />
                <Tab label="Cadastro" value="register" sx={{ fontWeight: 600 }} />
              </Tabs>

              {activeTab === "login" ? (
                <Box component="form" onSubmit={handleLoginSubmit} sx={{ pt: 2 }}>
                  <Stack spacing={3}>
                    <TextField label="Email" type="email" required placeholder="Digite o email" fullWidth />
                    <TextField label="Senha" type="password" required placeholder="Digite a senha" fullWidth />
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
                      <Link component="button" type="button" variant="body2" onClick={() => alert("Mock: recuperar senha")}>Esqueceu sua senha?</Link>
                      <FormControlLabel control={<Checkbox />} label="Lembrar de mim" />
                    </Stack>
                    <Paper
                      sx={{
                        borderRadius: 3,
                        border: "1px dashed rgba(12,83,49,0.36)",
                        p: 3,
                        textAlign: "center",
                        bgcolor: "rgba(12,83,49,0.05)",
                      }}
                      aria-label="Espaço reservado para o hCaptcha"
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>hCaptcha mockado</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Inseriremos o widget real quando integrarmos o backend.
                      </Typography>
                    </Paper>
                    <Button type="submit" variant="contained" size="large" sx={{ fontWeight: 700 }}>Login</Button>
                  </Stack>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleRegisterSubmit} sx={{ pt: 2 }}>
                  <Stack spacing={3}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <TextField label="Email" type="email" required placeholder="Digite o email" fullWidth />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField label="Nome" required placeholder="Digite o nome" fullWidth />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="País" placeholder="BRA" fullWidth />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="CPF" required placeholder="123.456.789-10" fullWidth />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Telefone" required placeholder="(11) 99999-9999" fullWidth />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Senha" type="password" required fullWidth />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Confirme sua senha" type="password" required fullWidth />
                      </Grid>
                    </Grid>
                    <FormControl required>
                      <FormControlLabel control={<Checkbox required />} label="Declaro que li e concordo com os Termos de Uso e Política de Privacidade" />
                      <FormHelperText>Links mockados conforme a tela original.</FormHelperText>
                    </FormControl>
                    <Paper
                      sx={{
                        borderRadius: 3,
                        border: "1px dashed rgba(12,83,49,0.36)",
                        p: 3,
                        textAlign: "center",
                        bgcolor: "rgba(12,83,49,0.05)",
                      }}
                      aria-label="Espaço reservado para o hCaptcha"
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>hCaptcha mockado</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Placeholder da checagem de segurança exibida na referência.
                      </Typography>
                    </Paper>
                    <Button type="submit" variant="contained" size="large" sx={{ fontWeight: 700 }}>Prosseguir</Button>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Paper>

          <Stack spacing={2}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Cursos em destaque
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Seleção mockada que replica a vitrine original com quatro cursos principais.
            </Typography>
          </Stack>
          <Grid container spacing={3}>
            {featuredCourses.map((course) => (
              <Grid key={course.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <CatalogCourseCard {...course} />
              </Grid>
            ))}
          </Grid>

          <Paper
            sx={{
              borderRadius: 4,
              p: { xs: 3, md: 4 },
              background: "linear-gradient(135deg, rgba(31,159,95,0.16), rgba(251,191,36,0.24))",
              border: "1px solid rgba(12,83,49,0.18)",
            }}
          >
            <Stack spacing={1.5}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Precisa de suporte?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                O atendimento mockado replica o CTA encontrado no rodapé da plataforma original.
              </Typography>
              <Button variant="outlined" onClick={() => alert("Mock: abrir suporte")}>Abrir atendimento</Button>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
}
