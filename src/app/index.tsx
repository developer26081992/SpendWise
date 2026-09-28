import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const STORAGE_KEY = "spendwise_expenses";

export default function App() {
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Food");

  const [expenses, setExpenses] = useState([]);

  const [exchangeRate, setExchangeRate] = useState(null);
  const [loadingRate, setLoadingRate] = useState(true);
  const [rateError, setRateError] = useState("");

  // Load saved expenses when the app starts
  useEffect(() => {
    loadExpenses();
  }, []);

  // Question 3: Get live EUR exchange rate
  useEffect(() => {
    fetchExchangeRate();
  }, []);

  const loadExpenses = async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem(STORAGE_KEY);

      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
      }
    } catch (error) {
      console.log("Load expenses error:", error);
    }
  };

  const saveExpenses = async (updatedExpenses) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedExpenses));

      setExpenses(updatedExpenses);
    } catch (error) {
      console.log("Save expenses error:", error);

      Alert.alert("Error", "Could not save the expense.");
    }
  };

  const fetchExchangeRate = async () => {
    try {
      setLoadingRate(true);
      setRateError("");

      const response = await axios.get(
        "https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR",
        {
          timeout: 10000,
        },
      );

      const rate = response.data?.rates?.EUR;

      if (typeof rate === "number") {
        setExchangeRate(rate);
      } else {
        setRateError("Exchange rate was not found.");
      }
    } catch (error) {
      console.log("Currency API error:", error.message);

      setRateError("Unable to load live exchange rate.");
    } finally {
      setLoadingRate(false);
    }
  };

  // Question 2: Add and save expense locally
  const addExpense = async () => {
    if (!amount.trim() || !title.trim()) {
      Alert.alert(
        "Missing Information",
        "Please enter both an amount and a title.",
      );
      return;
    }

    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }

    const newExpense = {
      id: Date.now().toString(),
      amount: numericAmount,
      title: title.trim(),
      category: category,
    };

    const updatedExpenses = [newExpense, ...expenses];

    await saveExpenses(updatedExpenses);

    setAmount("");
    setTitle("");
    setCategory("Food");

    Alert.alert("Success", "Expense added successfully.");
  };

  const numericAmount = parseFloat(amount) || 0;

  const convertedAmount =
    exchangeRate !== null ? numericAmount * Number(exchangeRate) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>SpendWise</Text>

        {/* QUESTION 3: CURRENCY BANNER */}
        <View style={styles.currencyBanner}>
          <Text style={styles.currencyTitle}>Live Currency Conversion</Text>

          {loadingRate ? (
            <Text style={styles.currencyText}>
              Loading live EUR exchange rate...
            </Text>
          ) : rateError ? (
            <View>
              <Text style={styles.errorText}>{rateError}</Text>

              <TouchableOpacity
                style={styles.retryButton}
                onPress={fetchExchangeRate}
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.currencyText}>
                USD 1 = EUR {Number(exchangeRate).toFixed(4)}
              </Text>

              {amount.trim() !== "" && (
                <Text style={styles.convertedAmount}>
                  USD {numericAmount.toFixed(2)} = EUR{" "}
                  {convertedAmount.toFixed(2)}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* QUESTION 2: EXPENSE FORM */}
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

        <TouchableOpacity style={styles.button} onPress={addExpense}>
          <Text style={styles.buttonText}>Add Expense</Text>
        </TouchableOpacity>

        {/* QUESTION 2: SAVED EXPENSES */}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F8",
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  heading: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#0F2742",
  },

  currencyBanner: {
    backgroundColor: "#0F2742",
    padding: 18,
    borderRadius: 10,
    marginBottom: 20,
  },

  currencyTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 8,
  },

  currencyText: {
    color: "#FFFFFF",
    fontSize: 16,
  },

  convertedAmount: {
    color: "#C9A227",
    fontSize: 19,
    fontWeight: "bold",
    marginTop: 10,
  },

  errorText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 22,
  },

  retryButton: {
    backgroundColor: "#C9A227",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 12,
  },

  retryText: {
    color: "#0F2742",
    fontWeight: "bold",
  },

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
