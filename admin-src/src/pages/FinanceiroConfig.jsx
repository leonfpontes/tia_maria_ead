import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControlLabel,
  Snackbar,
  Switch,
  Typography,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import AppLayout from '../components/AppLayout';
import { useApi } from '../hooks/useApi';

export default function FinanceiroConfig() {
  const api = useApi();

  const [emailAtivo, setEmailAtivo] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  useEffect(() => {
    api('/api/admin/config')
      .then((r) => r.json())
      .then((data) => {
        setEmailAtivo(data.email_confirmacao_ativo ?? true);
      })
      .catch(() => {
        setSnack({ open: true, msg: 'Erro ao carregar configurações.', severity: 'error' });
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleToggleEmail(event) {
    const novoValor = event.target.checked;
    setEmailAtivo(novoValor);
    setSaving(true);
    try {
      const r = await api('/api/admin/config', {
        method: 'PUT',
        body: JSON.stringify({ email_confirmacao_ativo: novoValor }),
      });
      if (!r.ok) throw new Error();
      setSnack({
        open: true,
        msg: novoValor
          ? 'E-mail de confirmação habilitado.'
          : 'E-mail de confirmação desabilitado.',
        severity: 'success',
      });
    } catch {
      setEmailAtivo((v) => !v); // reverter
      setSnack({ open: true, msg: 'Erro ao salvar configuração.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppLayout title="Financeiro · Configurações">
      <Box sx={{ maxWidth: 600 }}>
        <Typography variant="h6" fontWeight={700} mb={0.5}>
          Configurações do Financeiro
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Ajustes globais do módulo financeiro. Outras configurações serão adicionadas conforme
          o módulo de mensalidades for implantado.
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <Card variant="outlined">
            <CardContent>
              {/* Header do card */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <EmailIcon fontSize="small" color="primary" />
                <Typography variant="subtitle1" fontWeight={600}>
                  E-mails transacionais
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={emailAtivo}
                    onChange={handleToggleEmail}
                    disabled={saving}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      Enviar e-mail de confirmação de senha
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {emailAtivo
                        ? 'Cada consulente recebe um e-mail ao retirar senha online.'
                        : 'Nenhum e-mail será enviado ao retirar senha. Útil para evitar envios desnecessários antes de configurar o módulo de mensalidades.'}
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: 'flex-start', gap: 1 }}
              />
            </CardContent>
          </Card>
        )}
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          variant="filled"
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
}
