import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    IconButton,
    Chip,
    Box,
    Avatar,
    Divider,
    Grid,
    Tooltip,
    CardHeader,
    Skeleton,
    useTheme,
    alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ImageIcon from '@mui/icons-material/Image';
import { FieldType, CardGenericProps, BaseEntity, EntityConfig, FieldConfig} from "./TypeConfig.ts";

// Styled components for a more modern look
const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
    },
    position: 'relative',
    overflow: 'visible',
    borderRadius: theme.shape.borderRadius * 2,
}));

const CardSelected = styled('div')(({ theme }) => ({
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    border: `2px solid ${theme.palette.background.paper}`,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.contrastText,
}));

const StyledCardContent = styled(CardContent)({
    flexGrow: 1,
    paddingBottom: '8px',
    '&:last-child': { paddingBottom: '16px' }
});

const ImagePreview = styled('div')({
    height: 140,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
});

const ImagePlaceholder = styled(Box)(({ theme }) => ({
    height: 140,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
    color: theme.palette.text.secondary,
}));

const EntityAvatar = styled(Avatar)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    width: 40,
    height: 40,
}));

const FieldLabel = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontWeight: 500,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: theme.spacing(0.5),
}));

const FieldValue = styled(Typography)({
    wordBreak: 'break-word',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
});

const ActionButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.text.secondary,
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.primary.main,
    },
}));

/**
 * Renders a card for displaying an entity with dynamic fields based on configuration
 */
