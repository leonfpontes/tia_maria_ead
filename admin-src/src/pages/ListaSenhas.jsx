import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import AppLayout from '../components/AppLayout';
import { useApi } from '../hooks/useApi';
import { formatPhoneDisplay, normalizeDisplayText } from '../utils/formatters';
import { formatDatetimeBR, formatDateBR, formatTimeBR } from '../utils/dates';

const STATUS_COLORS = {
  ATIVA: 'success',
  ATENDIDA: 'info',
  NO_SHOW: 'warning',
  CANCELADA: 'error',
};

const STATUS_CHANGE_OPTIONS = {
  ATIVA: [
    { value: 'ATENDIDA', label: 'Atendida' },
    { value: 'NO_SHOW', label: 'No-Show' },
    { value: 'CANCELADA', label: 'Cancelar' },
  ],
  ATENDIDA: [{ value: 'ATIVA', label: '↩ Desfazer' }],
  NO_SHOW: [{ value: 'ATIVA', label: '↩ Desfazer' }],
};

const METRICS_DEF = [
  { key: 'emitidas', label: 'Emitidas', color: '#4ade80' },
  { key: 'atendidas', label: 'Atendidas', color: '#93c5fd' },
  { key: 'noShow', label: 'No-Show', color: '#fbbf24' },
  { key: 'walkIn', label: 'Walk-in', color: '#c4b5fd' },
  { key: 'preferenciais', label: 'Preferenciais', color: '#fcd34d' },
];

function buildMetrics(rows) {
  return {
    emitidas: rows.filter((s) => s.status !== 'CANCELADA').length,
    atendidas: rows.filter((s) => s.status === 'ATENDIDA').length,
    noShow: rows.filter((s) => s.status === 'NO_SHOW').length,
    walkIn: rows.filter((s) => s.is_walk_in).length,
    preferenciais: rows.filter((s) => s.is_preferencial).length,
  };
}

