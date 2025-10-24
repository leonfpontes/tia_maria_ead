"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, Button, Card, Container, TextField, Typography } from "@mui/material";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export default function ResetPasswordPage() {
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  useEffect(() => {
    if (!token) {
      setError("Link de recuperação inválido. Solicite um novo e-mail.");
    }
  }, [token]);

  async function handleSubmit() {
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Link de recuperação inválido. Solicite um novo e-mail.");
      return;
    }

    if (senha.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (senha !== confirmacao) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nova_senha: senha }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.detail ?? "Token inválido ou expirado.");
      }

      setSuccess("Senha redefinida com sucesso! Redirecionando...");
      setTimeout(() => router.push("/"), 2500);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao redefinir senha";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: { xs: 6, md: 10 } }}>
      <Card sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
        <Typography variant="h5" component="h1" fontWeight={700} mb={2}>
          Redefinir senha
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Informe uma nova senha para finalizar a recuperação de acesso. Certifique-se de lembrar dela
          ou armazená-la com segurança.
        </Typography>
        <TextField
          label="Nova senha"
          type="password"
          fullWidth
          margin="normal"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
        />
        <TextField
          label="Confirmar nova senha"
          type="password"
          fullWidth
          margin="normal"
          value={confirmacao}
          onChange={(event) => setConfirmacao(event.target.value)}
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
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleSubmit}
          disabled={loading || !token}
        >
          {loading ? "Atualizando..." : "Redefinir senha"}
        </Button>
      </Card>
    </Container>
  );
}
