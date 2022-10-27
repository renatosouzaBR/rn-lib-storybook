import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  StyleSheet,
} from "react-native";

import { shadow } from "../utils/shadow";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
}

export function Button({ title, ...props }: ButtonProps) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} {...props}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#61DAFB",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.style,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
