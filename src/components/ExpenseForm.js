import { Picker } from "@react-native-picker/picker";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ExpenseForm({
  amount,
  setAmount,
  title,
  setTitle,
  category,
  setCategory,
  onAddExpense,
}) {
  return (
    <View>
      <Text style={styles.label}>Amount</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Title / Description</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Groceries"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Category</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(value) => setCategory(value)}
        >
          <Picker.Item label="Food" value="Food" />

          <Picker.Item label="Transport" value="Transport" />

          <Picker.Item label="Utilities" value="Utilities" />

          <Picker.Item label="Entertainment" value="Entertainment" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={onAddExpense}>
        <Text style={styles.buttonText}>Add Expense</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 10,
    color: "#222222",
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: "#222222",
  },

  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    overflow: "hidden",
  },

  button: {
    backgroundColor: "#0F2742",
    padding: 16,
    borderRadius: 8,
    marginTop: 25,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
});
