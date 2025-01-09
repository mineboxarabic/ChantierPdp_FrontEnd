import React, { useState } from 'react';
import { Box, TextField, Button, Avatar, Typography, Grid, Paper } from '@mui/material';

const ProfilePage: React.FC = () => {


    const [profile, setProfile] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        bio: 'A passionate developer.',
        avatar: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log('Profile saved:', profile);
        alert('Profile updated successfully!');
    };

    return (
        <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                        <Avatar
                            src={profile.avatar || '/default-avatar.png'}
                            sx={{ width: 100, height: 100, margin: 'auto' }}
                        />
                        <Typography variant="h6" sx={{ mt: 1 }}>
                            {profile.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={profile.name}
                            onChange={handleInputChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={profile.email}
                            onChange={handleInputChange}
                            variant="outlined"
                            type="email"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Bio"
                            name="bio"
                            value={profile.bio}
                            onChange={handleInputChange}
                            variant="outlined"
                            multiline
                            rows={4}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Avatar URL"
                            name="avatar"
                            value={profile.avatar}
                            onChange={handleInputChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" fullWidth onClick={handleSave}>
                            Save Changes
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default ProfilePage;
