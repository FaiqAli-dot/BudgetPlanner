# Wedding Budget Tracker - Firebase Edition (Shared & Real-Time)

A beautiful, responsive web application for tracking wedding expenses with **real-time synchronization** and **multi-user collaboration**. Perfect for couples planning their wedding together!

## 🎉 Features

### 💍 Core Functionality
- **User Authentication**: Secure sign-up and login with email/password
- **Real-Time Sync**: Changes instantly appear on all connected devices
- **Budget Sharing**: Invite your partner to collaborate on the same budget
- **Expense Tracking**: Add, edit, and delete expenses with ease
- **Quick-Add Categories**: 12 predefined wedding expense categories
- **Live Calculations**: Real-time updates for total spent, remaining cash, and pending amounts
- **Cloud Storage**: All data securely stored in Firebase

### 🎨 User Interface
- **Premium Design**: Elegant gold gradient theme with modern styling
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Dark Mode Support**: Automatically adapts to system dark mode
- **Intuitive Modals**: Easy-to-use dialogs for adding and editing expenses
- **Visual Feedback**: Clear status indicators for budget health

### 🔐 Security & Privacy
- **Secure Authentication**: Firebase handles all security
- **Data Encryption**: All data encrypted in transit and at rest
- **Access Control**: Only authorized users can view/edit shared budgets
- **No Personal Data**: We don't collect or store any personal information

## 📱 Expense Categories

1. **Venue** - Wedding hall or outdoor venue rental
2. **Catering** - Food and beverages for guests
3. **Photography** - Professional photographer and videographer
4. **Decoration** - Flowers, lights, and decorations
5. **Music & Entertainment** - DJ, band, or live entertainment
6. **Invitations & Stationery** - Cards, invites, and printed materials
7. **Makeup & Hair** - Bridal and guest makeup services
8. **Wedding Attire** - Bride, groom, and party dresses
9. **Transportation** - Vehicles and transportation for guests
10. **Accommodation** - Hotel rooms for out-of-town guests
11. **Gifts & Favors** - Guest favors and wedding gifts
12. **Other** - Miscellaneous expenses

## 🚀 Getting Started

### For Users

1. **Visit the App**: Open the deployed URL in your browser
2. **Create Account**: Sign up with your email and password
3. **Start Planning**: Add your wedding expenses
4. **Invite Partner**: Share your budget by inviting their email
5. **Collaborate**: Both of you can edit and see changes in real-time

### For Developers

See `GITHUB-PAGES-SETUP.md` for detailed deployment instructions.

## 💻 How to Use

### Creating an Account
1. Click "Create Account" tab
2. Enter your full name, email, and password
3. Click "Create Account"
4. You're ready to start planning!

### Adding Expenses

**Method 1: Quick-Add Categories**
- Click any category button (e.g., Venue, Catering)
- The expense is instantly added with the pre-estimated budget
- Edit the expense to customize details

**Method 2: Manual Entry**
- Click the "+" button (floating action button)
- Fill in category, description, estimated cost, and amount paid
- Click "Save Expense"

### Sharing Your Budget

1. Scroll to "Share Budget" section
2. Enter your partner's email address
3. Click "Send Invite"
4. Your partner will see the budget in their account
5. Changes sync in real-time!

### Editing Expenses
- Click "Edit" on any expense
- Modify the details
- Click "Save Expense"
- Changes appear instantly for all users

### Managing Budget
- Click "Edit Budget" on the total budget card
- Enter your new budget amount
- Click "Update Budget"

## 🔄 Real-Time Synchronization

When you or your partner makes changes:
- **Instant Updates**: Changes appear immediately on all devices
- **Live Calculations**: Totals update automatically
- **No Manual Refresh**: Everything syncs automatically
- **Offline Support**: Local changes sync when connection returns

## 📊 Calculations

### Total Spent
Sum of all "Amount Paid" across all expenses

### Remaining Cash
Total Budget - Total Spent

### Pending Amount (per expense)
Estimated Cost - Amount Paid

### Spending Percentage
(Total Spent / Total Budget) × 100

## 🌐 Deployment

The app is deployed on GitHub Pages for free hosting:

- **Free Hosting**: No hosting costs
- **Free Database**: Firebase free tier
- **Custom Domain**: Optional (paid)
- **SSL/HTTPS**: Automatic with GitHub Pages

See `GITHUB-PAGES-SETUP.md` for deployment steps.

## 📁 File Structure

```
wedding-budget-tracker/
├── index.html              # Main HTML file
├── styles.css              # Responsive styling
├── script.js               # Firebase integration & logic
├── README.md               # User guide
├── GITHUB-PAGES-SETUP.md   # Deployment guide
└── .gitignore              # Git ignore file
```

## 🔧 Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Firebase Realtime Database
- **Authentication**: Firebase Authentication
- **Hosting**: GitHub Pages
- **No Build Tools**: Runs directly in the browser

## 💾 Data Storage

- **Database**: Firebase Realtime Database
- **Storage**: 1GB free tier (more than enough for budgets)
- **Connections**: 100 simultaneous (perfect for small teams)
- **Backups**: Automatic by Firebase

## 🔒 Security

- **Authentication**: Email/password with Firebase
- **Authorization**: Only budget creator and shared users can access
- **Encryption**: All data encrypted in transit (HTTPS) and at rest
- **No Passwords Stored**: Firebase handles secure password storage

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🌙 Dark Mode

The app automatically adapts to your system's dark mode setting. No manual toggle needed!

## 💡 Tips

1. **Start with Quick-Add**: Use the quick-add buttons to rapidly add common wedding expenses
2. **Update as You Pay**: Edit the "Amount Paid" field as you make payments
3. **Add Descriptions**: Include vendor names or details for easy reference
4. **Monitor Budget**: Keep an eye on the "Remaining" card to stay within budget
5. **Share Early**: Invite your partner early so you can plan together

## ⚠️ Important Notes

- **Shared Budgets**: Only the budget creator can manage who has access
- **Real-Time Sync**: Internet connection required for sync (local changes queue offline)
- **Account Security**: Use a strong password and don't share your account
- **Data Backup**: Firebase automatically backs up your data

## 🆘 Troubleshooting

### Can't log in?
- Check your email and password
- Make sure you created an account first
- Try clearing browser cookies

### Budget not syncing?
- Check your internet connection
- Refresh the page
- Check browser console for errors

### Can't share budget?
- Make sure the email address is correct
- The recipient must have created an account first
- They'll see the budget in their app after sharing

### Changes not appearing?
- Refresh the page
- Check your internet connection
- Try logging out and back in

## 📞 Support

For issues or questions:
1. Check the browser console (F12 → Console tab)
2. Verify your Firebase config is correct
3. Ensure you have internet connection
4. Try clearing browser cache

## 📄 License

This project is free to use and modify for personal use.

## 🎁 Future Features

Potential enhancements:
- Budget breakdown charts
- Payment reminders
- Guest list integration
- Vendor contact management
- Budget templates
- Multiple budgets (engagement, honeymoon, etc.)

---

**Made with ❤️ for couples planning their perfect wedding**

**Happy wedding planning! 💍**
