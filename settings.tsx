import { ScrollView, View, Text, TextInput, Pressable, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useBudget } from '@/lib/budget-context';
import { formatCurrency } from '@/lib/format';
import { useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/use-colors';

export default function SettingsScreen() {
  const { state, setBudget, getTotalSpent } = useBudget();
  const colors = useColors();
  const [budgetInput, setBudgetInput] = useState(state.totalBudget.toString());
  const [isEditing, setIsEditing] = useState(false);
  const totalSpent = getTotalSpent();

  useEffect(() => {
    setBudgetInput(state.totalBudget.toString());
  }, [state.totalBudget]);

  const handleUpdateBudget = () => {
    const newBudget = parseFloat(budgetInput);

    if (!budgetInput.trim() || isNaN(newBudget) || newBudget <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Invalid Budget', 'Please enter a valid budget amount greater than 0');
      return;
    }

    if (newBudget < totalSpent) {
      Alert.alert(
        'Budget Below Spending',
        `Your current spending (${formatCurrency(totalSpent)}) exceeds the new budget. Continue anyway?`,
        [
          { text: 'Cancel', onPress: () => {} },
          {
            text: 'Continue',
            onPress: () => {
              setBudget(newBudget);
              setIsEditing(false);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            },
          },
        ]
      );
    } else {
      setBudget(newBudget);
      setIsEditing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleCancel = () => {
    setBudgetInput(state.totalBudget.toString());
    setIsEditing(false);
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">Settings</Text>
          <Text className="text-sm text-muted mt-1">Manage your budget preferences</Text>
        </View>

        {/* Budget Configuration Section */}
        <View className="bg-surface rounded-2xl p-4 border border-border mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Budget Configuration</Text>

          {/* Current Budget Display */}
          <View className="bg-background rounded-lg p-4 mb-4">
            <Text className="text-sm text-muted mb-1">Current Total Budget</Text>
            <Text className="text-2xl font-bold text-primary">{formatCurrency(state.totalBudget)}</Text>
          </View>

          {/* Budget Input Section */}
          {isEditing ? (
            <View className="gap-3">
              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">New Budget Amount (PKR)</Text>
                <TextInput
                  value={budgetInput}
                  onChangeText={setBudgetInput}
                  placeholder="Enter new budget"
                  placeholderTextColor={colors.muted}
                  keyboardType="decimal-pad"
                  className="bg-background border border-primary rounded-lg px-4 py-3 text-foreground text-base"
                />
              </View>

              <View className="flex-row gap-3">
                <Pressable
                  onPress={handleCancel}
                  style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                  className="flex-1 bg-border rounded-lg py-3"
                >
                  <Text className="text-center font-semibold text-foreground">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleUpdateBudget}
                  style={({ pressed }) => [
                    { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
                  ]}
                  className="flex-1 bg-primary rounded-lg py-3"
                >
                  <Text className="text-center font-semibold text-background">Save</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              onPress={() => setIsEditing(true)}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              className="bg-primary rounded-lg py-3"
            >
              <Text className="text-center font-semibold text-background">Edit Budget</Text>
            </Pressable>
          )}
        </View>

        {/* Budget Summary Section */}
        <View className="bg-surface rounded-2xl p-4 border border-border">
          <Text className="text-lg font-bold text-foreground mb-4">Budget Summary</Text>

          <View className="gap-3">
            {/* Total Budget */}
            <View className="flex-row justify-between items-center bg-background rounded-lg p-3">
              <Text className="text-sm text-muted">Total Budget</Text>
              <Text className="text-base font-semibold text-foreground">{formatCurrency(state.totalBudget)}</Text>
            </View>

            {/* Total Spent */}
            <View className="flex-row justify-between items-center bg-background rounded-lg p-3">
              <Text className="text-sm text-muted">Total Spent</Text>
              <Text className="text-base font-semibold text-foreground">{formatCurrency(totalSpent)}</Text>
            </View>

            {/* Remaining */}
            <View className="flex-row justify-between items-center bg-background rounded-lg p-3">
              <Text className="text-sm text-muted">Remaining</Text>
              <Text
                className={`text-base font-semibold ${
                  state.totalBudget - totalSpent < 0 ? 'text-error' : 'text-success'
                }`}
              >
                {formatCurrency(state.totalBudget - totalSpent)}
              </Text>
            </View>

            {/* Spending Percentage */}
            <View className="flex-row justify-between items-center bg-background rounded-lg p-3">
              <Text className="text-sm text-muted">Spending %</Text>
              <Text className="text-base font-semibold text-foreground">
                {Math.round((totalSpent / state.totalBudget) * 100)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Info Section */}
        <View className="bg-primary/10 rounded-2xl p-4 border border-primary mt-6">
          <Text className="text-sm text-foreground">
            <Text className="font-semibold">💡 Tip:</Text> You can adjust your total budget at any time. All your expenses will be recalculated automatically.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
