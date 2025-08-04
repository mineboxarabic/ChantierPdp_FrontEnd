import React from 'react';
import { Document, View, StyleSheet, Text, Font } from '@react-pdf/renderer';
import { BdtDTO } from "../utils/entitiesDTO/BdtDTO.ts";
import CustomPage from "./components/Page.tsx";
import { EntrepriseDTO } from '../utils/entitiesDTO/EntrepriseDTO.ts';
import { ChantierDTO } from '../utils/entitiesDTO/ChantierDTO.ts';
import RisqueDTO from '../utils/entitiesDTO/RisqueDTO.ts';
import {
    ModernIcon,
    OfficialCard,
    OfficialField,
    OfficialTable,
    OfficialHeader,
    OfficialRiskItem,
    OfficialSignature
} from './components';
import DispositifDTO from "../utils/entitiesDTO/DispositifDTO.ts";
import DispositifPdfItem from "./components/DispositifPdfItem.tsx";

// Register emoji source for PDF emoji support
Font.registerEmojiSource({
    format: 'png',
    url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
});

const styles = StyleSheet.create({
    // Dynamic and flexible styles
    pageContainer: {
        backgroundColor: '#ffffff',
        padding: 12,
        flexGrow: 1,
        minHeight: '100%',
    },
    companySection: {
        flexDirection: 'row',
        marginBottom: 15,
        flexWrap: 'wrap',
    },
    companyColumn: {
        width: '48%',
        marginRight: '2%',
        flexShrink: 0,
    },
    companyColumnLast: {
        width: '48%',
        marginLeft: '2%',
        flexShrink: 0,
    },
    safetySection: {
        flexDirection: 'row',
        marginBottom: 15,
        flexWrap: 'wrap',
    },
    safetyGrid: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
    },
    safetyColumn: {
        width: '50%',
        padding: 6,
        border: '1 solid #cccccc',
        backgroundColor: '#f8f8f8',
        minHeight: 60,
        flexShrink: 0,
    },
    safetyIconColumn: {
        width: '31%',
        marginRight: '3%',
        padding: 6,
        border: '1 solid #cccccc',
        backgroundColor: '#f8f8f8',
        minHeight: 60,
        flexShrink: 0,
    },
    safetyTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#dc2626',
        marginBottom: 6,
        textAlign: 'center',
        lineHeight: 1.2,
    },
    riskGrid: {
        flexDirection: 'row',
        marginBottom: 15,
        flexWrap: 'wrap',
    },
    riskColumn: {
        width: '48%',
        marginRight: '2%',
        flexShrink: 0,
    },
    interventionsSection: {
        flexDirection: 'row',
        marginBottom: 15,
        flexWrap: 'wrap',
    },
    interventionColumn: {
        width: '48%',
        marginRight: '2%',
        flexShrink: 0,
    },
    checklistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 3,
        paddingHorizontal: 4,
        marginBottom: 2,
        backgroundColor: '#ffffff',
        border: '1 solid #eeeeee',
        minHeight: 20,
        flexShrink: 0,
    },
    checkboxSmall: {
        width: 10,
        height: 10,
        border: '1 solid #999999',
        marginRight: 4,
        backgroundColor: '#ffffff',
    },
    checkboxText: {
        fontSize: 7,
        color: '#000000',
        flex: 1,
        lineHeight: 1.2,
    },
    statusGroup: {
        flexDirection: 'row',
    },
    statusMini: {
        width: 14,
        height: 10,
        border: '1 solid #999999',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 2,
        backgroundColor: '#ffffff',
    },
    statusMiniText: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#000000',
    },
});

interface BdtPageProps {
    currentBdt: BdtDTO;
    chantierData?: ChantierDTO;
    entrepriseData?: EntrepriseDTO;
    allRisksMap?: Map<number, RisqueDTO>;
    allDispositifsMap?: Map<number, DispositifDTO>;
}