export default function ListaSenhas() {
  const { id: giraId } = useParams();
  const navigate = useNavigate();
  const api = useApi();

  const [senhas, setSenhas] = useState([]);
  const [giraInfo, setGiraInfo] = useState(null);
  const [busca, setBusca] = useState('');
  const [soPreferencial, setSoPreferencial] = useState(false);
  const [soCheckin, setSoCheckin] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const loadSenhas = useCallback(
    async (searchVal = '') => {
      if (!giraId) return;
      setLoading(true);
      try {
        let url = `/api/admin/giras/${giraId}/senhas?telefone_completo=1`;
        if (searchVal) url += `&busca=${encodeURIComponent(searchVal)}`;
        const r = await api(url);
        const data = await r.json();
        setSenhas(Array.isArray(data) ? data : []);
        // Try to get gira info from the first row
        if (Array.isArray(data) && data.length > 0 && data[0].gira_titulo) {
          setGiraInfo({ titulo: data[0].gira_titulo });
        }
      } catch (e) {
        console.error(e);
        setAlert({ severity: 'error', message: 'Erro ao carregar senhas.' });
      } finally {
        setLoading(false);
      }
    },
    [api, giraId]
  );

  useEffect(() => {
    if (!giraId) return;
    // Also fetch gira info
    api(`/api/admin/giras/${giraId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setGiraInfo(d); })
      .catch(() => {});
    loadSenhas();
  }, [giraId, api, loadSenhas]);

  // Filtered rows
  const displayRows = useMemo(() => {
    return senhas.filter((s) => {
      if (soPreferencial && !s.is_preferencial) return false;
      if (soCheckin && !s.chegada_em) return false;
      return true;
    });
  }, [senhas, soPreferencial, soCheckin]);

  const metrics = useMemo(() => buildMetrics(senhas), [senhas]);

  function handleBuscaChange(val) {
    setBusca(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => loadSenhas(val), 300);
  }

  async function alterarStatus(id, status) {
    try {
      const r = await api(`/api/admin/senhas/${id}?action=status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      if (r.ok) {
        loadSenhas(busca);
      } else {
        const d = await r.json();
        setAlert({ severity: 'error', message: d.mensagem || 'Erro ao atualizar status.' });
      }
    } catch {
      setAlert({ severity: 'error', message: 'Erro de conexão.' });
    }
  }

  async function registrarCheckin(id) {
    try {
      const r = await api(`/api/admin/senhas/${id}?action=checkin`, {
        method: 'PATCH',
        body: JSON.stringify({ checkin: true }),
      });
      if (r.ok) loadSenhas(busca);
      else {
        const d = await r.json();
        setAlert({ severity: 'error', message: d.mensagem || 'Erro.' });
      }
    } catch {
      setAlert({ severity: 'error', message: 'Erro de conexão.' });
    }
  }

  function exportarCSV() {
    const bom = '\uFEFF';
    const header = 'Numero,Nome,Telefone,Email,Status,Preferencial,Walk-in,Check-in,Atendida em\r\n';
    const rows = senhas.map((s) => {
      const cols = [
        String(s.numero).padStart(2, '0'),
        `"${normalizeDisplayText(s.nome).replace(/"/g, '""')}"`,
        `"${formatPhoneDisplay(s.telefone)}"`,
        `"${s.email || ''}"`,
        s.status,
        s.is_preferencial ? 'Sim' : 'Não',
        s.is_walk_in ? 'Sim' : 'Não',
        s.chegada_em ? formatDatetimeBR(s.chegada_em) : '',
        s.atendida_em ? formatDatetimeBR(s.atendida_em) : '',
      ];
      return cols.join(',');
    });
    const csv = bom + header + rows.join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const giraTitulo = giraInfo?.titulo?.replace(/\s+/g, '_').slice(0, 30) || giraId;
    a.download = `senhas_${giraTitulo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!giraId) {
    return (
      <AppLayout title="Lista de Senhas">
        <Box p={3} textAlign="center">
          <Alert severity="warning" sx={{ mb: 2 }}>
            Nenhuma gira selecionada. Volte para Giras e clique em "Lista de Senhas".
          </Alert>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/gira')}>
            Voltar para Giras
          </Button>
        </Box>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={giraInfo ? `Senhas — ${normalizeDisplayText(giraInfo.titulo)}` : 'Lista de Senhas'}>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={1.5} mb={3} flexWrap="wrap">
          <IconButton onClick={() => navigate('/gira')} size="small" aria-label="Voltar para Giras">
            <ArrowBackIcon />
          </IconButton>
          <Box flex={1}>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              Lista de Senhas
            </Typography>
            {giraInfo && (
              <Typography variant="body2" color="text.secondary">
                {normalizeDisplayText(giraInfo.titulo)}
                {giraInfo.data_inicio
                  ? ` — ${formatDateBR(giraInfo.data_inicio)}`
                  : ''}
              </Typography>
            )}
          </Box>
        </Box>

        {alert && (
          <Alert severity={alert.severity} onClose={() => setAlert(null)} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}

        {/* Filters + actions */}
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Grid container spacing={1.5} alignItems="center">
              <Grid item xs={12} sm={4} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Busca por número ou nome..."
                  value={busca}
                  onChange={(e) => handleBuscaChange(e.target.value)}
                />
              </Grid>
              <Grid item xs={6} sm="auto">
                <FormControlLabel
                  control={
                    <Switch
                      checked={soPreferencial}
                      onChange={(e) => setSoPreferencial(e.target.checked)}
                      size="small"
                      color="warning"
                    />
                  }
                  label={<Typography variant="body2">Só Preferenciais</Typography>}
                />
              </Grid>
              <Grid item xs={6} sm="auto">
                <FormControlLabel
                  control={
                    <Switch
                      checked={soCheckin}
                      onChange={(e) => setSoCheckin(e.target.checked)}
                      size="small"
                      color="info"
                    />
                  }
                  label={<Typography variant="body2">Só com Check-in</Typography>}
                />
              </Grid>
              <Grid item xs="auto" sx={{ ml: 'auto' }}>
                <Box display="flex" gap={1}>
                  <Tooltip title="Atualizar">
                    <IconButton
                      size="small"
                      onClick={() => loadSenhas(busca)}
                      aria-label="Atualizar"
                      disabled={loading}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Exportar CSV">
                    <IconButton
                      size="small"
                      onClick={exportarCSV}
                      aria-label="Exportar CSV"
                      disabled={senhas.length === 0}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Big numbers */}
        <Grid container spacing={1.5} mb={2}>
          {METRICS_DEF.map(({ key, label, color }) => (
            <Grid item xs key={key}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{ color, fontVariantNumeric: 'tabular-nums' }}
                  >
                    {metrics[key]}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" display="block">
                    {label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Table */}
        <Card>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Telefone</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Check-in</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.disabled' }}>
                      {loading ? 'Carregando...' : 'Nenhuma senha encontrada.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  displayRows.map((s) => (
                    <TableRow key={s.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={0.75}>
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{ fontVariantNumeric: 'tabular-nums' }}
                          >
                            #{String(s.numero).padStart(2, '0')}
                          </Typography>
                          {s.is_preferencial && (
                            <Tooltip title="Preferencial">
                              <span style={{ fontSize: '0.9rem' }}>⭐</span>
                            </Tooltip>
                          )}
                          {s.is_walk_in && (
                            <Chip
                              label="WI"
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.6rem',
                                bgcolor: 'rgba(168,117,255,0.18)',
                                color: '#c4b5fd',
                                border: '1px solid rgba(168,117,255,0.3)',
                              }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>
                          {normalizeDisplayText(s.nome)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                        <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                          {formatPhoneDisplay(s.telefone)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 160 }}>
                          {s.email || '–'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={s.status}
                          color={STATUS_COLORS[s.status] || 'default'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        {s.chegada_em ? (
                          <Typography
                            variant="caption"
                            sx={{ color: '#86efac', whiteSpace: 'nowrap' }}
                          >
                            ✅ {formatTimeBR(s.chegada_em)}
                          </Typography>
                        ) : (
                          <Typography variant="caption" color="text.disabled">
                            –
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Box display="flex" justifyContent="flex-end" gap={0.5} flexWrap="wrap">
                          {/* Status actions */}
                          {(STATUS_CHANGE_OPTIONS[s.status] || []).map((opt) => (
                            <Button
                              key={opt.value}
                              size="small"
                              variant="outlined"
                              onClick={() => alterarStatus(s.id, opt.value)}
                              sx={{ fontSize: '0.7rem', p: '2px 6px', minWidth: 'unset' }}
                            >
                              {opt.label}
                            </Button>
                          ))}
                          {/* Check-in button if ATIVA and no check-in */}
                          {s.status === 'ATIVA' && !s.chegada_em && (
                            <Tooltip title="Registrar Check-in">
                              <Button
                                size="small"
                                variant="outlined"
                                color="info"
                                onClick={() => registrarCheckin(s.id)}
                                sx={{ fontSize: '0.7rem', p: '2px 6px', minWidth: 'unset' }}
                              >
                                📍 Check-in
                              </Button>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {displayRows.length > 0 && (
          <Typography variant="caption" color="text.disabled" display="block" mt={1} textAlign="right">
            Exibindo {displayRows.length} de {senhas.length} senhas
          </Typography>
        )}
      </Box>
    </AppLayout>
  );
}
