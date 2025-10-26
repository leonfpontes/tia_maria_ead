"use client";

import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import Link from "next/link";

// Dados mockados de cursos (mesmo que na página principal)
const mockCourses = {
  1: {
    id: 1,
    title: "Introdução às Tradições Afro-Brasileiras",
    description: "Fundamentos das religiões de matriz africana no Brasil.",
    completedDate: "2025-10-15",
    certificateId: "CERT-001",
    studentName: "João Silva",
  },
  2: {
    id: 2,
    title: "Ritualística de Umbanda",
    description: "Aprenda os rituais sagrados e suas significâncias espirituais.",
    completedDate: "2025-09-20",
    certificateId: "CERT-002",
    studentName: "João Silva",
  },
  3: {
    id: 3,
    title: "História e Cultura Yorubá",
    description: "Exploração profunda da cultura e história do povo Yorubá.",
    completedDate: "2025-08-10",
    certificateId: "CERT-003",
    studentName: "João Silva",
  },
};

function CertificateViewer({ course }: { course: any }) {
  return (
    <Card
      sx={{
        maxWidth: 800,
        mx: "auto",
        borderRadius: 4,
        boxShadow: "0 16px 48px rgba(15, 92, 54, 0.2)",
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        border: "2px solid rgba(31, 159, 95, 0.1)",
      }}
    >
      <CardContent sx={{ p: 6 }}>
        <Stack spacing={4} alignItems="center" textAlign="center">
          {/* Header com logo/emblema */}
          <Box sx={{ mb: 2 }}>
            <WorkspacePremiumRoundedIcon
              sx={{
                fontSize: 80,
                color: "primary.main",
                mb: 2,
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "primary.main",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                mb: 1,
              }}
            >
              Tia Maria EAD
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Portal Sagrado de Conhecimento
            </Typography>
          </Box>

          {/* Título do certificado */}
          <Box sx={{ py: 2 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                mb: 2,
                fontStyle: "italic",
              }}
            >
              Certificado de Conclusão
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.1rem" }}>
              Este certificado atesta que
            </Typography>
          </Box>

          {/* Nome do aluno */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              borderBottom: "2px solid rgba(31, 159, 95, 0.3)",
              pb: 1,
              px: 3,
            }}
          >
            {course.studentName}
          </Typography>

          {/* Descrição do curso */}
          <Box sx={{ maxWidth: 500 }}>
            <Typography variant="body1" sx={{ mb: 1, fontSize: "1.1rem" }}>
              concluiu com êxito o curso de
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              {course.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {course.description}
            </Typography>
          </Box>

          {/* Data e assinatura */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={4} sx={{ mt: 4, width: "100%" }}>
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Data de Conclusão
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {new Date(course.completedDate).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Certificado ID
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: "monospace" }}>
                {course.certificateId}
              </Typography>
            </Box>
          </Stack>

          {/* Assinatura */}
          <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid rgba(31, 159, 95, 0.2)", width: "100%" }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Assinado digitalmente por
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
              Tia Maria EAD
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Portal Sagrado • www.tiamariaead.com
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function CertificadoPage() {
  const params = useParams();
  const courseId = params.id as string;
  const course = mockCourses[parseInt(courseId) as keyof typeof mockCourses];

  if (!course) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="error">
          Certificado não encontrado
        </Typography>
        <Button component={Link} href="/certificados" variant="outlined" sx={{ mt: 2 }}>
          Voltar aos certificados
        </Button>
      </Box>
    );
  }

  const handleDownload = () => {
    // Mock download - em produção, isso seria um link para PDF gerado
    alert("Download do certificado iniciado! (Mock - em produção seria um PDF real)");
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <Button
          component={Link}
          href="/certificados"
          startIcon={<ArrowBackRoundedIcon />}
          variant="outlined"
          sx={{ mr: 2 }}
        >
          Voltar
        </Button>
        <WorkspacePremiumRoundedIcon color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Certificado de Conclusão
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {course.title}
          </Typography>
        </Box>
      </Stack>

      <CertificateViewer course={course} />

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button
          onClick={handleDownload}
          variant="contained"
          color="primary"
          size="large"
          startIcon={<DownloadRoundedIcon />}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 600,
            background: "linear-gradient(120deg, #0f5c36, #1f9f5f)",
            "&:hover": {
              background: "linear-gradient(120deg, #0a4228, #177e4a)",
            },
          }}
        >
          Baixar Certificado (PDF)
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
          Arquivo em formato PDF, pronto para impressão ou compartilhamento.
        </Typography>
      </Box>
    </Box>
  );
}