import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 4,
        padding: 12,
        marginBottom: 12,
        border: '1 solid #cccccc',
        minHeight: 'auto',
        flexShrink: 0,
    },
    cardHeader: {
        backgroundColor: '#f8f9fa',
        borderRadius: 2,
        padding: 8,
        marginBottom: 8,
        borderLeft: '3 solid #0066cc',
        flexShrink: 0,
    },
    cardTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333333',
    },
    cardSubtitle: {
        fontSize: 10,
        color: '#666666',
        marginTop: 1,
    },
    cardContent: {
        padding: 2,
        flexGrow: 1,
        flexShrink: 1,
    },
});

interface ModernCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    headerColor?: string;
    accentColor?: string;
}

const ModernCard: React.FC<ModernCardProps> = ({ 
    title, 
    subtitle, 
    children, 
    headerColor = '#f8f9fa',
    accentColor = '#0066cc'
}) => {
    return (
        <View style={styles.card}>
            <View style={[
                styles.cardHeader, 
                { backgroundColor: headerColor, borderLeftColor: accentColor }
            ]}>
                <Text style={styles.cardTitle}>{title}</Text>
                {subtitle && (
                    <Text style={styles.cardSubtitle}>{subtitle}</Text>
                )}
            </View>
            <View style={styles.cardContent}>
                {children}
            </View>
        </View>
    );
};

export default ModernCard;