const BDT_Page_Modern = ({ currentBdt, chantierData, entrepriseData, allRisksMap, allDispositifsMap }: BdtPageProps) => {

    // Helper function to get risk icon based on risk type
    const getRiskIcon = (risque: RisqueDTO): string => {
        const title = risque.title?.toLowerCase() || '';
        const description = risque.description?.toLowerCase() || '';

        if (title.includes('feu') || title.includes('incendie') || description.includes('feu')) return '🔥';
        if (title.includes('électr') || description.includes('électr')) return '⚡';
        if (title.includes('chute') || description.includes('chute')) return '⬇️';
        if (title.includes('bruit') || description.includes('bruit')) return '🔊';
        if (title.includes('chimique') || description.includes('chimique')) return '⚗️';
        if (title.includes('machine') || description.includes('machine')) return '⚙️';
        if (title.includes('radiation') || description.includes('radiation')) return '☢️';
        if (title.includes('gaz') || description.includes('gaz')) return '💨';
        if (title.includes('température') || description.includes('température')) return '🌡️';
        if (title.includes('ergonomie') || description.includes('ergonomie')) return '🏃';
        
        return risque.travailleDangereux ? '⚠️' : '📋';
    };

    // Get risks that are marked as dangerous work from the relations
    const getRisquesParticuliers = () => {
        if (!currentBdt.relations || !allRisksMap) return [];
        
        return currentBdt.relations
            .filter(rel => rel.objectType === 'RISQUE' || rel.objectType?.toString() === 'RISQUE')
            .map(rel => allRisksMap.get(rel.objectId))
            .filter(Boolean) as RisqueDTO[];
    };

    const getDispositifs = () => {
        if (!currentBdt.relations || !allDispositifsMap) return [];
        return currentBdt.relations
            .filter(rel => rel.objectType === 'DISPOSITIF' || rel.objectType?.toString() === 'DISPOSITIF')
            .map(rel => allDispositifsMap.get(rel.objectId))
            .filter(Boolean) as DispositifDTO[];
    };

    // Helper function to chunk array into smaller arrays for dynamic pages
    const chunkArray = <T,>(array: T[], chunkSize: number): T[][] => {
        const chunks: T[][] = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const risquesParticuliers = getRisquesParticuliers();
    const dispositifs = getDispositifs();
    const epiDispositifs = dispositifs.filter(d => d.type === 'EPI');
    const epcDispositifs = dispositifs.filter(d => d.type === 'EPC');

    // Debug logging
    console.log('BDT Relations:', currentBdt.relations);
    console.log('All Dispositifs Map:', allDispositifsMap);
    console.log('Filtered Dispositifs:', dispositifs);
    console.log('EPI Dispositifs:', epiDispositifs);
    console.log('EPC Dispositifs:', epcDispositifs);

    // Dynamically split risks if there are too many (more than 8 risks)
    const riskChunks = risquesParticuliers.length > 8 
        ? chunkArray(risquesParticuliers, 8) 
        : [risquesParticuliers];

    return (
        <Document>
            {/* Page 1: Basic Information */}
            <CustomPage>
                <View style={styles.pageContainer}>
                    {/* Official Professional Header */}
                    <OfficialHeader
                        documentNumber={currentBdt.id}
                        date={currentBdt.date ? new Date(currentBdt.date).toLocaleDateString('fr-FR') : undefined}
                        version="V2.0 - 2024"
                        classification="INTERNE"
                    />

                    {/* Company Information Section - Following the JSON structure */}
                    <View style={styles.companySection}>
                        <View style={styles.companyColumn}>
                            <OfficialCard 
                                title="ENTREPRISE UTILISATRICE" 
                                subtitle="DANONE"
                                accentColor="#0066cc"
                                sectionNumber="1.1"
                            >
                                <OfficialField label="Raison sociale" value="DANONE" />
                                <OfficialField label="Adresse" value="50 Impasse du Dan Perdu, 38540 Saint Just Chaleyssin" />
                                <OfficialField label="N° de téléphone" value="04.72.70.11.11" />
                                <OfficialField label="Donneur d'ordre" value={currentBdt.donneurDOrdre || ""} placeholder="À remplir" required />
                                <OfficialField label="Fonction (Donneur)" value="" placeholder="Man please - fonctionDonneur missing in BdtDTO" required />
                            </OfficialCard>
                        </View>

                        <View style={styles.companyColumnLast}>
                            <OfficialCard 
                                title="ENTREPRISE EXTÉRIEURE" 
                                subtitle="Prestataire"
                                accentColor="#009900"
                                sectionNumber="1.2"
                            >
                                <OfficialField 
                                    label="Raison sociale" 
                                    value={entrepriseData?.raisonSociale || entrepriseData?.nom} 
                                    placeholder="Non renseigné"
                                    required
                                />
                                <OfficialField 
                                    label="Adresse" 
                                    value={entrepriseData?.address} 
                                    placeholder="Non renseignée"
                                    required
                                />
                                <OfficialField 
                                    label="N° de téléphone" 
                                    value={entrepriseData?.numTel} 
                                    placeholder="Non renseigné"
                                    required
                                />
                                <OfficialField label="Responsable chantier" value="" placeholder="Man please - responsableChantier missing in BdtDTO" required />
                                <OfficialField label="Fonction (Responsable)" value="" placeholder="Man please - fonctionResponsable missing in BdtDTO" required />
                            </OfficialCard>
                        </View>
                    </View>

                    {/* Work Details Section - Enhanced with JSON structure fields */}
                    <OfficialCard 
                        title="INFORMATIONS GÉNÉRALES" 
                        subtitle="Identification du chantier et des travaux"
                        accentColor="#ff9900"
                        sectionNumber="2"
                    >
                        <OfficialField label="Nom du BDT" value={currentBdt?.nom} placeholder="Non renseigné" required />
                        <OfficialField 
                            label="Date BDT" 
                            value={currentBdt?.date ? new Date(currentBdt.date).toLocaleDateString('fr-FR') : undefined} 
                            placeholder="Non renseignée"
                            required
                        />
                        <OfficialField label="Lieu d'intervention" value={chantierData?.nom} placeholder="Man please - lieuIntervention missing in ChantierDTO" required />
                        <OfficialField 
                            label="Date début" 
                            value={chantierData?.dateDebut ? new Date(chantierData.dateDebut).toLocaleDateString('fr-FR') : undefined} 
                            placeholder="Non renseignée"
                            required
                        />
                        <OfficialField 
                            label="Date fin" 
                            value={chantierData?.dateFin ? new Date(chantierData.dateFin).toLocaleDateString('fr-FR') : undefined} 
                            placeholder="Non renseignée"
                            required
                        />
                        <OfficialField 
                            label="Effectif max sur chantier" 
                            value={chantierData?.effectifMaxiSurChantier?.toString()} 
                            placeholder="Non défini"
                            required
                        />
                        <OfficialField 
                            label="Nom du référent COVID" 
                            value="" 
                            placeholder="Man please - referentCovid missing in ChantierDTO"
                        />
                        <OfficialField 
                            label="Horaires de travail" 
                            value={currentBdt?.horaireDeTravaille} 
                            placeholder="Non définis"
                            required
                        />
                        <OfficialField 
                            label="Personnel Danone informé" 
                            value={currentBdt?.personnelDansZone ? 'OUI' : 'NON'} 
                            required
                        />
                        <OfficialField 
                            label="Tâches autorisées" 
                            value={currentBdt?.tachesAuthoriser} 
                            placeholder="Non définies"
                            fullWidth
                            required
                        />
                    </OfficialCard>

                    {/* Risques / Procédures d'Urgence Section */}
                    <OfficialCard 
                        title="RISQUES / PROCÉDURES D'URGENCE" 
                        subtitle="Coactivité et procédures d'évacuation"
                        accentColor="#dc2626"
                        sectionNumber="3"
                    >
                        <OfficialField label="Risques de coactivité" value="" placeholder="Man please - coactivite missing in RisqueDTO" fullWidth />
                        <OfficialField label="Mode opératoire" value="" placeholder="Man please - modeOperatoire missing in RisqueDTO" fullWidth />
                        <OfficialField label="Moyens utilisés" value="" placeholder="Man please - moyensUtilises missing in RisqueDTO" fullWidth />
                        <OfficialField label="Evacuation incendie" value="" placeholder="Man please - evacuationIncendie missing in DispositifDTO" />
                        <OfficialField label="Evacuation ammoniac" value="" placeholder="Man please - evacuationAmmoniac missing in DispositifDTO" />
                        <OfficialField label="Confinement" value="" placeholder="Man please - confinement missing in DispositifDTO" />
                        <OfficialField 
                            label="Numéros d'urgence" 
                            value="Accident: 04.72.70.1100 (Infirmerie) • 1520 (Poste Garde) • 15 (SAMU) | Incendie: 1520 (Poste Garde) • 04.72.70.1213 • 18 (Pompiers)" 
                            fullWidth
                        />
                    </OfficialCard>

                    {/* Tâches et Risques Section */}
                    <OfficialCard 
                        title="TÂCHES ET RISQUES" 
                        subtitle="Analyses des risques spécifiques"
                        accentColor="#8b5cf6"
                        sectionNumber="4"
                    >
                        <OfficialField label="Travaux en hauteur" value="" placeholder="Man please - travauxEnHauteur missing in AnalyseDeRisqueDTO" />
                        <OfficialField label="Utilisation de grue" value="" placeholder="Man please - utilisationGrue missing in AnalyseDeRisqueDTO" />
                        <OfficialField label="Travailleur isolé" value="" placeholder="Man please - travailleurIsole missing in AnalyseDeRisqueDTO" />
                        <OfficialField label="Risque amiante" value="" placeholder="Man please - risqueAmiante missing in AnalyseDeRisqueDTO" />
                        <OfficialField label="Utilisation outils portatifs" value="" placeholder="Man please - outilsPortatifs missing in AnalyseDeRisqueDTO" />
                    </OfficialCard>

                    {/* Prévention et Qualité Section */}
                    <OfficialCard 
                        title="PRÉVENTION ET QUALITÉ" 
                        subtitle="Consignations et vérifications"
                        accentColor="#059669"
                        sectionNumber="5"
                    >
                        <OfficialField label="Consignation machine" value="" placeholder="Man please - consignationMachine missing in AuditSecuDTO" />
                        <OfficialField label="Consignation fluide" value="" placeholder="Man please - consignationFluide missing in AuditSecuDTO" />
                        <OfficialField label="Consignation électrique" value="" placeholder="Man please - consignationElectrique missing in AuditSecuDTO" />
                        <OfficialField label="Outils vérifiés" value="" placeholder="Man please - outilsVerifies missing in AuditSecuDTO" />
                        <OfficialField label="Tri déchets" value="" placeholder="Man please - triDechets missing in AuditSecuDTO" />
                    </OfficialCard>

                    {/* Safety Equipment Section - Enhanced */}
                    <OfficialCard 
                        title="MESURES DE SÉCURITÉ" 
                        subtitle="Équipements et précautions obligatoires"
                        accentColor="#dc2626"
                        sectionNumber="6"
                    >
                        <View style={styles.safetySection}>
                            <View style={styles.safetyColumn}>
                                <Text style={styles.safetyTitle}>ÉQUIPEMENTS DE PROTECTION INDIVIDUELLE (EPI)</Text>
                                {epiDispositifs.length > 0 ? (
                                    epiDispositifs.map(dispositif => (
                                        <DispositifPdfItem key={dispositif.id} dispositif={dispositif} />
                                    ))
                                ) : (
                                    <Text style={{ fontSize: 9, color: '#555555', fontStyle: 'italic' }}>Aucun équipement individuel requis</Text>
                                )}
                            </View>
                            <View style={styles.safetyColumn}>
                                <Text style={styles.safetyTitle}>ÉQUIPEMENTS DE PROTECTION COLLECTIVE (EPC)</Text>
                                {epcDispositifs.length > 0 ? (
                                    epcDispositifs.map(dispositif => (
                                        <DispositifPdfItem key={dispositif.id} dispositif={dispositif} />
                                    ))
                                ) : (
                                    <Text style={{ fontSize: 9, color: '#555555', fontStyle: 'italic' }}>Aucun équipement collectif requis</Text>
                                )}
                            </View>
                        </View>
                    </OfficialCard>

                    {/* Safety Icons Section */}
                    <OfficialCard 
                        title="INFORMATIONS DE SÉCURITÉ" 
                        subtitle="Numéros d'urgence et procédures"
                        accentColor="#dc2626"
                        sectionNumber="7"
                    >
                        <View style={styles.safetyGrid}>
                            <View style={styles.safetyIconColumn}>
                                <ModernIcon
                                    icon="🚨"
                                    label="EN CAS D'ACCIDENT"
                                    description="Infirmerie interne: 04.72.70.1100 - Poste garde: 1520 - SAMU: 15"
                                    backgroundColor="#fee2e2"
                                    color="#dc2626"
                                    status="danger"
                                />
                            </View>
                            
                            <View style={styles.safetyIconColumn}>
                                <ModernIcon
                                    icon="🔥"
                                    label="EN CAS D'INCENDIE"
                                    description="Poste de garde: 1520 ou 04.72.70.1213 - Sirius: 7018 - Pompiers: 18"
                                    backgroundColor="#fef3c7"
                                    color="#f59e0b"
                                    status="warning"
                                />
                            </View>
                            
                            <View style={styles.safetyIconColumn}>
                                <ModernIcon
                                    icon="⚠️"
                                    label="ÉVACUATION/ALERTE"
                                    description="Méthode sirène - Rassemblement pelouse face tour d'inspiration"
                                    backgroundColor="#dbeafe"
                                    color="#2563eb"
                                    status="ok"
                                />
                            </View>
                        </View>
                    </OfficialCard>
                </View>
            </CustomPage>

            {/* Dynamic Pages for Risks */}
            {riskChunks.map((riskChunk, pageIndex) => {
                const pageKey = `risk-page-${Date.now()}-${pageIndex}`;
                const pageTitle = pageIndex > 0 
                    ? `RISQUES PARTICULIERS DE L'OPÉRATION (Suite ${pageIndex + 1})`
                    : 'RISQUES PARTICULIERS DE L\'OPÉRATION';
                
                return (
                    <CustomPage key={pageKey}>
                        <View style={styles.pageContainer}>
                            {/* Risk Assessment Table - Show placeholder since data not available */}
                            {pageIndex === 0 && (
                                <OfficialCard 
                                    title="ANALYSE DES RISQUES" 
                                    subtitle="Coactivité avec les entreprises extérieures"
                                    accentColor="#dc2626"
                                    sectionNumber="8"
                                >
                                    <OfficialTable
                                        columns={[
                                            { header: 'Mode Opératoire', width: '25%', align: 'left' },
                                            { header: 'Moyens Utilisés', width: '25%', align: 'left' },
                                            { header: 'Risques Prévisibles', width: '25%', align: 'left' },
                                            { header: 'Mesures de Prévention', width: '25%', align: 'left' }
                                        ]}
                                        data={[
                                            {
                                                modeOperatoire: 'Man please - need allAnalyseDeRisque data',
                                                moyensUtilises: 'Man please - need allAnalyseDeRisque data',
                                                risquesPrevisibles: 'Man please - need allAnalyseDeRisque data',
                                                mesuresPrevention: 'Man please - need allAnalyseDeRisque data'
                                            }
                                        ]}
                                        minRows={3}
                                        emptyRowText="À compléter"
                                    />
                                </OfficialCard>
                            )}

                            {/* Detailed Risk Assessment */}
                            {riskChunk.length > 0 && (
                                <OfficialCard 
                                    title={pageTitle}
                                    subtitle="Évaluation détaillée des risques"
                                    accentColor="#dc2626"
                                    sectionNumber={`9.${pageIndex + 1}`}
                                >
                                    <View style={styles.riskGrid}>
                                        <View style={styles.riskColumn}>
                                            {riskChunk.slice(0, Math.ceil(riskChunk.length / 2)).map((risque, index) => (
                                                <OfficialRiskItem
                                                    key={`risk-left-${risque.id || index}`}
                                                    title={risque.title || risque.description || `Risque #${risque.id}`}
                                                    description={risque.description !== risque.title ? risque.description : undefined}
                                                    riskLevel={risque.travailleDangereux ? 'high' : 'medium'}
                                                    isDangerous={risque.travailleDangereux}
                                                    icon={getRiskIcon(risque)}
                                                />
                                            ))}
                                        </View>
                                        
                                        <View style={styles.riskColumn}>
                                            {riskChunk.slice(Math.ceil(riskChunk.length / 2)).map((risque, index) => (
                                                <OfficialRiskItem
                                                    key={`risk-right-${risque.id || index}`}
                                                    title={risque.title || risque.description || `Risque #${risque.id}`}
                                                    description={risque.description !== risque.title ? risque.description : undefined}
                                                    riskLevel={risque.travailleDangereux ? 'high' : 'medium'}
                                                    isDangerous={risque.travailleDangereux}
                                                    icon={getRiskIcon(risque)}
                                                />
                                            ))}
                                        </View>
                                    </View>
                                </OfficialCard>
                            )}

                            {/* Equipment/Consignation Section - Only on last risk page */}
                            {pageIndex === riskChunks.length - 1 && (
                                <OfficialCard 
                                    title="MESURES DE PRÉVENTION COMPLÉMENTAIRES" 
                                    subtitle="Consignations et procédures"
                                    accentColor="#0ea5e9"
                                    sectionNumber="10"
                                >
                                    <OfficialField label="Consignation énergétique DM/NOR" value="" placeholder="À remplir - CADENASSÉ:" fullWidth />
                                    <OfficialField label="Consignation fluide(s) DM/NOR" value="" placeholder="À remplir - CADENASSÉ:" fullWidth />
                                    <OfficialField label="Consignation électrique DM/NOR" value="" placeholder="À remplir - CADENASSÉ:" fullWidth />
                                    <OfficialField label="Consignation DU 1424" value="" placeholder="QUALITÉ, AFGRI ENVIRONNEMENT" fullWidth />
                                </OfficialCard>
                            )}
                        </View>
                    </CustomPage>
                );
            })}

            {/* Final Page - Interventions and Signatures */}
            <CustomPage>
                <View style={styles.pageContainer}>
                    {/* Interventions Section */}
                    <View style={styles.interventionsSection}>
                        <View style={styles.interventionColumn}>
                            <OfficialCard 
                                title="LES INTERVENANTS" 
                                subtitle="Personnel autorisé"
                                accentColor="#059669"
                                sectionNumber="11.1"
                            >
                                <View style={styles.checklistItem}>
                                    <View style={styles.checkboxSmall} />
                                    <Text style={styles.checkboxText}>Man please - need allAudits data for intervenants</Text>
                                    <View style={styles.statusGroup}>
                                        <View style={styles.statusMini}>
                                            <Text style={styles.statusMiniText}>O</Text>
                                        </View>
                                        <View style={styles.statusMini}>
                                            <Text style={styles.statusMiniText}>N</Text>
                                        </View>
                                    </View>
                                </View>
                            </OfficialCard>
                        </View>

                        <View style={styles.interventionColumn}>
                            <OfficialCard 
                                title="OUTILS UTILISÉS" 
                                subtitle="Équipements autorisés"
                                accentColor="#8b5cf6"
                                sectionNumber="11.2"
                            >
                                <View style={styles.checklistItem}>
                                    <View style={styles.checkboxSmall} />
                                    <Text style={styles.checkboxText}>Man please - need allAudits data for outils</Text>
                                    <View style={styles.statusGroup}>
                                        <View style={styles.statusMini}>
                                            <Text style={styles.statusMiniText}>O</Text>
                                        </View>
                                        <View style={styles.statusMini}>
                                            <Text style={styles.statusMiniText}>N</Text>
                                        </View>
                                    </View>
                                </View>
                            </OfficialCard>
                        </View>
                    </View>

                    {/* Signatures Section - Enhanced with JSON structure */}
                    <OfficialCard 
                        title="SIGNATURES ET VALIDATION" 
                        subtitle="Validation des intervenants"
                        accentColor="#6366f1"
                        sectionNumber="12"
                    >
                        <OfficialField label="Entreprise utilisatrice" value="" placeholder="Man please - entrepriseUtilisatrice missing in DocumentDTO" required />
                        <OfficialField label="Entreprise extérieure" value="" placeholder="Man please - entrepriseExterieure missing in DocumentDTO" required />
                        <OfficialField label="Chargé de travaux" value="" placeholder="Man please - chargeDeTravaux missing in DocumentDTO" required />
                        <OfficialField label="Donneur d'ordres" value="" placeholder="Man please - donneurOrdres missing in DocumentDTO" required />
                    </OfficialCard>

                    {/* Official Signatures Section */}
                    <OfficialSignature
                        leftTitle="CHARGÉ DE TRAVAUX"
                        rightTitle="DONNEUR D'ORDRES"
                        leftSubtitle="SIGNATURE ET VISA OBLIGATOIRE"
                        rightSubtitle="SIGNATURE ET VISA OBLIGATOIRE"
                    />
                </View>
            </CustomPage>
        </Document>
    );
};

export default BDT_Page_Modern;
