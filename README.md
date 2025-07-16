# Startup Exit Value Calculator

A comprehensive calculator comparing startup exit tax implications between Canada and the United States. Explore the economics of ambition and understand how different exit scenarios impact founders through QSBS (USA) vs LCGE (Canada) tax benefits.

## 🚀 Technologies

- **[Vite](https://vitejs.dev/)** (v7.0.3) - Ultra-fast development and build tool
- **[React 19](https://react.dev/)** with TypeScript - Latest React with full type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Modern utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible React components
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations and transitions
- **[Bun](https://bun.sh/)** - Fast package manager and runtime

## 🏗️ Project Structure

```
startup-exit-calculator/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Hero.tsx      # Main calculator interface
│   │   └── ...           # Other components
│   ├── lib/
│   │   ├── qsbs.ts       # US QSBS calculations
│   │   ├── lcge.ts       # Canada LCGE calculations
│   │   └── utils.ts      # Utility functions
│   ├── App.tsx           # Main application
│   └── index.css         # Global styles
├── public/               # Static assets and logos
└── README.md
```

## 🛠️ Development

### Prerequisites

- [Bun](https://bun.sh/) installed on your system

### Getting Started

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Start development server:**
   ```bash
   bun run dev
   ```

3. **Open your browser:**
   Visit `http://localhost:5173` to see the calculator

### Other Commands

- **Build for production:**
   ```bash
   bun run build
   ```

- **Preview production build:**
   ```bash
   bun run preview
   ```

- **Lint code:**
   ```bash
   bun run lint
   ```

## 💡 Features

### Calculator Functionality

- **Exit Value Input** - Set total company exit value and ownership percentage
- **Currency Support** - Toggle between USD and CAD with automatic conversion
- **Real-time Calculations** - Instant updates as you adjust parameters
- **Tax Breakdown** - Detailed breakdown of federal and state/provincial taxes
- **Comparison View** - Side-by-side comparison of Canada vs USA outcomes

### Tax Systems Covered

#### United States (QSBS)
- **Qualified Small Business Stock** exemption up to $15M USD
- Federal capital gains tax (0% on exempt gains, 20% on taxable)
- State-by-state tax variations
- All 50 US states supported

#### Canada (LCGE)
- **Lifetime Capital Gains Exemption** up to $1.25M CAD
- 50% inclusion rate for capital gains
- Federal and provincial tax calculations
- All Canadian provinces and territories supported

### Example Scenarios

- Small business acquisitions
- Post-Series A exits
- Large venture capital returns
- Public company examples (Shopify, Airbnb)

## 🎨 Design Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Interactive Elements** - Animated borders, hover effects, and smooth transitions
- **Professional UI** - Custom typography with Söhne, Financier Text, and Founders Grotesk fonts
- **Tooltips** - Contextual help explaining tax concepts
- **Visual Feedback** - Color-coded results showing which jurisdiction is more favorable

## 📊 Understanding the Results

The calculator helps answer key questions:

- **Which country offers better tax treatment for your exit scenario?**
- **How much would you save by incorporating in one jurisdiction vs another?**
- **What are the breakeven points between QSBS and LCGE benefits?**
- **How do state/provincial taxes impact the overall comparison?**

## 🌐 Deployment

The project can be deployed to any static hosting service:

1. **Build the project:**
   ```bash
   bun run build
   ```

2. **Deploy the `dist` folder** to your hosting provider:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3
   - Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly across different scenarios
5. Submit a pull request

## 📧 Built By

**Jesse Lee** - [jesselee.ca](https://jesselee.ca)

---

**Understanding the Economics of Ambition** - Compare how startup exits are taxed in Canada vs the USA and make informed decisions about where to build your company.
