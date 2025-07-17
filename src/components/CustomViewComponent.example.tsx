// Example usage of CustomViewComponent

import React from 'react';
import { Visibility as ViewIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import CustomViewComponent from './CustomViewComponent';

// Example usage with different object types
const ExampleUsage = () => {
  // Example PDP object
  const pdpData = {
    id: 'PDP-001',
    nom: 'Plan de Prévention Chantier A',
    status: 'active',
    dateCreation: '2024-01-15',
    dateEcheance: '2024-03-15',
    entreprise: { nom: 'Danone Construction' },
    responsable: 'jean.dupont@danone.com',
    risquesIdentifies: ['Chute', 'Électrique', 'Chimique'],
    travailleursConcernes: 25,
    validationRequired: true,
    priorite: 'Haute'
  };

  // Example BDT object
  const bdtData = {
    id: 'BDT-002',
    reference: 'BDT-ELECT-2024-001',
    status: 'pending',
    dateEmission: '2024-01-20',
    typeIntervention: 'Maintenance électrique',
    zone: 'Atelier A - Zone 3',
    dureeEstimee: '4 heures',
    equipementsImpactes: ['Ligne production 1', 'Transformateur A'],
    technicienResponsable: 'Marie Martin',
    validated: false
  };

  // Example Risque object
  const risqueData = {
    id: 'RSQ-003',
    nom: 'Risque de chute de hauteur',
    status: 'identifié',
    niveau: 'Élevé',
    probabilite: 'Moyenne',
    gravite: 'Majeure',
    mesuresPreventives: ['EPI obligatoire', 'Formation hauteur', 'Inspection quotidienne'],
    zonesConcernees: ['Toiture', 'Échafaudages', 'Passerelles'],
    dateIdentification: '2024-01-10',
    travailleDangereux: true,
    evaluationFinale: 'Action immédiate requise'
  };

  const commonActions = [
    {
      icon: <ViewIcon />,
      label: 'Voir détails',
      onClick: () => console.log('View clicked'),
      color: 'primary' as const
    },
    {
      icon: <EditIcon />,
      label: 'Modifier',
      onClick: () => console.log('Edit clicked'),
      color: 'secondary' as const
    },
    {
      icon: <DeleteIcon />,
      label: 'Supprimer',
      onClick: () => console.log('Delete clicked'),
      color: 'error' as const
    }
  ];

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', padding: '20px' }}>
      
      {/* PDP View
      <CustomViewComponent
        data={pdpData}
        title={pdpData.nom}
        subtitle="Plan de Prévention"
        avatar="PDP"
        status={pdpData.status}
        primaryFields={['nom', 'responsable', 'dateEcheance']}
        excludeFields={['id']}
        actions={commonActions}
        maxWidth={400}
      />

      {/* Compact version */}
      <CustomViewComponent
        data={pdpData}
        title="Version Compacte"
        status={pdpData.status}
        primaryFields={['nom', 'status']}
        excludeFields={['id', 'dateCreation', 'entreprise']}
        actions={[commonActions[0]]} // Only view action
        maxWidth={300}
        compact={true}
        showDividers={false}
      />

    </div>
  );
};

export default ExampleUsage;

/*
USAGE EXAMPLES:

1. Simple object display:
<CustomViewComponent data={myObject} />

2. With title and actions:
<CustomViewComponent 
  data={myObject}
  title="Mon Titre"
  actions={[
    { icon: <EditIcon />, label: 'Edit', onClick: () => editItem() }
  ]}
/>

3. Highlighting specific fields:
<CustomViewComponent 
  data={myObject}
  primaryFields={['name', 'status', 'date']}
  excludeFields={['id', 'internal_id']}
/>

4. Compact layout:
<CustomViewComponent 
  data={myObject}
  compact={true}
  maxWidth={250}
  showDividers={false}
/>

FEATURES:
✅ Automatic field formatting (dates, booleans, arrays, emails)
✅ Status-based color coding
✅ Responsive grid layout
✅ Action buttons with tooltips
✅ Primary/secondary field grouping
✅ Icon associations for common field types
✅ Customizable styling and layout
✅ Works with any object structure
✅ Beautiful hover effects and animations
*/
