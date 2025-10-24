import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight={800}>
              Bem-vindo à Plataforma EAD Tia Maria
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Este espaço está em construção. Em breve você encontrará cursos, materiais de estudo
              e experiências espirituais guiadas com a qualidade da Tia Maria e Cabocla Jupira.
            </Typography>
            <Button variant="contained" color="primary" size="large">
              Receber novidades
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
