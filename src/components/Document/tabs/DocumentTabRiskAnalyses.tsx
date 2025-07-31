import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import RiskAnalysisTable from './RiskAnalysisTable';
import useAnalyseRisque from '../../../hooks/useAnalyseRisque';
import useRisque from '../../../hooks/useRisque';
import useBdt from '../../../hooks/useBdt';
import { useParams } from 'react-router-dom';
import { AnalyseDeRisqueDTO } from '../../../utils/entitiesDTO/AnalyseDeRisqueDTO';
import RiskAnalysisSelectionDialog from '../dialogs/RiskAnalysisSelectionDialog';

const DocumentTabRiskAnalyses: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { analyses, getAllAnalyses, createAnalyse, updateAnalyse, deleteAnalyse } = useAnalyseRisque();
  const { risques, getAllRisques } = useRisque();
  const { response, getBDT, linkObjectToBDT, unlinkObjectFromBDT } = useBdt();
  const [riskRelations, setRiskRelations] = useState<any[]>([]);
  const [analysisRelations, setAnalysisRelations] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRiskId, setSelectedRiskId] = useState<number | null>(null);
  const [editingAnalysis, setEditingAnalysis] = useState<AnalyseDeRisqueDTO | null>(null);

  useEffect(() => {
    getAllAnalyses();
    getAllRisques();
    if (id) {
      getBDT(Number(id));
    }
  }, [id]);

  useEffect(() => {
    if (response && typeof response === 'object' && 'relations' in response) {
      const bdtData = response as any;
      setRiskRelations(bdtData.relations?.filter((r: any) => r.objectType === 'RISQUE') || []);
      setAnalysisRelations(bdtData.relations?.filter((r: any) => r.objectType === 'ANALYSE_DE_RISQUE') || []);
    }
  }, [response]);

  const handleLink = (analysisId: number) => {
    if (id) {
      linkObjectToBDT(Number(id), analysisId, 'ANALYSE_DE_RISQUE');
    }
  };

  const handleUnlink = (analysisId: number) => {
    if (id) {
      unlinkObjectFromBDT(Number(id), analysisId, 'ANALYSE_DE_RISQUE');
    }
  };

  const handleCreateAnalysis = (riskId: number) => {
    setSelectedRiskId(riskId);
    setIsDialogOpen(true);
  };

  const handleEditAnalysis = (analysis: AnalyseDeRisqueDTO) => {
    setEditingAnalysis(analysis);
    setIsDialogOpen(true);
  };

  const handleDeleteAnalysis = (analysisId: number) => {
    deleteAnalyse(analysisId);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedRiskId(null);
    setEditingAnalysis(null);
  };

  const handleDialogSave = (analysis: AnalyseDeRisqueDTO) => {
    if (editingAnalysis) {
      updateAnalyse(editingAnalysis.id!, analysis);
    } else {
      createAnalyse(analysis).then(newAnalysis => {
        if (id && newAnalysis) {
          linkObjectToBDT(Number(id), newAnalysis.id, 'ANALYSE_DE_RISQUE');
        }
      });
    }
    handleDialogClose();
  };

  return (
    <Box>
      <RiskAnalysisTable
        riskRelations={riskRelations}
        analysisRelations={analysisRelations}
        allRisquesMap={risques || new Map()}
        allAnalysesMap={analyses || new Map()}
        onLink={handleLink}
        onUnlink={handleUnlink}
        onCreateAnalysis={handleCreateAnalysis}
        onEditAnalysis={handleEditAnalysis}
        onDeleteAnalysis={handleDeleteAnalysis}
      />
      <RiskAnalysisSelectionDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        riskId={selectedRiskId}
        analysis={editingAnalysis}
      />
    </Box>
  );
};

export default DocumentTabRiskAnalyses;
