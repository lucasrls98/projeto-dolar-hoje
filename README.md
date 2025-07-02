# 💵 Dólar Hoje

A beautiful Vue.js application that displays the current dollar exchange rate in Brazilian Real (BRL) in real-time.

## ✨ Features

- **Real-time Exchange Rate**: Fetches current USD to BRL exchange rate
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Auto-refresh**: Updates every 5 minutes automatically
- **Error Handling**: Graceful error states with retry functionality
- **Mobile Responsive**: Works perfectly on all device sizes
- **Loading States**: Smooth loading animations

## 🚀 Quick Start

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (version 16 or higher).

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   The application will automatically open at `http://localhost:3000`

## 🧪 Testing the Application

### Manual Testing

1. **Load the application** - You should see a beautiful card with the dollar exchange rate
2. **Check loading state** - The app shows a spinner while fetching data
3. **Test refresh button** - Click "🔄 Atualizar" to manually refresh the rate
4. **Test error handling** - Disconnect your internet and refresh to see error state
5. **Test responsiveness** - Resize your browser window to test mobile layout

### Browser Testing

- **Chrome/Edge**: Open Developer Tools (F12) and test responsive design
- **Mobile**: Use browser dev tools to simulate mobile devices
- **Network**: Use Network tab to simulate slow connections or offline mode

### API Testing

The app uses the free [Exchange Rate API](https://exchangerate-api.com/). You can test different scenarios:

1. **Normal operation**: Should show current USD/BRL rate
2. **API down**: Disconnect internet to test error handling
3. **Slow connection**: Use browser dev tools to throttle network

## 📱 Features to Test

### ✅ Core Functionality
- [ ] Exchange rate displays correctly
- [ ] Rate is formatted in Brazilian currency format
- [ ] Last update timestamp shows correctly
- [ ] Variation percentage displays (simulated)

### ✅ User Interface
- [ ] Beautiful gradient design
- [ ] Smooth hover animations
- [ ] Loading spinner works
- [ ] Error state displays properly
- [ ] Responsive design on mobile

### ✅ User Experience
- [ ] Manual refresh button works
- [ ] Auto-refresh every 5 minutes
- [ ] Error retry functionality
- [ ] Smooth transitions between states

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
projeto-dolar-hoje/
├── src/
│   ├── App.vue          # Main application component
│   ├── main.js          # Vue app entry point
│   └── style.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## 🎨 Design Features

- **Modern UI**: Clean, minimalist design with gradients
- **CSS Custom Properties**: Consistent theming with CSS variables
- **Smooth Animations**: Hover effects and transitions
- **Typography**: Inter font family for excellent readability
- **Color Scheme**: Professional blue gradient theme
- **Shadows**: Subtle depth with CSS box-shadows

## 🔧 Technical Details

- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite for fast development
- **HTTP Client**: Axios for API requests
- **Styling**: Scoped CSS with modern features
- **API**: Exchange Rate API (free tier)

## 🌐 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Note**: This application uses a free API for demonstration purposes. For production use, consider using a paid API service with higher rate limits and reliability guarantees. 