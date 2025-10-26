"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";

export function Footer() {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #0f5c36 0%, #f472b6 100%)',
        borderTop: '1px solid rgba(255,255,255,0.2)',
        px: 3,
        py: 3,
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        maxWidth="lg"
        mx="auto"
      >
        <Typography variant="body2" sx={{ color: '#fff', textAlign: { xs: 'center', md: 'left' } }}>
          © 2025 Terreiro Tia Maria e Cabocla Jupira. Todos os direitos reservados.
        </Typography>

        <Box
          component="img"
          src="/Logo_Terr_White-removebg-preview.png"
          alt="Logo Terreiro Tia Maria"
          sx={{ height: 60, width: 'auto' }}
        />

        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
            Fale conosco:
          </Typography>
          <IconButton
            href="https://www.instagram.com/terreirotiamariaecaboclajupira/"
            target="_blank"
            rel="noreferrer"
            sx={{
              color: '#fff',
              '&:hover': { color: '#f9a8d4' },
            }}
          >
            <InstagramIcon />
          </IconButton>
          <IconButton
            href="https://api.whatsapp.com/message/5CVUD77PM674E1?autoload=1&app_absent=0"
            target="_blank"
            rel="noreferrer"
            sx={{
              color: '#fff',
              '&:hover': { color: '#f9a8d4' },
            }}
          >
            <WhatsAppIcon />
          </IconButton>
          <IconButton
            href="mailto:terreirotiamariaecaboclajupira@outlook.com"
            sx={{
              color: '#fff',
              '&:hover': { color: '#f9a8d4' },
            }}
          >
            <EmailIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}