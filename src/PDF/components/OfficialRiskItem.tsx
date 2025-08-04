import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    riskContainer: {
        marginBottom: 8,
        border: '1 solid #000000',
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        minHeight: 32,
        alignItems: 'center',
    },
    riskContainerHigh: {
        backgroundColor: '#fef2f2',
        border: '2 solid #dc2626',
    },
    riskContainerMedium: {
        backgroundColor: '#fefce8',
        border: '1 solid #f59e0b',
    },
    riskContainerLow: {
        backgroundColor: '#f0f9ff',
        border: '1 solid #3b82f6',
    },
    riskIcon: {
        width: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        backgroundColor: '#f5f5f5',
        borderRight: '1 solid #cccccc',
    },
    riskIconText: {
        fontSize: 12,
        textAlign: 'center',
    },
    riskContent: {
        width: '75%',
        padding: 6,
        paddingLeft: 8,
    },
    riskTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    riskDescription: {
        fontSize: 8,
        color: '#333333',
        lineHeight: 1.2,
    },
    riskLevel: {
        width: '15%',
        alignItems: 'center',
        justifyContent: 'center',
        borderLeft: '1 solid #cccccc',
        padding: 4,
    },
    riskLevelBadge: {
        padding: 4,
        borderRadius: 2,
        backgroundColor: '#e6e6e6',
        border: '1 solid #999999',
        minWidth: 30,
    },
    riskLevelText: {
        fontSize: 7,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
        color: '#000000',
    },
    dangerousBadge: {
        backgroundColor: '#dc2626',
        color: '#ffffff',
        marginTop: 2,
        padding: 2,
    },
    dangerousText: {
        fontSize: 6,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ffffff',
        textTransform: 'uppercase',
    },
});

interface OfficialRiskItemProps {
    title: string;
    description?: string;
    riskLevel: 'low' | 'medium' | 'high';
    isDangerous?: boolean;
    icon?: string;
}

const OfficialRiskItem: React.FC<OfficialRiskItemProps> = ({ 
    title, 
    description, 
    riskLevel, 
    isDangerous = false,
    icon = '⚠️'
}) => {
    const containerStyle = [
        styles.riskContainer,
        ...(riskLevel === 'high' ? [styles.riskContainerHigh] : []),
        ...(riskLevel === 'medium' ? [styles.riskContainerMedium] : []),
        ...(riskLevel === 'low' ? [styles.riskContainerLow] : []),
    ];

    const getLevelText = () => {
        switch (riskLevel) {
            case 'high': return 'ÉLEVÉ';
            case 'medium': return 'MOYEN';
            case 'low': return 'FAIBLE';
            default: return 'INDÉF.';
        }
    };

    const getLevelColor = () => {
        switch (riskLevel) {
            case 'high': return '#dc2626';
            case 'medium': return '#f59e0b';
            case 'low': return '#3b82f6';
            default: return '#6b7280';
        }
    };

    return (
        <View style={containerStyle}>
            <View style={styles.riskIcon}>
                <Text style={styles.riskIconText}>{icon}</Text>
            </View>
            
            <View style={styles.riskContent}>
                <Text style={styles.riskTitle}>{title}</Text>
                {description && (
                    <Text style={styles.riskDescription}>{description}</Text>
                )}
            </View>
            
            <View style={styles.riskLevel}>
                <View style={[
                    styles.riskLevelBadge,
                    { backgroundColor: getLevelColor() }
                ]}>
                    <Text style={[
                        styles.riskLevelText,
                        { color: '#ffffff' }
                    ]}>
                        {getLevelText()}
                    </Text>
                </View>
                
                {isDangerous && (
                    <View style={styles.dangerousBadge}>
                        <Text style={styles.dangerousText}>
                            TRAVAIL DANGEREUX
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default OfficialRiskItem;
