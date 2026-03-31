import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Drawer,
  FormControlLabel,
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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import AppLayout from '../components/AppLayout';
import { useApi } from '../hooks/useApi';
import { formatPhoneDisplay, formatarTelefoneInput } from '../utils/formatters';

const INITIAL_FORM = {
  nome: '',
  telefone: '',
  is_cambone: false,
};

function MediumDrawer({ open, onClose, editId, viewOnly, onSaved, api }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(editId);

  useEffect(() => {
    if (!open) return;
    setError('');
    if (editId) {
      api(`/api/admin/mediuns/${editId}`)
        .then((r) => r.json())
        .then((m) =>
          setForm({
            nome: m.nome || '',
            telefone: m.telefone ? formatarTelefoneInput(String(m.telefone).replace(/\D/g, '')) : '',
            is_cambone: Boolean(m.is_cambone),
          })
        )
        .catch(console.error);
    } else {
      setForm(INITIAL_FORM);
    }
  }, [open, editId]);

  function set(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    const body = {
      nome: form.nome.trim(),
      telefone: form.telefone.trim() || null,
      is_cambone: form.is_cambone,
    };
    try {
      const url = editId ? `/api/admin/mediuns/${editId}` : '/api/admin/mediuns';
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

  const title = viewOnly ? 'Visualizar Médium' : isEdit ? 'Editar Médium' : 'Novo Médium';

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100vw', sm: 420 }, bgcolor: '#122012' } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
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
            {title}
          </Typography>
          <IconButton onClick={onClose} size="small" aria-label="Fechar">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Nome *"
            value={form.nome}
            onChange={(e) => set('nome', e.target.value)}
            fullWidth
            size="small"
            disabled={viewOnly}
            placeholder="Ex: Maria da Conceição"
          />

          <TextField
            label="Telefone"
            value={form.telefone}
            onChange={(e) => set('telefone', formatarTelefoneInput(e.target.value))}
            fullWidth
            size="small"
            disabled={viewOnly}
            placeholder="(11) 99999-0000"
            inputProps={{ maxLength: 15 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={form.is_cambone}
                onChange={(e) => set('is_cambone', e.target.checked)}
                disabled={viewOnly}
                color="primary"
              />
            }
            label="É Cambonê (auxiliar de gira)"
          />
        </Box>

        {/* Footer */}
        {!viewOnly && (
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              gap: 1,
              justifyContent: 'flex-end',
            }}
          >
            <Button variant="outlined" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}

export default function Mediuns() {
  const api = useApi();
  const [mediuns, setMediuns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterNome, setFilterNome] = useState('');
  const [soAtivos, setSoAtivos] = useState(true);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerEditId, setDrawerEditId] = useState(null);
  const [drawerViewOnly, setDrawerViewOnly] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const loadMediuns = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api('/api/admin/mediuns');
      if (r.ok) {
        const data = await r.json();
        setMediuns(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadMediuns();
  }, [loadMediuns]);

  const filtered = useMemo(() => {
    const q = filterNome.trim().toLowerCase();
    return mediuns.filter((m) => {
      if (soAtivos && !m.ativo) return false;
      if (q && !m.nome.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [mediuns, filterNome, soAtivos]);

  function openNew() {
    setDrawerEditId(null);
    setDrawerViewOnly(false);
    setDrawerOpen(true);
  }

  function openView(id) {
    setDrawerEditId(id);
    setDrawerViewOnly(true);
    setDrawerOpen(true);
  }

  function openEdit(id) {
    setDrawerEditId(id);
    setDrawerViewOnly(false);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setDrawerEditId(null);
    setDrawerViewOnly(false);
  }

  async function handleDelete(id) {
    setDeleteError('');
    try {
      const r = await api(`/api/admin/mediuns/${id}`, { method: 'DELETE' });
      if (r.ok || r.status === 204) {
        setDeleteId(null);
        loadMediuns();
      } else {
        const data = await r.json().catch(() => ({}));
        setDeleteError(data.mensagem || 'Erro ao excluir.');
      }
    } catch {
      setDeleteError('Erro de conexão.');
    }
  }

  return (
    <AppLayout title="Médiuns">
      {/* Filter card */}
      <Card sx={{ mb: 2 }}>
        <CardContent
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
            '&:last-child': { pb: 2 },
          }}
        >
          <TextField
            label="Buscar por nome"
            size="small"
            value={filterNome}
            onChange={(e) => setFilterNome(e.target.value)}
            sx={{ minWidth: 220 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={soAtivos}
                onChange={(e) => setSoAtivos(e.target.checked)}
                color="primary"
              />
            }
            label="Somente ativos"
          />
          <Box sx={{ ml: 'auto' }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>
              Novo Médium
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Delete confirmation inline */}
      {deleteId && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" color="inherit" onClick={() => setDeleteId(null)}>
                Cancelar
              </Button>
              <Button size="small" color="error" variant="contained" onClick={() => handleDelete(deleteId)}>
                Confirmar
              </Button>
            </Box>
          }
        >
          Tem certeza que deseja excluir este médium? Esta ação não pode ser desfeita.
          {deleteError && (
            <Typography variant="caption" display="block" color="error" mt={0.5}>
              {deleteError}
            </Typography>
          )}
        </Alert>
      )}

      {/* Table */}
      <TableContainer component={Card}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Função</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Carregando...
                </TableCell>
              </TableRow>
            )}
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Nenhum médium encontrado.
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              filtered.map((m) => (
                <TableRow key={m.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{m.nome}</TableCell>
                  <TableCell>{formatPhoneDisplay(m.telefone)}</TableCell>
                  <TableCell>
                    <Chip
                      label={m.is_cambone ? 'Cambonê' : 'Médium'}
                      size="small"
                      color={m.is_cambone ? 'secondary' : 'primary'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={m.ativo ? 'Ativo' : 'Inativo'}
                      size="small"
                      color={m.ativo ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Visualizar">
                      <IconButton size="small" onClick={() => openView(m.id)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => openEdit(m.id)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => { setDeleteId(m.id); setDeleteError(''); }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Drawer */}
      <MediumDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        editId={drawerEditId}
        viewOnly={drawerViewOnly}
        onSaved={loadMediuns}
        api={api}
      />
    </AppLayout>
  );
}
