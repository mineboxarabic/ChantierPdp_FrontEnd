import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Switch,
    FormControlLabel,
    Typography,
    Grid,
    Box,
    Chip,
    IconButton,
    Autocomplete,
    CircularProgress,
    Divider,
    Paper,
    useTheme,
    alpha,
    Tabs,
    Tab,
    styled
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ImageIcon from '@mui/icons-material/Image';
import {
    FieldType,
    EditGenericProps,
    BaseEntity,
    FieldConfig,
    EntityRef,
    ImageModel
} from "./TypeConfig.ts";

// Styled components
const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    paddingTop: theme.spacing(2),
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 3),
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
}));

const FieldSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(2),
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        bottom: -4,
        left: 0,
        width: 40,
        height: 2,
        backgroundColor: theme.palette.primary.main,
    }
}));

const ImagePreviewContainer = styled(Paper)(({ theme }) => ({
    width: '100%',
    height: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
    overflow: 'hidden',
    position: 'relative',
}));

const RemoveImageButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: alpha(theme.palette.common.black, 0.7),
    color: theme.palette.common.white,
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.9),
    },
}));

const ArrayItemContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    gap: theme.spacing(1),
}));

/**
 * Dialog component for creating or editing entity data
 */
const EditGeneric = <T extends BaseEntity>({
                                               entity,
                                               config,
                                               open,
                                               onClose,
                                               onSubmit,
                                               crudOperations,
                                           }: EditGenericProps<T>) => {
    const theme = useTheme();
    const isCreating = !entity || !entity.id;
    const [formData, setFormData] = useState<Partial<T>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [referenceOptions, setReferenceOptions] = useState<Record<string, T[]>>({});

    // Group fields by section for better organization
    const organizeFieldsBySections = () => {
        const fieldSections = config.fields
            .filter(field => !field.hidden)
            .reduce((sections, field: FieldConfig) => {
                const sectionName = field.section || 'General';
                if (!sections[sectionName]) {
                    sections[sectionName] = [];
                }
                sections[sectionName].push(field);
                return sections;
            }, {} as Record<string, FieldConfig[]>);

        // Sort fields within each section by order if specified
        Object.keys(fieldSections).forEach(section => {
            fieldSections[section].sort((a, b) =>
                (a.order || Infinity) - (b.order || Infinity)
            );
        });

        return fieldSections;
    };

    const sections = organizeFieldsBySections();
    const sectionNames = Object.keys(sections);

    // Initialize form data when entity changes or dialog opens
    useEffect(() => {

        if (open) {
            console.log("Dialog opened, entity:", entity);
            // Deep clone the entity to avoid reference issues
            const initialData = entity ? JSON.parse(JSON.stringify(entity)) : {};
            setFormData(initialData);
            setErrors({});
            setTabIndex(0);

            // Load reference options for fields that need them
            loadReferenceOptions();
        }
    }, [entity, open]);
    useEffect(() => {
        //console.log('entity',entity)
    }, []);
    // Debug log to help track formData changes
    useEffect(() => {

        //console.log("Form data updated:", formData);

    }, [formData]);

    // Load reference options for entity reference fields
    const loadReferenceOptions = async () => {
        if (crudOperations && !crudOperations.getReferences) return;

        setLoading(true);

        const referenceFields = config.fields.filter(field =>
            field.type === FieldType.EntityRef || field.type === FieldType.ArrayOfEntityRefs
        );

        const promises = referenceFields.map(async field => {
            if (!field.entityType) return null;

            try {
                if (crudOperations && !crudOperations.getReferences) return null;
                if(!crudOperations) return null;

                const options =   await crudOperations?.getReferences(field.entityType);

                return { field: field.key, options };
            } catch (error) {
                console.error(`Error loading reference options for ${field.key}:`, error);
                return { field: field.key, options: [] };
            }
        });

        const results = await Promise.all(promises.filter(Boolean));

        const optionsMap = results.reduce((map, result) => {
            if (result) {
                map[result.field] = result.options;
            }
            return map;
        }, {} as Record<string, T[]>);

        setReferenceOptions(optionsMap);
        setLoading(false);
    };

    // Validate all fields before submission
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        config.fields.forEach(field => {
            if (field.required &&
                (formData[field.key] === undefined ||
                    formData[field.key] === null ||
                    formData[field.key] === '')) {
                newErrors[field.key] = `${field.label} is required`;
            }

            if (field.validation && formData[field.key] !== undefined) {
                // Number validations
                if (field.type === FieldType.Number) {
                    const numValue = Number(formData[field.key]);

                    if (!isNaN(numValue)) {
                        if (field.validation.min !== undefined && numValue < field.validation.min) {
                            newErrors[field.key] = `Minimum value is ${field.validation.min}`;
                        }

                        if (field.validation.max !== undefined && numValue > field.validation.max) {
                            newErrors[field.key] = `Maximum value is ${field.validation.max}`;
                        }
                    }
                }

                // String validations
                if (field.type === FieldType.Text && typeof formData[field.key] === 'string') {
                    if (field.validation.pattern) {
                        const regex = new RegExp(field.validation.pattern);
                        if (!regex.test(formData[field.key] as string)) {
                            newErrors[field.key] = field.validation.patternMessage || 'Invalid format';
                        }
                    }
                }

                // Custom validation
                if (field.validation.custom) {
                    const errorMessage = field.validation.custom(formData[field.key]);
                    if (errorMessage) {
                        newErrors[field.key] = errorMessage;
                    }
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = () => {
        if (!validateForm()) return;

        // Ensure all required fields are included
        const finalData = { ...formData };

        // If editing, ensure ID is included
        if (entity && entity.id) {
            finalData.id = entity.id;
        }

        onSubmit(finalData as T);
    };

    // Handle field change
    const handleChange = (key: string, value: any) => {
        console.log("Field changed:", key, value);
        setFormData(prev => ({
            ...prev,
            [key]: value
        }));

        // Clear error for this field if it exists
        if (errors[key]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    // Handle array item add/remove
    const handleArrayItemAdd = (key: string, valueType: FieldType) => {
        const currentArray = formData[key] as any[] || [];
        let newItem;

        switch (valueType) {
            case FieldType.Text:
                newItem = '';
                break;
            case FieldType.Number:
                newItem = 0;
                break;
            case FieldType.Boolean:
                newItem = false;
                break;
            case FieldType.Date:
                newItem = new Date();
                break;
            case FieldType.EntityRef:
                newItem = 0;
                break;
            default:
                newItem = '';
        }

        handleChange(key, [...currentArray, newItem]);
    };

    const handleArrayItemRemove = (key: string, index: number) => {
        const currentArray = formData[key] as any[] || [];
        const newArray = [...currentArray.slice(0, index), ...currentArray.slice(index + 1)];
        handleChange(key, newArray);
    };

    const handleArrayItemChange = (key: string, index: number, value: any) => {
        const currentArray = formData[key] as any[] || [];
        const newArray = [...currentArray];
        newArray[index] = value;
        handleChange(key, newArray);
    };

    // Handle file upload for images
    const handleImageUpload = (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target?.result?.toString().split(',')[1];
            if (imageData) {
                const imageModel = {
                    imageData,
                    mimeType: file.type
                };
                handleChange(key, imageModel);
            }
        };
        reader.readAsDataURL(file);
    };

    // Render input for a simple value in an array
    const renderSimpleValueInput = (field: FieldConfig, index: number, value: any) => {
        const valueType = field.valueType || FieldType.Text;

        switch (valueType) {
            case FieldType.Text:
                return (
                    <TextField
                        value={value || ''}
                        onChange={(e) => handleArrayItemChange(field.key, index, e.target.value)}
                        size="small"
                        disabled={field.readOnly}
                        fullWidth
                    />
                );

            case FieldType.Number:
                return (
                    <TextField
                        type="number"
                        value={value === undefined ? '' : value}
                        onChange={(e) => handleArrayItemChange(field.key, index, Number(e.target.value))}
                        size="small"
                        disabled={field.readOnly}
                        fullWidth
                    />
                );

            case FieldType.Boolean:
                return (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!!value}
                                onChange={(e) => handleArrayItemChange(field.key, index, e.target.checked)}
                                size="small"
                                disabled={field.readOnly}
                            />
                        }
                        label={`Item ${index + 1}`}
                    />
                );

            case FieldType.Date:
                return (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            value={value ? new Date(value) : null}
                            onChange={(date) => handleArrayItemChange(field.key, index, date)}
                            slotProps={{
                                textField: {
                                    size: "small",
                                    fullWidth: true,
                                    disabled: field.readOnly
                                }
                            }}
                        />
                    </LocalizationProvider>
                );

            default:
                return (
                    <TextField
                        value={value || ''}
                        onChange={(e) => handleArrayItemChange(field.key, index, e.target.value)}
                        size="small"
                        disabled={field.readOnly}
                        fullWidth
                    />
                );
        }
    };

    // Render image field
    const renderImageField = (field: FieldConfig) => {
        const imageValue = formData[field.key] as ImageModel;

        return (
            <Box>
                <Typography variant="subtitle2" gutterBottom>
                    {field.label}
                    {field.required && <Box component="span" sx={{ color: 'error.main' }}>*</Box>}
                </Typography>

                {imageValue?.imageData ? (
                    <ImagePreviewContainer>
                        <img
                            src={`data:${imageValue.mimeType};base64,${imageValue.imageData}`}
                            alt={field.label}
                            style={{ maxHeight: '100%', maxWidth: '100%' }}
                        />
                        {!field.readOnly && (
                            <RemoveImageButton
                                size="small"
                                onClick={() => handleChange(field.key, null)}
                            >
                                <CloseIcon />
                            </RemoveImageButton>
                        )}
                    </ImagePreviewContainer>
                ) : (
                    <ImagePreviewContainer>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <ImageIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                No image
                            </Typography>
                        </Box>
                    </ImagePreviewContainer>
                )}

                {!field.readOnly && (
                    <Button
                        component="label"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        sx={{ mt: 1 }}
                    >
                        {imageValue?.imageData ? 'Change Image' : 'Upload Image'}
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => handleImageUpload(field.key, e)}
                        />
                    </Button>
                )}

                {errors[field.key] && (
                    <FormHelperText error>{errors[field.key]}</FormHelperText>
                )}
                {field.helperText && !errors[field.key] && (
                    <FormHelperText>{field.helperText}</FormHelperText>
                )}
            </Box>
        );
    };



    // Render a field input based on its type
    const renderField = (field: FieldConfig) => {
        // Get value from formData, ensuring we have direct access
        const fieldValue = formData[field.key];


        // Use custom field component if provided
        if (field.fieldComponent) {
            return (
                <field.fieldComponent
                    field={field}
                    value={fieldValue}
                    onChange={(value) => handleChange(field.key, value)}
                />
            );
        }

        // Render image field
        if (field.type === FieldType.Image) {
            return renderImageField(field);
        }

        // Default field rendering based on type
        switch (field.type) {
            case FieldType.Text:
                return (
                    <TextField
                        fullWidth
                        label={field.label}
                        value={fieldValue || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        error={!!errors[field.key]}
                        helperText={errors[field.key] || field.helperText}
                        placeholder={field.placeholder}
                        disabled={field.readOnly}
                        required={field.required}
                        multiline={field.multiline}
                        rows={field.rows || 4}
                        InputLabelProps={{ shrink: true }}
                    />
                );

            case FieldType.Number:
                return (
                    <TextField
                        fullWidth
                        type="number"
                        label={field.label}
                        value={fieldValue === undefined ? '' : fieldValue}
                        onChange={(e) => handleChange(field.key, e.target.value === '' ? '' : Number(e.target.value))}
                        error={!!errors[field.key]}
                        helperText={errors[field.key] || field.helperText}
                        placeholder={field.placeholder}
                        disabled={field.readOnly}
                        required={field.required}
                        InputLabelProps={{ shrink: true }}
                    />
                );

            case FieldType.Boolean:
                return (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!!fieldValue}
                                onChange={(e) => handleChange(field.key, e.target.checked)}
                                disabled={field.readOnly}
                            />
                        }
                        label={
                            <Box>
                                {field.label}
                                {field.required && <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Box>}
                            </Box>
                        }
                    />
                );

            case FieldType.Date:
                return (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label={field.label}
                            value={fieldValue ? new Date(fieldValue as string) : null}
                            onChange={(date) => handleChange(field.key, date)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: !!errors[field.key],
                                    helperText: errors[field.key] || field.helperText,
                                    disabled: field.readOnly,
                                    required: field.required,
                                    InputLabelProps: { shrink: true }
                                }
                            }}
                        />
                    </LocalizationProvider>
                );

            case FieldType.Enum:
                return (
                    <FormControl
                        fullWidth
                        error={!!errors[field.key]}
                        disabled={field.readOnly}
                        required={field.required}
                    >
                        <InputLabel>{field.label}</InputLabel>
                        <Select
                            value={fieldValue || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            label={field.label}
                        >
                            {field.options?.map((option, index) => (
                                <MenuItem key={index} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {(errors[field.key] || field.helperText) && (
                            <FormHelperText>{errors[field.key] || field.helperText}</FormHelperText>
                        )}
                    </FormControl>
                );

            case FieldType.EntityRef:
                return (
                    <FormControl
                        fullWidth
                        error={!!errors[field.key]}
                        disabled={field.readOnly || loading}
                        required={field.required}
                    >
                        <Autocomplete
                            value={fieldValue as T || null}
                            options={referenceOptions[field.key] || []}
                            loading={loading}
                            getOptionLabel={(option) => {
                                if (!option) return '';
                                if (typeof option === 'string') return option;
                                console.log('this is the option', option);
                                return  option[field.reference?.fieldName && field.reference?.fieldName || ''] || `ID: ${option}`;
                            }}
                            isOptionEqualToValue={(option, value) => option === value}
                            onChange={(_, newValue) => handleChange(field.key, newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={field.label}
                                    error={!!errors[field.key]}
                                    helperText={errors[field.key] || field.helperText}
                                    required={field.required}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </FormControl>
                );

            case FieldType.ArrayOfEntityRefs:
               
            return (
                    <Box>
                        <Autocomplete
                            multiple
                            value={fieldValue as T[] || []}
                            options={referenceOptions[field.key] || []}
                            loading={loading}
                            getOptionLabel={(option) => {
                                if (!option) return '';
                                if (typeof option === 'string') return option;
                                return option[field.reference?.fieldName && field.reference?.fieldName || ''] || `ID: ${referenceOptions && referenceOptions[field.key]?.find(o => o.id === option)?.[field.reference?.fieldName || '']}`;
                            }}
                            isOptionEqualToValue={(option, value) => {
                                return option.id === value;
                            }}
                            onChange={(_, newValue) =>{

                                //Add only id to the list 
                                const newValueWithId = newValue.map((item) => {
                                    if (typeof item === 'number') return item;
                                   else return item.id;
                                });
                                console.log('this is the new value', newValueWithId);
                                handleChange(field.key, newValueWithId )
                            
                            } }
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={field.label}
                                    error={!!errors[field.key]}
                                    helperText={errors[field.key] || field.helperText}
                                    disabled={field.readOnly}
                                    required={field.required}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </Box>
                );

            case FieldType.ArrayOfSimpleValues: {
                const currentArray = (fieldValue as any[]) || [];
                return (
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            {field.label}
                            {field.required && <Box component="span" sx={{ color: 'error.main' }}>*</Box>}
                        </Typography>

                        {currentArray.map((item, index) => (
                            <ArrayItemContainer key={index}>
                                {renderSimpleValueInput(field, index, item)}
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleArrayItemRemove(field.key, index)}
                                    disabled={field.readOnly}
                                >
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                            </ArrayItemContainer>
                        ))}

                        <Button
                            startIcon={<AddIcon />}
                            variant="outlined"
                            size="small"
                            onClick={() => handleArrayItemAdd(field.key, field.valueType || FieldType.Text)}
                            disabled={field.readOnly}
                            sx={{ mt: 1 }}
                        >
                            Add {field.itemLabel || 'Item'}
                        </Button>

                        {errors[field.key] && (
                            <FormHelperText error>{errors[field.key]}</FormHelperText>
                        )}
                        {field.helperText && !errors[field.key] && (
                            <FormHelperText>{field.helperText}</FormHelperText>
                        )}
                    </Box>
                );
            }

            case FieldType.Object: {
                // Render object as a text field with JSON for simplicity
                // In a real app, you might want to implement a nested form
                const objectValue = fieldValue
                    ? JSON.stringify(fieldValue, null, 2)
                    : '';

                return (
                    <TextField
                        fullWidth
                        label={field.label}
                        value={objectValue}
                        onChange={(e) => {
                            try {
                                const parsedValue = JSON.parse(e.target.value);
                                handleChange(field.key, parsedValue);
                            } catch {
                                // Invalid JSON, just store as string for now
                                handleChange(field.key, e.target.value);
                            }
                        }}
                        error={!!errors[field.key]}
                        helperText={errors[field.key] || field.helperText || 'Enter valid JSON'}
                        multiline
                        rows={4}
                        disabled={field.readOnly}
                        required={field.required}
                        InputLabelProps={{ shrink: true }}
                    />
                );
            }
            default:
                return (
                    <TextField
                        fullWidth
                        label={field.label}
                        value={fieldValue || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        error={!!errors[field.key]}
                        helperText={errors[field.key] || field.helperText}
                        disabled={field.readOnly}
                        required={field.required}
                        InputLabelProps={{ shrink: true }}
                    />
                );
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <StyledDialogTitle>
                <Typography variant="h6">
                    {isCreating ? `Create ${config.displayName}` : `Edit ${config.displayName}`}
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </StyledDialogTitle>

            {/* Tabs for sections if more than one */}
            {sectionNames.length > 1 && (
                <Tabs
                    value={tabIndex}
                    onChange={(_, newValue) => setTabIndex(newValue)}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}
                >
                    {sectionNames.map((section, index) => (
                        <Tab
                            key={section}
                            label={section}
                            id={`section-tab-${index}`}
                            aria-controls={`section-tabpanel-${index}`}
                        />
                    ))}
                </Tabs>
            )}

            <StyledDialogContent>
                {sectionNames.map((section, index) => (
                    <Box
                        key={section}
                        role="tabpanel"
                        hidden={tabIndex !== index}
                        id={`section-tabpanel-${index}`}
                        aria-labelledby={`section-tab-${index}`}
                    >
                        {tabIndex === index && (
                            <FieldSection>
                                {sectionNames.length > 1 && (
                                    <SectionTitle variant="h6">{section}</SectionTitle>
                                )}

                                <Grid container spacing={2}>
                                    {sections[section].map((field) => (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={field.fullWidth ? 12 : 6}
                                            md={field.fullWidth ? 12 : 4}
                                            key={field.key}
                                        >
                                            {renderField(field)}
                                        </Grid>
                                    ))}
                                </Grid>
                            </FieldSection>
                        )}
                    </Box>
                ))}
            </StyledDialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} variant="outlined">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                >
                    {isCreating ? 'Create' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditGeneric;