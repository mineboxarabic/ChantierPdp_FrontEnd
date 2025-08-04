import React from 'react';
import { Document, Page, View, Text, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { BdtDTO } from "../utils/entitiesDTO/BdtDTO.ts";
import { ChantierDTO } from '../utils/entitiesDTO/ChantierDTO.ts';
import { EntrepriseDTO } from '../utils/entitiesDTO/EntrepriseDTO.ts';
import DispositifDTO from '../utils/entitiesDTO/DispositifDTO.ts';
import RisqueDTO from '../utils/entitiesDTO/RisqueDTO.ts';

// Font registration
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/helvetica-neue.ttf' }, // Regular
        { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/helvetica-neue-bold.ttf', fontWeight: 'bold' }, // Bold
    ],
});

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 10,
        padding: 20,
        color: '#333',
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '3px solid #005596',
        paddingBottom: 15,
        marginBottom: 25,
        backgroundColor: '#f8fafe',
        padding: 15,
        borderRadius: 5,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#005596',
        letterSpacing: 1,
    },
    headerSubText: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    danoneLogo: {
        width: 100,
        height: 50,
    },
    section: {
        marginBottom: 20,
        border: '1px solid #e0e0e0',
        borderRadius: 5,
        overflow: 'hidden',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#005596',
        padding: 10,
        marginBottom: 0,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionContent: {
        padding: 15,
        backgroundColor: '#fafbfc',
    },
    fieldContainer: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'center',
    },
    fieldLabel: {
        width: '35%',
        fontWeight: 'bold',
        color: '#444',
        fontSize: 10,
    },
    fieldValue: {
        width: '65%',
        color: '#222',
        fontSize: 10,
        backgroundColor: '#ffffff',
        padding: 4,
        border: '1px solid #ddd',
        borderRadius: 3,
    },
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    gridColumn: {
        width: '48%',
    },
    companyBox: {
        backgroundColor: '#ffffff',
        border: '2px solid #005596',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    companyTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#005596',
        marginBottom: 8,
        textAlign: 'center',
        backgroundColor: '#f0f5fa',
        padding: 5,
        borderRadius: 3,
    },
    companyField: {
        marginBottom: 4,
        fontSize: 9,
    },
    listItem: {
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'flex-start',
    },
    bullet: {
        width: 15,
        fontSize: 12,
        color: '#005596',
        fontWeight: 'bold',
    },
    listItemText: {
        flex: 1,
        fontSize: 10,
        lineHeight: 1.4,
    },
    riskItem: {
        backgroundColor: '#fff5f5',
        border: '1px solid #fecaca',
        borderRadius: 5,
        padding: 8,
        marginBottom: 5,
    },
    riskTitle: {
        fontWeight: 'bold',
        color: '#dc2626',
        fontSize: 10,
    },
    equipmentItem: {
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: 5,
        padding: 6,
        marginBottom: 4,
    },
    equipmentText: {
        fontSize: 9,
        color: '#166534',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        textAlign: 'center',
        fontSize: 8,
        color: '#666',
        borderTop: '1px solid #ddd',
        paddingTop: 10,
    },
    signatureSection: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#f8fafe',
        padding: 20,
        borderRadius: 8,
        border: '2px solid #005596',
    },
    signatureBox: {
        width: '40%',
        textAlign: 'center',
    },
    signatureLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#005596',
        marginBottom: 30,
    },
    signatureLine: {
        borderTop: '2px solid #005596',
        marginTop: 40,
        paddingTop: 5,
    },
    dateField: {
        fontSize: 9,
        color: '#666',
        marginTop: 10,
    },
    urgencyInfo: {
        backgroundColor: '#fef3c7',
        border: '2px solid #f59e0b',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
    },
    urgencyTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#92400e',
        marginBottom: 5,
    },
    urgencyText: {
        fontSize: 9,
        color: '#92400e',
        lineHeight: 1.3,
    },
    workDescription: {
        backgroundColor: '#ffffff',
        padding: 12,
        border: '1px solid #ddd',
        borderRadius: 5,
        minHeight: 60,
        fontSize: 10,
        lineHeight: 1.5,
    },
});

interface BdtOfficialTemplateProps {
    currentBdt: BdtDTO;
    chantierData?: ChantierDTO;
    entrepriseData?: EntrepriseDTO;
    allRisksMap?: Map<number, RisqueDTO>;
    allDispositifsMap?: Map<number, DispositifDTO>;
}

