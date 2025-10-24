"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { SvgIconComponent } from "@mui/icons-material";

type StatCardProps = {
  title: string;
  value: string;
  helperText?: string;
  trend?: {
    label: string;
    positive?: boolean;
  };
  icon?: SvgIconComponent;
  tone?: "primary" | "secondary" | "success" | "neutral";
};

const toneStyles: Record<string, { bg: string; color: string }> = {
  primary: { bg: "rgba(31,159,95,0.15)", color: "#0f5c36" },
  secondary: { bg: "rgba(189,71,39,0.16)", color: "#7a2a16" },
  success: { bg: "rgba(16,185,129,0.18)", color: "#047857" },
  neutral: { bg: "rgba(15,92,54,0.08)", color: "#1f2937" },
};

export function StatCard({ title, value, helperText, trend, icon: Icon, tone = "primary" }: StatCardProps) {
  const toneToken = toneStyles[tone];

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(15, 92, 54, 0.08)",
        background: "linear-gradient(180deg, rgba(248,250,252,0.9) 0%, rgba(255,255,255,0.95) 100%)",
        boxShadow: "0 25px 50px -35px rgba(15, 92, 54, 0.35)",
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {Icon && (
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "18%",
                  display: "grid",
                  placeItems: "center",
                  backgroundColor: toneToken.bg,
                  color: toneToken.color,
                }}
              >
                <Icon fontSize="medium" />
              </Box>
            )}
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {title}
            </Typography>
          </Stack>

          <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: "-0.03em" }}>
            {value}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            {trend && (
              <Chip
                label={trend.label}
                color={trend.positive ? "success" : "secondary"}
                variant={trend.positive ? "filled" : "outlined"}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            )}
            {helperText && (
              <Typography variant="body2" color="text.secondary">
                {helperText}
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
