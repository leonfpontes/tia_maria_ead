import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Drawer,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import AppLayout from '../components/AppLayout';
import { useApi } from '../hooks/useApi';
import { formatPhoneDisplay, formatarTelefoneInput, normalizeDisplayText } from '../utils/formatters';
import { formatTimeBR } from '../utils/dates';

const STATUS_COLORS = {
  ATIVA: 'success',
  ATENDIDA: 'info',
  NO_SHOW: 'warning',
  CANCELADA: 'error',
};

function WalkinDrawer({ open, onClose, giraId, editingSenha, api, onSaved }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [preferencial, setPreferencial] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(editingSenha);

  useEffect(() => {
    if (!open) return;
    setError('');
    if (editingSenha) {
      setNome(editingSenha.nome || '');
      const tel = editingSenha.telefone && editingSenha.telefone !== '0000-0000' ? editingSenha.telefone : '';
      setTelefone(tel ? formatPhoneDisplay(tel).replace('+55 ', '') : '');
      setEmail(editingSenha.email || '');
      setPreferencial(Boolean(editingSenha.is_preferencial));
    } else {
      setNome('');
      setTelefone('');
      setEmail('');
      setPreferencial(false);
    }
  }, [open, editingSenha]);

  async function handleSave() {
    if (!nome || nome.trim().length < 2) {
      setError('Nome é obrigatório (mínimo 2 caracteres).');
      return;
    }
    setSaving(true);
    setError('');
    const body = { nome: nome.trim(), is_preferencial: preferencial };
    if (telefone.trim()) body.telefone = telefone.trim();
    if (email.trim()) body.email = email.trim();

    try {
      let r, data;
      if (isEdit) {
        r = await api(`/api/admin/senhas/${editingSenha.id}?action=editar`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        });
      } else {
        r = await api(`/api/admin/giras/${giraId}/senhas`, {
          method: 'POST',
          body: JSON.stringify(body),
        });
      }
      data = await r.json();
      if (r.ok) {
        onSaved(isEdit ? null : data.numero);
        onClose();
      } else {
        setError(data.mensagem || 'Erro ao salvar walk-in.');
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
            {isEdit
              ? `✏️ Editar Walk-in #${String(editingSenha?.numero || 0).padStart(2, '0')}`
              : '➕ Incluir Walk-in'}
          </Typography>
          <IconButton onClick={onClose} size="small" aria-label="Fechar">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nome completo *"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            fullWidth
            size="small"
            placeholder="Ex: Maria da Silva"
            autoFocus
          />
          <TextField
            label="Telefone (opcional)"
            value={telefone}
            onChange={(e) => setTelefone(formatarTelefoneInput(e.target.value))}
            fullWidth
            size="small"
            placeholder="(99) 99999-9999"
            inputProps={{ maxLength: 16 }}
          />
          <TextField
            label="E-mail (opcional)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            size="small"
            placeholder="email@exemplo.com"
          />
          <FormControlLabel
            control={
              <input
                type="checkbox"
                checked={preferencial}
                onChange={(e) => setPreferencial(e.target.checked)}
                style={{ width: 18, height: 18, marginRight: 8 }}
              />
            }
            label={
              <Typography variant="body2" color="warning.main">
                Atendimento Preferencial (Lei 10.048/2000)
              </Typography>
            }
            sx={{ alignItems: 'center', gap: 0.5 }}
          />

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

function AtendimentoDrawer({ open, onClose, senha, api, onSaved }) {
  const [medium, setMedium] = useState('');
  const [cambone, setCambone] = useState('');
  const [obs, setObs] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [mediunOptions, setMediunOptions] = useState([]);
  const [camboneOptions, setCamboneOptions] = useState([]);

  useEffect(() => {
    if (!open) return;
    api('/api/admin/mediuns')
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const ativos = data.filter((m) => m.ativo);
        setMediunOptions(ativos.filter((m) => !m.is_cambone).map((m) => m.nome));
        setCamboneOptions(ativos.map((m) => m.nome));
      })
      .catch(console.error);
  }, [open, api]);

  useEffect(() => {
    if (!open || !senha) return;
    setMedium(senha.medium_nome || '');
    setCambone(senha.cambone_nome || '');
    setObs(senha.observacao || '');
    setError('');
  }, [open, senha]);

  async function handleSave() {
    if (!senha) return;
    setSaving(true);
    setError('');
    try {
      const r = await api(`/api/admin/senhas/${senha.id}?action=atendimento`, {
        method: 'PATCH',
        body: JSON.stringify({
          medium_nome: medium.trim(),
          cambone_nome: cambone.trim(),
          observacao: obs.trim(),
        }),
      });
      if (r.ok) {
        onSaved();
        onClose();
      } else {
        const d = await r.json();
        setError(d.mensagem || 'Erro ao salvar informações.');
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
            {senha
              ? `Atendimento — #${String(senha.numero || 0).padStart(2, '0')} ${normalizeDisplayText(senha.nome)}`
              : 'Atendimento'}
          </Typography>
          <IconButton onClick={onClose} size="small" aria-label="Fechar">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Autocomplete
            freeSolo
            options={mediunOptions}
            inputValue={medium}
            onInputChange={(_, val) => setMedium(val)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Médium"
                size="small"
                fullWidth
                placeholder="Selecione ou digite o nome"
                inputProps={{ ...params.inputProps, maxLength: 255 }}
              />
            )}
          />
          <Autocomplete
            freeSolo
            options={camboneOptions}
            inputValue={cambone}
            onInputChange={(_, val) => setCambone(val)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cambonê"
                size="small"
                fullWidth
                placeholder="Selecione ou digite o nome"
                inputProps={{ ...params.inputProps, maxLength: 255 }}
              />
            )}
          />
          <TextField
            label="Observação"
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            fullWidth
            size="small"
            multiline
            rows={3}
            placeholder="Informações adicionais..."
            inputProps={{ maxLength: 1000 }}
          />

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
            {saving ? '...' : '💾 Salvar'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}

function SenhaCard({ senha, filaPos, isProxima, onStatusChange, onCheckin, onEditWalkin, onOpenAtendimento }) {
  const st = (senha.status || '').toLowerCase();
  const numColor =
    senha.status === 'ATENDIDA'
      ? '#93c5fd'
      : senha.status === 'NO_SHOW'
      ? '#fbbf24'
      : senha.status === 'CANCELADA'
      ? '#6b7280'
      : '#4ade80';

  return (
    <Card
      sx={{
        border: isProxima ? '1px solid #4ade80' : '1px solid rgba(255,255,255,0.08)',
        bgcolor: isProxima ? 'rgba(74,222,128,0.07)' : 'rgba(255,255,255,0.04)',
        position: 'relative',
      }}
    >
      {senha.status === 'ATENDIDA' && (
        <Tooltip title="Informações de atendimento">
          <IconButton
            size="small"
            onClick={() => onOpenAtendimento(senha)}
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              opacity: senha.medium_nome || senha.cambone_nome || senha.observacao ? 0.85 : 0.4,
              fontSize: '0.9rem',
            }}
          >
            ℹ️
          </IconButton>
        </Tooltip>
      )}
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box display="flex" gap={1.5} alignItems="flex-start">
          {/* Número */}
          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              color: numColor,
              minWidth: '3rem',
              textAlign: 'center',
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            #{String(senha.numero).padStart(2, '0')}
          </Typography>

          {/* Info */}
          <Box flex={1} minWidth={0}>
            <Box display="flex" alignItems="center" gap={0.75} flexWrap="wrap">
              <Typography variant="body1" fontWeight={700} color="text.primary" noWrap>
                {normalizeDisplayText(senha.nome)}
              </Typography>
              {isProxima && (
                <Typography variant="caption" color="primary.main" fontWeight={800} noWrap>
                  ← PRÓXIMO
                </Typography>
              )}
            </Box>
            <Box display="flex" gap={0.5} mt={0.5} flexWrap="wrap" alignItems="center">
              <Chip
                label={senha.status}
                color={STATUS_COLORS[senha.status] || 'default'}
                size="small"
                variant="outlined"
              />
              {senha.is_preferencial && (
                <Chip label="⭐ Preferencial" size="small" color="warning" variant="outlined" />
              )}
              {senha.is_walk_in && (
                <Chip label="Walk-in" size="small" sx={{ bgcolor: 'rgba(168,117,255,0.18)', color: '#c4b5fd', border: '1px solid rgba(168,117,255,0.3)' }} />
              )}
              {senha.chegada_em && (
                <Chip
                  label={`✅ ${formatTimeBR(senha.chegada_em)}`}
                  size="small"
                  sx={{ bgcolor: 'rgba(34,197,94,0.18)', color: '#86efac', border: '1px solid rgba(34,197,94,0.3)' }}
                />
              )}
              {filaPos != null && senha.status === 'ATIVA' && (
                <Chip label={`#${filaPos} na fila`} size="small" color="info" variant="outlined" />
              )}
              {senha.status === 'ATENDIDA' && senha.atendida_em && (
                <Typography variant="caption" color="text.disabled">
                  {formatTimeBR(senha.atendida_em)}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Actions */}
        <Grid container spacing={0.5} mt={1}>
          {senha.status === 'ATIVA' && (
            <>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={() => onStatusChange(senha.id, 'ATENDIDA')}
                  sx={{ fontSize: '0.78rem' }}
                >
                  ✓ Atendida
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  size="small"
                  variant="contained"
                  color="warning"
                  onClick={() => onStatusChange(senha.id, 'NO_SHOW')}
                  sx={{ fontSize: '0.78rem' }}
                >
                  No-Show
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  color={senha.chegada_em ? 'inherit' : 'info'}
                  onClick={() => onCheckin(senha.id, !senha.chegada_em)}
                  sx={{ fontSize: '0.78rem' }}
                >
                  {senha.chegada_em ? '↩ Check-in' : '📍 Check-in'}
                </Button>
              </Grid>
              {senha.is_walk_in && (
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    onClick={() => onEditWalkin(senha)}
                    sx={{ fontSize: '0.78rem' }}
                  >
                    ✏️ Editar
                  </Button>
                </Grid>
              )}
            </>
          )}
          {(senha.status === 'ATENDIDA' || senha.status === 'NO_SHOW') && (
            <>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  onClick={() => onStatusChange(senha.id, 'ATIVA')}
                  sx={{ fontSize: '0.78rem' }}
                >
                  ↩ Desfazer
                </Button>
              </Grid>
              {senha.is_walk_in && (
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    onClick={() => onEditWalkin(senha)}
                    sx={{ fontSize: '0.78rem' }}
                  >
                    ✏️ Editar
                  </Button>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default function Porta() {
  const api = useApi();

  const [giras, setGiras] = useState([]);
  const [selectedGiraId, setSelectedGiraId] = useState('');
  const [senhas, setSenhas] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(false);
  const searchDebounce = useRef(null);
  const refreshInterval = useRef(null);

  // Drawers
  const [walkinOpen, setWalkinOpen] = useState(false);
  const [walkinEditing, setWalkinEditing] = useState(null);
  const [atdOpen, setAtdOpen] = useState(false);
  const [atdSenha, setAtdSenha] = useState(null);

  // Load published giras
  useEffect(() => {
    api('/api/admin/giras')
      .then((r) => r.json())
      .then((data) => {
        const publicadas = (Array.isArray(data) ? data : [])
          .filter((g) => g.status === 'PUBLICADA')
          .sort((a, b) => new Date(b.data_inicio) - new Date(a.data_inicio));
        setGiras(publicadas);
      })
      .catch(console.error);
  }, [api]);

  const loadSenhas = useCallback(
    async (searchValue = '') => {
      if (!selectedGiraId) return;
      let url = `/api/admin/giras/${selectedGiraId}/senhas`;
      if (searchValue) url += `?busca=${encodeURIComponent(searchValue)}`;
      try {
        const r = await api(url);
        const rows = await r.json();
        setSenhas(Array.isArray(rows) ? rows : []);
      } catch (e) {
        console.error(e);
      }
    },
    [api, selectedGiraId]
  );

  // Setup auto-refresh
  useEffect(() => {
    if (refreshInterval.current) clearInterval(refreshInterval.current);
    if (!selectedGiraId) return;
    loadSenhas(busca);
    refreshInterval.current = setInterval(() => {
      if (!busca) loadSenhas('');
    }, 30000);
    return () => clearInterval(refreshInterval.current);
  }, [selectedGiraId, loadSenhas]);

  function handleSearch(val) {
    setBusca(val);
    clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => loadSenhas(val), 300);
  }

  async function patchStatus(id, status) {
    try {
      const r = await api(`/api/admin/senhas/${id}?action=status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      if (r.ok) {
        await loadSenhas(busca);
        if (status === 'ATENDIDA') {
          const s = senhas.find((x) => x.id === id || x.id === String(id));
          if (s) openAtendimento(s);
        }
      } else {
        const d = await r.json();
        alert(d.mensagem || 'Erro ao atualizar status.');
      }
    } catch {
      alert('Erro de conexão.');
    }
  }

  async function patchCheckin(id, checkin) {
    try {
      const r = await api(`/api/admin/senhas/${id}?action=checkin`, {
        method: 'PATCH',
        body: JSON.stringify({ checkin }),
      });
      if (r.ok) loadSenhas(busca);
      else {
        const d = await r.json();
        alert(d.mensagem || 'Erro ao registrar check-in.');
      }
    } catch {
      alert('Erro de conexão.');
    }
  }

  function openAtendimento(senha) {
    setAtdSenha(senha);
    setAtdOpen(true);
  }

  // Metrics
  const metrics = {
    atendidas: senhas.filter((s) => s.status === 'ATENDIDA').length,
    emitidas: senhas.filter((s) => s.status !== 'CANCELADA').length,
    ativas: senhas.filter((s) => s.status === 'ATIVA').length,
    presentes: senhas.filter((s) => s.chegada_em && s.status !== 'CANCELADA').length,
    noShow: senhas.filter((s) => s.status === 'NO_SHOW').length,
  };

  // Compute queue positions
  const filaPosMap = new Map();
  let pos = 0;
  senhas.forEach((s) => {
    if (s.status === 'ATIVA') {
      pos += 1;
      filaPosMap.set(Number(s.id), pos);
    }
  });
  const proximaIdx = senhas.findIndex((s) => s.status === 'ATIVA');

  const METRICS_DEF = [
    { key: 'atendidas', label: 'Atendidas', color: '#93c5fd' },
    { key: 'emitidas', label: 'Emitidas', color: '#4ade80' },
    { key: 'ativas', label: 'Restantes', color: '#e8f5e9' },
    { key: 'presentes', label: 'Presentes', color: '#86efac' },
    { key: 'noShow', label: 'No-Show', color: '#fbbf24' },
  ];

  return (
    <AppLayout title="Porta">
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 680, mx: 'auto' }}>
        <Typography variant="h5" fontWeight={700} color="text.primary" mb={3}>
          🚪 Porta
        </Typography>

        {/* Gira selector */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <FormControl fullWidth size="small">
              <InputLabel>Gira</InputLabel>
              <Select
                label="Gira"
                value={selectedGiraId}
                onChange={(e) => setSelectedGiraId(e.target.value)}
              >
                <MenuItem value="">
                  <em>Selecione uma gira...</em>
                </MenuItem>
                {giras.map((g) => (
                  <MenuItem key={g.id} value={String(g.id)}>
                    {normalizeDisplayText(g.titulo)}{' '}
                    {g.data_inicio
                      ? `– ${new Date(g.data_inicio).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`
                      : ''}
                  </MenuItem>
                ))}
                {giras.length === 0 && (
                  <MenuItem disabled>
                    <em>Nenhuma gira publicada</em>
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </CardContent>
        </Card>

        {selectedGiraId && (
          <>
            {/* Search */}
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Busca por número ou nome..."
                  value={busca}
                  onChange={(e) => handleSearch(e.target.value)}
                  autoFocus
                />
              </CardContent>
            </Card>

            {/* Metrics */}
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

            {/* Walk-in button */}
            <Box mb={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => { setWalkinEditing(null); setWalkinOpen(true); }}
              >
                Incluir Walk-in
              </Button>
            </Box>

            {/* Password list */}
            <Box display="flex" flexDirection="column" gap={1}>
              {senhas.length === 0 ? (
                <Typography textAlign="center" color="text.disabled" py={4}>
                  Nenhuma senha encontrada.
                </Typography>
              ) : (
                senhas.map((s, idx) => (
                  <SenhaCard
                    key={s.id}
                    senha={s}
                    filaPos={filaPosMap.get(Number(s.id)) ?? null}
                    isProxima={idx === proximaIdx}
                    onStatusChange={patchStatus}
                    onCheckin={patchCheckin}
                    onEditWalkin={(senha) => { setWalkinEditing(senha); setWalkinOpen(true); }}
                    onOpenAtendimento={openAtendimento}
                  />
                ))
              )}
            </Box>

            <Typography
              variant="caption"
              color="text.disabled"
              display="block"
              textAlign="center"
              mt={2}
            >
              Atualiza a cada 30s automaticamente
            </Typography>
          </>
        )}
      </Box>

      {/* Walk-in drawer */}
      <WalkinDrawer
        open={walkinOpen}
        onClose={() => setWalkinOpen(false)}
        giraId={selectedGiraId}
        editingSenha={walkinEditing}
        api={api}
        onSaved={(numero) => {
          loadSenhas(busca);
        }}
      />

      {/* Atendimento drawer */}
      <AtendimentoDrawer
        open={atdOpen}
        onClose={() => setAtdOpen(false)}
        senha={atdSenha}
        api={api}
        onSaved={() => loadSenhas(busca)}
      />
    </AppLayout>
  );
}
