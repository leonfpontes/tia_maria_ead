"use client";

import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { AppChrome } from "../../components/layout/AppChrome";
import { SectionTitle } from "../../components/layout/dash/SectionTitle";

export default function AreaAlunoPage() {
  // Mocked user and progress
  const user = {
    nome: "Maria das Dores",
    email: "maria@exemplo.com",
    tipo: "aluno",
    avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
  };
  const cursosEmAndamento = [
    {
      id: "oxossi",
      nome: "Trilha Oxóssi",
      progresso: 75,
      aulas: 12,
    },
    {
      id: "ancestralidade",
      nome: "Ancestralidade Viva",
      progresso: 40,
      aulas: 8,
    },
  ];
  const certificados = [
    {
      id: "cura",
      nome: "Cura Espiritual Umbandista",
      data: "10/10/2025",
      url: "#",
    },
  ];

  return (
    <AppChrome userName={user.nome} userEmail={user.email} userRole="Estudante">
      <Stack spacing={{ xs: 4, md: 6 }}>
        <SectionTitle
          title="Área do Aluno"
          subtitle="Seu perfil, progresso e conquistas na plataforma."
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
          <Avatar src={user.avatarUrl} sx={{ width: 80, height: 80 }} />
          <Stack>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{user.nome}</Typography>
            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>Estudante</Typography>
          </Stack>
        </Box>

        <SectionTitle title="Cursos em andamento" subtitle="Continue sua jornada de aprendizado." />
        <Grid container spacing={3}>
          {cursosEmAndamento.map((curso) => (
            <Grid key={curso.id} item xs={12} md={6}>
              <Box sx={{ p: 3, borderRadius: 3, border: "1px solid #e0e0e0", background: "#fafafa" }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{curso.nome}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {curso.aulas} aulas • {curso.progresso}% concluído
                </Typography>
                <Box sx={{ width: "100%", background: "#e0e0e0", borderRadius: 2, height: 8, mb: 2 }}>
                  <Box sx={{ width: `${curso.progresso}%`, background: "#1976d2", height: 8, borderRadius: 2 }} />
                </Box>
                <Button variant="contained" color="primary" size="small">Continuar curso</Button>
              </Box>
            </Grid>
          ))}
        </Grid>

        <SectionTitle title="Certificados" subtitle="Comprove suas conquistas." />
        <Grid container spacing={3}>
          {certificados.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">Nenhum certificado disponível ainda.</Typography>
            </Grid>
          ) : certificados.map((cert) => (
            <Grid key={cert.id} item xs={12} md={6}>
              <Box sx={{ p: 3, borderRadius: 3, border: "1px solid #e0e0e0", background: "#f5fff5" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{cert.nome}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Emitido em {cert.data}
                </Typography>
                <Button variant="outlined" color="success" size="small" href={cert.url}>
                  Ver certificado
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </AppChrome>
  );
}
