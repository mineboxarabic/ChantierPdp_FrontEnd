import { FC, ReactNode } from "react";
import { View, StyleSheet } from "@react-pdf/renderer";

interface GridProps {
  columns: number;
  gap?: number;
  children: ReactNode;
}

const styles = StyleSheet.create({
  grid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
});

const Grid: FC<GridProps> = ({ columns, gap = 5, children }) => {
  const itemStyle = {
    width: `${100 / columns}%`,
    padding: gap / 2,
  };

  return (
    <View style={styles.grid}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <View key={index} style={itemStyle}>
              {child}
            </View>
          ))
        : children}
    </View>
  );
};

export default Grid;