const BDT_Official_Template = ({ currentBdt, chantierData, entrepriseData, allRisksMap, allDispositifsMap }: BdtOfficialTemplateProps) => {

    const getDispositifs = (type: 'EPI' | 'EPC') => {
        if (!currentBdt.relations || !allDispositifsMap) return [];
        return currentBdt.relations
            .filter(rel => rel.objectType === 'DISPOSITIF' || rel.objectType?.toString() === 'DISPOSITIF')
            .map(rel => allDispositifsMap.get(rel.objectId))
            .filter((d): d is DispositifDTO => !!d && d.type === type);
    };

    const getRisques = () => {
        if (!currentBdt.relations || !allRisksMap) return [];
        return currentBdt.relations
            .filter(rel => rel.objectType === 'RISQUE' || rel.objectType?.toString() === 'RISQUE')
            .map(rel => allRisksMap.get(rel.objectId))
            .filter((r): r is RisqueDTO => !!r);
    };

    const epiDispositifs = getDispositifs('EPI');
    const epcDispositifs = getDispositifs('EPC');
    const risques = getRisques();

    // Helper function to get enterprise type label
    const getEntrepriseTypeLabel = (type?: string) => {
        if (type === 'EE') return 'Entreprise Extérieure';
        if (type === 'EU') return 'Entreprise Utilisatrice';
        return 'N/A';
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Enhanced Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerText}>BON DE TRAVAIL</Text>
                        <Text style={styles.headerSubText}>Document officiel de sécurité</Text>
                        <Text style={styles.headerSubText}>N° {currentBdt.id}</Text>
                    </View>
                    <Image style={styles.danoneLogo} src="https://vectorlogoseek.com/wp-content/uploads/2019/09/danone-vector-logo.png" />
                </View>

                {/* Emergency Information */}
                <View style={styles.urgencyInfo}>
                    <Text style={styles.urgencyTitle}>🚨 INFORMATIONS D'URGENCE</Text>
                    <Text style={styles.urgencyText}>
                        Accident: 04.72.70.1100 (Infirmerie) | 1520 (Poste garde) | 15 (SAMU)
                        {'\n'}Incendie: 1520 (Poste garde) | 04.72.70.1213 | 18 (Pompiers)
                    </Text>
                </View>

                {/* Identification Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📋 Identification de l'intervention</Text>
                    <View style={styles.sectionContent}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Nom du BDT:</Text>
                            <Text style={styles.fieldValue}>{currentBdt.nom || 'N/A'}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Date d'établissement:</Text>
                            <Text style={styles.fieldValue}>{currentBdt.date ? new Date(currentBdt.date).toLocaleDateString('fr-FR') : 'N/A'}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Nom du chantier:</Text>
                            <Text style={styles.fieldValue}>{chantierData?.nom || 'N/A'}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Lieu d'intervention:</Text>
                            <Text style={styles.fieldValue}>{chantierData?.localisation || 'N/A'}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Période d'intervention:</Text>
                            <Text style={styles.fieldValue}>
                                Du {chantierData?.dateDebut ? new Date(chantierData.dateDebut).toLocaleDateString('fr-FR') : 'N/A'}
                                {' '}au {chantierData?.dateFin ? new Date(chantierData.dateFin).toLocaleDateString('fr-FR') : 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Horaires de travail:</Text>
                            <Text style={styles.fieldValue}>{currentBdt.horaireDeTravaille || 'N/A'}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Personnel informé:</Text>
                            <Text style={styles.fieldValue}>{currentBdt.personnelDansZone ? 'OUI' : 'NON'}</Text>
                        </View>
                    </View>
                </View>

                {/* Companies Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🏢 Intervenants</Text>
                    <View style={styles.sectionContent}>
                        <View style={styles.gridContainer}>
                            <View style={styles.gridColumn}>
                                <View style={styles.companyBox}>
                                    <Text style={styles.companyTitle}>ENTREPRISE UTILISATRICE</Text>
                                    <Text style={styles.companyField}>Raison Sociale: DANONE</Text>
                                    <Text style={styles.companyField}>Adresse: 50 Impasse du Dan Perdu</Text>
                                    <Text style={styles.companyField}>38540 Saint Just Chaleyssin</Text>
                                    <Text style={styles.companyField}>Téléphone: 04.72.70.11.11</Text>
                                    <Text style={styles.companyField}>Donneur d'ordre: {currentBdt.donneurDOrdre || 'À définir'}</Text>
                                </View>
                            </View>
                            <View style={styles.gridColumn}>
                                <View style={styles.companyBox}>
                                    <Text style={styles.companyTitle}>ENTREPRISE EXTÉRIEURE</Text>
                                    <Text style={styles.companyField}>Raison Sociale: {entrepriseData?.raisonSociale || entrepriseData?.nom || 'N/A'}</Text>
                                    <Text style={styles.companyField}>Adresse: {entrepriseData?.address || 'N/A'}</Text>
                                    <Text style={styles.companyField}>Téléphone: {entrepriseData?.numTel || 'N/A'}</Text>
                                    <Text style={styles.companyField}>Type: {getEntrepriseTypeLabel(entrepriseData?.type)}</Text>
                                    <Text style={styles.companyField}>Responsable chantier: À définir</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Work Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🔨 Description des travaux autorisés</Text>
                    <View style={styles.sectionContent}>
                        <Text style={styles.workDescription}>
                            {currentBdt.tachesAuthoriser || 'Aucune description des tâches spécifiée.'}
                        </Text>
                    </View>
                </View>

                {/* Safety Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⚠️ Risques et Mesures de Prévention</Text>
                    <View style={styles.sectionContent}>
                        <View style={styles.gridContainer}>
                            <View style={styles.gridColumn}>
                                <Text style={styles.companyTitle}>RISQUES IDENTIFIÉS</Text>
                                {risques.length > 0 ? risques.map(r => (
                                    <View key={r.id} style={styles.riskItem}>
                                        <Text style={styles.riskTitle}>{r.title}</Text>
                                        {r.description && r.description !== r.title && (
                                            <Text style={{fontSize: 9, marginTop: 2}}>{r.description}</Text>
                                        )}
                                        {r.travailleDangereux && (
                                            <Text style={{fontSize: 8, color: '#dc2626', fontWeight: 'bold', marginTop: 2}}>
                                                ⚠️ TRAVAIL DANGEREUX
                                            </Text>
                                        )}
                                    </View>
                                )) : <Text>Aucun risque identifié.</Text>}
                            </View>
                            <View style={styles.gridColumn}>
                                <Text style={styles.companyTitle}>ÉQUIPEMENTS DE PROTECTION</Text>
                                
                                <Text style={{fontWeight: 'bold', marginBottom: 5, fontSize: 10}}>
                                    🛡️ Équipements Individuels (EPI)
                                </Text>
                                {epiDispositifs.length > 0 ? epiDispositifs.map(d => (
                                    <View key={d.id} style={styles.equipmentItem}>
                                        <Text style={styles.equipmentText}>• {d.title}</Text>
                                        {d.description && (
                                            <Text style={{fontSize: 8, color: '#166534', marginTop: 1}}>
                                                {d.description}
                                            </Text>
                                        )}
                                    </View>
                                )) : <Text style={{fontSize: 9, fontStyle: 'italic'}}>Aucun EPI spécifique requis.</Text>}
                                
                                <Text style={{fontWeight: 'bold', marginBottom: 5, marginTop: 10, fontSize: 10}}>
                                    🏗️ Équipements Collectifs (EPC)
                                </Text>
                                {epcDispositifs.length > 0 ? epcDispositifs.map(d => (
                                    <View key={d.id} style={styles.equipmentItem}>
                                        <Text style={styles.equipmentText}>• {d.title}</Text>
                                        {d.description && (
                                            <Text style={{fontSize: 8, color: '#166534', marginTop: 1}}>
                                                {d.description}
                                            </Text>
                                        )}
                                    </View>
                                )) : <Text style={{fontSize: 9, fontStyle: 'italic'}}>Aucun EPC spécifique requis.</Text>}
                            </View>
                        </View>
                    </View>
                </View>
                
                {/* Enhanced Signature Section */}
                <View style={styles.signatureSection}>
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureLabel}>DONNEUR D'ORDRE</Text>
                        <Text style={styles.signatureLine}></Text>
                        <Text style={styles.dateField}>Date: _______________</Text>
                        <Text style={styles.dateField}>Nom et signature</Text>
                    </View>
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureLabel}>CHARGÉ DE TRAVAUX</Text>
                        <Text style={styles.signatureLine}></Text>
                        <Text style={styles.dateField}>Date: _______________</Text>
                        <Text style={styles.dateField}>Nom et signature</Text>
                    </View>
                </View>

                <Text style={styles.footer}>
                    Document généré automatiquement le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
                    {'\n'}La sécurité est l'affaire de tous - Respectez les consignes
                </Text>
            </Page>
        </Document>
    );
};

export default BDT_Official_Template;
