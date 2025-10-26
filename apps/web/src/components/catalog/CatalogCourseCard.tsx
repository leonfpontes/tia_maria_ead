"use client";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import PlayCircleFilledRoundedIcon from "@mui/icons-material/PlayCircleFilledRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

export type CatalogCourseCardProps = {
  title: string;
  summary: string;
  price: string;
  oldPrice?: string;
  category: string;
  accent: string;
  tag?: string;
  lessonsLabel?: string;
  highlight?: boolean;
  typeLabel?: string;
};

export function CatalogCourseCard({
  title,
  summary,
  price,
  oldPrice,
  category,
  accent,
  tag,
  lessonsLabel,
  highlight,
  typeLabel = "Curso",
}: CatalogCourseCardProps) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
        border: highlight ? "2px solid rgba(31, 159, 95, 0.45)" : "1px solid rgba(15, 92, 54, 0.08)",
        boxShadow: highlight
          ? "0 18px 48px rgba(15, 92, 54, 0.18)"
          : "0 12px 36px rgba(15, 92, 54, 0.08)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.98) 100%)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: 180,
          background: accent,
          color: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          p: 3,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          <Chip
            label={typeLabel}
            size="small"
            sx={{
              bgcolor: "rgba(15,92,54,0.25)",
              color: "#f8fafc",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          />
          {tag && (
            <Chip
              label={tag}
              size="small"
              color="secondary"
              sx={{ fontWeight: 700, background: "rgba(251,191,36,0.9)", color: "#0f2e1f" }}
            />
          )}
        </Stack>
        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
          {title}
        </Typography>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Stack spacing={2}>
          <Chip
            icon={<WorkspacePremiumRoundedIcon fontSize="small" />}
            label={category}
            size="small"
            variant="outlined"
            sx={{
              alignSelf: "flex-start",
              fontWeight: 600,
              borderRadius: 2,
              borderColor: "rgba(15, 92, 54, 0.2)",
              color: "rgba(15, 92, 54, 0.9)",
            }}
          />

          <Typography variant="body2" color="text.secondary">
            {summary}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="baseline">
            <Typography variant="h6" sx={{ fontWeight: 700, color: "success.main" }}>
              {price}
            </Typography>
            {oldPrice && (
              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                {oldPrice}
              </Typography>
            )}
          </Stack>

          {lessonsLabel && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "text.secondary" }}>
              <PlayCircleFilledRoundedIcon fontSize="small" />
              <Typography variant="body2">{lessonsLabel}</Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 3, pb: 3 }}>
        <Button
          fullWidth
          variant="contained"
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            background: "linear-gradient(120deg, #0f5c36, #1f9f5f)",
            "&:hover": {
              background: "linear-gradient(120deg, #0a4228, #177e4a)",
            },
          }}
        >
          Ver detalhes
        </Button>
      </CardActions>
    </Card>
  );
}
