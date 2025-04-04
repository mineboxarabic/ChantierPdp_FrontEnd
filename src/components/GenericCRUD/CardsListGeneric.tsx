import React, {useEffect, useState} from 'react';
import {
    Box,
    Grid,
    Typography,
    Pagination,
    CircularProgress,
    Alert,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    useMediaQuery,
    useTheme,
    InputAdornment,
    TextField,
    IconButton,
    Divider,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TablePagination,
    Tooltip,
    Checkbox
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TableViewIcon from '@mui/icons-material/TableView';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { CardsGenericProps, BaseEntity, EntityConfig, FieldType} from "./TypeConfig.ts";
import CardGeneric from './CardGeneric';

// Styled components
const ToolbarContainer = styled(Paper)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 2,
}));

const NoResultsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(6),
    textAlign: 'center',
    width: '100%',
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius * 2,
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(2),
}));

const ViewToggleButton = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
    backgroundColor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
    '&:hover': {
        backgroundColor: active
            ? alpha(theme.palette.primary.main, 0.2)
            : alpha(theme.palette.primary.main, 0.1),
    },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
}));

const ActionCell = styled(TableCell)(({ theme }) => ({
    width: '160px',
    padding: theme.spacing(0.5, 1),
}));

const StyledTableRow = styled(TableRow, {
    shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: alpha(theme.palette.action.hover, 0.04),
    },
    '&:hover': {
        backgroundColor: alpha(theme.palette.action.hover, 0.2),
    },
    ...(selected && {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.15),
        },
    }),
}));

// Helper function for alpha (since it might not be exported from MUI)
function alpha(color: string, value: number) {
    return color.replace(/^rgba?\(|\s+|\)$/g, '').split(',').length === 3
        ? `rgba(${color.replace(/^rgba?\(|\s+|\)$/g, '')}, ${value})`
        : color;
}

/**
 * Component for displaying a grid of entity cards with filtering, sorting, and pagination
 */
