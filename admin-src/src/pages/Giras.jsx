import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Drawer,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import KeyIcon from '@mui/icons-material/Key';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import AppLayout from '../components/AppLayout';
import { useApi } from '../hooks/useApi';
import { toDateOnlyInSaoPaulo, toDatetimeLocalValue, fromDatetimeLocalToSaoPaulo, formatDatetimeBR } from '../utils/dates';
import { formatTipoCardLabel, normalizeDisplayText } from '../utils/formatters';

const TIPO_CARD_OPTIONS = [
  { value: 'EXU_POMBOGIRA', label: 'Exus e Pombogiras' },
  { value: 'PRETOS_VELHOS', label: 'Pretos Velhos' },
  { value: 'CABOCLOS_BOIADEIROS', label: 'Caboclos e Boiadeiros' },
  { value: 'MALANDROS', label: 'Malandros' },
  { value: 'GIRA_MISTA', label: 'Gira Mista' },
  { value: 'NAO_HAVERA_GIRA', label: 'Não haverá Gira' },
];

const STATUS_GIRA_OPTIONS = [
  { value: 'RASCUNHO', label: 'Rascunho' },
  { value: 'PUBLICADA', label: 'Publicada' },
  { value: 'ENCERRADA', label: 'Encerrada' },
];

const STATUS_COLORS = {
  RASCUNHO: 'default',
  PUBLICADA: 'success',
  ENCERRADA: 'default',
  CANCELADA: 'error',
};

const CTRL_STATUS_COLORS = {
  AGUARDANDO: 'default',
  ABERTO: 'success',
  ESGOTADO: 'error',
  ENCERRADO: 'warning',
};

const INITIAL_GIRA_FORM = {
  titulo: '',
  tipo_card: 'GIRA_MISTA',
  data_inicio: '',
  observacoes: '',
  status: 'RASCUNHO',
};

const INITIAL_CTRL_FORM = {
  total_senhas: 50,
  liberacao_inicio: '',
  liberacao_fim: '',
};

