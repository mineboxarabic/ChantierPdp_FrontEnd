import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    riskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 8,
        marginBottom: 4,
        backgroundColor: '#ffffff',
        border: '1 solid #cccccc',
    },
    riskItemDangerous: {
        borderColor: '#ff9900',
        backgroundColor: '#fff8f0',
    },
    riskIcon: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        backgroundColor: '#f5f5f5',
        border: '1 solid #cccccc',
    },
    riskIconText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#333333',
    },
    riskContent: {
        flex: 1,
        paddingRight: 6,
    },
    riskTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 1,
    },
    riskDescription: {
        fontSize: 8,
        color: '#333333',
        lineHeight: 1.2,
    },
    statusIndicators: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusBox: {
        width: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        border: '1 solid #999999',
        marginLeft: 4,
        backgroundColor: '#ffffff',
    },
    statusBoxChecked: {
        backgroundColor: '#e6f3e6',
        borderColor: '#009900',
    },
    statusText: {
        fontSize: 7,
        color: '#000000',
        fontWeight: 'bold',
    },
    statusLabel: {
        fontSize: 6,
        color: '#666666',
        textAlign: 'center',
        marginTop: 1,
    },
});

interface RiskItemProps {
    title: string;
    description?: string;
    riskLevel?: 'low' | 'medium' | 'high';
    isDangerous?: boolean;
    isCompleted?: boolean;
    icon?: string;
}

const RiskItem: React.FC<RiskItemProps> = ({ 
    title, 
    description,
    riskLevel = 'medium',
    isDangerous = false,
    isCompleted,
    icon
}) => {
    const getRiskIcon = () => {
        if (icon) return icon;
        switch (riskLevel) {
            case 'low':
                return '●';
            case 'medium':
                return '▲';
            case 'high':
                return '■';
            default:
                return '!';
        }
    };

    return (
        <View style={[
            styles.riskItem,
            ...(isDangerous ? [styles.riskItemDangerous] : [])
        ]}>
            <View style={styles.riskIcon}>
                <Text style={styles.riskIconText}>
                    {getRiskIcon()}
                </Text>
            </View>
            
            <View style={styles.riskContent}>
                <Text style={styles.riskTitle}>{title}</Text>
                {description && (
                    <Text style={styles.riskDescription}>{description}</Text>
                )}
            </View>
            
            <View style={styles.statusIndicators}>
                <View>
                    <View style={[
                        styles.statusBox,
                        ...(isCompleted === true ? [styles.statusBoxChecked] : [])
                    ]}>
                        {isCompleted === true && (
                            <Text style={styles.statusText}>✓</Text>
                        )}
                    </View>
                    <Text style={styles.statusLabel}>OUI</Text>
                </View>
                
                <View>
                    <View style={[
                        styles.statusBox,
                        ...(isCompleted === false ? [styles.statusBoxChecked] : [])
                    ]}>
                        {isCompleted === false && (
                            <Text style={styles.statusText}>✗</Text>
                        )}
                    </View>
                    <Text style={styles.statusLabel}>NON</Text>
                </View>
            </View>
        </View>
    );
};

export default RiskItem;
