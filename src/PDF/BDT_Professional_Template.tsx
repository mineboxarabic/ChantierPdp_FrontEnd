import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { BdtDTO } from '../utils/entitiesDTO/BdtDTO';
import { ChantierDTO } from '../utils/entitiesDTO/ChantierDTO';
import { EntrepriseDTO } from '../utils/entitiesDTO/EntrepriseDTO';
import RisqueDTO from '../utils/entitiesDTO/RisqueDTO';
import DispositifDTO from '../utils/entitiesDTO/DispositifDTO';

// Professional color scheme
const colors = {
    primary: '#004B87',      // Danone blue
    secondary: '#0066CC',
    accent: '#FF6B00',       // Orange for warnings
    text: '#2C3E50',
    lightGray: '#F8F9FA',
    mediumGray: '#E9ECEF',
    darkGray: '#6C757D',
    white: '#FFFFFF',
    danger: '#DC3545',
    success: '#28A745',
    warning: '#FFC107',
    lightBlue: '#E3F2FD',
    lightGreen: '#E8F5E8',
    lightRed: '#FFEBEE'
};

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 10,
        padding: 0,
        color: colors.text,
        backgroundColor: colors.white,
        lineHeight: 1.3,
    },
    
    // Header Section
    documentHeader: {
        backgroundColor: colors.primary,
        padding: 20,
        color: colors.white,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 4,
    },
    docNumber: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    companyInfo: {
        textAlign: 'right',
    },
    companyName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    companyDetails: {
        fontSize: 10,
        lineHeight: 1.2,
    },
    
    // Emergency Banner
    emergencySection: {
        backgroundColor: colors.danger,
        padding: 12,
        textAlign: 'center',
    },
    emergencyTitle: {
        color: colors.white,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    emergencyContacts: {
        color: colors.white,
        fontSize: 10,
        lineHeight: 1.3,
    },
    
    // Content Area
    contentArea: {
        padding: 20,
    },
    
    // Section Styles
    section: {
        marginBottom: 16,
        border: `1px solid ${colors.mediumGray}`,
        borderRadius: 6,
        overflow: 'hidden',
    },
    sectionHeader: {
        backgroundColor: colors.lightGray,
        padding: 12,
        borderBottom: `1px solid ${colors.mediumGray}`,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionContent: {
        padding: 15,
    },
    
    // Information Grid
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    infoRow: {
        width: '48%',
        flexDirection: 'row',
        marginBottom: 8,
        minHeight: 20,
    },
    infoRowFull: {
        width: '100%',
        flexDirection: 'row',
        marginBottom: 8,
        minHeight: 20,
    },
    label: {
        width: '45%',
        fontSize: 9,
        fontWeight: 'bold',
        color: colors.darkGray,
        paddingRight: 8,
        paddingTop: 2,
    },
    value: {
        width: '55%',
        fontSize: 10,
        color: colors.text,
        borderBottom: `1px dotted ${colors.mediumGray}`,
        paddingBottom: 2,
        paddingTop: 2,
        minHeight: 16,
    },
    
    // Company Information Boxes
    companiesContainer: {
        flexDirection: 'row',
        gap: 15,
    },
    companyBox: {
        flex: 1,
        border: `2px solid ${colors.primary}`,
        borderRadius: 8,
        overflow: 'hidden',
    },
    companyBoxHeader: {
        backgroundColor: colors.primary,
        padding: 10,
        textAlign: 'center',
    },
    companyBoxTitle: {
        color: colors.white,
        fontSize: 11,
        fontWeight: 'bold',
    },
    companyBoxContent: {
        padding: 12,
        backgroundColor: colors.white,
    },
    companyField: {
        fontSize: 9,
        marginBottom: 6,
        lineHeight: 1.3,
    },
    companyFieldLabel: {
        fontWeight: 'bold',
        color: colors.darkGray,
    },
    
    // Work Description
    workDescriptionBox: {
        backgroundColor: colors.lightBlue,
        border: `1px solid ${colors.secondary}`,
        borderRadius: 6,
        padding: 15,
        minHeight: 60,
    },
    workDescriptionText: {
        fontSize: 10,
        lineHeight: 1.4,
        color: colors.text,
    },
    
    // Risk and Safety Section
    riskSafetyContainer: {
        flexDirection: 'row',
        gap: 15,
    },
    riskColumn: {
        flex: 1,
    },
    safetyColumn: {
        flex: 1,
    },
    
    // Risk Items
    riskList: {
        backgroundColor: colors.lightRed,
        border: `1px solid ${colors.danger}`,
        borderRadius: 6,
        padding: 10,
    },
    riskHeader: {
        fontSize: 11,
        fontWeight: 'bold',
        color: colors.danger,
        marginBottom: 8,
        textAlign: 'center',
        paddingBottom: 4,
        borderBottom: `1px solid ${colors.danger}`,
    },
    riskItem: {
        marginBottom: 6,
        padding: 6,
        backgroundColor: colors.white,
        borderRadius: 4,
        border: `1px solid #FFCDD2`,
    },
    riskTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: colors.danger,
        marginBottom: 2,
    },
    riskDescription: {
        fontSize: 8,
        color: colors.text,
        lineHeight: 1.2,
    },
    riskDangerous: {
        backgroundColor: colors.danger,
        color: colors.white,
        fontSize: 7,
        padding: 2,
        borderRadius: 8,
        textAlign: 'center',
        marginTop: 3,
        fontWeight: 'bold',
    },
    
    // Equipment Sections
    equipmentContainer: {
        backgroundColor: colors.lightGreen,
        border: `1px solid ${colors.success}`,
        borderRadius: 6,
        padding: 10,
        marginBottom: 10,
    },
    equipmentHeader: {
        fontSize: 11,
        fontWeight: 'bold',
        color: colors.success,
        marginBottom: 8,
        textAlign: 'center',
        paddingBottom: 4,
        borderBottom: `1px solid ${colors.success}`,
    },
    equipmentSubHeader: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.primary,
        marginTop: 8,
        marginBottom: 4,
        paddingLeft: 4,
    },
    equipmentItem: {
        flexDirection: 'row',
        marginBottom: 4,
        paddingLeft: 8,
    },
    equipmentBullet: {
        width: 12,
        fontSize: 9,
        color: colors.success,
        fontWeight: 'bold',
    },
    equipmentText: {
        flex: 1,
        fontSize: 9,
        color: colors.text,
        lineHeight: 1.2,
    },
    equipmentDescription: {
        fontSize: 8,
        color: colors.darkGray,
        fontStyle: 'italic',
        marginTop: 1,
        paddingLeft: 12,
    },
    
    // Status Badges
    statusContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
    statusBadge: {
        padding: 4,
        borderRadius: 12,
        fontSize: 8,
        fontWeight: 'bold',
        textAlign: 'center',
        minWidth: 60,
    },
    statusActive: {
        backgroundColor: colors.success,
        color: colors.white,
    },
    statusDangerous: {
        backgroundColor: colors.danger,
        color: colors.white,
    },
    statusAnnual: {
        backgroundColor: colors.warning,
        color: colors.text,
    },
    
    // Checkbox Styles
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    checkbox: {
        width: 12,
        height: 12,
        border: `1px solid ${colors.text}`,
        marginRight: 8,
        textAlign: 'center',
        fontSize: 8,
        lineHeight: 1.2,
    },
    checkboxChecked: {
        backgroundColor: colors.primary,
        color: colors.white,
    },
    checkboxLabel: {
        fontSize: 9,
        color: colors.text,
    },
    
    // Signature Section
    signatureSection: {
        marginTop: 25,
        flexDirection: 'row',
        gap: 20,
    },
    signatureBox: {
        flex: 1,
        border: `2px solid ${colors.primary}`,
        borderRadius: 8,
        padding: 15,
        textAlign: 'center',
        minHeight: 100,
    },
    signatureTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    signatureSubtitle: {
        fontSize: 9,
        color: colors.darkGray,
        marginBottom: 15,
    },
    signatureArea: {
        borderTop: `1px solid ${colors.mediumGray}`,
        marginTop: 35,
        paddingTop: 8,
    },
    signatureLabel: {
        fontSize: 8,
        color: colors.darkGray,
    },
    dateLine: {
        marginTop: 8,
        fontSize: 9,
        color: colors.text,
        borderBottom: `1px solid ${colors.mediumGray}`,
        paddingBottom: 2,
    },
    
    // Footer
    footer: {
        position: 'absolute',
        bottom: 15,
        left: 20,
        right: 20,
        textAlign: 'center',
        fontSize: 8,
        color: colors.darkGray,
        borderTop: `1px solid ${colors.mediumGray}`,
        paddingTop: 8,
        backgroundColor: colors.lightGray,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 4,
    },
    
    // Utilities
    textBold: {
        fontWeight: 'bold',
    },
    textCenter: {
        textAlign: 'center',
    },
    textRight: {
        textAlign: 'right',
    },
    mt8: {
        marginTop: 8,
    },
    mb8: {
        marginBottom: 8,
    },
});