function GiraDrawer({ open, onClose, editId, onSaved, api }) {
  const [form, setForm] = useState(INITIAL_GIRA_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(editId);

  useEffect(() => {
    if (!open) return;
    setError('');
    if (editId) {
      api(`/api/admin/giras/${editId}`)
        .then((r) => r.json())
        .then((g) =>
          setForm({
            titulo: g.titulo || '',
            tipo_card: g.tipo_card || 'GIRA_MISTA',
            data_inicio: g.data_inicio ? g.data_inicio.slice(0, 16) : '',
            observacoes: g.observacoes || '',
            status: g.status || 'RASCUNHO',
          })
        )
        .catch(console.error);
    } else {
      setForm(INITIAL_GIRA_FORM);
    }
  }, [open, editId]);

  function set(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    const body = {
      titulo: form.titulo.trim(),
      tipo_card: form.tipo_card,
      data_inicio: fromDatetimeLocalToSaoPaulo(form.data_inicio),
      observacoes: form.observacoes.trim() || null,
      status: form.status,
    };
    try {
      const url = editId ? `/api/admin/giras/${editId}` : '/api/admin/giras';
      const method = editId ? 'PUT' : 'POST';
      const r = await api(url, { method, body: JSON.stringify(body) });
      const data = await r.json();
      if (r.ok) {
        onSaved();
        onClose();
      } else {
        setError(data.mensagem || 'Erro ao salvar.');
      }
    } catch {
      setError('Erro de conexão.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100vw', sm: 440 }, bgcolor: '#122012' } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            {isEdit ? 'Editar Gira' : 'Nova Gira'}
          </Typography>
          <IconButton onClick={onClose} size="small" aria-label="Fechar">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Título *"
            value={form.titulo}
            onChange={(e) => set('titulo', e.target.value)}
            fullWidth
            size="small"
            placeholder="Ex: Gira de Caboclos"
          />

          <FormControl fullWidth size="small">
            <InputLabel>Tipo da Gira *</InputLabel>
            <Select
              label="Tipo da Gira *"
              value={form.tipo_card}
              onChange={(e) => set('tipo_card', e.target.value)}
            >
              {TIPO_CARD_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Data e Hora *"
            type="datetime-local"
            value={form.data_inicio}
            onChange={(e) => set('data_inicio', e.target.value)}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Observações"
            value={form.observacoes}
            onChange={(e) => set('observacoes', e.target.value)}
            fullWidth
            size="small"
            multiline
            rows={3}
            placeholder="Informações adicionais..."
          />

          <FormControl fullWidth size="small">
            <InputLabel>Status *</InputLabel>
            <Select
              label="Status *"
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
            >
              {STATUS_GIRA_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {error && <Alert severity="error">{error}</Alert>}
        </Box>

        <Box
          sx={{
            p: 2,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
          }}
        >
          <Button variant="outlined" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : '💾 Salvar'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}

function ConfigDrawer({ open, onClose, giraId, giraNome, api }) {
  const [form, setForm] = useState(INITIAL_CTRL_FORM);
  const [ctrlStatus, setCtrlStatus] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !giraId) return;
    setError('');
    api(`/api/admin/controles/${giraId}`)
      .then((r) => {
        if (r.status === 404) return null;
        return r.json();
      })
      .then((ctrl) => {
        if (!ctrl) return;
        setCtrlStatus(ctrl.status);
        setForm({
          total_senhas: ctrl.total_senhas || 50,
          liberacao_inicio: toDatetimeLocalValue(ctrl.liberacao_inicio),
          liberacao_fim: toDatetimeLocalValue(ctrl.liberacao_fim),
        });
      })
      .catch(console.error);
  }, [open, giraId]);

  function set(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
  }

  async function handleSave() {
    if (!form.liberacao_inicio) {
      setError('Informe a data/hora de início da liberação.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const body = {
        total_senhas: parseInt(form.total_senhas, 10),
        liberacao_inicio: fromDatetimeLocalToSaoPaulo(form.liberacao_inicio),
        liberacao_fim: form.liberacao_fim ? fromDatetimeLocalToSaoPaulo(form.liberacao_fim) : null,
      };
      const r = await api(`/api/admin/controles/${giraId}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      const data = await r.json();
      if (r.ok) {
        setCtrlStatus(data.status);
        alert('Configuração salva!');
      } else {
        setError(data.mensagem || 'Erro ao salvar.');
      }
    } catch {
      setError('Erro de conexão.');
    } finally {
      setSaving(false);
    }
  }

  async function handleAcao(action) {
    const msg = action === 'liberar' ? 'Liberar retirada de senhas agora?' : 'Encerrar retirada de senhas?';
    if (!confirm(msg)) return;
    try {
      const r = await api(`/api/admin/controles/${giraId}`, {
        method: 'PUT',
        body: JSON.stringify({ action }),
      });
      const data = await r.json();
      if (r.ok) setCtrlStatus(data.status);
      else alert(data.mensagem || 'Erro.');
    } catch {
      alert('Erro de conexão.');
    }
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100vw', sm: 440 }, bgcolor: '#122012' } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Configuração de Senhas
          </Typography>
          <IconButton onClick={onClose} size="small" aria-label="Fechar">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            {ctrlStatus && (
              <Chip
                label={ctrlStatus}
                color={CTRL_STATUS_COLORS[ctrlStatus] || 'default'}
                size="small"
              />
            )}
            <Typography variant="body2" color="text.secondary">
              Gira: <strong>{normalizeDisplayText(giraNome)}</strong>
            </Typography>
          </Box>

          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Total de Senhas"
                type="number"
                value={form.total_senhas}
                onChange={(e) => set('total_senhas', e.target.value)}
                fullWidth
                size="small"
                inputProps={{ min: 1 }}
              />
              <TextField
                label="Início da Liberação *"
                type="datetime-local"
                value={form.liberacao_inicio}
                onChange={(e) => set('liberacao_inicio', e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Fim da Liberação (opcional)"
                type="datetime-local"
                value={form.liberacao_fim}
                onChange={(e) => set('liberacao_fim', e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
              <Typography variant="caption" color="text.disabled">
                Defina início obrigatório e fim opcional da retirada.
              </Typography>

              {error && <Alert severity="error">{error}</Alert>}

              <Box display="flex" gap={1} flexWrap="wrap">
                <Button variant="contained" color="info" onClick={handleSave} disabled={saving} size="small">
                  {saving ? '...' : '💾 Salvar'}
                </Button>
                <Button variant="contained" color="success" onClick={() => handleAcao('liberar')} size="small">
                  🟢 Liberar Agora
                </Button>
                <Button variant="contained" color="warning" onClick={() => handleAcao('encerrar')} size="small">
                  🔒 Encerrar Agora
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Drawer>
  );
}

export default function Giras() {
  const api = useApi();
  const navigate = useNavigate();

  const [giras, setGiras] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroDe, setFiltroDe] = useState('');
  const [filtroAte, setFiltroAte] = useState('');
  const [apenasAtivas, setApenasAtivas] = useState(true);

  // Gira drawer
  const [giraDrawerOpen, setGiraDrawerOpen] = useState(false);
  const [editingGiraId, setEditingGiraId] = useState(null);

  // Config drawer
  const [cfgDrawerOpen, setCfgDrawerOpen] = useState(false);
  const [cfgGiraId, setCfgGiraId] = useState(null);
  const [cfgGiraNome, setCfgGiraNome] = useState('');

  const loadGiras = useCallback(() => {
    setLoading(true);
    api('/api/admin/giras')
      .then((r) => r.json())
      .then((data) => setGiras(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [api]);

  useEffect(() => {
    loadGiras();
  }, [loadGiras]);

  const filteredGiras = useMemo(() => {
    const hojeSp = toDateOnlyInSaoPaulo(new Date());
    return giras
      .filter((g) => {
        const titulo = String(g.titulo || '').toLowerCase();
        if (filtroNome && !titulo.includes(filtroNome.toLowerCase())) return false;
        const dataSp = toDateOnlyInSaoPaulo(g.data_inicio);
        if (filtroDe && dataSp < filtroDe) return false;
        if (filtroAte && dataSp > filtroAte) return false;
        if (apenasAtivas && dataSp && dataSp < hojeSp) return false;
        return true;
      })
      .sort((a, b) => new Date(b.data_inicio) - new Date(a.data_inicio));
  }, [giras, filtroNome, filtroDe, filtroAte, apenasAtivas]);

  function openNovaGira() {
    setEditingGiraId(null);
    setGiraDrawerOpen(true);
  }

  function openEditarGira(id) {
    setEditingGiraId(id);
    setGiraDrawerOpen(true);
  }

  function openConfigSenhas(id, nome) {
    setCfgGiraId(id);
    setCfgGiraNome(nome);
    setCfgDrawerOpen(true);
  }

  async function excluirGira(id) {
    if (!confirm('Excluir esta gira? Esta ação é irreversível.')) return;
    try {
      const r = await api(`/api/admin/giras/${id}`, { method: 'DELETE' });
      if (r.ok || r.status === 204) loadGiras();
      else {
        const d = await r.json();
        alert(d.mensagem || 'Não foi possível excluir.');
      }
    } catch {
      alert('Erro de conexão.');
    }
  }

  return (
    <AppLayout title="Giras">
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            Giras
          </Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openNovaGira}>
            Nova Gira
          </Button>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Nome da gira"
                  value={filtroNome}
                  onChange={(e) => setFiltroNome(e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="Filtrar por título..."
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <TextField
                  label="De"
                  type="date"
                  value={filtroDe}
                  onChange={(e) => setFiltroDe(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <TextField
                  label="Até"
                  type="date"
                  value={filtroAte}
                  onChange={(e) => setFiltroAte(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={apenasAtivas}
                      onChange={(e) => setApenasAtivas(e.target.checked)}
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      Desconsiderar giras antigas
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Senhas</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.disabled' }}>
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : filteredGiras.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.disabled' }}>
                      Nenhuma gira encontrada para os filtros selecionados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGiras.map((g) => {
                    const senhas = g.controle_status
                      ? `${g.emitidas || 0} / ${g.total_senhas || '?'}`
                      : '–';
                    return (
                      <TableRow key={g.id} hover>
                        <TableCell sx={{ fontWeight: 500, color: 'text.primary' }}>
                          {normalizeDisplayText(g.titulo)}
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>
                          {formatTipoCardLabel(g.tipo_card)}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                          {formatDatetimeBR(g.data_inicio)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={g.status}
                            color={STATUS_COLORS[g.status] || 'default'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell sx={{ color: 'text.primary' }}>{senhas}</TableCell>
                        <TableCell align="right">
                          <Box display="flex" gap={0.5} justifyContent="flex-end">
                            <Tooltip title="Configurar senhas">
                              <IconButton
                                size="small"
                                onClick={() => openConfigSenhas(g.id, g.titulo)}
                                aria-label="Configurar senhas"
                              >
                                <KeyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar gira">
                              <IconButton
                                size="small"
                                color="info"
                                onClick={() => openEditarGira(g.id)}
                                aria-label="Editar gira"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Lista de Senhas">
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/gira/${g.id}/senhas`)}
                                aria-label="Lista de Senhas"
                              >
                                <ListAltIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {g.status === 'RASCUNHO' && (
                              <Tooltip title="Excluir gira">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => excluirGira(g.id)}
                                  aria-label="Excluir gira"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>

      {/* Drawers */}
      <GiraDrawer
        open={giraDrawerOpen}
        onClose={() => setGiraDrawerOpen(false)}
        editId={editingGiraId}
        onSaved={loadGiras}
        api={api}
      />

      <ConfigDrawer
        open={cfgDrawerOpen}
        onClose={() => setCfgDrawerOpen(false)}
        giraId={cfgGiraId}
        giraNome={cfgGiraNome}
        api={api}
      />
    </AppLayout>
  );
}
