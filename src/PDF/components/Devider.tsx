import { FC } from "react";
import { View, StyleSheet } from "@react-pdf/renderer";

interface DividerProps {
    width?: string;  // Default is 100% (for horizontal dividers)
    height?: number; // Default is 1 (for thin dividers)
    color?: string;  // Default is black
    margin?: number; // Default is 5
}

const Divider: FC<DividerProps> = ({ width = "100%", height = 1, color = "#2d2f31", margin = 5 }) => {
    const styles = StyleSheet.create({
        divider: {
            width,
            height,
            backgroundColor: color,
            marginVertical: margin,
            opacity: 0.5,
        },
    });

    return <View style={styles.divider} />;
};

export default Divider;
