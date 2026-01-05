# Wedding Budget Tracker - Web Version

A beautiful, responsive web application for tracking wedding expenses with real-time calculations and budget management.

## Features

### 💍 Core Functionality
- **Budget Management**: Set and edit your total wedding budget
- **Expense Tracking**: Add, edit, and delete expenses with ease
- **Quick-Add Categories**: 12 predefined wedding expense categories with one-tap addition
- **Live Calculations**: Real-time updates for total spent, remaining cash, and pending amounts
- **Persistent Storage**: All data is saved to browser's local storage automatically

### 🎨 User Interface
- **Premium Design**: Elegant gold gradient theme with modern styling
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatically adapts to system dark mode preferences
- **Intuitive Modals**: Easy-to-use dialogs for adding and editing expenses
- **Visual Feedback**: Clear status indicators for budget health

### 📊 Expense Categories
1. Venue - Wedding hall or outdoor venue rental
2. Catering - Food and beverages for guests
3. Photography - Professional photographer and videographer
4. Decoration - Flowers, lights, and decorations
5. Music & Entertainment - DJ, band, or live entertainment
6. Invitations & Stationery - Cards, invites, and printed materials
7. Makeup & Hair - Bridal and guest makeup services
8. Wedding Attire - Bride, groom, and party dresses
9. Transportation - Vehicles and transportation for guests
10. Accommodation - Hotel rooms for out-of-town guests
11. Gifts & Favors - Guest favors and wedding gifts
12. Other - Miscellaneous expenses

## How to Use

### Getting Started
1. Open `index.html` in any web browser
2. The app comes with 3 sample expenses to demonstrate functionality
3. All data is automatically saved to your browser

### Adding Expenses
**Method 1: Quick-Add Categories**
- Click any category button (e.g., Venue, Catering)
- The expense is instantly added with the pre-estimated budget
- Edit the expense to customize details

**Method 2: Manual Entry**
- Click the "+" button (floating action button)
- Fill in category, description, estimated cost, and amount paid
- Click "Save Expense"

### Editing Expenses
- Click the "Edit" button on any expense card
- Modify the category, description, estimated cost, or amount paid
- Click "Save Expense" to apply changes
- Calculations update automatically

### Deleting Expenses
- Click the "Delete" button on any expense card
- Confirm the deletion
- The expense is removed and calculations update

### Managing Budget
- Click the "Edit Budget" button on the total budget card
- Enter your new total budget amount
- Click "Update Budget"
- All calculations adjust automatically

## Technical Details

### Files
- `index.html` - HTML structure and markup
- `styles.css` - Responsive styling with dark mode support
- `script.js` - All functionality and calculations

### Data Storage
- Uses browser's `localStorage` API
- Data persists across browser sessions
- No server or backend required
- No data is sent anywhere - everything stays on your device

### Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Calculations

### Total Spent
Sum of all "Amount Paid" across all expenses

### Remaining Cash
Total Budget - Total Spent

### Pending Amount (per expense)
Estimated Cost - Amount Paid

### Spending Percentage
(Total Spent / Total Budget) × 100

## Currency
All amounts are displayed in Pakistani Rupees (PKR) with proper formatting.

## Tips

1. **Start with Quick-Add**: Use the quick-add buttons to rapidly add common wedding expenses
2. **Update as You Pay**: Edit the "Amount Paid" field as you make payments
3. **Add Descriptions**: Include vendor names or details in the description field for easy reference
4. **Monitor Budget**: Keep an eye on the "Remaining" card to stay within budget
5. **Share the Link**: You can share the website URL with your partner or wedding planner

## Offline Usage
This app works completely offline. Once loaded, you don't need an internet connection to use it.

## Privacy
Your wedding budget data is stored only in your browser. No data is collected, stored on servers, or shared with anyone.

## Support
For issues or feature requests, please refer to the source code or contact the developer.

---

**Made with ❤️ for wedding planning**
