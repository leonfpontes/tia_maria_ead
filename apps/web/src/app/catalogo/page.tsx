"use client";


import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppChrome } from "../../components/layout/AppChrome";
import { SectionTitle } from "../../components/layout/dash/SectionTitle";
import { CourseCard } from "../../components/layout/dash/CourseCard";

export default function CatalogoPage() {
  // Mocked course data
  const cursosMock = [
    {
      id: "oxossi",
      nome: "Trilha Oxóssi",
      descricao: "Desenvolva sua força interior e conexão com a natureza.",
      nivel: "Intermediário",
      aulas: 12,
      destaque: true,
    },
    {
      id: "ancestralidade",
      nome: "Ancestralidade Viva",
      descricao: "Resgate e honre os saberes dos antigos mestres.",
      nivel: "Básico",
      aulas: 8,
      destaque: false,
    },
    {
      id: "cura",
      nome: "Cura Espiritual Umbandista",
      descricao: "Práticas de autocuidado e equilíbrio energético.",
      nivel: "Avançado",
      aulas: 15,
      destaque: false,
    },
    {
      id: "giras",
      nome: "Giras e Rituais",
      descricao: "Entenda o significado dos rituais e giras na Umbanda.",
      nivel: "Básico",
      aulas: 10,
      destaque: false,
    },
  ];

  const filtros = ["Todos", "Básico", "Intermediário", "Avançado"];
  const [filtroSelecionado, setFiltroSelecionado] = useState("Todos");

  const cursosFiltrados = cursosMock.filter(
    (curso) => filtroSelecionado === "Todos" || curso.nivel === filtroSelecionado
  );

  return (
    <AppChrome userName="Maria das Dores" userEmail="maria@exemplo.com" userRole="Estudante">
      <Stack spacing={{ xs: 4, md: 6 }}>
        <SectionTitle
          title="Catálogo de Cursos EAD"
          subtitle="Explore trilhas, aulas e conteúdos para sua jornada."
        />

        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2}>
            {filtros.map((filtro) => (
              <Button
                key={filtro}
                variant={filtroSelecionado === filtro ? "contained" : "outlined"}
                color="primary"
                onClick={() => setFiltroSelecionado(filtro)}
              >
                {filtro}
              </Button>
            ))}
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {cursosFiltrados.map((curso) => (
            <Grid key={curso.id} item xs={12} md={6} lg={4}>
              <CourseCard
                title={curso.nome}
                description={curso.descricao}
                duration="4 semanas"
                lessonsLabel={`${curso.aulas} aulas`}
                ctaLabel="Acessar curso"
                onCtaClick={() => {}}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </AppChrome>
  );
}
