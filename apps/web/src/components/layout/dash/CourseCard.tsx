"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";

export type CourseCardProps = {
  title: string;
  description: string;
  duration: string;
  lessons?: number;
  lessonsLabel?: string;
  progress?: number;
  category?: string;
  ctaLabel: string;
  onCtaClick?: () => void;
};

export function CourseCard({
  title,
  description,
  duration,
  lessons,
  lessonsLabel,
  progress,
  category,
  ctaLabel,
  onCtaClick,
}: CourseCardProps) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: 3,
        border: "1px solid rgba(15, 92, 54, 0.08)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(248,250,252,0.95) 100%)",
      }}
    >
      <CardHeader
        title={title}
        subheader={category}
        titleTypographyProps={{ fontWeight: 700, variant: "h6" }}
        subheaderTypographyProps={{ color: "primary.main", fontWeight: 600 }}
        sx={{ pb: 0 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ color: "text.secondary" }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <AccessTimeRoundedIcon fontSize="small" />
            <Typography variant="body2">{duration}</Typography>
          </Stack>
          {(typeof lessons === "number" || lessonsLabel) && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <AutoStoriesRoundedIcon fontSize="small" />
              <Typography variant="body2">{lessonsLabel ?? `${lessons} aulas`}</Typography>
            </Stack>
          )}
          {typeof progress === "number" && (
            <Chip label={`${progress}%`} size="small" color="success" variant="outlined" sx={{ fontWeight: 600 }} />
          )}
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 3, pb: 3 }}>
        <Button fullWidth variant="contained" color="primary" size="large" onClick={onCtaClick}>
          {ctaLabel}
        </Button>
      </CardActions>
    </Card>
  );
}
