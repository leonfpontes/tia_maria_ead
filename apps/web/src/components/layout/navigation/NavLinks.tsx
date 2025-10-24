"use client";

import { usePathname } from "next/navigation";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import { SvgIconComponent } from "@mui/icons-material";

export type NavigationItem = {
  label: string;
  href: string;
  icon: SvgIconComponent;
  highlight?: boolean;
};

type NavLinksProps = {
  items: NavigationItem[];
  collapsed?: boolean;
};

export function NavLinks({ items, collapsed }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <List sx={{ px: collapsed ? 0 : 1, py: 2 }}>
      {items.map((item) => {
        const selected = pathname.startsWith(item.href);

        return (
          <Tooltip
            key={item.href}
            title={collapsed ? item.label : ""}
            placement="right"
            arrow
            disableHoverListener={!collapsed}
          >
            <ListItemButton
              href={item.href}
              selected={selected}
              sx={{
                mb: 0.5,
                border: item.highlight ? "1px solid rgba(251, 191, 36, 0.4)" : undefined,
                background: item.highlight
                  ? "linear-gradient(120deg, rgba(251,191,36,0.15), rgba(16,185,129,0.08))"
                  : undefined,
              }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, color: "inherit" }}>
                <item.icon fontSize="small" />
              </ListItemIcon>
              {!collapsed && <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />}
            </ListItemButton>
          </Tooltip>
        );
      })}
    </List>
  );
}