interface BdtProfessionalTemplateProps {
    currentBdt: BdtDTO;
    chantierData?: ChantierDTO;
    entrepriseData?: EntrepriseDTO;
    allRisksMap?: Map<number, RisqueDTO>;
    allDispositifsMap?: Map<number, DispositifDTO>;
}

const BdtProfessionalTemplate: React.FC<BdtProfessionalTemplateProps> = ({
    currentBdt,
    chantierData,
    entrepriseData,
    allRisksMap,
    allDispositifsMap
}) => {
    // Helper functions for data processing
    const getDispositifs = (type: 'EPI' | 'EPC'): DispositifDTO[] => {
        if (!currentBdt.relations || !allDispositifsMap) return [];
        return currentBdt.relations
            .filter(rel => rel.objectType === 'DISPOSITIF')
            .map(rel => allDispositifsMap.get(rel.objectId))
            .filter((d): d is DispositifDTO => !!d && d.type === type);
    };

    const getRisques = (): RisqueDTO[] => {
        if (!currentBdt.relations || !allRisksMap) return [];
        return currentBdt.relations
            .filter(rel => rel.objectType === 'RISQUE')
            .map(rel => allRisksMap.get(rel.objectId))
            .filter((r): r is RisqueDTO => !!r);
    };

    const formatDate = (date?: Date | string) => {
        if (!date) return 'Non défini';
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatTime = (date?: Date | string) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const epiDispositifs = getDispositifs('EPI');
    const epcDispositifs = getDispositifs('EPC');
    const risques = getRisques();

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Professional Header */}
                <View style={styles.documentHeader}>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.mainTitle}>BON DE TRAVAIL</Text>
                            <Text style={styles.subtitle}>Autorisation de Travail Sécurisé</Text>
                            <Text style={styles.docNumber}>N° BDT-{currentBdt.id || '000'}</Text>
                        </View>
                        <View style={styles.companyInfo}>
                            <Text style={styles.companyName}>DANONE</Text>
                            <Text style={styles.companyDetails}>
                                50 Impasse du Dan Perdu{'\n'}
                                38540 Saint Just Chaleyssin{'\n'}
                                Tél: 04.72.70.11.11
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Emergency Information */}
                <View style={styles.emergencySection}>
                    <Text style={styles.emergencyTitle}>🚨 NUMÉROS D'URGENCE 🚨</Text>
                    <Text style={styles.emergencyContacts}>
                        ACCIDENT: 04.72.70.1100 (Infirmerie) • 1520 (Poste Garde) • 15 (SAMU){'\n'}
                        INCENDIE: 1520 (Poste Garde) • 04.72.70.1213 • 18 (Pompiers)
                    </Text>
                </View>

                <View style={styles.contentArea}>
                    {/* Document Information */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>📋 Informations du Document</Text>
                        </View>
                        <View style={styles.sectionContent}>
                            <View style={styles.infoGrid}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Nom du BDT:</Text>
                                    <Text style={styles.value}>{currentBdt.nom || 'Non défini'}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Date d'établissement:</Text>
                                    <Text style={styles.value}>{formatDate(currentBdt.date)}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Nom du chantier:</Text>
                                    <Text style={styles.value}>{chantierData?.nom || 'Non défini'}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Opération:</Text>
                                    <Text style={styles.value}>{chantierData?.operation || 'Non définie'}</Text>
                                </View>
                                <View style={styles.infoRowFull}>
                                    <Text style={styles.label}>Horaires de travail:</Text>
                                    <Text style={styles.value}>{currentBdt.horaireDeTravaille || 'À définir'}</Text>
                                </View>
                            </View>
                            
                            {/* Status Badges */}
                            <View style={styles.statusContainer}>
                                <View style={[styles.statusBadge, styles.statusActive]}>
                                    <Text>ACTIF</Text>
                                </View>
                                {chantierData?.travauxDangereux && (
                                    <View style={[styles.statusBadge, styles.statusDangerous]}>
                                        <Text>DANGEREUX</Text>
                                    </View>
                                )}
                                {chantierData?.isAnnuelle && (
                                    <View style={[styles.statusBadge, styles.statusAnnual]}>
                                        <Text>ANNUEL</Text>
                                    </View>
                                )}
                            </View>

                            {/* Checkboxes */}
                            <View style={styles.mt8}>
                                <View style={styles.checkboxContainer}>
                                    <View style={currentBdt.personnelDansZone ? [styles.checkbox, styles.checkboxChecked] : styles.checkbox}>
                                        <Text>{currentBdt.personnelDansZone ? '✓' : ''}</Text>
                                    </View>
                                    <Text style={styles.checkboxLabel}>Personnel informé de l'intervention</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Intervention Period */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>📅 Période d'Intervention</Text>
                        </View>
                        <View style={styles.sectionContent}>
                            <View style={styles.infoGrid}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Date de début:</Text>
                                    <Text style={styles.value}>{formatDate(chantierData?.dateDebut)}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Date de fin:</Text>
                                    <Text style={styles.value}>{formatDate(chantierData?.dateFin)}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Nb heures prévues:</Text>
                                    <Text style={styles.value}>{chantierData?.nbHeurs || '0'} h</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Effectif max:</Text>
                                    <Text style={styles.value}>{chantierData?.effectifMaxiSurChantier || '0'} pers.</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Companies Information */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>🏢 Intervenants</Text>
                        </View>
                        <View style={styles.sectionContent}>
                            <View style={styles.companiesContainer}>
                                <View style={styles.companyBox}>
                                    <View style={styles.companyBoxHeader}>
                                        <Text style={styles.companyBoxTitle}>ENTREPRISE UTILISATRICE</Text>
                                    </View>
                                    <View style={styles.companyBoxContent}>
                                        <Text style={styles.companyField}>
                                            <Text style={styles.companyFieldLabel}>Raison Sociale: </Text>
                                            DANONE
                                        </Text>
                                        <Text style={styles.companyField}>
                                            <Text style={styles.companyFieldLabel}>Adresse: </Text>
                                            50 Impasse du Dan Perdu{'\n'}38540 Saint Just Chaleyssin
                                        </Text>
                                        <Text style={styles.companyField}>
                                            <Text style={styles.companyFieldLabel}>Téléphone: </Text>
                                            04.72.70.11.11
                                        </Text>
                                        <Text style={styles.companyField}>
                                            <Text style={styles.companyFieldLabel}>Donneur d'ordre: </Text>
                                            {currentBdt.donneurDOrdre || 'À définir'}
                                        </Text>
                                    </View>
                                </View>
                                
                                <View style={styles.companyBox}>
                                    <View style={styles.companyBoxHeader}>
                                        <Text style={styles.companyBoxTitle}>ENTREPRISE EXTÉRIEURE</Text>
                                    </View>
                                    <View style={styles.companyBoxContent}>
                                        <Text style={styles.companyField}>
                                            <Text style={styles.companyFieldLabel}>Raison Sociale: </Text>
                                            {entrepriseData?.raisonSociale || entrepriseData?.nom || 'Non définie'}
                                        </Text>
                                        <Text style={styles.companyField}>
                                            <Text style={styles.companyFieldLabel}>Adresse: </Text>
                                            {entrepriseData?.address || 'Non définie'}
                                        </Text>
                                        <Text style={styles.companyField}>
                                            <Text style={styles.companyFieldLabel}>Téléphone: </Text>
                                            {entrepriseData?.numTel || 'Non défini'}
                                        </Text>
                                        <Text style={styles.companyField}>
                                            <Text style={styles.companyFieldLabel}>Responsable: </Text>
                                            À définir
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Work Description */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>🔧 Description des Travaux Autorisés</Text>
                        </View>
                        <View style={styles.sectionContent}>
                            <View style={styles.workDescriptionBox}>
                                <Text style={styles.workDescriptionText}>
                                    {currentBdt.tachesAuthoriser || 'Aucune description des tâches spécifiée dans ce bon de travail.'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Risk and Safety Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>⚠️ Analyse des Risques et Équipements de Protection</Text>
                        </View>
                        <View style={styles.sectionContent}>
                            <View style={styles.riskSafetyContainer}>
                                {/* Risks Column */}
                                <View style={styles.riskColumn}>
                                    <View style={styles.riskList}>
                                        <Text style={styles.riskHeader}>🚨 RISQUES IDENTIFIÉS</Text>
                                        {risques.length > 0 ? risques.map((r) => (
                                            <View key={r.id} style={styles.riskItem}>
                                                <Text style={styles.riskTitle}>{r.title}</Text>
                                                {r.description && r.description !== r.title && (
                                                    <Text style={styles.riskDescription}>{r.description}</Text>
                                                )}
                                                {r.travailleDangereux && (
                                                    <View style={styles.riskDangerous}>
                                                        <Text>⚠️ TRAVAIL DANGEREUX</Text>
                                                    </View>
                                                )}
                                            </View>
                                        )) : (
                                            <Text style={styles.riskDescription}>Aucun risque spécifique identifié.</Text>
                                        )}
                                    </View>
                                </View>

                                {/* Safety Equipment Column */}
                                <View style={styles.safetyColumn}>
                                    {/* EPI Section */}
                                    <View style={styles.equipmentContainer}>
                                        <Text style={styles.equipmentHeader}>🛡️ ÉQUIPEMENTS DE PROTECTION</Text>
                                        
                                        <Text style={styles.equipmentSubHeader}>Équipements Individuels (EPI)</Text>
                                        {epiDispositifs.length > 0 ? epiDispositifs.map((d) => (
                                            <View key={d.id}>
                                                <View style={styles.equipmentItem}>
                                                    <Text style={styles.equipmentBullet}>•</Text>
                                                    <Text style={styles.equipmentText}>{d.title}</Text>
                                                </View>
                                                {d.description && (
                                                    <Text style={styles.equipmentDescription}>{d.description}</Text>
                                                )}
                                            </View>
                                        )) : (
                                            <Text style={styles.equipmentDescription}>Aucun EPI spécifique requis.</Text>
                                        )}

                                        <Text style={styles.equipmentSubHeader}>Équipements Collectifs (EPC)</Text>
                                        {epcDispositifs.length > 0 ? epcDispositifs.map((d) => (
                                            <View key={d.id}>
                                                <View style={styles.equipmentItem}>
                                                    <Text style={styles.equipmentBullet}>•</Text>
                                                    <Text style={styles.equipmentText}>{d.title}</Text>
                                                </View>
                                                {d.description && (
                                                    <Text style={styles.equipmentDescription}>{d.description}</Text>
                                                )}
                                            </View>
                                        )) : (
                                            <Text style={styles.equipmentDescription}>Aucun EPC spécifique requis.</Text>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Signature Section */}
                    <View style={styles.signatureSection}>
                        <View style={styles.signatureBox}>
                            <Text style={styles.signatureTitle}>Donneur d'Ordre</Text>
                            <Text style={styles.signatureSubtitle}>Entreprise Utilisatrice</Text>
                            <View style={styles.signatureArea}>
                                <Text style={styles.signatureLabel}>Nom et Signature</Text>
                                <Text style={styles.dateLine}>Date: _______________</Text>
                            </View>
                        </View>
                        
                        <View style={styles.signatureBox}>
                            <Text style={styles.signatureTitle}>Chargé de Travaux</Text>
                            <Text style={styles.signatureSubtitle}>Entreprise Extérieure</Text>
                            <View style={styles.signatureArea}>
                                <Text style={styles.signatureLabel}>Nom et Signature</Text>
                                <Text style={styles.dateLine}>Date: _______________</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>
                        Document généré automatiquement le {formatDate(new Date())} à {formatTime(new Date())}
                        {'\n'}Ce document engage la responsabilité des signataires - La sécurité est l'affaire de tous
                        {'\n'}Danone France - Système de Management de la Sécurité
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default BdtProfessionalTemplate;
