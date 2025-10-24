"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  TextField,
  Typography,
} from "@mui/material";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type LoginDialogProps = {
  open: boolean;
  onClose: () => void;
  onForgotPassword: () => void;
  onSuccess: (payload: { token: string; nome: string; email: string; tipo: "admin" | "aluno" }) => void;
};

export function LoginDialog({ open, onClose, onForgotPassword, onSuccess }: LoginDialogProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setError(null);
    if (!email || !senha) {
      setError("Informe e-mail e senha para continuar");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.detail ?? "Credenciais inválidas");
      }

      const data = await response.json();
      localStorage.setItem("tia-maria-token", data.token);
      onSuccess(data);
      setEmail("");
      setSenha("");
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao entrar";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setEmail("");
    setSenha("");
    setError(null);
    setLoading(false);
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Entrar na plataforma</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <TextField
          label="E-mail"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          label="Senha"
          type="password"
          fullWidth
          margin="normal"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
        />
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Esqueceu a senha? {" "}
            <Link component="button" type="button" onClick={onForgotPassword} sx={{ fontWeight: 600 }}>
              Recuperar acesso
            </Link>
          </Typography>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleLogin} variant="contained" color="primary" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
