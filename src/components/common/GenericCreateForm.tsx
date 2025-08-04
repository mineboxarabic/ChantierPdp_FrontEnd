
import React, { useState, useCallback } from 'react';
import { TextField, Button, Box, Switch, FormControlLabel, Typography, Avatar, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';

// Defines the structure for a single form field
export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'boolean' | 'number' | 'file' | 'select';
    required?: boolean;
    multiline?: boolean;
    rows?: number;
    accept?: string; // For file inputs, specify accepted file types
    options?: { value: string; label: string }[]; // For select inputs
}

// Defines the configuration for the entire form
export interface FormConfig {
    fields: FormField[];
}

interface GenericCreateFormProps {
    config: FormConfig;
    onSave: (formData: Record<string, any>) => void;
    onCancel: () => void;
}

const GenericCreateForm: React.FC<GenericCreateFormProps> = ({ config, onSave, onCancel }) => {
    // Initialize form data with default values
    const [formData, setFormData] = useState<Record<string, any>>(() => {
        const initialData: Record<string, any> = {};
        config.fields.forEach(field => {
            if (field.type === 'boolean') {
                initialData[field.name] = false;
            } else if (field.type === 'file') {
                initialData[field.name] = null;
            } else {
                initialData[field.name] = '';
            }
        });
        return initialData;
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [previews, setPreviews] = useState<Record<string, string>>({});

    const validate = useCallback(() => {
        const newErrors: Record<string, string> = {};
        for (const field of config.fields) {
            if (field.required && !formData[field.name]) {
                newErrors[field.name] = `${field.label} is required.`;
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [config.fields, formData]);

    const handleSave = useCallback(() => {
        if (validate()) {
            onSave(formData);
        }
    }, [validate, onSave, formData]);

    const handleChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = async (name: string, file: File | null) => {
        if (!file) {
            setFormData(prev => ({ ...prev, [name]: null }));
            setPreviews(prev => ({ ...prev, [name]: '' }));
            return;
        }

        try {
            // Convert file to base64 for preview and storage
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    resolve(result.split(',')[1]); // Remove data URL prefix
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            // Create image object for storage
            const imageObject = {
                imageData: base64,
                mimeType: file.type
            };

            setFormData(prev => ({ ...prev, [name]: imageObject }));
            setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
        } catch (error) {
            console.error('Error processing file:', error);
            setErrors(prev => ({ ...prev, [name]: 'Erreur lors du traitement du fichier' }));
        }
    };

    return (
        <Box component="form" noValidate autoComplete="off">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {config.fields.map(field => {
                    if (field.type === 'boolean') {
                        return (
                            <Box key={field.name}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={!!formData[field.name]}
                                            onChange={(e) => handleChange(field.name, e.target.checked)}
                                            name={field.name}
                                        />
                                    }
                                    label={field.label}
                                />
                            </Box>
                        );
                    }
                    
                    if (field.type === 'file') {
                        return (
                            <Box key={field.name}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    {field.label} {field.required && '*'}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        startIcon={<PhotoCamera />}
                                        sx={{ minWidth: 150 }}
                                    >
                                        Choisir une image
                                        <input
                                            type="file"
                                            hidden
                                            accept={field.accept || "image/*"}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                handleFileChange(field.name, file);
                                            }}
                                        />
                                    </Button>
                                    {previews[field.name] && (
                                        <Avatar
                                            src={previews[field.name]}
                                            sx={{ width: 64, height: 64 }}
                                            variant="rounded"
                                        />
                                    )}
                                </Box>
                                {errors[field.name] && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                        {errors[field.name]}
                                    </Typography>
                                )}
                            </Box>
                        );
                    }

                    if (field.type === 'select') {
                        return (
                            <Box key={field.name}>
                                <FormControl fullWidth error={!!errors[field.name]}>
                                    <InputLabel>{field.label}</InputLabel>
                                    <Select
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        label={field.label}
                                    >
                                        {field.options?.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors[field.name] && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                            {errors[field.name]}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Box>
                        );
                    }
                    
                    return (
                        <Box key={field.name}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                type={field.type}
                                name={field.name}
                                label={field.label}
                                value={formData[field.name] || ''}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                required={field.required}
                                multiline={field.multiline}
                                rows={field.rows}
                                error={!!errors[field.name]}
                                helperText={errors[field.name]}
                            />
                        </Box>
                    );
                })}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                <Button onClick={onCancel} variant="outlined">
                    Annuler
                </Button>
                <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>
                    Enregistrer
                </Button>
            </Box>
        </Box>
    );
};

export default GenericCreateForm;