const CardGeneric = <T extends BaseEntity>({
                                               entity,
                                               config,
                                               onSelect,
                                               onEdit,
                                               onDelete,
                                               onView,
                                               selected = false,
                                           }: CardGenericProps<T>) => {
    const theme = useTheme();

    if (!entity) return <CardSkeleton />;

    // Find display and image fields
    const displayField = config.displayField || 'id';
    const imageField = config.fields.find(field => field.type === FieldType.Image)?.key;
    const displayValue = entity[displayField] || `ID: ${entity.id}`;

    // Get fields to display (limit to 4 visible fields by default)
    const visibleFields = config.fields
        .filter(field => !field.hidden)
        .slice(0, 4);

    // Function to render field value based on type
    const renderFieldValue = (field: FieldConfig, value: any) => {
        if (value === undefined || value === null) return '-';

        // Use custom renderer if provided
        if (field.renderer) {
            return <field.renderer value={value} />;
        }

        // Use custom formatter if provided
        if (field.formatter) {
            return field.formatter(value);
        }

        // Default rendering based on field type
        switch (field.type) {
            case FieldType.Boolean:
                return value ? 'Yes' : 'No';

            case FieldType.Date:
                return new Date(value).toLocaleDateString();

            case FieldType.Enum: {
                const option = field.options?.find(opt => opt.value === value);
                return (
                    <Chip
                        label={option?.label || value}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                );
            }
            case FieldType.EntityRef:
                return value?.id ? `ID: ${value.id}` : '-';

            case FieldType.ArrayOfEntityRefs:
                return value?.length ? `${value.length} items` : 'None';

            case FieldType.ArrayOfSimpleValues:
                return value?.length ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {value.slice(0, 2).map((item: any, i: number) => (
                            <Chip key={i} label={item} size="small" />
                        ))}
                        {value.length > 2 && (
                            <Chip label={`+${value.length - 2}`} size="small" color="primary" />
                        )}
                    </Box>
                ) : 'None';

            case FieldType.Number:
                return value.toString();

            default:
                // Handle strings and other types - truncate if too long
                return typeof value === 'string' && value.length > 100
                    ? `${value.substring(0, 100)}...`
                    : String(value);
        }
    };

    // Get entity initial for avatar
    const getInitial = () => {
        const displayStr = String(displayValue);
        return displayStr.charAt(0).toUpperCase();
    };

    const getImage = (imageField:string) => {
        let imageString;
        console.log(entity[imageField])
        if(imageField && entity[imageField] && entity[imageField].mimeType != '' && entity[imageField].imageData != ''){
                return `data:${entity[imageField].mimeType};base64,${entity[imageField].imageData}`;
        }else{
            console.log('test')
            if(typeof config.defaultImage === 'string'){
                return config.defaultImage;
            }else{
                return `data:${entity[imageField].mimeType};base64,${entity[imageField].imageData}`;

            }
        }
    }

    return (
        <StyledCard
            variant="outlined"
            sx={{
                cursor: onSelect ? 'pointer' : 'default',
                border: selected ? `2px solid ${theme.palette.primary.main}` : undefined,
            }}
            onClick={() => onSelect && onSelect(entity)}
        >
            {selected && (
                <CardSelected>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'common.white' }} />
                </CardSelected>
            )}

            {/* Image Preview (if available) */}
            {imageField && entity[imageField] ? (
                <ImagePreview>
                    <img
                        src={getImage(imageField)}
                        alt={String(displayValue)}
                        style={{ width: '100%', objectFit: 'cover' }}
                    />
                </ImagePreview>
            ) : (
                <ImagePlaceholder>
                    <ImageIcon fontSize="large" />
                </ImagePlaceholder>
            )}

            {/* Card Header */}
            <CardHeader
                avatar={
                    <EntityAvatar>{getInitial()}</EntityAvatar>
                }
                title={
                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                        {displayValue}
                    </Typography>
                }
                subheader={
                    <Typography variant="caption" color="text.secondary">
                        {config.displayName} #{entity.id}
                    </Typography>
                }
                sx={{ pb: 0 }}
            />

            <StyledCardContent>
                <Grid container spacing={1}>
                    {visibleFields.map((field) => (
                        <Grid item xs={12} sm={6} key={field.key}>
                            <FieldLabel>{field.label}</FieldLabel>
                            <FieldValue variant="body2">
                                {renderFieldValue(field, entity[field.key])}
                            </FieldValue>
                        </Grid>
                    ))}
                </Grid>
            </StyledCardContent>

            <Divider />

            <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
                {onView && (
                    <Tooltip title="View">
                        <ActionButton size="small" onClick={(e) => { e.stopPropagation(); onView(entity); }}>
                            <VisibilityIcon fontSize="small" />
                        </ActionButton>
                    </Tooltip>
                )}

                {onEdit && (
                    <Tooltip title="Edit">
                        <ActionButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(entity); }}>
                            <EditIcon fontSize="small" />
                        </ActionButton>
                    </Tooltip>
                )}

                {onDelete && (
                    <Tooltip title="Delete">
                        <ActionButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); onDelete(entity); }}
                            color="error"
                        >
                            <DeleteIcon fontSize="small" />
                        </ActionButton>
                    </Tooltip>
                )}
            </CardActions>
        </StyledCard>
    );
};

// Skeleton placeholder for loading state
const CardSkeleton = () => {
    return (
        <StyledCard variant="outlined">
            <Skeleton variant="rectangular" height={140} />
            <CardHeader
                avatar={<Skeleton variant="circular" width={40} height={40} />}
                title={<Skeleton width="80%" />}
                subheader={<Skeleton width="40%" />}
            />
            <StyledCardContent>
                <Grid container spacing={1}>
                    {[...Array(4)].map((_, i) => (
                        <Grid item xs={12} sm={6} key={i}>
                            <Skeleton height={20} width="40%" sx={{ mb: 0.5 }} />
                            <Skeleton height={24} />
                        </Grid>
                    ))}
                </Grid>
            </StyledCardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
                <Skeleton variant="circular" width={32} height={32} sx={{ mx: 0.5 }} />
                <Skeleton variant="circular" width={32} height={32} sx={{ mx: 0.5 }} />
                <Skeleton variant="circular" width={32} height={32} sx={{ mx: 0.5 }} />
            </CardActions>
        </StyledCard>
    );
};

export default CardGeneric;