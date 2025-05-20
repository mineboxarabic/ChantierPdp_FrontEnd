import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    IconButton,
    Typography,
    Snackbar,
    Alert,
    CircularProgress,
    Chip,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Grid,
    Card,
    CardContent,
    CardActions,
    Divider,
    useTheme,
    alpha,
    SelectChangeEvent,
    Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    Search as SearchIcon,
    Clear as ClearIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    VisibilityOutlined as ViewIcon
} from '@mui/icons-material';

// Types
export type EntityConfig<T> = {
    entityName: string;
    entityNamePlural: string;
    fields: FieldConfig[];
    fetchData: () => Promise<T[]>; //This function fetches the data from the server
    createData: (data: T) => Promise<T>;
    updateData: (id: number, data: T) => Promise<T>;
    deleteData: (id: number) => Promise<void>;
    getEmptyEntity: () => T;
};

export type FieldConfig = {
    key: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'date' | 'image' | 'reference' | 'boolean' | 'array';
    required?: boolean;
    options?: { value: string | number; label: string }[];
    hidden?: boolean;
    readOnly?: boolean;
    transform?: (value: any) => any;
    getOptionLabel?: (option: any) => string;
    referenceEntityName?: string;
    referenceOptions?: any[];
    width?: string;
};

type CrudState<T> = {
    data: T[];
    loading: boolean;
    error: string | null;
    page: number;
    rowsPerPage: number;
    openDialog: boolean;
    currentEntity: T | null;
    dialogMode: 'create' | 'edit' | 'view' | 'delete';
    snackbar: {
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    };
    searchTerm: string;
};

