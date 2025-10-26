"use client";

import { useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

import { LoginDialog } from "../auth/LoginDialog";
import { ForgotPasswordDialog } from "../auth/ForgotPasswordDialog";

export function Header() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          background: 'linear-gradient(135deg, #0f5c36 0%, #f472b6 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          px: 3,
          py: 2,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" maxWidth="lg" mx="auto">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              component="img"
              src="/Logo_Terr_White-removebg-preview.png"
              alt="Logo Terreiro Tia Maria"
              sx={{ height: 50, width: 'auto' }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
              Terreiro Tia Maria e Cabocla Jupira EAD
            </Typography>
          </Stack>
          <Stack direction="row" spacing={3} alignItems="center">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500, '&:hover': { color: '#f9a8d4' } }}>
                Home
              </Typography>
            </Link>
            <Link href="/catalogo" style={{ textDecoration: 'none' }}>
              <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500, '&:hover': { color: '#f9a8d4' } }}>
                Cursos
              </Typography>
            </Link>
            <Button variant="outlined" onClick={() => setLoginOpen(true)} sx={{ color: '#fff', borderColor: '#fff', '&:hover': { borderColor: '#f9a8d4', color: '#f9a8d4' } }}>
              Login
            </Button>
            <Button variant="contained" color="secondary" onClick={() => setLoginOpen(true)}> {/* Placeholder, talvez criar cadastro */}
              Cadastre-se
            </Button>
          </Stack>
        </Stack>
      </Box>
      <LoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onForgotPassword={() => {
          setLoginOpen(false);
          setForgotOpen(true);
        }}
        onSuccess={() => setLoginOpen(false)}
      />
      <ForgotPasswordDialog open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </>
  );
}