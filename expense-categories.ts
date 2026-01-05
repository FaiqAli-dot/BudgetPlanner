export interface ExpenseCategory {
  name: string;
  description: string;
  estimatedBudget: number;
  icon: string;
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    name: 'Venue',
    description: 'Wedding hall or outdoor venue rental',
    estimatedBudget: 300000,
    icon: '🏛️',
  },
  {
    name: 'Catering',
    description: 'Food and beverages for guests',
    estimatedBudget: 400000,
    icon: '🍽️',
  },
  {
    name: 'Photography',
    description: 'Professional photographer and videographer',
    estimatedBudget: 100000,
    icon: '📸',
  },
  {
    name: 'Decoration',
    description: 'Flowers, lights, and decorations',
    estimatedBudget: 80000,
    icon: '🌸',
  },
  {
    name: 'Music & Entertainment',
    description: 'DJ, band, or live entertainment',
    estimatedBudget: 60000,
    icon: '🎵',
  },
  {
    name: 'Invitations & Stationery',
    description: 'Cards, invites, and printed materials',
    estimatedBudget: 15000,
    icon: '📧',
  },
  {
    name: 'Makeup & Hair',
    description: 'Bridal and guest makeup services',
    estimatedBudget: 25000,
    icon: '💄',
  },
  {
    name: 'Wedding Attire',
    description: 'Bride, groom, and party dresses',
    estimatedBudget: 150000,
    icon: '👗',
  },
  {
    name: 'Transportation',
    description: 'Vehicles and transportation for guests',
    estimatedBudget: 40000,
    icon: '🚗',
  },
  {
    name: 'Accommodation',
    description: 'Hotel rooms for out-of-town guests',
    estimatedBudget: 50000,
    icon: '🏨',
  },
  {
    name: 'Gifts & Favors',
    description: 'Guest favors and wedding gifts',
    estimatedBudget: 30000,
    icon: '🎁',
  },
  {
    name: 'Other',
    description: 'Miscellaneous expenses',
    estimatedBudget: 0,
    icon: '📝',
  },
];

export function getCategoryByName(name: string): ExpenseCategory | undefined {
  return EXPENSE_CATEGORIES.find((cat) => cat.name === name);
}
