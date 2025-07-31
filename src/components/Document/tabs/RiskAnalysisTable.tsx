import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import RisqueDTO from '../../../utils/entitiesDTO/RisqueDTO';
import {AnalyseDeRisqueDTO} from '../../../utils/entitiesDTO/AnalyseDeRisqueDTO';
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

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Risk Name</TableCell>
          <TableCell>Analysis Details</TableCell>
          <TableCell>Actions</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.risque.title}</TableCell>
            <TableCell>
              {row.hasAnalysis && row.analysis ? row.analysis.deroulementDesTaches : 'No Analysis'}
            </TableCell>
            <TableCell>
              {row.hasAnalysis && row.analysis ? (
                <>
                  <Button onClick={() => onEditAnalysis(row.analysis!)}>Edit</Button>
                  <Button onClick={() => onDeleteAnalysis(row.analysis!.id!)}>Delete</Button>
                  {row.isLinked ? (
                    <Button onClick={() => onUnlink(row.analysis!.id!)}>Unlink</Button>
                  ) : (
                    <Button onClick={() => onLink(row.analysis!.id!)}>Link</Button>
                  )}
                </>
              ) : (
                <Button onClick={() => onCreateAnalysis(row.risque.id!)}>
                  + Create Analysis
                </Button>
              )}
            </TableCell>
            <TableCell>{row.isLinked ? 'Linked' : 'Not Linked'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RiskAnalysisTable;