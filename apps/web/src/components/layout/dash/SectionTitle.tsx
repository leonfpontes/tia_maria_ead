"use client";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

export type SectionTitleProps = {
  title: string;
  subtitle?: string;
  chipLabel?: string;
};

export function SectionTitle({ title, subtitle, chipLabel }: SectionTitleProps) {
  return (
    <Stack spacing={1.5} sx={{ mb: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Divider sx={{ width: 28, borderColor: "primary.main", borderWidth: 2, borderRadius: 999 }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {chipLabel && <Chip label={chipLabel} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />}
      </Stack>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
}
