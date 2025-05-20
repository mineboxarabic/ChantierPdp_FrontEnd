import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  CircularProgress,
  Divider,
  Stack,
  Alert
} from '@mui/material';
import {AnalyseDeRisqueDTO} from '../utils/entitiesDTO/AnalyseDeRisqueDTO';
import RisqueDTO from '../utils/entitiesDTO/RisqueDTO';
import useRisque from '../hooks/useRisque';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import VerifiedIcon from '@mui/icons-material/Verified';
import { ParentOAnalyseDeRisque, ParentOfRelations } from './Interfaces';
import useAnalyseRisque from "../hooks/useAnalyseRisque.ts";

interface CreateEditAnalyseDeRisqueFormProps<PARENT extends ParentOAnalyseDeRisque> {
  onSave: (data: AnalyseDeRisqueDTO) => void;
  onCancel: () => void;
  parent: PARENT;
  saveParent: (parent: PARENT) => void;
  setIsChanged: (isChanged: boolean) => void;
  currentAnalyse?: AnalyseDeRisqueDTO;
  isEdit?: boolean;
  title?: string;
}

const CreateEditAnalyseDeRisqueForm = <PARENT extends ParentOAnalyseDeRisque>({
                                                                                onSave,
                                                                                onCancel,
                                                                                parent,
                                                                                saveParent,
                                                                                setIsChanged,
                                                                                currentAnalyse,
                                                                                isEdit = false,
                                                                                title = "Créer ou Modifier une analyse de risque"
                                                                              }: CreateEditAnalyseDeRisqueFormProps<PARENT>) => {
  const { getAllRisques, risques, loading: risquesLoading, error: risquesError } = useRisque();
  const analyseHook = useAnalyseRisque();

  // Form state
  const [deroulementDesTaches, setDeroulementDesTaches] = useState<string>(currentAnalyse?.deroulementDesTaches || '');
  const [moyensUtilises, setMoyensUtilises] = useState<string>(currentAnalyse?.moyensUtilises || '');
  const [mesuresDePrevention, setMesuresDePrevention] = useState<string>(currentAnalyse?.mesuresDePrevention || '');
  const [selectedRisque, setSelectedRisque] = useState<RisqueDTO | null>(currentAnalyse?.risque || null);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);

  // Set the form as changed whenever a field is modified
  useEffect(() => {
    getAllRisques();
    setIsFormChanged(true);
    setIsChanged(true);
  }, [deroulementDesTaches, moyensUtilises, mesuresDePrevention, selectedRisque, setIsChanged]);

  // Select the first risque in the list if none is selected and risques are loaded
  useEffect(() => {
    if (!selectedRisque && risques && risques.size > 0) {
      setSelectedRisque(risques[0]);
    }
  }, [risques, selectedRisque]);

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    if (!deroulementDesTaches.trim()) {
      errors.deroulementDesTaches = "Le déroulement des tâches est requis";
    }

    if (!moyensUtilises.trim()) {
      errors.moyensUtilises = "Les moyens utilisés sont requis";
    }

    if (!mesuresDePrevention.trim()) {
      errors.mesuresDePrevention = "Les mesures de prévention sont requises";
    }

    if (!selectedRisque) {
      errors.risque = "Un risque doit être sélectionné";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      if (!selectedRisque) {
        return; // This shouldn't happen due to validation, but TypeScript needs it
      }

      let analyseDeRisque = new AnalyseDeRisqueDTO(
          deroulementDesTaches,
          moyensUtilises,
          selectedRisque,
          mesuresDePrevention
      );

      // If editing, preserve the ID
      if (isEdit && currentAnalyse?.id) {
        //analyseDeRisque.id = currentAnalyse.id;
        analyseHook.updateAnalyse(currentAnalyse.id, analyseDeRisque).then(a => {
            analyseDeRisque = a;
              onSave(analyseDeRisque);
        }
        ).catch(error => {
          console.error("Error updating analyse:", error);
        });
      }else{
        analyseHook.createAnalyse(analyseDeRisque).then(a => {
            analyseDeRisque = a;
          onSave(analyseDeRisque);
        })
      }


      setIsFormChanged(false);
    }
  };

  const handleCancel = () => {
    setIsFormChanged(false);
    setIsChanged(false);
    onCancel();
  };

  return (
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {risquesError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Erreur lors du chargement des risques: {risquesError}
            </Alert>
        )}

        <Grid container spacing={3}>
          {/* Risque Selection Section */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Sélection du Risque
              </Typography>

              {risquesLoading ? (
                  <Box display="flex" justifyContent="center" my={3}>
                    <CircularProgress />
                  </Box>
              ) : (
                  <>
                    {selectedRisque && (
                        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            {selectedRisque.logo && (
                                <Box sx={{ width: 48, height: 48 }}>
                                  <img
                                      src={`data:${selectedRisque.logo.mimeType};base64,${selectedRisque.logo.imageData}`}
                                      alt={selectedRisque.title}
                                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                  />
                                </Box>
                            )}
                            <Box>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {selectedRisque.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {selectedRisque.description}
                              </Typography>
                            </Box>
                            {selectedRisque.travailleDangereux && (
                                <Box display="flex" alignItems="center">
                                  <WarningIcon color="error" sx={{ mr: 1 }} />
                                  <Typography color="error.main">Travail Dangereux</Typography>
                                </Box>
                            )}
                            {selectedRisque.travaillePermit && (
                                <Box display="flex" alignItems="center">
                                  <VerifiedIcon color="info" sx={{ mr: 1 }} />
                                  <Typography color="info.main">Travail avec Permis</Typography>
                                </Box>
                            )}
                          </Stack>
                        </Box>
                    )}

                    <Autocomplete
                        options={Array.from(risques.values()) || []}
                        getOptionLabel={(option) => option.title}
                        value={selectedRisque}
                        onChange={(_, newValue) => setSelectedRisque(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Choisir un risque"
                                variant="outlined"
                                error={!!formErrors.risque}
                                helperText={formErrors.risque}
                            />
                        )}
                        renderOption={(props, option) => (
                            <li {...props}>
                              <Stack direction="row" spacing={2} alignItems="center">
                                {option.logo && (
                                    <Box sx={{ width: 24, height: 24 }}>
                                      <img
                                          src={`data:${option.logo.mimeType};base64,${option.logo.imageData}`}
                                          alt={option.title}
                                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                      />
                                    </Box>
                                )}
                                <Typography>{option.title}</Typography>
                              </Stack>
                            </li>
                        )}
                    />
                  </>
              )}
            </Paper>
          </Grid>

          {/* Form Fields */}
          <Grid item xs={12}>
            <TextField
                label="Déroulement des tâches"
                fullWidth
                multiline
                rows={4}
                value={deroulementDesTaches}
                onChange={(e) => setDeroulementDesTaches(e.target.value)}
                error={!!formErrors.deroulementDesTaches}
                helperText={formErrors.deroulementDesTaches}
                margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
                label="Moyens utilisés"
                fullWidth
                multiline
                rows={3}
                value={moyensUtilises}
                onChange={(e) => setMoyensUtilises(e.target.value)}
                error={!!formErrors.moyensUtilises}
                helperText={formErrors.moyensUtilises}
                margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
                label="Mesures de prévention"
                fullWidth
                multiline
                rows={4}
                value={mesuresDePrevention}
                onChange={(e) => setMesuresDePrevention(e.target.value)}
                error={!!formErrors.mesuresDePrevention}
                helperText={formErrors.mesuresDePrevention}
                margin="normal"
            />
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
              <Button
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  onClick={handleCancel}
              >
                Annuler
              </Button>
              <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={!isFormChanged}
              >
                {isEdit ? 'Mettre à jour' : 'Enregistrer'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
  );
};

export default CreateEditAnalyseDeRisqueForm;