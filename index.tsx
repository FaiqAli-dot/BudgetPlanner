import { ScrollView, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useBudget } from '@/lib/budget-context';
import { formatCurrency } from '@/lib/format';
import { ExpenseCard } from '@/components/expense-card';
import { AddExpenseModal } from '@/components/add-expense-modal';
import { QuickAddCategories } from '@/components/quick-add-categories';
import { useState } from 'react';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

export default function HomeScreen() {
  const { state, getTotalSpent, getRemainingCash } = useBudget();
  const [modalVisible, setModalVisible] = useState(false);
  const colors = useColors();

  const totalSpent = getTotalSpent();
  const remainingCash = getRemainingCash();
  const isOverBudget = remainingCash < 0;

  if (state.isLoading) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <>
      <ScreenContainer className="flex-1 bg-background">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground">Wedding Budget</Text>
            <Text className="text-sm text-muted mt-1">Track your wedding expenses</Text>
          </View>

          {/* Quick Add Categories */}
          <QuickAddCategories onCategorySelect={() => {}} />

          {/* Summary Cards */}
          <View className="gap-3 mb-6">
            {/* Total Budget Card */}
            <View className="bg-primary rounded-2xl p-4">
              <Text className="text-sm text-background opacity-80 mb-1">Total Budget</Text>
              <Text className="text-2xl font-bold text-background">{formatCurrency(state.totalBudget)}</Text>
            </View>

            {/* Two Column Cards */}
            <View className="flex-row gap-3">
              {/* Total Spent Card */}
              <View className="flex-1 bg-surface border border-border rounded-2xl p-4">
                <Text className="text-xs text-muted mb-1 uppercase font-semibold">Total Spent</Text>
                <Text className="text-xl font-bold text-foreground">{formatCurrency(totalSpent)}</Text>
                <Text className="text-xs text-muted mt-2">
                  {Math.round((totalSpent / state.totalBudget) * 100)}% of budget
                </Text>
              </View>

              {/* Remaining Cash Card */}
              <View className={cn(
                'flex-1 rounded-2xl p-4 border',
                isOverBudget
                  ? 'bg-error/10 border-error'
                  : 'bg-success/10 border-success'
              )}>
                <Text className="text-xs text-muted mb-1 uppercase font-semibold">Remaining</Text>
                <Text className={cn(
                  'text-xl font-bold',
                  isOverBudget ? 'text-error' : 'text-success'
                )}>
                  {formatCurrency(remainingCash)}
                </Text>
                {isOverBudget && (
                  <Text className="text-xs text-error mt-2 font-semibold">Over Budget</Text>
                )}
              </View>
            </View>
          </View>

          {/* Expenses Section */}
          <View>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-foreground">All Expenses</Text>
              <Text className="text-sm text-muted">{state.expenses.length} items</Text>
            </View>

            {state.expenses.length === 0 ? (
              <View className="bg-surface rounded-2xl p-8 items-center">
                <Text className="text-lg font-semibold text-foreground mb-2">No Expenses Yet</Text>
                <Text className="text-sm text-muted text-center">
                  Add your first expense to get started
                </Text>
              </View>
            ) : (
              <View>
                {state.expenses.map((expense) => (
                  <ExpenseCard key={expense.id} expense={expense} />
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <Pressable
          onPress={() => setModalVisible(true)}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            },
          ]}
          className="absolute bottom-6 right-6 bg-primary rounded-full w-14 h-14 items-center justify-center shadow-lg"
        >
          <Text className="text-2xl font-bold text-background">+</Text>
        </Pressable>
      </ScreenContainer>

      {/* Add Expense Modal */}
      <AddExpenseModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
}
