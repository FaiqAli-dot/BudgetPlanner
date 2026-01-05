import { View, Text, Pressable, ScrollView } from 'react-native';
import { EXPENSE_CATEGORIES } from '@/constants/expense-categories';
import { useBudget } from '@/lib/budget-context';
import * as Haptics from 'expo-haptics';

interface QuickAddCategoriesProps {
  onCategorySelect: (category: string, estimatedBudget: number) => void;
}

export function QuickAddCategories({ onCategorySelect }: QuickAddCategoriesProps) {
  const { addExpense } = useBudget();

  const handleQuickAdd = (categoryName: string, estimatedBudget: number) => {
    addExpense({
      category: categoryName,
      description: '',
      estimated: estimatedBudget,
      paid: 0,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onCategorySelect(categoryName, estimatedBudget);
  };

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold text-foreground">Quick Add Expense</Text>
        <Text className="text-xs text-muted">{EXPENSE_CATEGORIES.length} categories</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
        className="gap-2"
      >
        {EXPENSE_CATEGORIES.map((category) => (
          <Pressable
            key={category.name}
            onPress={() => handleQuickAdd(category.name, category.estimatedBudget)}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              },
            ]}
            className="bg-primary rounded-full px-4 py-2 flex-row items-center gap-2 min-w-max"
          >
            <Text className="text-lg">{category.icon}</Text>
            <Text className="text-background font-semibold text-sm">{category.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text className="text-xs text-muted mt-2">
        Tap any category to add it with estimated budget
      </Text>
    </View>
  );
}
