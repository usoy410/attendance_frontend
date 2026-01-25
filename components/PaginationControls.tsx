import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { borderRadius, colors, elevation, spacing, touchTarget, typography } from "../constants/theme";

interface PaginationControlsProps {
  page: number;
  total: number;
  limit: number;
  onPageChange: (newPage: number) => void;
}

export function PaginationControls({
  page,
  total,
  limit,
  onPageChange,
}: PaginationControlsProps) {
  const totalPages = Math.ceil(total / limit);
  const isFirstPage = page === 1;
  const isLastPage = page >= totalPages;

  return (
    <View style={styles.pagination}>
      <TouchableOpacity
        style={[styles.pageButton, isFirstPage && styles.disabledButton]}
        onPress={() => !isFirstPage && onPageChange(page - 1)}
        disabled={isFirstPage}
      >
        <Text style={styles.pageButtonText}>Prev</Text>
      </TouchableOpacity>
      <Text style={styles.pageInfo}>
        Page {page} of {totalPages}
      </Text>
      <TouchableOpacity
        style={[styles.pageButton, isLastPage && styles.disabledButton]}
        onPress={() => !isLastPage && onPageChange(page + 1)}
        disabled={isLastPage}
      >
        <Text style={styles.pageButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.bgPrimary,
    borderTopWidth: 1,
    borderTopColor: colors.borderMedium,
    ...elevation.level2,
  },
  pageButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.sm,
    minHeight: touchTarget.minimum,
    minWidth: 80,
    justifyContent: "center",
    alignItems: "center",
    ...elevation.level1,
  },
  disabledButton: {
    backgroundColor: colors.borderDark,
    ...elevation.level0,
  },
  pageButtonText: {
    color: colors.textWhite,
    ...typography.button,
  },
  pageInfo: {
    ...typography.bodyLg,
    color: colors.textSecondary,
  },
});
