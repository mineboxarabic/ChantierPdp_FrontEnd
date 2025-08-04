import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#ffffff',
        marginBottom: 12,
        border: '2 solid #000000',
        minHeight: 'auto',
        flexShrink: 0,
    },
    cardHeader: {
        backgroundColor: '#f5f5f5',
        padding: 8,
        borderBottom: '1 solid #000000',
        flexShrink: 0,
    },
    cardHeaderAccent: {
        backgroundColor: '#e6e6e6',
        padding: 2,
        marginBottom: 6,
        border: '1 solid #666666',
    },
    cardTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    cardSubtitle: {
        fontSize: 9,
        color: '#333333',
        textAlign: 'center',
        marginTop: 2,
        fontStyle: 'italic',
    },
    cardContent: {
        padding: 8,
        flexGrow: 1,
        flexShrink: 1,
        backgroundColor: '#ffffff',
    },
    sectionNumber: {
        position: 'absolute',
        top: 2,
        right: 4,
        fontSize: 8,
        fontWeight: 'bold',
        color: '#666666',
        backgroundColor: '#f0f0f0',
        padding: 2,
        borderRadius: 2,
    },
});

interface OfficialCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    sectionNumber?: string;
    accentColor?: string;
}

const OfficialCard: React.FC<OfficialCardProps> = ({ 
    title, 
    subtitle, 
    children, 
    sectionNumber,
    accentColor = '#666666'
}) => {
    return (
        <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
                <View style={[styles.cardHeaderAccent, { borderColor: accentColor }]}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    {subtitle && (
                        <Text style={styles.cardSubtitle}>{subtitle}</Text>
                    )}
                </View>
                {sectionNumber && (
                    <Text style={styles.sectionNumber}>{sectionNumber}</Text>
                )}
            </View>
            <View style={styles.cardContent}>
                {children}
            </View>
        </View>
    );
};

export default OfficialCard;