const CardsGeneric = <T extends BaseEntity>({
                                                entities,
                                                config,
                                                onSelect,
                                                onEdit,
                                                onDelete,
                                                onView,
                                                selectedIds = [],
                                                loading = false,
                                                pagination,
                                                searchTerm = '',
                                                onSearchChange
}: CardsGenericProps<T>) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    const [sortField, setSortField] = useState(config.defaultSortField || '');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');



    // Watch for prop changes
    useEffect(() => {
        setLocalSearchTerm(searchTerm);
    }, [searchTerm]);



    // Calculate columns based on screen size and view mode
    const getColsCount = () => {
        if (viewMode === 'list') return 12;
        if (isMobile) return 12;
        if (isTablet) return 6;
        return 3;
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTerm = e.target.value;
        setLocalSearchTerm(newTerm);

        // If we have a parent handler, call it, otherwise use local filtering
        if (onSearchChange) {
            onSearchChange(newTerm);
        }
    };

    // Filter entities based on search term
    const filterEntities = () => {
        // If we have a parent search handler, don't filter locally
        if (onSearchChange) return entities;

        if (!localSearchTerm) return entities;

        const searchFields = config.searchFields ||
            config.fields.filter(f => !f.hidden).map(f => f.key);

        return entities.filter(entity =>
            searchFields.some(field => {
                const value = entity[field];
                if (value === null || value === undefined) return false;
                return String(value).toLowerCase().includes(localSearchTerm.toLowerCase());
            })
        );
    };

    // Sort entities
    const sortEntities = (filteredEntities: T[]) => {
        if (!sortField) return filteredEntities;

        return [...filteredEntities].sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            // Handle null or undefined values
            if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
            if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? 1 : -1;

            // Compare based on type
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            // Default comparison for numbers, booleans, etc.
            return sortDirection === 'asc'
                ? (aValue > bValue ? 1 : -1)
                : (aValue > bValue ? -1 : 1);
        });
    };

    // Apply filtering and sorting
    const filteredEntities = filterEntities();
    const sortedEntities = sortEntities(filteredEntities);

    // Get sortable fields
    const sortableFields = config.fields.filter(field =>
        !field.hidden &&
        ['text', 'number', 'date', 'boolean'].includes(field.type)
    );

    // Handle sort change
    const handleSortChange = (field: string) => {
        if (sortField === field) {
            // Toggle direction if same field
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            // Set new field and reset direction
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Get visible fields for table view
    const visibleFields = config.fields.filter(field =>
        !field.hidden &&
        field.key !== 'id' &&
        field.type !== FieldType.Image
    ).slice(0, 5); // Limit to 5 fields for better display

    // Format cell value for table view
    const formatCellValue = (entity: T, fieldKey: string) => {
        const value = entity[fieldKey];
        if (value === null || value === undefined) return '-';

        const field = config.fields.find(f => f.key === fieldKey);
        if (!field) return String(value);

        // Use custom formatter if provided
        if (field.formatter) {
            return field.formatter(value);
        }

        // Default rendering based on field type
        switch (field.type) {
            case FieldType.Boolean:
                return value ? 'Yes' : 'No';

            case FieldType.Date:
                return new Date(value as string).toLocaleDateString();

            case FieldType.Enum: {
                const option = field.options?.find(opt => opt.value === value);
                return option?.label || value;
            }
            case FieldType.EntityRef:
                return value?.id ? `ID: ${value.id}` : '-';

            case FieldType.ArrayOfEntityRefs:
                return (value as any[])?.length ? `${(value as any[]).length} items` : 'None';

            case FieldType.ArrayOfSimpleValues:
                return (value as any[])?.length ? `${(value as any[]).length} items` : 'None';

            default:
                return String(value);
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* Toolbar with search, sort, and view options */}
            <ToolbarContainer sx={{
                width:'100%',
                minWidth: '150vh',
            }} elevation={0}>
                <TextField
                    placeholder={`Search ${config.pluralName}`}
                    variant="outlined"
                    size="small"
                    value={localSearchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ flexGrow: 1 }}
                />

                {sortableFields.length > 0 && (
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel id="sort-field-label">Sort By</InputLabel>
                        <Select
                            labelId="sort-field-label"
                            value={sortField}
                            label="Sort By"
                            onChange={(e) => handleSortChange(e.target.value)}
                            startAdornment={
                                <InputAdornment position="start">
                                    <SortIcon fontSize="small" />
                                </InputAdornment>
                            }
                        >
                            {sortableFields.map((field) => (
                                <MenuItem key={field.key} value={field.key}>
                                    {field.label} {sortField === field.key && (sortDirection === 'asc' ? '↑' : '↓')}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                <Divider orientation="vertical" flexItem sx={{ height: 36, mx: 1 }} />

                <Box>
                    <ViewToggleButton
                        size="small"
                        active={viewMode === 'grid'}
                        onClick={() => setViewMode('grid')}
                        aria-label="Grid view"
                    >
                        <ViewModuleIcon fontSize="small" />
                    </ViewToggleButton>
                    <ViewToggleButton
                        size="small"
                        active={viewMode === 'list'}
                        onClick={() => setViewMode('list')}
                        aria-label="List view"
                    >
                        <ViewListIcon fontSize="small" />
                    </ViewToggleButton>
                    <ViewToggleButton
                        size="small"
                        active={viewMode === 'table'}
                        onClick={() => setViewMode('table')}
                        aria-label="Table view"
                    >
                        <TableViewIcon fontSize="small" />
                    </ViewToggleButton>
                </Box>
            </ToolbarContainer>

            {/* Loading indicator */}
            {loading && (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            )}

            {/* No results message */}
            {!loading && sortedEntities.length === 0 && (
                <NoResultsContainer>
                    <Typography variant="h6" gutterBottom>No {config.pluralName} found</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {searchTerm ?
                            `No results match your search "${searchTerm}". Try different keywords.` :
                            `No ${config.pluralName.toLowerCase()} are currently available.`
                        }
                    </Typography>
                </NoResultsContainer>
            )}

            {/* Content based on view mode */}
            {!loading && sortedEntities.length > 0 && (
                <>
                    {/* Table View Mode */}
                    {viewMode === 'table' ? (
                        <StyledTableContainer>
                            <Table aria-label={`${config.displayName} table`} size="medium">
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                disabled={!onSelect}
                                                sx={{ visibility: onSelect ? 'visible' : 'hidden' }}
                                            />
                                        </TableCell>
                                        {visibleFields.map((field) => (
                                            <TableCell key={field.key}>
                                                <TableSortLabel
                                                    active={sortField === field.key}
                                                    direction={sortDirection}
                                                    onClick={() => handleSortChange(field.key)}
                                                >
                                                    {field.label}
                                                </TableSortLabel>
                                            </TableCell>
                                        ))}
                                        <ActionCell>Actions</ActionCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortedEntities.map((entity) => {
                                        const isSelected = selectedIds.includes(entity.id as number);
                                        return (
                                            <StyledTableRow
                                                key={String(entity.id)}
                                                hover
                                                selected={isSelected}
                                                onClick={() => onSelect && onSelect(entity)}
                                                sx={{ cursor: onSelect ? 'pointer' : 'default' }}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isSelected}
                                                        disabled={!onSelect}
                                                        sx={{ visibility: onSelect ? 'visible' : 'hidden' }}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={() => onSelect && onSelect(entity)}
                                                    />
                                                </TableCell>
                                                {visibleFields.map((field) => (
                                                    <TableCell key={field.key}>
                                                        {formatCellValue(entity, field.key)}
                                                    </TableCell>
                                                ))}
                                                <ActionCell>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        {onView && (
                                                            <Tooltip title="View">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onView(entity);
                                                                    }}
                                                                >
                                                                    <VisibilityIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                        {onEdit && (
                                                            <Tooltip title="Edit">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onEdit(entity);
                                                                    }}
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                        {onDelete && (
                                                            <Tooltip title="Delete">
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onDelete(entity);
                                                                    }}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </Box>
                                                </ActionCell>
                                            </StyledTableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </StyledTableContainer>
                    ) : (
                        /* Grid or List View Mode */
                        <Grid container spacing={3}>
                            {sortedEntities.map((entity) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={viewMode === 'list' ? 12 : 6}
                                    md={viewMode === 'list' ? 12 : 4}
                                    lg={viewMode === 'list' ? 12 : 3}
                                    key={String(entity.id)}
                                >
                                    <CardGeneric
                                        entity={entity}
                                        config={config}
                                        onSelect={onSelect}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onView={onView}
                                        selected={selectedIds.includes(entity.id as number)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <PaginationContainer>
                            <FormControl size="small" sx={{ minWidth: 100 }}>
                                <Select
                                    value={pagination.page}
                                    onChange={(e) => pagination.onPageChange(Number(e.target.value))}
                                    size="small"
                                >
                                    {[...Array(pagination.totalPages)].map((_, i) => (
                                        <MenuItem key={i} value={i + 1}>
                                            Page {i + 1}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Pagination
                                count={pagination.totalPages}
                                page={pagination.page}
                                onChange={(_, page) => pagination.onPageChange(page)}
                                color="primary"
                                size={isMobile ? "small" : "medium"}
                            />

                            <Typography variant="body2" color="text.secondary">
                                Page {pagination.page} of {pagination.totalPages}
                            </Typography>
                        </PaginationContainer>
                    )}
                </>
            )}
        </Box>
    );
};

export default CardsGeneric;