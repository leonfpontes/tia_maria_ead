"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import WhatshotRoundedIcon from "@mui/icons-material/WhatshotRounded";

import { AppChrome } from "../../components/layout/AppChrome";
import { CatalogCourseCard } from "../../components/catalog/CatalogCourseCard";

const navigationLinks = ["Home", "Cursos", "Combo Esquerda", "Combo Mineral", "Atendimento", "Comunidade"];

const catalogCategories = [
  "Todas as categorias",
  "Teologia de Umbanda",
  "Rituais e Trabalhos",
  "Workshops e Vivências",
  "Combos Especiais",
  "Consultas e Atendimentos",
];

const courseCatalog = [
  {
    id: "obi-oraculo",
    title: "Obi: O Oráculo dos Orixás",
    summary: "Mergulhe no poder ancestral do Obi e aprenda leituras, rituais e fundamentos para orientar decisões sagradas.",
    price: "R$ 147,00",
    category: "Teologia de Umbanda",
    accent: "linear-gradient(135deg, #a83256 0%, #f5a623 100%)",
    tag: "Mais vendido",
    lessonsLabel: "24 aulas • 7 módulos",
    highlight: true,
    typeLabel: "Curso",
  },
  {
    id: "ogum-tradicao",
    title: "Orixá Ogum: Da Tradição Yorubá à Umbanda",
    summary: "Conheça a jornada de Ogum e como sua força se manifesta nos rituais de Umbanda.",
    price: "R$ 127,00",
    category: "Teologia de Umbanda",
    accent: "linear-gradient(135deg, #0f172a 0%, #22d3ee 100%)",
    tag: "Novo",
    lessonsLabel: "18 aulas • 6 módulos",
    typeLabel: "Curso",
  },
  {
    id: "magia-tambor",
    title: "Magia do Tambor – Curimba Online",
    summary: "Aprenda toques, cantos e fundamentos para conduzir giras com segurança e potência sonora.",
    price: "R$ 125,00",
    category: "Rituais e Trabalhos",
    accent: "linear-gradient(135deg, #1f2937 0%, #f59e0b 100%)",
    lessonsLabel: "16 aulas • 5 módulos",
    typeLabel: "Curso",
  },
  {
    id: "oxum-prosperidade",
    title: "Oxum, a Senhora da Prosperidade",
    summary: "Rituais de prosperidade, firmezas e banhos dedicados à energia doce de Oxum.",
    price: "R$ 124,00",
    category: "Rituais e Trabalhos",
    accent: "linear-gradient(135deg, #fbbf24 0%, #7c3aed 100%)",
    lessonsLabel: "12 aulas • 4 módulos",
    typeLabel: "Curso",
  },
  {
    id: "umbanda-primeiros-passos",
    title: "Umbanda Primeiros Passos",
    summary: "Fundamentos da religião, calendário litúrgico e ética do médiuns em treinamento.",
    price: "R$ 117,00",
    category: "Teologia de Umbanda",
    accent: "linear-gradient(135deg, #0f766e 0%, #7dd3fc 100%)",
    tag: "Essencial",
    lessonsLabel: "20 aulas • 6 módulos",
    typeLabel: "Curso",
  },
  {
    id: "workshop-exu-ouro",
    title: "Workshop Exu do Ouro",
    summary: "Vivência intensa sobre prosperidade, firmezas com Exu do Ouro e abertura de caminhos.",
    price: "R$ 127,00",
    category: "Workshops e Vivências",
    accent: "linear-gradient(135deg, #1f2937 0%, #fbbf24 100%)",
    lessonsLabel: "Evento gravado • 4h de conteúdo",
    typeLabel: "Workshop",
  },
  {
    id: "rituais-ano-novo",
    title: "Rituais de Ano Novo",
    summary: "Planeje a passagem com firmezas, oferendas e banhos de renovação para a nova gira.",
    price: "R$ 99,00",
    oldPrice: "R$ 127,00",
    category: "Rituais e Trabalhos",
    accent: "linear-gradient(135deg, #0f172a 0%, #38bdf8 100%)",
    tag: "Promoção",
    lessonsLabel: "8 aulas • bônus prático",
    typeLabel: "Curso",
  },
  {
    id: "quartinha-fundamentos",
    title: "Quartinha, Fundamento e Prática",
    summary: "Aprenda a consagrar, limpar e movimentar as quartinhas no altar e na gira.",
    price: "R$ 107,00",
    category: "Rituais e Trabalhos",
    accent: "linear-gradient(135deg, #0b3b60 0%, #38bdf8 100%)",
    lessonsLabel: "15 aulas • 5 módulos",
    typeLabel: "Curso",
  },
  {
    id: "combo-misterios-esquerda",
    title: "Combo Mistérios da Esquerda",
    summary: "Pacote completo sobre Exus e Pombagiras com rituais, padês e firmezas exclusivas.",
    price: "R$ 247,00",
    oldPrice: "R$ 297,00",
    category: "Combos Especiais",
    accent: "linear-gradient(135deg, #581c87 0%, #f97316 100%)",
    tag: "Combo",
    lessonsLabel: "3 cursos • 54 aulas",
    typeLabel: "Combo",
  },
  {
    id: "combo-umbanda-mineral",
    title: "Combo Umbanda Mineral",
    summary: "Cristais, ervas e fundamentos minerais aplicados às giras e atendimentos.",
    price: "R$ 219,00",
    oldPrice: "R$ 279,00",
    category: "Combos Especiais",
    accent: "linear-gradient(135deg, #0f766e 0%, #22d3ee 100%)",
    tag: "Coleção",
    lessonsLabel: "2 cursos + bônus",
    typeLabel: "Combo",
  },
  {
    id: "consultas-especiais",
    title: "Consultas e Orientação Mediúnica",
    summary: "Agende um atendimento online com mentoria individual para dúvidas e direcionamentos.",
    price: "R$ 180,00",
    category: "Consultas e Atendimentos",
    accent: "linear-gradient(135deg, #1e293b 0%, #fcd34d 100%)",
    tag: "Agenda aberta",
    lessonsLabel: "Sessão ao vivo • 60 minutos",
    typeLabel: "Atendimento",
  },
];

