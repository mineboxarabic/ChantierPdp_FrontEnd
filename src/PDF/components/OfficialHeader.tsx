import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    headerContainer: {
        marginBottom: 20,
        backgroundColor: '#ffffff',
        border: '2 solid #000000',
    },
    headerTop: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderBottom: '1 solid #000000',
        padding: 10,
    },
    logoSection: {
        width: '25%',
        alignItems: 'center',
        borderRight: '1 solid #cccccc',
        paddingRight: 10,
    },
    titleSection: {
        width: '50%',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    metaSection: {
        width: '25%',
        paddingLeft: 10,
        borderLeft: '1 solid #cccccc',
    },
    documentTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    documentSubtitle: {
        fontSize: 10,
        color: '#333333',
        textAlign: 'center',
        marginBottom: 6,
    },
    versionBadge: {
        backgroundColor: '#e6e6e6',
        padding: 4,
        border: '1 solid #999999',
        borderRadius: 2,
    },
    versionText: {
        fontSize: 8,
        color: '#000000',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    metaItem: {
        marginBottom: 8,
        backgroundColor: '#ffffff',
        border: '1 solid #cccccc',
        padding: 4,
    },
    metaLabel: {
        fontSize: 7,
        color: '#666666',
        marginBottom: 2,
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    metaValue: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        backgroundColor: '#f8f8f8',
        padding: 2,
        border: '0.5 solid #999999',
    },
    confidentialBanner: {
        backgroundColor: '#dc2626',
        padding: 6,
        borderTop: '1 solid #000000',
    },
    confidentialText: {
        color: '#ffffff',
        fontSize: 9,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    companyLogo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0066cc',
        textAlign: 'center',
        backgroundColor: '#f0f8ff',
        padding: 8,
        border: '2 solid #0066cc',
        borderRadius: 4,
    },
});

interface OfficialHeaderProps {
    documentNumber?: string | number;
    date?: string;
    version?: string;
    classification?: 'PUBLIC' | 'INTERNE' | 'CONFIDENTIEL';
}

const OfficialHeader: React.FC<OfficialHeaderProps> = ({ 
    documentNumber, 
    date,
    version = "V2.0 - 2024",
    classification = 'INTERNE'
}) => {
    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerTop}>
                <View style={styles.logoSection}>
                    <Text style={styles.companyLogo}>DANONE</Text>
                </View>
                
                <View style={styles.titleSection}>
                    <Text style={styles.documentTitle}>
                        Bordereau de Travaux
                    </Text>
                    <Text style={styles.documentSubtitle}>
                        Document officiel d'autorisation de travaux
                    </Text>
                    <View style={styles.versionBadge}>
                        <Text style={styles.versionText}>{version}</Text>
                    </View>
                </View>

                <View style={styles.metaSection}>
                    {documentNumber && (
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>N° Document</Text>
                            <Text style={styles.metaValue}>BDT-{documentNumber}</Text>
                        </View>
                    )}
                    {date && (
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Date d'émission</Text>
                            <Text style={styles.metaValue}>{date}</Text>
                        </View>
                    )}
                    <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>Classification</Text>
                        <Text style={styles.metaValue}>{classification}</Text>
                    </View>
                </View>
            </View>
            
            <View style={styles.confidentialBanner}>
                <Text style={styles.confidentialText}>
                    Document confidentiel - Usage interne uniquement
                </Text>
            </View>
        </View>
    );
};

export default OfficialHeader;
