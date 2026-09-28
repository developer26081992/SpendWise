import { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CurrencyBanner from "./src/components/CurrencyBanner";
import ExpenseForm from "./src/components/ExpenseForm";
import ExpenseList from "./src/components/ExpenseList";

import {
  clearFormState,
  loadExpenses,
  loadFormState,
  saveExpenses,
  saveFormState,
} from "./src/services/storageService";

import { fetchExchangeRate } from "./src/services/currencyService";

export default function App() {
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Food");

  const [expenses, setExpenses] = useState([]);

  const [exchangeRate, setExchangeRate] = useState(null);

  const [loadingRate, setLoadingRate] = useState(true);

  const [rateError, setRateError] = useState("");

  // Load saved expenses and form data
  useEffect(() => {
    const initializeApp = async () => {
      const savedExpenses = await loadExpenses();
      setExpenses(savedExpenses);

      const savedFormState = await loadFormState();

      if (savedFormState) {
        setAmount(savedFormState.amount || "");
        setTitle(savedFormState.title || "");
        setCategory(savedFormState.category || "Food");
      }
    };

    initializeApp();
  }, []);

  // Save current form values
  useEffect(() => {
    const saveCurrentFormState = async () => {
      await saveFormState({
        amount,
        title,
        category,
      });
    };

    saveCurrentFormState();
  }, [amount, title, category]);

  // Load live currency rate
  useEffect(() => {
    getExchangeRate();
  }, []);

  const getExchangeRate = async () => {
    try {
      setLoadingRate(true);
      setRateError("");

      const rate = await fetchExchangeRate();

      setExchangeRate(rate);
    } catch (error) {
      setRateError("Unable to load live exchange rate.");
    } finally {
      setLoadingRate(false);
    }
  };

  // Add expense
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
      category,
    };

    const updatedExpenses = [newExpense, ...expenses];

    const saved = await saveExpenses(updatedExpenses);

    if (!saved) {
      Alert.alert("Error", "Could not save the expense.");
      return;
    }

    setExpenses(updatedExpenses);

    setAmount("");
    setTitle("");
    setCategory("Food");

    await clearFormState();

    Alert.alert("Success", "Expense added successfully.");
  };

  // Calculate total of all saved expenses
  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0,
  );

  // Calculate current input conversion
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

        {/* TOTAL SUM BANNER */}
        <View style={styles.totalBanner}>
          <Text style={styles.totalLabel}>TOTAL EXPENSES</Text>

          <Text style={styles.totalAmount}>USD {totalExpenses.toFixed(2)}</Text>
        </View>

        {/* LIVE CURRENCY CONVERSION */}
        <CurrencyBanner
          loadingRate={loadingRate}
          rateError={rateError}
          exchangeRate={exchangeRate}
          amount={amount}
          convertedAmount={convertedAmount}
          onRetry={getExchangeRate}
        />

        {/* EXPENSE FORM */}
        <ExpenseForm
          amount={amount}
          setAmount={setAmount}
          title={title}
          setTitle={setTitle}
          category={category}
          setCategory={setCategory}
          onAddExpense={addExpense}
        />

        {/* SAVED EXPENSES */}
        <ExpenseList expenses={expenses} />
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

  totalBanner: {
    backgroundColor: "#C9A227",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },

  totalLabel: {
    color: "#0F2742",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  totalAmount: {
    color: "#0F2742",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 6,
  },
});
