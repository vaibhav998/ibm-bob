# IBM Sales Coaching Dashboard

A comprehensive sales intelligence and coaching platform built with the IBM Momentum design system, integrating IBM's proven sales coaching methodologies.

## 🎯 Overview

This dashboard provides sales managers with actionable insights and coaching frameworks to improve team performance. It combines pipeline analytics, opportunity tracking, and IBM's coaching methodologies into an intuitive interface.

## ✨ Key Features

### Manager Overview
- **Pipeline Health Tracking**: Real-time view of team pipeline vs. goals
- **Risk Matrix**: Visual representation of pipeline health × opportunity creation
- **Team KPIs**: 7 critical metrics including pipeline coverage, at-risk reps, and untouched accounts
- **Opportunity Creation Analytics**: Month-over-month trends and insights

### Rep Coaching Workspace
- **Pipeline Analysis with IBM Questions**:
  - How did you get here and what's your gap?
  - Which deals are honestly not likely?
  - Which lever are you pulling this month?
  - What accelerator can speed your top deal up?

- **Zoom Out Assessment** (IBM Framework):
  - Quantity: Number of opportunities in pipeline
  - Deal Size: Average deal value vs target
  - Mix: Product and segment diversity
  - Balance: Distribution across accounts

- **Sales Formula Analysis**:
  - Current opportunities vs team average
  - Meeting-to-opportunity conversion tracking
  - Required meetings calculation
  - IBM coaching questions for pace and obstacles

- **Growth Strategy Framework**:
  - Which of the six boxes will fill your gap?
  - Where do you have a story to tell?
  - Where can you add value the buyer hasn't considered?
  - Which buying centers are experiencing change?

- **Quota Recovery Plan**:
  - Pipeline gap analysis
  - Multiple path scenarios
  - Actionable checklist
  - AI-powered recommendations

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server or build tools required

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd northstar_dashboard
```

2. Open in browser:
```bash
open index.html
```

Or simply double-click `index.html` to open in your default browser.

## 📁 Project Structure

```
northstar_dashboard/
├── index.html      # Main HTML structure
├── styles.css      # IBM Momentum design system (1,574 lines)
├── app.js          # Interactive functionality (638 lines)
└── README.md       # This file
```

## 🎨 Design System

Built with the **IBM Momentum Design System**:
- **Colors**: Dark teal sidebar (#10292b), warm workspace tones
- **Typography**: DM Sans (body), Manrope (headings)
- **Layout**: Fixed sidebar, responsive main content
- **Components**: Custom KPI cards, pipeline tables, risk matrix, coaching panels

## 👥 Sample Data

Includes 6 sales representatives with realistic metrics:
- **Priya Shah** - High performer, exceeding quota
- **Maya Chen** - Strong pipeline, low opportunity creation
- **Sam Rivera** - Adequate performance, small deal sizes
- **Jordan Lee** - Below quota, multiple exposure areas (default view)
- **Noah Williams** - Critical risk, needs immediate coaching
- **Elena Garcia** - Close to quota, concentration risk

## 🔧 Customization

### Adding New Reps
Edit the `reps` array in `app.js`:
```javascript
{
  id: 'unique-id',
  name: 'Rep Name',
  initials: 'RN',
  role: 'Enterprise AE',
  region: 'Region',
  pipeline: 200000,
  goal: 240000,
  // ... other metrics
}
```

### Modifying IBM Questions
Update the question boxes in `index.html` or add new sections following the existing patterns.

### Styling Changes
All design tokens are defined as CSS variables in `styles.css`:
```css
:root {
  --sidebar-bg: #10292b;
  --primary: #087f75;
  --danger: #d8653b;
  /* ... more variables */
}
```

## 📊 IBM Coaching Methodologies

This dashboard implements several IBM sales coaching frameworks:

1. **Pipeline Coaching Toolkit**: Questions to assess pipeline health and identify actions
2. **Sales Formula Planner**: Activity-based metrics to predict opportunity creation
3. **Zoom Out Process**: Four-dimension assessment of pipeline quality
4. **Growth Strategy Framework**: Six-box model for identifying growth opportunities

## 🌐 Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

## 📱 Responsive Design

- **Desktop** (>1200px): Full layout with sidebar
- **Tablet** (900-1200px): Compact layout
- **Mobile** (<900px): Collapsible sidebar, stacked content

## 🔒 Privacy & Data

- All data is stored in JavaScript arrays (no backend)
- No external API calls
- No data persistence (refresh resets to defaults)
- Safe to use with real data (stays local)

## 🛠️ Development

No build process required. Edit files directly:

1. **HTML changes**: Edit `index.html`
2. **Style changes**: Edit `styles.css`
3. **Logic changes**: Edit `app.js`
4. Refresh browser to see changes

## 📝 License

This project is provided as-is for internal use.

## 🤝 Contributing

To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📧 Support

For questions or issues, contact the development team.

---

**Built with ❤️ using IBM Sales Coaching Methodologies and IBM Momentum Design System**