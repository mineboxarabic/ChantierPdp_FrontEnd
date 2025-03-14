import { FC, ReactNode } from "react";
import { View, StyleSheet } from "@react-pdf/renderer";

interface VerticalProps {
    gap?: number;
    children: ReactNode;
}

const styles = StyleSheet.create({
    vertical: {
        display: "flex",
        flexDirection: "column",
    },
});

const Vertical: FC<VerticalProps> = ({ gap = 5, children }) => {
    const childStyle = { marginBottom: gap };

    return (
        <View style={styles.vertical}>
            {Array.isArray(children)
                ? children.map((child, index) => (
                    <View key={index} style={index !== children.length - 1 ? childStyle : undefined}>
                        {child}
                    </View>
                ))
                : children}
        </View>
    );
};

export default Vertical;
