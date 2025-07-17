import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import DanoneLogo from "./DanoneLogo.tsx";
import {useAuth} from "../hooks/useAuth.tsx";

const navigationItems = [
    { 
        name: 'Tableau de Bord', 
        link: '/',
        icon: '🏠'
    },
    { 
        name: 'Chantiers', 
        icon: '🏗️',
        submenu: [
            { name: 'Créer Chantier', link: '/create/chantier', icon: '➕' },
            { name: 'Liste Chantiers', link: '/list/chantier', icon: '📋' }
        ]
    },
    { 
        name: 'Plans de Prévention', 
        icon: '📋',
        submenu: [
            { name: 'Tous les PDPs', link: '/view/pdps', icon: '📄' },
            { name: 'Liste PDPs', link: '/list/pdps', icon: '📚' }
        ]
    },
    { 
        name: 'Gestion', 
        icon: '⚙️',
        submenu: [
            { name: 'Utilisateurs', link: '/view/users', icon: '👥' },
            { name: 'Entreprises', link: '/view/entreprises', icon: '🏢' },
            { name: 'Travailleurs', link: '/view/workers', icon: '👷' },
            { name: 'Localisations', link: '/view/localisations', icon: '📍' }
        ]
    },
    { 
        name: 'Sécurité', 
        icon: '🛡️',
        submenu: [
            { name: 'Risques', link: '/view/risques', icon: '⚠️' },
            { name: 'Permis', link: '/view/permits', icon: '📜' },
            { name: 'Audits Sécurité', link: '/view/auditsecus', icon: '🔍' }
        ]
    }
];
const userMenuItems = [
    { name: 'Mon Profil', link: '/profile', icon: '👤' },
    { name: 'Paramètres', link: '/settings', icon: '⚙️' },
    { name: 'Aide', link: '/help', icon: '❓' }
];

