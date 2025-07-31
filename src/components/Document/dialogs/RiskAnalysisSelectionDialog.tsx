import React, { useState, useEffect } from 'react';
import { AnalyseDeRisqueDTO } from '../../../utils/entitiesDTO/AnalyseDeRisqueDTO';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

interface RiskAnalysisSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (analysis: AnalyseDeRisqueDTO) => void;
  riskId: number | null;
  analysis: AnalyseDeRisqueDTO | null;
}

const RiskAnalysisSelectionDialog: React.FC<RiskAnalysisSelectionDialogProps> = ({
  open,
  onClose,
  onSave,
  riskId,
  analysis,
}) => {
  const [deroulementDesTaches, setDeroulementDesTaches] = useState('');
  const [moyensUtilises, setMoyensUtilises] = useState('');
  const [mesuresDePrevention, setMesuresDePrevention] = useState('');

  useEffect(() => {
    if (analysis) {
      setDeroulementDesTaches(analysis.deroulementDesTaches || '');
      setMoyensUtilises(analysis.moyensUtilises || '');
      setMesuresDePrevention(analysis.mesuresDePrevention || '');
    } else {
      setDeroulementDesTaches('');
      setMoyensUtilises('');
      setMesuresDePrevention('');
    }
  }, [analysis, open]);

  const handleSave = () => {
    const analysisData = new AnalyseDeRisqueDTO(
      deroulementDesTaches,
      moyensUtilises,
      undefined, // risque will be set elsewhere if needed
      mesuresDePrevention
    );
    
    if (analysis?.id) {
      analysisData.id = analysis.id;
    }
    
    onSave(analysisData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {analysis ? 'Modifier l\'analyse de risque' : 'Créer une analyse de risque'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Déroulement des tâches"
            value={deroulementDesTaches}
            onChange={(e) => setDeroulementDesTaches(e.target.value)}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Moyens utilisés"
            value={moyensUtilises}
            onChange={(e) => setMoyensUtilises(e.target.value)}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Mesures de prévention"
            value={mesuresDePrevention}
            onChange={(e) => setMesuresDePrevention(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSave} variant="contained">
          {analysis ? 'Modifier' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RiskAnalysisSelectionDialog;