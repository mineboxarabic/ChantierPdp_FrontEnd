import { FC, ReactNode } from "react";
import { View, StyleSheet } from "@react-pdf/renderer";

interface HorizontalProps {
    gap?: number;
    children: ReactNode;
}

const styles = StyleSheet.create({
    horizontal: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
});

const Horizontal: FC<HorizontalProps> = ({ gap = 5, children }) => {
    const childStyle = { marginRight: gap };

    return (
        <View style={styles.horizontal}>
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

export default Horizontal;
