import { Platform, StyleSheet } from "react-native";

export const shadow = StyleSheet.create({
  style: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
});