function EnhancedNavBar() {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [anchorElMenus, setAnchorElMenus] = useState<{ [key: string]: HTMLElement | null }>({});

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElNav(event.currentTarget);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
    const handleOpenSubmenu = (menuName: string, event: React.MouseEvent<HTMLElement>) => {
        setAnchorElMenus(prev => ({ ...prev, [menuName]: event.currentTarget }));
    };

    const handleCloseNavMenu = () => setAnchorElNav(null);
    const handleCloseUserMenu = () => setAnchorElUser(null);
    const handleCloseSubmenu = (menuName: string) => {
        setAnchorElMenus(prev => ({ ...prev, [menuName]: null }));
    };

    const {connectedUser, logout} = useAuth();


    const isLoggedIn = connectedUser !== null;

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
              {/*      <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />*/}
                    <DanoneLogo simple sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 700,
                            letterSpacing: '.2rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            fontSize: '1.5rem'
                        }}
                    >
                        PDP Danone
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="open navigation menu"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorElNav}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {navigationItems.map((item) => (
                                item.submenu ? (
                                    <MenuItem 
                                        key={item.name} 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenSubmenu(item.name, e);
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                            <span>{item.icon}</span>
                                            <Typography>{item.name}</Typography>
                                        </Box>
                                    </MenuItem>
                                ) : (
                                    <MenuItem 
                                        key={item.name} 
                                        onClick={() => {
                                            window.location.href = item.link!;
                                            handleCloseNavMenu();
                                        }}
                                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                    >
                                        <span>{item.icon}</span>
                                        {item.name}
                                    </MenuItem>
                                )
                            ))}
                        </Menu>
                        
                        {/* Separate submenu modals for mobile */}
                        {navigationItems.map((item) => (
                            item.submenu && (
                                <Menu
                                    key={`${item.name}-submenu`}
                                    anchorEl={anchorElMenus[item.name]}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    keepMounted
                                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                    open={Boolean(anchorElMenus[item.name])}
                                    onClose={() => handleCloseSubmenu(item.name)}
                                    sx={{ display: { xs: 'block', md: 'none' } }}
                                >
                                    {item.submenu.map((subItem) => (
                                        <MenuItem 
                                            key={subItem.name} 
                                            onClick={() => {
                                                window.location.href = subItem.link;
                                                handleCloseNavMenu();
                                                handleCloseSubmenu(item.name);
                                            }}
                                            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                        >
                                            <span>{subItem.icon}</span>
                                            {subItem.name}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            )
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                        {navigationItems.map((item) => (
                            item.submenu ? (
                                <Box key={item.name} sx={{ position: 'relative' }}>
                                    <Button
                                        onClick={(e) => handleOpenSubmenu(item.name, e)}
                                        sx={{ 
                                            my: 2, 
                                            color: 'white', 
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            px: 2,
                                            borderRadius: 2,
                                            '&:hover': {
                                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                            }
                                        }}
                                    >
                                        <span>{item.icon}</span>
                                        {item.name}
                                    </Button>
                                    <Menu
                                        anchorEl={anchorElMenus[item.name]}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                        keepMounted
                                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                        open={Boolean(anchorElMenus[item.name])}
                                        onClose={() => handleCloseSubmenu(item.name)}
                                        slotProps={{
                                            paper: {
                                                sx: {
                                                    mt: 1,
                                                    borderRadius: 2,
                                                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                                    minWidth: 200
                                                }
                                            }
                                        }}
                                    >
                                        {item.submenu.map((subItem) => (
                                            <MenuItem 
                                                key={subItem.name}
                                                onClick={() => {
                                                    window.location.href = subItem.link;
                                                    handleCloseSubmenu(item.name);
                                                }}
                                                sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: 1.5,
                                                    py: 1.5,
                                                    px: 2,
                                                    '&:hover': {
                                                        bgcolor: 'primary.light',
                                                        color: 'white'
                                                    }
                                                }}
                                            >
                                                <span style={{ fontSize: '1.1rem' }}>{subItem.icon}</span>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {subItem.name}
                                                </Typography>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Box>
                            ) : (
                                <Button
                                    key={item.name}
                                    onClick={() => window.location.href = item.link!}
                                    sx={{ 
                                        my: 2, 
                                        color: 'white', 
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        px: 2,
                                        borderRadius: 2,
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        }
                                    }}
                                >
                                    <span>{item.icon}</span>
                                    {item.name}
                                </Button>
                            )
                        ))}
                    </Box>

                    {isLoggedIn ? (
                        <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ 
                                display: { xs: 'none', md: 'flex' }, 
                                alignItems: 'center', 
                                gap: 1,
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                px: 2,
                                py: 0.5,
                                borderRadius: 3
                            }}>
                                <Typography variant="body2" fontWeight={500}>
                                    {connectedUser?.username}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                    {connectedUser?.role}
                                </Typography>
                            </Box>

                            <Tooltip title="Menu utilisateur">
                                <IconButton 
                                    onClick={handleOpenUserMenu} 
                                    sx={{ 
                                        p: 0,
                                        border: '2px solid rgba(255, 255, 255, 0.3)',
                                        '&:hover': {
                                            border: '2px solid rgba(255, 255, 255, 0.5)',
                                        }
                                    }}
                                >
                                    <Avatar 
                                        alt={connectedUser?.username} 
                                        src="/static/images/avatar/2.jpg"
                                        sx={{ width: 40, height: 40 }}
                                    />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                anchorEl={anchorElUser}
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                keepMounted
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                                slotProps={{
                                    paper: {
                                        sx: {
                                            borderRadius: 2,
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                            minWidth: 200
                                        }
                                    }
                                }}
                            >
                                {userMenuItems.map((item) => (
                                    <MenuItem 
                                        key={item.name} 
                                        onClick={() => {
                                            window.location.href = item.link;
                                            handleCloseUserMenu();
                                        }}
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 1.5,
                                            py: 1.5,
                                            px: 2
                                        }}
                                    >
                                        <span>{item.icon}</span>
                                        <Typography variant="body2">{item.name}</Typography>
                                    </MenuItem>
                                ))}
                                <MenuItem
                                    onClick={() => {
                                        logout();
                                        window.location.href = '/login'
                                    }}
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1.5,
                                        py: 1.5,
                                        px: 2,
                                        borderTop: '1px solid',
                                        borderColor: 'divider',
                                        color: 'error.main'
                                    }}
                                >
                                    <span>🚪</span>
                                    <Typography variant="body2">Déconnexion</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={() => (window.location.href = '/login')}
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                fontWeight: 600,
                                px: 3,
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                                }
                            }}
                        >
                            Connexion
                        </Button>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default EnhancedNavBar;
