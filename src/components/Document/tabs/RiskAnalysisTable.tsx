import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Button, 
  Paper,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
  LinkOff as UnlinkIcon,
  Add as AddIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import RisqueDTO from '../../../utils/entitiesDTO/RisqueDTO';
import {AnalyseDeRisqueDTO} from '../../../utils/entitiesDTO/AnalyseDeRisqueDTO';
import ManagerCRUD from '../../GenericCRUD/ManagerCRUD';
import { AnalyseDeRisqueConfig } from '../../../pages/AnalyseDeRisque/AnalyseDeRisqueManager';
import useAnalyseRisque from '../../../hooks/useAnalyseRisque';

interface RiskAnalysisTableProps {
  riskRelations: any[];
  analysisRelations: any[];
  allRisquesMap: Map<number, RisqueDTO>;
  allAnalysesMap: Map<number, AnalyseDeRisqueDTO>;
  onLink: (analysisId: number) => void;
  onUnlink: (analysisId: number) => void;
  onCreateAnalysis: (riskId: number) => void;
  onEditAnalysis: (analysis: AnalyseDeRisqueDTO) => void;
  onDeleteAnalysis: (analysisId: number) => void;
}

const RiskAnalysisTable: React.FC<RiskAnalysisTableProps> = ({
  riskRelations,
  analysisRelations,
  allRisquesMap,
  allAnalysesMap,
  onLink,
  onUnlink,
  onCreateAnalysis,
  onEditAnalysis,
  onDeleteAnalysis,
}) => {
  const [showAnalysesDialog, setShowAnalysesDialog] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<RisqueDTO | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const analyseService = useAnalyseRisque();

  const rows: {
    risque: RisqueDTO;
    analysis?: AnalyseDeRisqueDTO;
    isLinked: boolean;
    hasAnalysis: boolean;
  }[] = [];

  riskRelations.forEach(riskRelation => {
    const risque = allRisquesMap.get(riskRelation.objectId);
    if (!risque) return;

    const analysesForThisRisk = Array.from(allAnalysesMap.values()).filter(
      analysis => analysis.risque?.id === risque.id
    );

    if (analysesForThisRisk.length > 0) {
      analysesForThisRisk.forEach(analysis => {
        const isLinkedToBDT = analysisRelations.find(rel => rel.objectId === analysis.id);
        rows.push({
          risque,
          analysis,
          isLinked: !!isLinkedToBDT,
          hasAnalysis: true,
        });
      });
    } else {
      rows.push({
        risque,
        analysis: undefined,
        isLinked: false,
        hasAnalysis: false,
      });
    }
  });

  const handleCreateAnalysisClick = (risk: RisqueDTO) => {
    const existingAnalyses = Array.from(allAnalysesMap.values()).filter(
      analysis => analysis.risque?.id === risk.id
    );

    if (existingAnalyses.length > 0) {
      setSelectedRisk(risk);
      setShowAnalysesDialog(true);
    } else {
      // No existing analyses, show create dialog
      setSelectedRisk(risk);
      setShowCreateDialog(true);
    }
  };

  const handleSelectExistingAnalysis = (analysis: AnalyseDeRisqueDTO) => {
    if (analysis.id) {
      onLink(analysis.id);
    }
    setShowAnalysesDialog(false);
    setSelectedRisk(null);
  };

  const handleCreateNewAnalysis = () => {
    setShowAnalysesDialog(false);
    setShowCreateDialog(true);
  };

  const formatFieldValue = (value: any, maxLength: number = 50): string => {
    if (value === null || value === undefined) return 'N/A';
    const stringValue = String(value);
    return stringValue.length > maxLength 
      ? `${stringValue.substring(0, maxLength)}...` 
      : stringValue;
  };

  // Create CRUD operations for the AnalyseDeRisque manager
  const crudOperations = {
    getAll: async () => {
      return await analyseService.getAllAnalyses() || [];
    },
    getById: async (id: number) => {
      return await analyseService.getAnalyseRisque(id);
    },
    create: async (entity: AnalyseDeRisqueDTO) => {
      // Pre-set the selected risk if available
      const entityWithRisk = selectedRisk ? { ...entity, risque: selectedRisk } : entity;
      const created = await analyseService.createAnalyse(entityWithRisk);
      
      // After creation, link it to the BDT if we have a selected risk
      if (created.id) {
        onLink(created.id);
      }
      setShowCreateDialog(false);
      setSelectedRisk(null);
      return created;
    },
    update: async (id: number, entity: AnalyseDeRisqueDTO) => {
      return await analyseService.updateAnalyse(id, entity);
    },
    delete: async (id: number) => {
      await analyseService.deleteAnalyse(id);
    },
  };

  return (
    <Box>
      <Paper elevation={2} sx={{ overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Risk Information</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Task Flow</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tools Used</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Prevention Measures</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow 
                key={`${row.risque.id}-${row.analysis?.id || 'no-analysis'}-${index}`}
                sx={{ 
                  '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                  '&:hover': { backgroundColor: 'action.selected' }
                }}
              >
                {/* Risk Information */}
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {row.risque.title}
                    </Typography>
                    {row.risque.description && (
                      <Typography variant="body2" color="text.secondary">
                        {formatFieldValue(row.risque.description, 60)}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                
                {/* Task Flow */}
                <TableCell>
                  {row.hasAnalysis && row.analysis ? (
                    <Typography variant="body2">
                      {formatFieldValue(row.analysis.deroulementDesTaches)}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                      No analysis available
                    </Typography>
                  )}
                </TableCell>
                
                {/* Tools Used */}
                <TableCell>
                  {row.hasAnalysis && row.analysis ? (
                    <Typography variant="body2">
                      {formatFieldValue(row.analysis.moyensUtilises)}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                      Not specified
                    </Typography>
                  )}
                </TableCell>
                
                {/* Prevention Measures */}
                <TableCell>
                  {row.hasAnalysis && row.analysis ? (
                    <Typography variant="body2">
                      {formatFieldValue(row.analysis.mesuresDePrevention)}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                      Not specified
                    </Typography>
                  )}
                </TableCell>
                
                {/* Status */}
                <TableCell>
                  <Chip
                    label={row.isLinked ? 'Linked' : 'Not Linked'}
                    color={row.isLinked ? 'success' : 'default'}
                    size="small"
                    variant={row.isLinked ? 'filled' : 'outlined'}
                  />
                </TableCell>
                
                {/* Actions */}
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {row.hasAnalysis && row.analysis ? (
                      <>
                        <Tooltip title="View Analysis">
                          <IconButton 
                            size="small" 
                            color="info"
                            onClick={() => onEditAnalysis(row.analysis!)}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Edit Analysis">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => onEditAnalysis(row.analysis!)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Delete Analysis">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => onDeleteAnalysis(row.analysis!.id!)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        {row.isLinked ? (
                          <Tooltip title="Unlink from Document">
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() => onUnlink(row.analysis!.id!)}
                            >
                              <UnlinkIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Link to Document">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => onLink(row.analysis!.id!)}
                            >
                              <LinkIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </>
                    ) : (
                      <Tooltip title="Create or Select Analysis">
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          startIcon={<AddIcon />}
                          onClick={() => handleCreateAnalysisClick(row.risque)}
                        >
                          Add Analysis
                        </Button>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Dialog for selecting existing analyses or creating new one */}
      <Dialog 
        open={showAnalysesDialog} 
        onClose={() => setShowAnalysesDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            Select Analysis for Risk: {selectedRisk?.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Existing analyses for this risk were found. You can select one to link or create a new analysis.
          </Typography>
          
          <List>
            {selectedRisk && Array.from(allAnalysesMap.values())
              .filter(analysis => analysis.risque?.id === selectedRisk.id)
              .map((analysis, index) => (
                <React.Fragment key={analysis.id}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleSelectExistingAnalysis(analysis)}>
                      <ListItemText
                        primary={`Analysis #${analysis.id}`}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              <strong>Tasks:</strong> {formatFieldValue(analysis.deroulementDesTaches, 80)}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Tools:</strong> {formatFieldValue(analysis.moyensUtilises, 80)}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Prevention:</strong> {formatFieldValue(analysis.mesuresDePrevention, 80)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < Array.from(allAnalysesMap.values()).filter(a => a.risque?.id === selectedRisk.id).length - 1 && (
                    <Divider />
                  )}
                </React.Fragment>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAnalysesDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateNewAnalysis} 
            variant="contained"
            startIcon={<AddIcon />}
          >
            Create New Analysis
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for creating new analysis using GenericCRUD */}
      <Dialog 
        open={showCreateDialog} 
        onClose={() => setShowCreateDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            Create New Analysis for Risk: {selectedRisk?.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: '600px', mt: 1 }}>
            <ManagerCRUD
              config={AnalyseDeRisqueConfig}
              crudOperations={crudOperations}
              actions={{
                create: true,
                edit: false,
                delete: false,
                view: false,
                export: false,
                import: false,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowCreateDialog(false);
            setSelectedRisk(null);
          }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RiskAnalysisTable;