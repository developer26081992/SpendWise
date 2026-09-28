import { StyleSheet, Text, View } from "react-native";

export default function ExpenseList({ expenses }) {
  return (
    <View>
      <Text style={styles.savedTitle}>Saved Expenses</Text>

      {expenses.length === 0 ? (
        <Text style={styles.emptyText}>No expenses saved yet.</Text>
      ) : (
        expenses.map((expense) => (
          <View key={expense.id} style={styles.expenseCard}>
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseTitle}>{expense.title}</Text>

              <Text style={styles.expenseCategory}>{expense.category}</Text>
            </View>

            <Text style={styles.expenseAmount}>
              USD {Number(expense.amount).toFixed(2)}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  savedTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F2742",
    marginTop: 35,
    marginBottom: 15,
  },

  emptyText: {
    fontSize: 15,
    color: "#666666",
    marginBottom: 20,
  },

  expenseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  expenseInfo: {
    flex: 1,
    marginRight: 10,
  },

  expenseTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222222",
  },

  expenseCategory: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },

  expenseAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F2742",
  },
});
