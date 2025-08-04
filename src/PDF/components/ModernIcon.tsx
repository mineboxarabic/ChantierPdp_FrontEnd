import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        minHeight: 80,
        padding: 6,
    },
    iconCircle: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
        border: '1 solid #cccccc',
        backgroundColor: '#f8f8f8',
    },
    iconText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333333',
    },
    iconLabel: {
        fontSize: 7,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        marginBottom: 3,
        lineHeight: 1.2,
    },
    iconDescription: {
        fontSize: 6,
        textAlign: 'center',
        color: '#333333',
        lineHeight: 1.1,
        maxWidth: 100,
    },
    statusIndicator: {
        width: 6,
        height: 6,
        marginTop: 3,
        alignSelf: 'center',
        backgroundColor: '#cccccc',
    },
    statusOK: {
        backgroundColor: '#009900',
    },
    statusWarning: {
        backgroundColor: '#ff9900',
    },
    statusDanger: {
        backgroundColor: '#cc0000',
    },
});

interface ModernIconProps {
    icon: string;
    label: string;
    description?: string;
    color?: string;
    backgroundColor?: string;
    status?: 'ok' | 'warning' | 'danger';
}

const ModernIcon: React.FC<ModernIconProps> = ({ 
    icon, 
    label, 
    description,
    color = '#333333',
    backgroundColor = '#f8f8f8',
    status
}) => {
    const getStatusStyle = () => {
        switch (status) {
            case 'ok':
                return styles.statusOK;
            case 'warning':
                return styles.statusWarning;
            case 'danger':
                return styles.statusDanger;
            default:
                return {};
        }
    };

    const getIconDisplay = (iconType: string) => {
        // Use actual emojis that work with Font.registerEmojiSource
        switch (iconType.toLowerCase()) {
            case 'alerte':
            case 'alert':
                return '🚨';
            case 'incendie':
            case 'fire':
                return '🔥';
            case 'urgence':
            case 'emergency':
                return '⚡';
            case 'warning':
                return '⚠️';
            case 'ok':
            case 'check':
                return '✅';
            case 'danger':
            case 'cross':
                return '❌';
            case 'feu':
                return '🔥';
            case 'elec':
            case 'électricité':
                return '⚡';
            case 'chute':
                return '⬇️';
            case 'bruit':
                return '🔊';
            case 'chim':
            case 'chimique':
                return '⚗️';
            case 'mach':
            case 'machine':
                return '⚙️';
            case 'rad':
            case 'radiation':
                return '☢️';
            case 'gaz':
                return '💨';
            case 'temp':
            case 'température':
                return '🌡️';
            case 'ergo':
            case 'ergonomie':
                return '🏃';
            case 'risque':
                return '⚠️';
            default:
                // If it's already an emoji, return it as-is
                if (/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(iconType)) {
                    return iconType;
                }
                // For other text, use a default icon
                return '📋';
        }
    };

    return (
        <View style={styles.iconContainer}>
            <View style={[
                styles.iconCircle,
                { backgroundColor }
            ]}>
                <Text style={[styles.iconText, { color }]}>
                    {getIconDisplay(icon)}
                </Text>
            </View>
            <Text style={styles.iconLabel}>{label}</Text>
            {description && (
                <Text style={styles.iconDescription}>{description}</Text>
            )}
            {status && (
                <View style={[styles.statusIndicator, getStatusStyle()]} />
            )}
        </View>
    );
};

export default ModernIcon;
