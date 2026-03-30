import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import AppLayout from '../components/AppLayout';
import { useApi } from '../hooks/useApi';
import { toDateOnlyInSaoPaulo } from '../utils/dates';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const METRIC_COLORS = {
  emitidas: '#93c5fd',
  atendidas: '#86efac',
  no_show: '#fdba74',
  walk_in: '#f9a8d4',
  preferenciais: '#fde68a',
};

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function computeBigNumbers(rows) {
  return rows.reduce(
    (acc, g) => ({
      emitidas: acc.emitidas + toNum(g.emitidas),
      atendidas: acc.atendidas + toNum(g.atendidas),
      no_show: acc.no_show + toNum(g.no_show),
      walk_in: acc.walk_in + toNum(g.walk_in),
      preferenciais: acc.preferenciais + toNum(g.preferenciais),
    }),
    { emitidas: 0, atendidas: 0, no_show: 0, walk_in: 0, preferenciais: 0 }
  );
}

function formatTimelineLabel(isoValue, title) {
  const dateOnly = toDateOnlyInSaoPaulo(isoValue);
  if (!dateOnly) return title || 'Sem data';
  const [y, m, d] = dateOnly.split('-');
  return `${d}/${m} • ${title || 'Gira'}`;
}

function buildChartData(rows) {
  const sorted = [...rows].sort((a, b) => new Date(a.data_inicio) - new Date(b.data_inicio));
  const labels = sorted.map((g) => formatTimelineLabel(g.data_inicio, g.titulo));
  return {
    labels,
    datasets: [
      {
        label: 'Aguardando',
        data: sorted.map((g) => toNum(g.aguardando_padrao)),
        backgroundColor: 'rgba(59,130,246,0.75)',
        borderColor: 'rgba(59,130,246,1)',
        borderWidth: 1,
        stack: 'senhas',
      },
      {
        label: 'Preferencial',
        data: sorted.map((g) => toNum(g.aguardando_preferencial)),
        backgroundColor: 'rgba(245,158,11,0.8)',
        borderColor: 'rgba(245,158,11,1)',
        borderWidth: 1,
        stack: 'senhas',
      },
      {
        label: 'Walk-in',
        data: sorted.map((g) => toNum(g.aguardando_walkin)),
        backgroundColor: 'rgba(236,72,153,0.8)',
        borderColor: 'rgba(236,72,153,1)',
        borderWidth: 1,
        stack: 'senhas',
      },
      {
        label: 'Atendidas',
        data: sorted.map((g) => toNum(g.atendidas)),
        backgroundColor: 'rgba(34,197,94,0.8)',
        borderColor: 'rgba(34,197,94,1)',
        borderWidth: 1,
        stack: 'senhas',
      },
      {
        label: 'No-show',
        data: sorted.map((g) => toNum(g.no_show)),
        backgroundColor: 'rgba(249,115,22,0.8)',
        borderColor: 'rgba(249,115,22,1)',
        borderWidth: 1,
        stack: 'senhas',
      },
    ],
  };
}

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { labels: { color: '#c9e2ca', boxWidth: 14, boxHeight: 14 } },
    tooltip: {
      callbacks: {
        footer: () => 'Fatias mutuamente exclusivas',
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      ticks: { color: '#9fb7a0', maxRotation: 45, autoSkip: true },
      grid: { color: 'rgba(255,255,255,.06)' },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      ticks: { color: '#9fb7a0', precision: 0 },
      grid: { color: 'rgba(255,255,255,.06)' },
    },
  },
};

const METRICS_DEF = [
  { key: 'emitidas', label: 'Senhas emitidas' },
  { key: 'atendidas', label: 'Senhas atendidas' },
  { key: 'no_show', label: 'Senhas no-show' },
  { key: 'walk_in', label: 'Senhas walk-in' },
  { key: 'preferenciais', label: 'Senhas preferenciais' },
];

export default function Dashboard() {
  const api = useApi();
  const [giras, setGiras] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroDe, setFiltroDe] = useState(null);
  const [filtroAte, setFiltroAte] = useState(null);
  const [apenasAtivas, setApenasAtivas] = useState(true);

  useEffect(() => {
    setLoading(true);
    api('/api/admin/giras')
      .then((r) => r.json())
      .then((data) => setGiras(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [api]);

  const filteredGiras = useMemo(() => {
    const hojeSp = toDateOnlyInSaoPaulo(new Date());
    return giras
      .filter((g) => {
        const titulo = String(g.titulo || '').toLowerCase();
        if (filtroNome && !titulo.includes(filtroNome.toLowerCase())) return false;
        const dataSp = toDateOnlyInSaoPaulo(g.data_inicio);
        const de = filtroDe ? format(filtroDe, 'yyyy-MM-dd') : null;
        const ate = filtroAte ? format(filtroAte, 'yyyy-MM-dd') : null;
        if (de && dataSp < de) return false;
        if (ate && dataSp > ate) return false;
        if (apenasAtivas && dataSp && dataSp < hojeSp) return false;
        return true;
      })
      .sort((a, b) => new Date(b.data_inicio) - new Date(a.data_inicio));
  }, [giras, filtroNome, filtroDe, filtroAte, apenasAtivas]);

  const bigNumbers = useMemo(() => computeBigNumbers(filteredGiras), [filteredGiras]);
  const chartData = useMemo(() => (filteredGiras.length ? buildChartData(filteredGiras) : null), [filteredGiras]);

  return (
    <AppLayout title="Dashboard">
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h5" fontWeight={700} color="text.primary" mb={3}>
          Dashboard
        </Typography>

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
                <DatePicker
                  label="De"
                  value={filtroDe}
                  onChange={(val) => setFiltroDe(val)}
                  format="dd/MM/yyyy"
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <DatePicker
                  label="Até"
                  value={filtroAte}
                  onChange={(val) => setFiltroAte(val)}
                  format="dd/MM/yyyy"
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
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

        {/* Big numbers */}
        <Grid container spacing={2} mb={3}>
          {METRICS_DEF.map(({ key, label }) => (
            <Grid item xs={6} sm={4} md key={key}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#9fb7a0',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      display: 'block',
                      mb: 0.5,
                    }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{ color: METRIC_COLORS[key], fontVariantNumeric: 'tabular-nums' }}
                  >
                    {bigNumbers[key]}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Timeline chart */}
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
              <Typography variant="subtitle1" color="text.secondary">
                Timeline de Senhas por Gira
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Distribuição no recorte atual dos filtros
              </Typography>
            </Box>

            {loading ? (
              <Typography variant="body2" color="text.disabled" textAlign="center" py={4}>
                Carregando...
              </Typography>
            ) : !chartData ? (
              <Typography variant="body2" color="text.disabled" textAlign="center" py={4}>
                Sem dados para o período selecionado.
              </Typography>
            ) : (
              <Box sx={{ height: { xs: 240, sm: 320 }, position: 'relative' }}>
                <Bar data={chartData} options={CHART_OPTIONS} />
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
