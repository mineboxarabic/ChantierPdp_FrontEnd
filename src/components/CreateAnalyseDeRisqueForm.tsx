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
import AnalyseDeRisqueDTO from '../utils/entitiesDTO/AnalyseDeRisqueDTO';
import RisqueDTO from '../utils/entitiesDTO/RisqueDTO';
import useRisque from '../hooks/useRisque';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import VerifiedIcon from '@mui/icons-material/Verified';
import { ParentOAnalyseDeRisque, ParentOfRelations } from './Interfaces';

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

const CreateEditAnalyseDeRisqueForm= <PARENT extends ParentOAnalyseDeRisque>({
  onSave,
  onCancel,
  currentAnalyse: initialData = null,
  title = "Créer ou Modifier une analyse de risque"
} : CreateEditAnalyseDeRisqueFormProps<PARENT>) => {

    <Box sx={{ padding: 2 }}>

    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
{/* id?: number;
    deroulementDesTaches: string;
    moyensUtilises: string;
    risque: RisqueDTO; // Assuming you have a Risque class
    mesuresDePrevention: string; */}

    Here you show some info about the selected Risque  and a button to change it, also you have to have a selected risque even if you didn't select on it auto selects the first on the list 

    Here you show textfields (deroulementDesTaches, moyensUtilises, mesuresDePrevention) and a button to save the analyse de risque.



};

export default CreateEditAnalyseDeRisqueForm;