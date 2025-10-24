"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type ForgotPasswordDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function ForgotPasswordDialog({ open, onClose }: ForgotPasswordDialogProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/request-password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.detail ?? "Erro ao solicitar recuperação");
      }

      const data = await response.json();
      setSuccess(data?.message ?? "Se o e-mail estiver cadastrado, enviaremos instruções.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao enviar solicitação";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setEmail("");
    setSuccess(null);
    setError(null);
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Recuperar senha</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <TextField
          label="E-mail"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Fechar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading || !email}
        >
          {loading ? "Enviando..." : "Enviar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
