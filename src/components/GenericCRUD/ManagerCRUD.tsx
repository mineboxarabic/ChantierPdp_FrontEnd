import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Toolbar,
    Tooltip,
    Checkbox,
    IconButton,
    useTheme,
    Snackbar,
    Alert,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    LinearProgress,
    alpha,
    styled, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {
    ManagerCrudProps,
    BaseEntity,
    CardsGenericProps
} from "./TypeConfig.ts";
import CardsGeneric from "./CardsListGeneric.tsx";
import EditGeneric from "./EditGeneirc.tsx";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
    width: '100%',
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const ToolbarTitleSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
}));

const ToolbarTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    marginRight: theme.spacing(2),
}));

const ToolbarActions = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
}));

const ContentContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
}));

/**
 * Manager component for orchestrating CRUD operations
 */
const ManagerCrud = <T extends BaseEntity>({
                                               config,
                                               crudOperations,
                                               initialFilters = {},
                                               pagination = true,
                                               pageSize = 10,
                                               toolbar,
                                               actions = {
                                                   create: true,
                                                   edit: true,
                                                   delete: true,
                                                   view: false,
                                                   export: false,
                                                   import: false,
                                               },
                                           }: ManagerCrudProps<T>) => {
    const theme = useTheme();

    // State
    const [entities, setEntities] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedEntities, setSelectedEntities] = useState<T[]>([]);
    const [editingEntity, setEditingEntity] = useState<T | undefined>(undefined);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState(initialFilters);
    const [searchTerm, setSearchTerm] = useState('');


    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    }>({
        open: false,
        message: '',
        severity: 'info',
    });

    // Actions menu state
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(menuAnchorEl);

    // Custom action if any
    const customActions = actions.custom || [];

    const [allEntities, setAllEntities] = useState<T[]>([]);



    useEffect(() => {

        crudOperations.getAll().then(e=>{
            console.log(e);
            setAllEntities(e);
        })

    }, []);

    const refreshData= ():void =>{
        crudOperations.getAll().then(e=>{
            console.log(e);
            setAllEntities(e);
        })
    }
    // Load entities on mount and when pagination/filters change
    useEffect(() => {
        loadEntities(searchTerm);
    }, [currentPage, allEntities, filters, searchTerm]);

    // Load entities from the API
    const loadEntities = async (search = '') => {
        setLoading(true);
        try {
            const fetchedEntities = allEntities;

            // Filter entities by search term if provided
            let filteredEntities = fetchedEntities;
            if (search) {
                const searchFields = config.searchFields ||
                    config.fields.filter(f => !f.hidden).map(f => f.key);

                filteredEntities = fetchedEntities.filter(entity =>
                    searchFields.some(field => {
                        const value = entity[field];
                        if (value === null || value === undefined) return false;
                        return String(value).toLowerCase().includes(search.toLowerCase());
                    })
                );
            }

            // If pagination is enabled, calculate total pages based on filtered results
            if (pagination) {
                setTotalPages(Math.max(1, Math.ceil(filteredEntities.length / pageSize)));

                // Apply pagination manually to filtered results
                const startIndex = (currentPage - 1) * pageSize;
                const paginatedEntities = filteredEntities.slice(startIndex, startIndex + pageSize);
                setEntities(paginatedEntities);
            } else {
                setEntities(filteredEntities);
            }

            // Clear selection when loading new entities
            setSelectedEntities([]);
        } catch (error) {
            console.error('Error loading entities:', error);
            showNotification('Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Add a new handler for search term changes
    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1); // Reset to first page when searching
        loadEntities(term);
    };


    // Handle entity selection
    const handleSelect = (entity: T) => {
        setSelectedEntities(prev => {
            const isSelected = prev.some(item => item.id === entity.id);

            if (isSelected) {
                return prev.filter(item => item.id !== entity.id);
            } else {
                return [...prev, entity];
            }
        });
    };

    // Handle entity edit
    const handleEdit = (entity: T) => {
        setEditingEntity(entity);
        setIsEditorOpen(true);
    };

    // Handle entity view (can be same as edit but read-only)
    const handleView = (entity: T) => {
        setEditingEntity(entity);
        setIsEditorOpen(true);
    };

    // Handle entity create
    const handleCreate = () => {
        setEditingEntity(undefined);
        setIsEditorOpen(true);
    };

    // Handle entity delete
    const handleDelete = (entity: T) => {
        setSelectedEntities([entity]);
        setIsDeleteDialogOpen(true);
    };

    // Handle bulk delete
    const handleBulkDelete = () => {
        if (selectedEntities.length > 0) {
            setIsDeleteDialogOpen(true);
        }
    };

    // Confirm delete
    const confirmDelete = async () => {
        setLoading(true);
        try {
            // Delete all selected entities
            for (const entity of selectedEntities) {
                if (entity.id) {
                    await crudOperations.delete(entity.id);
                }
            }

            refreshData();


            await loadEntities();
            showNotification(`${selectedEntities.length} item(s) deleted successfully`, 'success');
        } catch (error) {
            console.error('Error deleting entities:', error);
            showNotification('Failed to delete items', 'error');
        } finally {
            setIsDeleteDialogOpen(false);
            setLoading(false);
        }
    };

    // Handle form submission (create/update)
    const handleSubmit = async (entityData: T) => {
        setLoading(true);
        try {
            if (entityData.id) {
                // Update existing entity
                await crudOperations.update(entityData.id, entityData);
                showNotification(`${config.displayName} updated successfully`, 'success');
            } else {
                // Create new entity
                await crudOperations.create(entityData);

                showNotification(`${config.displayName} created successfully`, 'success');
            }
            crudOperations.getAll().then(e=>{
                setAllEntities(e);
            })
            // Reload entities and close editor
            await loadEntities();
            setIsEditorOpen(false);
        } catch (error) {
            console.error('Error saving entity:', error);
            showNotification('Failed to save data', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Show notification
    const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setNotification({
            open: true,
            message,
            severity,
        });
    };

    // Handle notification close
    const handleNotificationClose = () => {
        setNotification({
            ...notification,
            open: false,
        });
    };

    // Open actions menu
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    // Close actions menu
    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    // Export data as JSON
    const handleExport = () => {
        try {
            const jsonData = JSON.stringify(entities, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `${config.pluralName.toLowerCase()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showNotification('Data exported successfully', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            showNotification('Failed to export data', 'error');
        }
    };

    // Import data from JSON
    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = e.target?.result as string;
                const importedData = JSON.parse(content) as T[];

                setLoading(true);

                // Create each imported entity
                for (const entity of importedData) {
                    // Remove id to ensure we create new entities
                    const { id, ...entityData } = entity;
                    await crudOperations.create(entityData as T);
                }

                // Reload entities
                await loadEntities();
                showNotification(`${importedData.length} item(s) imported successfully`, 'success');
            } catch (error) {
                console.error('Error importing data:', error);
                showNotification('Failed to import data. Please check the file format.', 'error');
            } finally {
                setLoading(false);
            }
        };
        reader.readAsText(file);

        // Reset the input
        event.target.value = '';
    };

    // Execute custom action
    const executeCustomAction = (action: { name: string; action: (selected: T[]) => void }) => {
        action.action(selectedEntities);
        handleMenuClose();
    };

    // Check if all entities are selected
    const areAllSelected = entities.length > 0 && selectedEntities.length === entities.length;

    // Check if some entities are selected
    const areSomeSelected = selectedEntities.length > 0 && selectedEntities.length < entities.length;

    // Handle select all
    const handleSelectAll = () => {
        if (areAllSelected) {
            setSelectedEntities([]);
        } else {
            setSelectedEntities([...entities]);
        }
    };

    return (
        <Box>
            <StyledPaper elevation={0}>
                {/* Toolbar */}
                <StyledToolbar>
                    <ToolbarTitleSection>
                        {selectedEntities.length > 0 ? (
                            <>
                                <Checkbox
                                    color="primary"
                                    indeterminate={areSomeSelected}
                                    checked={areAllSelected}
                                    onChange={handleSelectAll}
                                />
                                <ToolbarTitle variant="subtitle1">
                                    {selectedEntities.length} selected
                                </ToolbarTitle>

                                {actions.delete && (
                                    <Tooltip title="Delete">
                                        <IconButton onClick={handleBulkDelete}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </>
                        ) : (
                            <>
                                <ToolbarTitle variant="h6">{config.pluralName}</ToolbarTitle>
                                {toolbar}
                            </>
                        )}
                    </ToolbarTitleSection>

                    <ToolbarActions>
                        {/* Primary actions */}
                        {selectedEntities.length === 0 && (
                            <>
                                <Tooltip title="Refresh">
                                    <IconButton onClick={()=>{
                                        refreshData();
                                    }}>
                                        <RefreshIcon />
                                    </IconButton>
                                </Tooltip>

                                {actions.create && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                        onClick={handleCreate}
                                    >
                                        Create
                                    </Button>
                                )}

                                {/* More actions menu */}
                                {(actions.export || actions.import || customActions.length > 0) && (
                                    <>
                                        <Tooltip title="More actions">
                                            <IconButton onClick={handleMenuOpen}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Menu
                                            anchorEl={menuAnchorEl}
                                            open={isMenuOpen}
                                            onClose={handleMenuClose}
                                        >
                                            {actions.export && (
                                                <MenuItem onClick={handleExport}>
                                                    <ListItemIcon>
                                                        <FileDownloadIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText>Export</ListItemText>
                                                </MenuItem>
                                            )}

                                            {actions.import && (
                                                <MenuItem>
                                                    <ListItemIcon>
                                                        <FileUploadIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText>
                                                        <label style={{ cursor: 'pointer', display: 'block' }}>
                                                            Import
                                                            <input
                                                                type="file"
                                                                accept=".json"
                                                                style={{ display: 'none' }}
                                                                onChange={handleImport}
                                                            />
                                                        </label>
                                                    </ListItemText>
                                                </MenuItem>
                                            )}

                                            {(actions.export || actions.import) && customActions.length > 0 && (
                                                <Divider />
                                            )}

                                            {/* Custom actions */}
                                            {customActions.map((action, index) => (
                                                <MenuItem
                                                    key={index}
                                                    onClick={() => executeCustomAction(action)}
                                                    disabled={action.multiple && selectedEntities.length === 0}
                                                >
                                                    {action.icon && (
                                                        <ListItemIcon>
                                                            {action.icon}
                                                        </ListItemIcon>
                                                    )}
                                                    <ListItemText>{action.label}</ListItemText>
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </>
                                )}
                            </>
                        )}
                    </ToolbarActions>
                </StyledToolbar>

                {/* Loading indicator */}
                {loading && <LinearProgress />}

                {/* Content */}
                <ContentContainer>
                    <CardsGeneric
                        entities={entities}
                        config={config}
                        onSelect={handleSelect}
                        onEdit={actions.edit ? handleEdit : undefined}
                        onDelete={actions.delete ? handleDelete : undefined}
                        onView={actions.view ? handleView : undefined}
                        selectedIds={selectedEntities.map(e => e.id as number)}
                        loading={loading}
                        pagination={pagination ? {
                            page: currentPage,
                            totalPages,
                            onPageChange: handlePageChange,
                        } : undefined}
                        searchTerm={searchTerm}
                        onSearchChange={handleSearchChange}
                    />
                </ContentContainer>
            </StyledPaper>

            {/* Edit/Create Dialog */}
            <EditGeneric
                entity={editingEntity}
                config={config}
                open={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                onSubmit={handleSubmit}
                crudOperations={crudOperations}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {selectedEntities.length === 1
                            ? `Are you sure you want to delete this ${config.displayName.toLowerCase()}?`
                            : `Are you sure you want to delete ${selectedEntities.length} ${config.pluralName.toLowerCase()}?`}
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleNotificationClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleNotificationClose}
                    severity={notification.severity}
                    variant="filled"
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ManagerCrud;