// Generic CRUD component
export function GenericCrud<T extends { id?: number }>({ config }: { config: EntityConfig<T> }) {
    const theme = useTheme();

    const initialState: CrudState<T> = {
        data: [],
        loading: true,
        error: null,
        page: 0,
        rowsPerPage: 10,
        openDialog: false,
        currentEntity: null,
        dialogMode: 'create',
        snackbar: {
            open: false,
            message: '',
            severity: 'info',
        },
        searchTerm: '',
    };

    const [state, setState] = useState<CrudState<T>>(initialState);

    // Load data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setState({ ...state, loading: true, error: null });
        try {
            const result = await config.fetchData();
            setState({
                ...state,
                data: result,
                loading: false,
            });
        } catch (error) {
            setState({
                ...state,
                loading: false,
                error: error instanceof Error ? error.message : 'An unknown error occurred',
            });
            showSnackbar('Failed to fetch data', 'error');
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setState({ ...state, page: newPage });
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            page: 0,
            rowsPerPage: parseInt(event.target.value, 10),
        });
    };

    const handleOpenDialog = (mode: 'create' | 'edit' | 'view' | 'delete', entity?: T) => {
        setState({
            ...state,
            openDialog: true,
            dialogMode: mode,
            currentEntity: mode === 'create' ? config.getEmptyEntity() : entity || null,
        });
    };

    const handleCloseDialog = () => {
        setState({ ...state, openDialog: false, currentEntity: null });
    };

    const handleInputChange = (field: string, value: any) => {
        if (!state.currentEntity) return;

        const fieldConfig = config.fields.find(f => f.key === field);

        // Handle nested properties using dot notation (e.g., "entreprise.id")
        if (field.includes('.')) {
            const [parentField, childField] = field.split('.');
            setState({
                ...state,
                currentEntity: {
                    ...state.currentEntity,
                    [parentField]: {
                        ...state.currentEntity[parentField as keyof T],
                        [childField]: value
                    }
                } as T,
            });
        } else {
            // For direct properties
            setState({
                ...state,
                currentEntity: {
                    ...state.currentEntity,
                    [field]: fieldConfig?.type === 'number' ? Number(value) : value,
                } as T,
            });
        }
    };

    const handleSubmit = async () => {
        if (!state.currentEntity) return;

        setState({ ...state, loading: true });
        try {
            if (state.dialogMode === 'create') {
                const created = await config.createData(state.currentEntity);
                setState({
                    ...state,
                    data: [...state.data, created],
                    loading: false,
                    openDialog: false,
                });
                showSnackbar(`${config.entityName} created successfully`, 'success');
            } else if (state.dialogMode === 'edit' && state.currentEntity.id) {
                const updated = await config.updateData(state.currentEntity.id, state.currentEntity);
                setState({
                    ...state,
                    data: state.data.map(item =>
                        (item as any).id === state.currentEntity?.id ? updated : item
                    ),
                    loading: false,
                    openDialog: false,
                });
                showSnackbar(`${config.entityName} updated successfully`, 'success');
            }
        } catch (error) {
            setState({ ...state, loading: false });
            showSnackbar(
                `Failed to ${state.dialogMode === 'create' ? 'create' : 'update'} ${config.entityName}`,
                'error'
            );
        }
    };

    const handleDelete = async () => {
        if (!state.currentEntity || !state.currentEntity.id) return;

        setState({ ...state, loading: true });
        try {
            await config.deleteData(state.currentEntity.id);
            setState({
                ...state,
                data: state.data.filter(item => (item as any).id !== state.currentEntity?.id),
                loading: false,
                openDialog: false,
            });
            showSnackbar(`${config.entityName} deleted successfully`, 'success');
        } catch (error) {
            setState({ ...state, loading: false });
            showSnackbar(`Failed to delete ${config.entityName}`, 'error');
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setState({
            ...state,
            snackbar: {
                open: true,
                message,
                severity,
            },
        });
    };

    const handleCloseSnackbar = () => {
        setState({
            ...state,
            snackbar: {
                ...state.snackbar,
                open: false,
            },
        });
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, searchTerm: event.target.value });
    };

    const clearSearch = () => {
        setState({ ...state, searchTerm: '' });
    };

    // Filter data based on search term
    const filteredData = state.data.filter((entity) => {
        if (!state.searchTerm) return true;

        const searchLower = state.searchTerm.toLowerCase();

        // Search through all visible string fields
        return config.fields.some(field => {
            if (field.hidden) return false;

            const value = getNestedValue(entity, field.key);

            if (typeof value === 'string') {
                return value.toLowerCase().includes(searchLower);
            } else if (typeof value === 'number') {
                return value.toString().includes(searchLower);
            }

            return false;
        });
    });

    const getNestedValue = (obj: any, path: string) => {
        const keys = path.split('.');
        return keys.reduce((o, key) => (o && o[key] !== undefined) ? o[key] : undefined, obj);
    };

    const renderFieldValue = (entity: T, field: FieldConfig) => {
        const value = getNestedValue(entity, field.key);

        if (value === undefined || value === null) {
            return '-';
        }

        switch (field.type) {
            case 'reference':
                return value.id || '-';
            case 'image':
                return value.imageData ?
                    <img
                        src={`data:${value.mimeType || 'image/png'};base64,${value.imageData}`}
                        alt={field.label}
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    /> : '-';
            case 'select':
                const option = field.options?.find(opt => opt.value === value);
                return option ? option.label : value;
            case 'boolean':
                return value ? 'Yes' : 'No';
            case 'array':
                return Array.isArray(value) ? `${value.length} items` : '-';
            default:
                return field.transform ? field.transform(value) : String(value);
        }
    };

    const renderFormField = (field: FieldConfig) => {
        if (!state.currentEntity || field.hidden) return null;

        const value = getNestedValue(state.currentEntity, field.key) || '';
        const isReadOnly = field.readOnly || state.dialogMode === 'view';

        switch (field.type) {
            case 'select':
                return (
                    <FormControl fullWidth margin="normal" key={field.key} disabled={isReadOnly}>
                        <InputLabel id={`${field.key}-label`}>{field.label}</InputLabel>
                        <Select
                            labelId={`${field.key}-label`}
                            id={field.key}
                            value={value || ''}
                            onChange={(e: SelectChangeEvent<string | number>) =>
                                handleInputChange(field.key, e.target.value)
                            }
                            label={field.label}
                            required={field.required}
                        >
                            {field.options?.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );

            case 'reference':
                return (
                    <FormControl fullWidth margin="normal" key={field.key} disabled={isReadOnly}>
                        <InputLabel id={`${field.key}-label`}>
                            {field.label} {field.referenceEntityName ? `(${field.referenceEntityName})` : ''}
                        </InputLabel>
                        <Select
                            labelId={`${field.key}-label`}
                            id={field.key}
                            value={value?.id || ''}
                            onChange={(e) => {
                                const refId = e.target.value as number;
                                handleInputChange(field.key, { id: refId });
                            }}
                            label={field.label}
                            required={field.required}
                        >
                            {field.referenceOptions?.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {field.getOptionLabel ? field.getOptionLabel(option) : option.id}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );

            case 'image':
                // In a real app, you'd implement image upload here
                return (
                    <Box key={field.key} mt={2} mb={2}>
                        <Typography variant="subtitle2">{field.label}</Typography>
                        {value && value.imageData && (
                            <Box mt={1} mb={1}>
                                <img
                                    src={`data:${value.mimeType || 'image/png'};base64,${value.imageData}`}
                                    alt={field.label}
                                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                                />
                            </Box>
                        )}
                        {!isReadOnly && (
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<AddIcon />}
                                disabled={isReadOnly}
                            >
                                Upload Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => {
                                        // In a real app, you'd handle file upload here
                                        // This is just a placeholder
                                        console.log('File selected:', e.target.files?.[0]);
                                    }}
                                />
                            </Button>
                        )}
                    </Box>
                );

            case 'boolean':
                return (
                    <FormControl fullWidth margin="normal" key={field.key} disabled={isReadOnly}>
                        <InputLabel id={`${field.key}-label`}>{field.label}</InputLabel>
                        <Select
                            labelId={`${field.key}-label`}
                            id={field.key}
                            value={value === true ? 'true' : value === false ? 'false' : ''}
                            onChange={(e) => handleInputChange(field.key, e.target.value === 'true')}
                            label={field.label}
                        >
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                        </Select>
                    </FormControl>
                );

            default:
                return (
                    <TextField
                        key={field.key}
                        fullWidth
                        margin="normal"
                        id={field.key}
                        name={field.key}
                        label={field.label}
                        value={value || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        type={field.type === 'number' ? 'number' : 'text'}
                        required={field.required}
                        disabled={isReadOnly}
                        multiline={field.type === 'text' && String(value).length > 50}
                        rows={field.type === 'text' && String(value).length > 50 ? 4 : 1}
                    />
                );
        }
    };

    const renderDialogContent = () => {
        return (
            <DialogContent>
                {state.dialogMode === 'delete' ? (
                    <Typography>
                        Are you sure you want to delete this {config.entityName}?
                    </Typography>
                ) : (
                    <Grid container spacing={2}>
                        {config.fields.map((field) => (
                            <Grid item xs={12} sm={field.width ? 6 : 12} key={field.key}>
                                {renderFormField(field)}
                            </Grid>
                        ))}
                    </Grid>
                )}
            </DialogContent>
        );
    };

    const renderDialogActions = () => {
        if (state.dialogMode === 'view') {
            return (
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            );
        }

        if (state.dialogMode === 'delete') {
            return (
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            );
        }

        return (
            <DialogActions>
                <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={state.loading}
                >
                    {state.loading ? (
                        <CircularProgress size={24} />
                    ) : (
                        state.dialogMode === 'create' ? 'Create' : 'Update'
                    )}
                </Button>
            </DialogActions>
        );
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" component="div">
                        {config.entityNamePlural}
                    </Typography>
                    <Box display="flex" gap={1}>
                        <Tooltip title="Refresh">
                            <IconButton onClick={fetchData} disabled={state.loading}>
                                {state.loading ? <CircularProgress size={24} /> : <RefreshIcon />}
                            </IconButton>
                        </Tooltip>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog('create')}
                        >
                            Add {config.entityName}
                        </Button>
                    </Box>
                </Box>

                {/* Search Bar */}
                <Box display="flex" mb={2}>
                    <TextField
                        variant="outlined"
                        placeholder={`Search ${config.entityNamePlural}`}
                        size="small"
                        fullWidth
                        value={state.searchTerm}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                            endAdornment: state.searchTerm ? (
                                <IconButton size="small" onClick={clearSearch}>
                                    <ClearIcon />
                                </IconButton>
                            ) : null,
                        }}
                    />
                </Box>

                {state.error ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {state.error}
                    </Alert>
                ) : null}

                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label={`${config.entityNamePlural} table`}>
                        <TableHead>
                            <TableRow sx={{ bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.primary.main, 0.1) }}>
                                {config.fields
                                    .filter(field => !field.hidden)
                                    .map((field) => (
                                        <TableCell key={field.key}>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {field.label}
                                            </Typography>
                                        </TableCell>
                                    ))}
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {state.loading ? (
                                <TableRow>
                                    <TableCell colSpan={config.fields.filter(f => !f.hidden).length + 1} align="center">
                                        <Box display="flex" justifyContent="center" alignItems="center" p={3}>
                                            <CircularProgress />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={config.fields.filter(f => !f.hidden).length + 1} align="center">
                                        <Typography color="textSecondary" variant="body2">
                                            {state.searchTerm
                                                ? `No ${config.entityNamePlural} matching "${state.searchTerm}"`
                                                : `No ${config.entityNamePlural} found`}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredData
                                    .slice(state.page * state.rowsPerPage, state.page * state.rowsPerPage + state.rowsPerPage)
                                    .map((entity) => (
                                        <TableRow hover key={(entity as any).id}>
                                            {config.fields
                                                .filter(field => !field.hidden)
                                                .map((field) => (
                                                    <TableCell key={`${(entity as any).id}-${field.key}`}>
                                                        {renderFieldValue(entity, field)}
                                                    </TableCell>
                                                ))}
                                            <TableCell align="right">
                                                <Box display="flex" justifyContent="flex-end" gap={1}>
                                                    <Tooltip title="View">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleOpenDialog('view', entity)}
                                                        >
                                                            <ViewIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Edit">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleOpenDialog('edit', entity)}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleOpenDialog('delete', entity)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredData.length}
                    rowsPerPage={state.rowsPerPage}
                    page={state.page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Form Dialog */}
            <Dialog
                open={state.openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {state.dialogMode === 'create'
                        ? `Add New ${config.entityName}`
                        : state.dialogMode === 'edit'
                            ? `Edit ${config.entityName}`
                            : state.dialogMode === 'view'
                                ? `View ${config.entityName}`
                                : `Delete ${config.entityName}`}
                </DialogTitle>
                {renderDialogContent()}
                {renderDialogActions()}
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={state.snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={state.snackbar.severity}>
                    {state.snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default GenericCrud;

