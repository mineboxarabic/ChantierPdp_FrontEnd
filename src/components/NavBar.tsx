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
import AdbIcon from '@mui/icons-material/Adb';
import { useNotifications } from '@toolpad/core/useNotifications';
import { useState } from 'react';
import DanoneLogo from "./DanoneLogo.tsx";

const pages = [
    { name: 'Products', link: '/products' },
    { name: 'Pricing', link: '/pricing' },
    { name: 'Blog', link: '/blog' },
    { name: 'CRUD', submenu: [
            { name: 'View Users', link: '/view/users' },
            { name: 'View Risks', link: '/view/risques' },
            { name: 'View Enterprises', link: '/view/entreprises' },
            { name: 'View Localisations', link: '/view/localisations' },
            {name: 'View Permits', link: '/view/permits'}
        ]}
];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function EnhancedNavBar() {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [anchorElCrud, setAnchorElCrud] = useState<null | HTMLElement>(null);
    const notifications = useNotifications();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElNav(event.currentTarget);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
    const handleOpenCrudMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElCrud(event.currentTarget);

    const handleCloseNavMenu = () => setAnchorElNav(null);
    const handleCloseUserMenu = () => setAnchorElUser(null);
    const handleCloseCrudMenu = () => setAnchorElCrud(null);

    const isLoggedIn = localStorage.getItem('user') !== null;

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
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        {isLoggedIn ? 'PDanP' : 'PDanP'}
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
                            {pages.map((page) => (
                                page.submenu ? (
                                    <MenuItem key={page.name} onClick={handleOpenCrudMenu}>
                                        <Typography>{page.name}</Typography>
                                        <Menu
                                            anchorEl={anchorElCrud}
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                            keepMounted
                                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                            open={Boolean(anchorElCrud)}
                                            onClose={handleCloseCrudMenu}
                                        >
                                            {page.submenu.map((item) => (
                                                <MenuItem key={item.name} onClick={() => (window.location.href = item.link)}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </MenuItem>
                                ) : (
                                    <MenuItem key={page.name} onClick={() => (window.location.href = page.link)}>
                                        {page.name}
                                    </MenuItem>
                                )
                            ))}
                        </Menu>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            page.submenu ? (
                                <Button
                                    key={page.name}
                                    onClick={handleOpenCrudMenu}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {page.name}
                                </Button>
                            ) : (
                                <Button
                                    key={page.name}
                                    onClick={() => (window.location.href = page.link)}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {page.name}
                                </Button>
                            )
                        ))}
                    </Box>

                    {isLoggedIn ? (
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
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
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                                <MenuItem
                                    onClick={() => {
                                        localStorage.removeItem('user');
                                        notifications.show('Logged out', { severity: 'error' });
                                        window.location.reload();
                                    }}
                                >
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={() => (window.location.href = '/login')}
                        >
                            Login
                        </Button>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default EnhancedNavBar;
