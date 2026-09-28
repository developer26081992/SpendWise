import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CurrencyBanner({
  loadingRate,
  rateError,
  exchangeRate,
  amount,
  convertedAmount,
  onRetry,
}) {
  const numericAmount = parseFloat(amount) || 0;

  return (
    <View style={styles.currencyBanner}>
      <Text style={styles.currencyTitle}>Live Currency Conversion</Text>

      {loadingRate ? (
        <Text style={styles.currencyText}>
          Loading live EUR exchange rate...
        </Text>
      ) : rateError ? (
        <View>
          <Text style={styles.errorText}>{rateError}</Text>

          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
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
              USD {numericAmount.toFixed(2)} = EUR {convertedAmount.toFixed(2)}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
