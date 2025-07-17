// Example usage of CustomViewPage

import React from 'react';
import {
  Description as PdpIcon,
  Build as BdtIcon,
  Warning as RisqueIcon,
  People as WorkerIcon,
  Business as EntrepriseIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  Attachment as AttachmentIcon,
} from '@mui/icons-material';
import CustomViewPage from './CustomViewPage';

const ExampleCustomViewPage = () => {
  // Example PDP data
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
    priorite: 'Haute',
    description: 'Plan de prévention pour les travaux de maintenance sur la ligne de production A',
    zoneIntervention: 'Atelier A - Zones 1, 2 et 3',
    equipementsImpactes: ['Convoyeur principal', 'Station de contrôle', 'Poste de conditionnement']
  };

  // Related workers
  const workers = [
    { nom: 'Jean Dupont', poste: 'Chef d\'équipe', qualification: 'Niveau 3' },
    { nom: 'Marie Martin', poste: 'Technicienne', qualification: 'Niveau 2' },
    { nom: 'Pierre Durand', poste: 'Opérateur', qualification: 'Niveau 1' }
  ];

  // Related risks
  const risques = [
    { nom: 'Chute de hauteur', niveau: 'Élevé', mesures: 'EPI obligatoire' },
    { nom: 'Risque électrique', niveau: 'Moyen', mesures: 'Consignation' },
    { nom: 'Exposition chimique', niveau: 'Faible', mesures: 'Ventilation' }
  ];

  // Documents attachés
  const documents = [
    { nom: 'Analyse de risques.pdf', type: 'PDF', taille: '2.3 MB' },
    { nom: 'Plan d\'intervention.docx', type: 'Word', taille: '1.1 MB' },
    { nom: 'Photos zone.zip', type: 'Archive', taille: '15.7 MB' }
  ];

  return (
    <CustomViewPage
      data={pdpData}
      title={pdpData.nom}
      subtitle="Plan de Prévention"
      avatar={<PdpIcon />}
      status={pdpData.status}
      
      breadcrumbs={[
        { label: 'Accueil', href: '/' },
        { label: 'Plans de Prévention', href: '/pdp' },
        { label: pdpData.nom }
      ]}
      
      // Main tabs with different content types
      tabs={[
        {
          label: 'Informations générales',
          icon: <AssignmentIcon />,
          content: pdpData // Object data - will use CustomViewComponent
        },
        {
          label: 'Travailleurs',
          icon: <WorkerIcon />,
          content: (
            <div>
              <h3>Équipe assignée ({workers.length} personnes)</h3>
              {workers.map((worker, index) => (
                <div key={index} style={{ 
                  padding: '12px', 
                  border: '1px solid #ddd', 
                  margin: '8px 0', 
                  borderRadius: '8px' 
                }}>
                  <strong>{worker.nom}</strong> - {worker.poste}<br/>
                  <small>Qualification: {worker.qualification}</small>
                </div>
              ))}
            </div>
          )
        },
        {
          label: 'Analyse des risques',
          icon: <RisqueIcon />,
          content: {
            risquesIdentifies: pdpData.risquesIdentifies,
            nombreRisques: risques.length,
            evaluationGlobale: 'Risque modéré avec mesures de prévention',
            derniereRevision: '2024-01-10',
            details: risques
          }
        },
        {
          label: 'Historique',
          icon: <TimelineIcon />,
          content: {
            dateCreation: pdpData.dateCreation,
            derniereMiseAJour: '2024-01-20',
            validations: [
              'Validation initiale - 15/01/2024',
              'Révision sécurité - 18/01/2024',
              'Approbation finale - 20/01/2024'
            ],
            modifications: 3,
            statut: 'Approuvé'
          }
        }
      ]}
      
      // Primary actions in header
      primaryActions={[
        {
          label: 'Modifier',
          icon: <EditIcon />,
          onClick: () => console.log('Edit PDP'),
          variant: 'contained',
          color: 'primary'
        },
        {
          label: 'Imprimer',
          icon: <PrintIcon />,
          onClick: () => console.log('Print PDP'),
          variant: 'outlined'
        },
        {
          label: 'Partager',
          icon: <ShareIcon />,
          onClick: () => console.log('Share PDP'),
          variant: 'text'
        }
      ]}
      
      // Related clickable cards
      relatedCards={[
        {
          title: 'Chantier associé',
          subtitle: 'Maintenance ligne A',
          data: { nom: 'Chantier A', status: 'En cours', progression: '75%' },
          onClick: () => console.log('Go to chantier'),
          status: 'En cours',
          icon: <BdtIcon />
        },
        {
          title: 'Entreprise',
          subtitle: 'Danone Construction',
          data: { nom: 'Danone Construction', secteur: 'Agroalimentaire' },
          onClick: () => console.log('Go to entreprise'),
          status: 'Actif',
          icon: <EntrepriseIcon />
        },
        {
          title: 'Évaluation des risques',
          subtitle: '3 risques identifiés',
          data: { nombreRisques: 3, niveauGlobal: 'Modéré' },
          onClick: () => console.log('Go to risks'),
          status: 'À jour',
          icon: <RisqueIcon />
        }
      ]}
      
      // Side drawer content
      showDrawer={true}
      drawerContent={[
        {
          title: 'Documents attachés',
          data: documents,
          type: 'list'
        },
        {
          title: 'Actions récentes',
          data: [
            { title: 'Validation du responsable', description: '20/01/2024 - J. Dupont' },
            { title: 'Mise à jour des risques', description: '18/01/2024 - M. Martin' },
            { title: 'Création du plan', description: '15/01/2024 - Système' }
          ],
          type: 'list'
        },
        {
          title: 'Statistiques',
          data: {
            progression: '85%',
            tempsRestant: '5 jours',
            budgetUtilise: '12 450€',
            nombreIntervenants: workers.length
          },
          type: 'details'
        }
      ]}
      
      // Floating action button
      fabAction={{
        icon: <AddIcon />,
        onClick: () => console.log('Quick add'),
        label: 'Ajouter un élément'
      }}
      
      onBack={() => console.log('Go back')}
    />
  );
};

export default ExampleCustomViewPage;

/*
USAGE PATTERNS:

1. Simple object view:
<CustomViewPage 
  data={myObject} 
  title="Mon Objet" 
/>

2. With tabs and related content:
<CustomViewPage 
  data={myObject}
  title="Vue complète"
  tabs={[
    { label: 'Détails', content: myObject },
    { label: 'Historique', content: historyData }
  ]}
  relatedCards={relatedItems}
/>

3. Complex dashboard-like page:
<CustomViewPage 
  data={mainData}
  title="Dashboard PDP"
  tabs={multipleTabsWithDifferentContentTypes}
  drawerContent={sidebarSections}
  primaryActions={headerActions}
  fabAction={quickAction}
  showDrawer={true}
/>

FEATURES DEMONSTRATED:
✅ Mixed content types in tabs (objects, custom JSX, formatted data)
✅ Clickable cards that open detail dialogs
✅ Side drawer with different content types (lists, cards, details)
✅ Header with breadcrumbs, status, and actions
✅ Floating action button
✅ Responsive design
✅ Beautiful Material-UI styling
✅ Flexible data display using CustomViewComponent
✅ Quick view dialogs for related items
*/
