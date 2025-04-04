/*
// WorkerManager.tsx
import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

type EntityRef = {
    id: number;
    name?: string;
};

type Worker = {
    id?: number;
    nom: string;
    prenom: string;
    entreprise: EntityRef[];
    chantier: EntityRef[];
    pdps: EntityRef[];
    signatures?: any[];
};

const API_BASE = 'http://localhost:8080/api';

const WorkerManager: React.FC = () => {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [formData, setFormData] = useState<Worker>({
        nom: '',
        prenom: '',
        entreprise: [],
        chantier: [],
        pdps: [],
    });
    const [editing, setEditing] = useState<boolean>(false);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [dropdowns, setDropdowns] = useState<{ entreprises: EntityRef[]; chantiers: EntityRef[]; pdps: EntityRef[] }>({ entreprises: [], chantiers: [], pdps: [] });
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [workersRes, eRes, cRes, pRes] = await Promise.all([
                axios.get(`${API_BASE}/workers`),
                axios.get(`${API_BASE}/entreprises`),
                axios.get(`${API_BASE}/chantiers`),
                axios.get(`${API_BASE}/pdps`)
            ]);
            setWorkers(workersRes.data);
            setDropdowns({ entreprises: eRes.data, chantiers: cRes.data, pdps: pRes.data });
        } catch (e) {
            console.error(e);
            setSnackbar({ open: true, message: 'Failed to load data', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleSave = async () => {
        try {
            if (formData.id) {
                await axios.put(`${API_BASE}/workers/${formData.id}`, formData);
                setSnackbar({ open: true, message: 'Worker updated', severity: 'success' });
            } else {
                await axios.post(`${API_BASE}/workers`, formData);
                setSnackbar({ open: true, message: 'Worker created', severity: 'success' });
            }
            setOpenForm(false);
            fetchAll();
        } catch {
            setSnackbar({ open: true, message: 'Failed to save worker', severity: 'error' });
        }
    };

    const handleDelete = async (id?: number) => {
        if (!id || !window.confirm('Delete this worker?')) return;
        try {
            await axios.delete(`${API_BASE}/workers/${id}`);
            setSnackbar({ open: true, message: 'Deleted', severity: 'success' });
            fetchAll();
        } catch {
            setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
        }
    };

    const handleEdit = (worker: Worker) => {
        setFormData(worker);
        setEditing(true);
        setOpenForm(true);
    };

    const handleCreate = () => {
        setFormData({ nom: '', prenom: '', entreprise: [], chantier: [], pdps: [] });
        setEditing(false);
        setOpenForm(true);
    };

    const handleSelectChange = (e: any, field: keyof Worker) => {
        const selected: EntityRef = e.target.value;
        setFormData({ ...formData, [field]: [selected] });
    };

    const filtered = workers.filter(w =>
        (w.nom?.toLowerCase().includes(search.toLowerCase()) || w.prenom?.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Workers</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>Add Worker</Button>
            </Box>
            <TextField
                fullWidth
                label="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 3 }}
            />
            {loading ? (
                <Box sx={{ textAlign: 'center' }}><CircularProgress /></Box>
            ) : filtered.length === 0 ? (
                <Alert severity="info">No workers</Alert>
            ) : (
                <Grid container spacing={3}>
                    {filtered.map((w) => (
                        <Grid item xs={12} sm={6} md={4} key={w.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{w.nom} {w.prenom}</Typography>
                                    <Typography variant="body2">Company: {w.entreprise[0]?.name || w.entreprise[0]?.id}</Typography>
                                    <Typography variant="body2">Chantier: {w.chantier[0]?.name || w.chantier[0]?.id}</Typography>
                                    <Typography variant="body2">PDP: {w.pdps[0]?.name || w.pdps[0]?.id}</Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton color="primary" onClick={() => handleEdit(w)}><EditIcon /></IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(w.id)}><DeleteIcon /></IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="md">
                <DialogTitle>{editing ? 'Edit Worker' : 'Add Worker'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth required label="Last Name" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth required label="First Name" value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Company</InputLabel>
                                <Select value={formData.entreprise[0] || ''} onChange={(e) => handleSelectChange(e, 'entreprise')} input={<OutlinedInput label="Company" />}>
                                    {dropdowns.entreprises.map((e) => <MenuItem key={e.id} value={e}>{e.name || e.id}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Chantier</InputLabel>
                                <Select value={formData.chantier[0] || ''} onChange={(e) => handleSelectChange(e, 'chantier')} input={<OutlinedInput label="Chantier" />}>
                                    {dropdowns.chantiers.map((c) => <MenuItem key={c.id} value={c}>{c.name || c.id}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>PDP</InputLabel>
                                <Select value={formData.pdps[0] || ''} onChange={(e) => handleSelectChange(e, 'pdps')} input={<OutlinedInput label="PDP" />}>
                                    {dropdowns.pdps.map((p) => <MenuItem key={p.id} value={p}>{p.name || p.id}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenForm(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default WorkerManager;
*/


