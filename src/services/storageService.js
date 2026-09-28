import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "spendwise_expenses";
const FORM_STATE_KEY = "spendwise_form_state";

export const loadExpenses = async () => {
  try {
    const storedExpenses = await AsyncStorage.getItem(STORAGE_KEY);

    if (storedExpenses) {
      return JSON.parse(storedExpenses);
    }

    return [];
  } catch (error) {
    console.log("Load expenses error:", error);
    return [];
  }
};

export const saveExpenses = async (expenses) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));

    return true;
  } catch (error) {
    console.log("Save expenses error:", error);
    return false;
  }
};

// Save the values currently typed into the expense form
export const saveFormState = async (formState) => {
  try {
    await AsyncStorage.setItem(FORM_STATE_KEY, JSON.stringify(formState));

    return true;
  } catch (error) {
    console.log("Save form state error:", error);
    return false;
  }
};

// Restore the values typed into the form
export const loadFormState = async () => {
  try {
    const storedFormState = await AsyncStorage.getItem(FORM_STATE_KEY);

    if (storedFormState) {
      return JSON.parse(storedFormState);
    }

    return null;
  } catch (error) {
    console.log("Load form state error:", error);
    return null;
  }
};

// Clear the saved form after an expense is submitted
export const clearFormState = async () => {
  try {
    await AsyncStorage.removeItem(FORM_STATE_KEY);
  } catch (error) {
    console.log("Clear form state error:", error);
  }
};
