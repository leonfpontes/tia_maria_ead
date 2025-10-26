"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Link from "next/link";

// Dados mockados de cursos concluídos
const completedCourses = [
  {
    id: 1,
    title: "Introdução às Tradições Afro-Brasileiras",
    description: "Fundamentos das religiões de matriz africana no Brasil.",
    completedDate: "2025-10-15",
    certificateId: "CERT-001",
  },
  {
    id: 2,
    title: "Ritualística de Umbanda",
    description: "Aprenda os rituais sagrados e suas significâncias espirituais.",
    completedDate: "2025-09-20",
    certificateId: "CERT-002",
  },
  {
    id: 3,
    title: "História e Cultura Yorubá",
    description: "Exploração profunda da cultura e história do povo Yorubá.",
    completedDate: "2025-08-10",
    certificateId: "CERT-003",
  },
];

export default function CertificadosPage() {
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <WorkspacePremiumRoundedIcon color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Meus Certificados
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Cursos concluídos e certificados disponíveis para download.
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        {completedCourses.map((course) => (
          <Grid key={course.id} size={{ xs: 12, md: 6, lg: 4 }}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(15, 92, 54, 0.1)",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 40px rgba(15, 92, 54, 0.15)",
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CheckCircleRoundedIcon color="success" />
                    <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 600 }}>
                      Concluído em {new Date(course.completedDate).toLocaleDateString("pt-BR")}
                    </Typography>
                  </Stack>

                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                    {course.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {course.description}
                  </Typography>

                  <Box sx={{ mt: "auto" }}>
                    <Button
                      component={Link}
                      href={`/certificados/${course.id}`}
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<WorkspacePremiumRoundedIcon />}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 600,
                        background: "linear-gradient(120deg, #0f5c36, #1f9f5f)",
                        "&:hover": {
                          background: "linear-gradient(120deg, #0a4228, #177e4a)",
                        },
                      }}
                    >
                      Acessar Certificado
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {completedCourses.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <WorkspacePremiumRoundedIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Nenhum certificado disponível ainda
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete seus cursos para receber certificados de conclusão.
          </Typography>
          <Button
            component={Link}
            href="/catalogo"
            variant="outlined"
            color="primary"
            sx={{ mt: 3 }}
          >
            Explorar cursos
          </Button>
        </Box>
      )}
    </Box>
  );
}