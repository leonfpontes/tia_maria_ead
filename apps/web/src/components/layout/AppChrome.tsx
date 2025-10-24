"use client";

import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksRounded";
import VideoLibraryRoundedIcon from "@mui/icons-material/VideoLibraryRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Link from "next/link";

import { NavLinks, NavigationItem } from "./navigation/NavLinks";

const navItems: NavigationItem[] = [
  { label: "Visão geral", href: "/dashboard", icon: DashboardRoundedIcon },
  { label: "Catálogo", href: "/catalogo", icon: LibraryBooksRoundedIcon, highlight: true },
  { label: "Aulas", href: "/aulas", icon: VideoLibraryRoundedIcon },
  { label: "Certificados", href: "/certificados", icon: WorkspacePremiumRoundedIcon },
  { label: "Configurações", href: "/configuracoes", icon: SettingsRoundedIcon },
];

type AppChromeProps = {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  onLogout?: () => void;
};

export function AppChrome({ children, userName = "Convidado", userEmail = "usuario@exemplo.com", userRole, onLogout }: AppChromeProps) {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const avatarInitials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const content = (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 60%, #ffffff 100%)" }}>
      {/* Sidebar */}
      {isMdUp ? (
        <Box
          component="nav"
          sx={{
            width: 280,
            flexShrink: 0,
            background: "linear-gradient(180deg, rgba(8,47,35,0.94) 0%, rgba(10,62,37,0.98) 100%)",
            color: "#f8fafc",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ px: 3, py: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar sx={{ bgcolor: "rgba(16, 185, 129, 0.25)", color: "#34d399", width: 40, height: 40, fontWeight: 700 }}>
                TM
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(248, 250, 252, 0.7)" }}>
                  Tia Maria EAD
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
                  Portal Sagrado
                </Typography>
              </Box>
            </Stack>
          </Box>

          <NavLinks items={navItems} />

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ px: 2, pb: 3 }}>
            <Box sx={{
              p: 2.5,
              borderRadius: 3,
              background: "linear-gradient(120deg, rgba(31,159,95,0.15), rgba(210,96,63,0.1))",
              border: "1px solid rgba(248, 250, 252, 0.1)",
              backdropFilter: "blur(12px)",
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                Explore novos cursos
              </Typography>
              <Typography variant="body2" color="rgba(248,250,252,0.7)" sx={{ mb: 1.5 }}>
                Descubra conteúdos especiais e aprofunde sua jornada espiritual.
              </Typography>
              <Button
                component={Link}
                href="/catalogo"
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
              >
                Ver catálogo
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              width: 280,
              background: "linear-gradient(180deg, rgba(8,47,35,0.94) 0%, rgba(10,62,37,0.98) 100%)",
              color: "#f8fafc",
            },
          }}
        >
          <Box sx={{ px: 3, py: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar sx={{ bgcolor: "rgba(16, 185, 129, 0.25)", color: "#34d399", width: 40, height: 40, fontWeight: 700 }}>
                TM
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(248, 250, 252, 0.7)" }}>
                  Tia Maria EAD
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
                  Portal Sagrado
                </Typography>
              </Box>
            </Stack>
          </Box>
          <NavLinks items={navItems} />
          <Box sx={{ px: 2, pb: 3, mt: 1 }}>
            <Button
              component={Link}
              href="/catalogo"
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
            >
              Ver catálogo
            </Button>
          </Box>
        </Drawer>
      )}

      {/* Main content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AppBar position="sticky" color="transparent" elevation={0} sx={{ background: "rgba(248, 250, 252, 0.7)" }}>
          <Toolbar sx={{ justifyContent: "space-between", gap: 2, py: 1.5 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              {!isMdUp && (
                <IconButton
                  color="inherit"
                  onClick={() => setDrawerOpen((prev) => !prev)}
                  aria-label={drawerOpen ? "Fechar menu" : "Abrir menu"}
                >
                  {drawerOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
                </IconButton>
              )}
              <Box>
                <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, letterSpacing: "0.06em" }}>
                  Saravá, {userName.split(" ")[0] || "amigo"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Que Oxóssi e Xangô conduzam seus estudos hoje.
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
              <Tooltip title="Lembretes e avisos" arrow>
                <Chip label="Gira hoje às 20h" color="secondary" variant="filled" sx={{ fontWeight: 600 }} />
              </Tooltip>
              <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(15, 92, 54, 0.12)" }} />
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {userName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {userEmail}
                  </Typography>
                </Box>
                <IconButton
                  onClick={(event) => setMenuAnchor(event.currentTarget)}
                  size="small"
                  sx={{
                    borderRadius: 999,
                    border: "2px solid rgba(31, 159, 95, 0.25)",
                    boxShadow: "0 12px 24px -16px rgba(15, 92, 54, 0.65)",
                  }}
                >
                  <Avatar sx={{ bgcolor: "rgba(31, 159, 95, 0.18)", color: "#0f5c36" }}>{avatarInitials}</Avatar>
                </IconButton>
              </Stack>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1 }}>
          <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {content}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem disabled>
          <Stack>
            <Typography variant="subtitle2">{userName}</Typography>
            <Typography variant="caption" color="text.secondary">
              {userEmail}
            </Typography>
            {userRole && (
              <Chip label={userRole} size="small" color="success" sx={{ mt: 0.5, alignSelf: "flex-start" }} />
            )}
          </Stack>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem component={Link} href="/perfil">
          Perfil e preferências
        </MenuItem>
        <MenuItem component={Link} href="/suporte">
          Falar com a equipe
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            onLogout?.();
          }}
          sx={{ color: "error.main" }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <LogoutRoundedIcon fontSize="small" />
            <span>Sair</span>
          </Stack>
        </MenuItem>
      </Menu>
    </>
  );
}
