import { View, Text, Pressable, TextInput, Alert } from 'react-native';
import { useBudget, type Expense } from '@/lib/budget-context';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/use-colors';

interface ExpenseCardProps {
  expense: Expense;
}

type EditField = 'category' | 'description' | 'estimated' | 'paid' | null;

export function ExpenseCard({ expense }: ExpenseCardProps) {
  const { updateExpense, deleteExpense, state } = useBudget();
  const colors = useColors();
  const [editField, setEditField] = useState<EditField>(null);
  const [editValues, setEditValues] = useState({
    category: expense.category,
    description: expense.description,
    estimated: expense.estimated.toString(),
    paid: expense.paid.toString(),
  });

  // Get the latest expense data from state to ensure calculations are always current
  const currentExpense = state.expenses.find((exp) => exp.id === expense.id) || expense;
  const pending = currentExpense.estimated - currentExpense.paid;

  const handleFieldChange = (field: keyof typeof editValues, value: string) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveField = (field: EditField) => {
    if (!field) return;

    const newValues = {
      category: editValues.category.trim() || expense.category,
      description: editValues.description.trim(),
      estimated: parseFloat(editValues.estimated) || expense.estimated,
      paid: parseFloat(editValues.paid) || expense.paid,
    };

    if (!newValues.category) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Invalid Input', 'Category cannot be empty');
      setEditValues({
        category: expense.category,
        description: expense.description,
        estimated: expense.estimated.toString(),
        paid: expense.paid.toString(),
      });
      setEditField(null);
      return;
    }

    if (newValues.paid > newValues.estimated) {
      Alert.alert(
        'Amount Paid Exceeds Estimated',
        `Amount paid (${formatCurrency(newValues.paid)}) is greater than estimated (${formatCurrency(newValues.estimated)}). Continue?`,
        [
          { text: 'Cancel', onPress: () => {} },
          {
            text: 'Continue',
            onPress: () => {
              updateExpense(expense.id, newValues);
              setEditField(null);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            },
          },
        ]
      );
    } else {
      updateExpense(expense.id, newValues);
      setEditField(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleCancel = () => {
    setEditValues({
      category: expense.category,
      description: expense.description,
      estimated: expense.estimated.toString(),
      paid: expense.paid.toString(),
    });
    setEditField(null);
  };

  const handleDelete = () => {
    Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: () => {
          deleteExpense(expense.id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <View className="bg-surface rounded-2xl p-4 mb-3 border border-border">
      {/* Header: Category and Description */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          {editField === 'category' ? (
            <TextInput
              value={editValues.category}
              onChangeText={(val) => handleFieldChange('category', val)}
              placeholder="Category"
              placeholderTextColor={colors.muted}
              className="bg-background border border-primary rounded-lg px-3 py-2 text-foreground font-bold text-lg mb-1"
              autoFocus
            />
          ) : (
            <Pressable onPress={() => setEditField('category')}>
              <Text className="text-lg font-bold text-foreground">{currentExpense.category}</Text>
            </Pressable>
          )}

          {editField === 'description' ? (
            <TextInput
              value={editValues.description}
              onChangeText={(val) => handleFieldChange('description', val)}
              placeholder="Description"
              placeholderTextColor={colors.muted}
              className="bg-background border border-primary rounded-lg px-3 py-2 text-muted text-sm mt-1"
              autoFocus
            />
          ) : (
            <Pressable onPress={() => setEditField('description')}>
              <Text className="text-sm text-muted mt-1">{currentExpense.description || 'Tap to add description'}</Text>
            </Pressable>
          )}
        </View>

        {editField ? (
          <View className="flex-row gap-2 ml-2">
            <Pressable
              onPress={handleCancel}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              className="bg-border rounded-lg px-2 py-1"
            >
              <Text className="text-foreground font-semibold text-xs">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => handleSaveField(editField)}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              className="bg-primary rounded-lg px-2 py-1"
            >
              <Text className="text-background font-semibold text-xs">Save</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={handleDelete}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            className="ml-2"
          >
            <Text className="text-error font-semibold text-sm">Delete</Text>
          </Pressable>
        )}
      </View>

      {/* Cost Breakdown */}
      <View className="bg-background rounded-lg p-3 space-y-2">
        {/* Estimated Cost */}
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-muted">Estimated:</Text>
          {editField === 'estimated' ? (
            <View className="flex-row items-center gap-2">
              <TextInput
                value={editValues.estimated}
                onChangeText={(val) => handleFieldChange('estimated', val)}
                keyboardType="decimal-pad"
                placeholder="0"
                className="flex-1 bg-background border border-primary rounded-lg px-2 py-1 text-foreground text-sm"
                maxLength={10}
                autoFocus
              />
              <Pressable
                onPress={() => handleSaveField('estimated')}
                className="bg-primary px-2 py-1 rounded-lg"
              >
                <Text className="text-background font-semibold text-xs">OK</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => setEditField('estimated')}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Text className="text-sm font-semibold text-foreground underline">{formatCurrency(currentExpense.estimated)}</Text>
            </Pressable>
          )}
        </View>

        {/* Amount Paid */}
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-muted">Paid:</Text>
          {editField === 'paid' ? (
            <View className="flex-row items-center gap-2">
              <TextInput
                value={editValues.paid}
                onChangeText={(val) => handleFieldChange('paid', val)}
                keyboardType="decimal-pad"
                placeholder="0"
                className="flex-1 bg-background border border-primary rounded-lg px-2 py-1 text-foreground text-sm"
                maxLength={10}
                autoFocus
              />
              <Pressable
                onPress={() => handleSaveField('paid')}
                className="bg-primary px-2 py-1 rounded-lg"
              >
                <Text className="text-background font-semibold text-xs">OK</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => setEditField('paid')}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Text className="text-sm font-semibold text-primary underline">{formatCurrency(currentExpense.paid)}</Text>
            </Pressable>
          )}
        </View>

        {/* Pending Amount */}
        <View className="flex-row justify-between">
          <Text className="text-sm text-muted">Pending:</Text>
          <Text
            className={cn('text-sm font-semibold', pending > 0 ? 'text-warning' : pending === 0 ? 'text-success' : 'text-error')}
          >
            {formatCurrency(pending)}
          </Text>
        </View>
      </View>
    </View>
  );
}
