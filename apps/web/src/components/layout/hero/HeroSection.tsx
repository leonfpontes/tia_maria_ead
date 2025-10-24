"use client";

import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type HeroSectionProps = {
  title: string;
  subtitle: string;
  description: string;
  primaryAction: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  highlights?: string[];
  illustration?: ReactNode;
};

export function HeroSection({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  highlights,
  illustration,
}: HeroSectionProps) {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        background: "linear-gradient(120deg, rgba(8,47,35,0.98) 0%, rgba(16,185,129,0.25) 100%)",
        color: "#f8fafc",
        px: { xs: 4, md: 6 },
        py: { xs: 5, md: 7 },
        minHeight: { md: 360 },
        boxShadow: "0 40px 80px -40px rgba(8, 47, 35, 0.6)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at top right, rgba(251,191,36,0.25), transparent 55%)",
          opacity: 0.7,
          pointerEvents: "none",
        }}
      />

      <Grid container spacing={6} alignItems="center" sx={{ position: "relative" }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={2}>
            <Chip
              label={subtitle}
              color="secondary"
              variant="filled"
              sx={{
                alignSelf: "flex-start",
                fontWeight: 600,
                px: 2,
                backgroundColor: "rgba(210,96,63,0.18)",
                color: "#fde7db",
              }}
            />
            <Typography component="h1" variant="h2" sx={{ fontWeight: 800, letterSpacing: "-0.03em" }}>
              {title}
            </Typography>
            <Typography variant="body1" sx={{ color: "rgba(248, 250, 252, 0.8)", maxWidth: 520 }}>
              {description}
            </Typography>

            {highlights && highlights.length > 0 && (
              <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 1 }}>
                {highlights.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    variant="outlined"
                    sx={{ borderColor: "rgba(248,250,252,0.4)", color: "rgba(248,250,252,0.8)", fontWeight: 500 }}
                  />
                ))}
              </Stack>
            )}

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ pt: 2 }}>
              {primaryAction.href ? (
                <Button
                  component="a"
                  href={primaryAction.href}
                  onClick={primaryAction.onClick}
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  {primaryAction.label}
                </Button>
              ) : (
                <Button
                  onClick={primaryAction.onClick}
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  {primaryAction.label}
                </Button>
              )}
              {secondaryAction && (secondaryAction.href ? (
                <Button
                  component="a"
                  href={secondaryAction.href}
                  onClick={secondaryAction.onClick}
                  variant="outlined"
                  color="inherit"
                  size="large"
                >
                  {secondaryAction.label}
                </Button>
              ) : (
                <Button
                  onClick={secondaryAction.onClick}
                  variant="outlined"
                  color="inherit"
                  size="large"
                >
                  {secondaryAction.label}
                </Button>
              ))}
            </Stack>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          {illustration ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>{illustration}</Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                aspectRatio: "1",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(16,185,129,0.45), transparent 60%)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#ecfccb" }}>
                Experiências
                <br />
                Sagradas
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
