# Wedding Budget Tracker - Design Plan

## Screen List

1. **Home Screen** - Main budget overview and expense list
2. **Add/Edit Expense Modal** - Form to create or modify expenses
3. **Settings Screen** - Configure total budget and preferences

## Primary Content and Functionality

### Home Screen
- **Header Section**: Display total budget (1,000,000 PKR), total spent, and remaining cash
- **Summary Cards**: Three cards showing:
  - Total Budget (PKR 1,000,000)
  - Total Spent (dynamic calculation)
  - Remaining Cash (dynamic calculation)
- **Expense List**: Scrollable list of expenses with:
  - Category name
  - Description
  - Estimated cost
  - Amount paid (editable inline)
  - Pending amount (auto-calculated)
  - Delete button
- **Floating Action Button**: Add new expense
- **Live Updates**: Pending amounts and remaining cash update instantly

### Add/Edit Expense Modal
- **Category Input**: Text field
- **Description Input**: Text field
- **Estimated Cost Input**: Number field
- **Amount Paid Input**: Number field
- **Save Button**: Persist the expense
- **Cancel Button**: Close modal without saving

### Settings Screen
- **Budget Configuration**: Option to adjust total budget
- **App Info**: Display app version and credits

## Key User Flows

1. **View Budget Overview**
   - User opens app → Home screen loads with summary cards and expense list
   - All calculations are displayed in real-time

2. **Add New Expense**
   - User taps "+" button → Add Expense modal opens
   - User fills in category, description, estimated cost, and amount paid
   - User taps "Save" → Expense is added to list, summary updates instantly
   - User can tap "Cancel" to close without saving

3. **Edit Expense Amount Paid**
   - User taps on "Amount Paid" field in the list → Field becomes editable
   - User updates the value → Pending amount and remaining cash update instantly
   - User taps outside or confirms → Changes are saved

4. **Delete Expense**
   - User swipes left or taps delete button → Expense is removed
   - Summary cards update instantly

## Color Choices

- **Primary Gold**: `#D4AF37` - Premium wedding aesthetic, used for accents and buttons
- **Background**: `#FFFFFF` (light) / `#151718` (dark) - Clean and minimal
- **Surface**: `#F5F5F5` (light) / `#1E2022` (dark) - Card backgrounds
- **Text Primary**: `#11181C` (light) / `#ECEDEE` (dark) - Main text
- **Text Secondary**: `#687076` (light) / `#9BA1A6` (dark) - Muted text
- **Success**: `#22C55E` - For positive indicators
- **Warning**: `#F59E0B` - For alerts
- **Error**: `#EF4444` - For delete actions

## Design Principles

- **Mobile-First**: Optimized for portrait orientation (9:16)
- **One-Handed Usage**: All interactive elements within thumb reach
- **Premium Feel**: Gold accents and clean typography reflect wedding elegance
- **Live Feedback**: Instant calculations and visual updates for all interactions
- **Accessibility**: Clear labels, sufficient color contrast, and touch targets
