import { View, Text, TextInput, Pressable, Modal, ScrollView, Alert } from 'react-native';
import { useBudget } from '@/lib/budget-context';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/use-colors';

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AddExpenseModal({ visible, onClose }: AddExpenseModalProps) {
  const { addExpense } = useBudget();
  const colors = useColors();
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [estimated, setEstimated] = useState('');
  const [paid, setPaid] = useState('');

  const handleAdd = () => {
    if (!category.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Missing Category', 'Please enter a category name');
      return;
    }

    const estimatedAmount = parseFloat(estimated) || 0;
    const paidAmount = parseFloat(paid) || 0;

    if (paidAmount > estimatedAmount) {
      Alert.alert(
        'Amount Paid Exceeds Estimated',
        `Amount paid (${paidAmount}) is greater than estimated (${estimatedAmount}). Continue?`,
        [
          { text: 'Cancel', onPress: () => {} },
          {
            text: 'Continue',
            onPress: () => {
              proceedWithAdd(estimatedAmount, paidAmount);
            },
          },
        ]
      );
      return;
    }

    proceedWithAdd(estimatedAmount, paidAmount);
  };

  const proceedWithAdd = (estimatedAmount: number, paidAmount: number) => {

    addExpense({
      category: category.trim(),
      description: description.trim(),
      estimated: estimatedAmount,
      paid: paidAmount,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setCategory('');
    setDescription('');
    setEstimated('');
    setPaid('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="bg-primary px-4 py-4 pt-12 flex-row justify-between items-center">
          <Text className="text-xl font-bold text-background">Add Expense</Text>
          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Text className="text-background font-semibold text-lg">✕</Text>
          </Pressable>
        </View>

        {/* Form */}
        <ScrollView className="flex-1 p-4">
          <View className="gap-4">
            {/* Category Input */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Category *</Text>
              <TextInput
                value={category}
                onChangeText={setCategory}
                placeholder="e.g., Venue, Catering, Photography"
                placeholderTextColor={colors.muted}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>

            {/* Description Input */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="e.g., Main Hall Rental"
                placeholderTextColor={colors.muted}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>

            {/* Estimated Cost Input */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Estimated Cost (PKR)</Text>
              <TextInput
                value={estimated}
                onChangeText={setEstimated}
                placeholder="0"
                placeholderTextColor={colors.muted}
                keyboardType="decimal-pad"
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>

            {/* Amount Paid Input */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Amount Paid (PKR)</Text>
              <TextInput
                value={paid}
                onChangeText={setPaid}
                placeholder="0"
                placeholderTextColor={colors.muted}
                keyboardType="decimal-pad"
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>
          </View>
        </ScrollView>

        {/* Footer Buttons */}
        <View className="flex-row gap-3 p-4 border-t border-border">
          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            className="flex-1 bg-border rounded-lg py-3"
          >
            <Text className="text-center font-semibold text-foreground">Cancel</Text>
          </Pressable>
          <Pressable
            onPress={handleAdd}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}
            className="flex-1 bg-primary rounded-lg py-3"
          >
            <Text className="text-center font-semibold text-background">Add Expense</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