export default function CatalogoPage() {
  const [activeNav, setActiveNav] = useState("Cursos");
  const [selectedCategory, setSelectedCategory] = useState("Todas as categorias");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();

    return courseCatalog.filter((course) => {
      const matchesCategory =
        selectedCategory === "Todas as categorias" || course.category === selectedCategory;

      const matchesSearch =
        lowerSearch.length === 0 ||
        course.title.toLowerCase().includes(lowerSearch) ||
        course.summary.toLowerCase().includes(lowerSearch) ||
        course.category.toLowerCase().includes(lowerSearch);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <AppChrome userName="Maria das Dores" userEmail="maria@exemplo.com" userRole="Estudante">
      <Stack spacing={{ xs: 4, md: 6 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            px: { xs: 3, md: 5 },
            py: { xs: 4, md: 5 },
            background: "linear-gradient(120deg, rgba(15,92,54,0.12) 0%, rgba(31,159,95,0.08) 100%)",
            border: "1px solid rgba(15, 92, 54, 0.12)",
            boxShadow: "0 24px 60px -32px rgba(15, 92, 54, 0.45)",
          }}
        >
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
            >
              <Stack spacing={1.5}>
                <Typography variant="overline" color="success.main" sx={{ letterSpacing: "0.14em", fontWeight: 600 }}>
                  Catálogo EAD
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  Escolha seu próximo aprendizado sagrado
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520 }}>
                  Explore cursos, workshops e combos criados para ampliar sua conexão com a Umbanda. Tudo mockado
                  para validar a nova experiência.
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {navigationLinks.map((link) => (
                  <Chip
                    key={link}
                    label={link}
                    variant={activeNav === link ? "filled" : "outlined"}
                    color={activeNav === link ? "primary" : "default"}
                    onClick={() => setActiveNav(link)}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      bgcolor: activeNav === link ? "primary.main" : "rgba(15,92,54,0.06)",
                      color: activeNav === link ? "primary.contrastText" : "text.primary",
                    }}
                  />
                ))}
              </Stack>
            </Stack>

            <Divider sx={{ borderColor: "rgba(15, 92, 54, 0.1)" }} />

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", md: "center" }}
            >
              <OutlinedInput
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por cursos, combos ou temas"
                fullWidth
                startAdornment={
                  <InputAdornment position="start">
                    <SearchRoundedIcon color="primary" />
                  </InputAdornment>
                }
                sx={{
                  maxWidth: { md: 420 },
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: 999,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(15,92,54,0.2)",
                  },
                }}
              />

              <Stack direction="row" spacing={1.5} alignItems="center">
                <Chip
                  icon={<WhatshotRoundedIcon />}
                  label={`${filteredCourses.length} cursos disponíveis`}
                  color="success"
                  sx={{ fontWeight: 600, borderRadius: 2 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<TuneRoundedIcon />}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    borderColor: "rgba(15,92,54,0.2)",
                    color: "text.primary",
                  }}
                >
                  Ordenar por destaque
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "280px 1fr" },
            gap: { xs: 3, md: 5 },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              p: 3,
              border: "1px solid rgba(15,92,54,0.08)",
              background: "linear-gradient(180deg, rgba(248,250,252,0.96) 0%, rgba(255,255,255,0.98) 100%)",
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Categorias
              </Typography>
              <Divider sx={{ borderColor: "rgba(15,92,54,0.12)" }} />
              <List disablePadding>
                {catalogCategories.map((category) => {
                  const selected = selectedCategory === category;
                  return (
                    <ListItemButton
                      key={category}
                      selected={selected}
                      onClick={() => setSelectedCategory(category)}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        color: selected ? "primary.main" : "text.primary",
                        fontWeight: selected ? 700 : 500,
                      }}
                    >
                      <ListItemText primary={category} />
                    </ListItemButton>
                  );
                })}
              </List>

              <Divider sx={{ borderColor: "rgba(15,92,54,0.12)" }} />

              <Stack spacing={1.5}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Coleções em destaque
                </Typography>
                <Stack direction="column" spacing={1}>
                  <Chip
                    label="Tradição e Teologia"
                    variant="outlined"
                    sx={{ alignSelf: "flex-start", borderRadius: 2, fontWeight: 600 }}
                  />
                  <Chip
                    label="Rituais de Prosperidade"
                    variant="outlined"
                    color="secondary"
                    sx={{
                      alignSelf: "flex-start",
                      borderRadius: 2,
                      fontWeight: 600,
                      borderColor: "rgba(251,191,36,0.6)",
                      color: "#7c2d12",
                      background: "rgba(251,191,36,0.18)",
                    }}
                  />
                </Stack>
              </Stack>
            </Stack>
          </Paper>

          <Stack spacing={4}>
            <Grid container spacing={3}>
              {filteredCourses.map((course) => (
                <Grid key={course.id} size={{ xs: 12, sm: 6, xl: 4 }}>
                  <CatalogCourseCard {...course} />
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Box>
      </Stack>
    </AppChrome>
  );
}
