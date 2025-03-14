import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const getColor = (severity:string) => {
    switch (severity) {
        case "error": return "#D32F2F";
        case "warning": return "#FFC400";
        case "info": return "#00FFF7";
        case "success": return "#22FF00";
        case "danger": return "#FF0000";
        case "indecation": return "#1976D2";
        default: return "#FFFFFF";
    }
};

const TitleHeadingPDF = ({ title, subtitle, severity }) => {
    return (
        <View style={[styles.container, { backgroundColor: getColor(severity) }]}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 7,
        padding: 8,
        paddingLeft: 16,
        marginBottom: 10,
    },
    title: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    subtitle: {
        color: "#FFFFFF",
        fontSize: 14,
    },
});

export default TitleHeadingPDF;
