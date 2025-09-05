# 🚀 CPU Scheduler Simulator

A comprehensive, interactive CPU scheduling algorithm simulator built with Next.js 15, React 19, and TypeScript. This educational tool helps students and professionals understand different CPU scheduling strategies through visual simulations.

## ✨ Features

### 🎯 **6 CPU Scheduling Algorithms**
- **First-Come-First-Served (FCFS)** - Processes executed in arrival order
- **Shortest Job First (SJF)** - Non-preemptive shortest burst time scheduling
- **Shortest Remaining Time First (SRTF)** - Preemptive shortest remaining time scheduling
- **Priority Scheduling** - Both non-preemptive and preemptive priority-based scheduling
- **Round Robin** - Time-sliced scheduling with configurable quantum
- **Multilevel Feedback Queue (MLFQ)** - Advanced adaptive scheduling algorithm

### 🎨 **Beautiful User Interface**
- **Dynamic Landing Page** - Impressive animated homepage with interactive demo
- **Real-time Gantt Charts** - Visual process execution timeline
- **Interactive Controls** - Step-by-step simulation playback
- **Performance Metrics** - Comprehensive analysis of waiting time, turnaround time, and throughput
- **Dark Theme** - Professional CPU/processor-inspired design
- **Responsive Design** - Works perfectly on desktop and mobile

### 🧪 **Comprehensive Testing**
- **30 Test Cases** - All algorithms thoroughly tested
- **100% Test Coverage** - Every algorithm validated with edge cases
- **TypeScript** - Full type safety and IntelliSense support

## 🚀 Live Demo

Visit the live application: **[Your Render.com URL will be here]**

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Custom CSS animations
- **Testing**: Jest, React Testing Library
- **Deployment**: Render.com
- **Icons**: Lucide React
- **State Management**: React Context API

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/gauru07/scheduler_simulator.git
   cd scheduler_simulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run test suite
npm run type-check   # TypeScript type checking
```

## 🎮 How to Use

### Landing Page
1. Visit the homepage to see the impressive animated introduction
2. Click "Try Interactive Demo" to see a live simulation
3. Click "Launch Full Simulator" to access the complete interface

### Simulator Interface
1. **Add Processes**: Use the sidebar to add processes with arrival time, burst time, and priority
2. **Select Algorithm**: Choose from 6 different scheduling algorithms
3. **Run Simulation**: Click "Execute Simulation" to see the results
4. **Visualize Results**: View the Gantt chart and performance metrics
5. **Control Playback**: Use simulation controls to step through the execution

## 📊 Algorithm Performance Comparison

| Algorithm | Avg Waiting Time | Avg Turnaround Time | Preemption | Use Case |
|-----------|------------------|---------------------|------------|----------|
| FCFS | 5.25 | 10.00 | No | Simple, fair scheduling |
| SJF | 3.75 | 8.25 | No | Optimal for short jobs |
| SRTF | 3.00 | 7.75 | Yes | Best average waiting time |
| Priority | 4.50 | 9.50 | Optional | Task importance-based |
| Round Robin | 5.50 | 10.25 | Yes | Interactive systems |
| MLFQ | 5.75 | 10.50 | Yes | Real-time systems |

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/scheduler/      # API endpoints
│   ├── simulator/          # Simulator page
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── controls/          # Input controls
│   ├── layout/            # Layout components
│   ├── landing/           # Landing page components
│   ├── ui/                # Reusable UI components
│   └── visualization/     # Charts and displays
├── contexts/              # React contexts
├── engine/                # Core algorithm implementations
│   ├── algorithms/        # Scheduling algorithms
│   ├── datastructures/    # Data structures
│   └── types.ts          # TypeScript definitions
├── hooks/                 # Custom React hooks
└── utils/                 # Utility functions
```

## 🧪 Testing

The project includes comprehensive tests for all algorithms:

```bash
npm test
```

**Test Results**: 30/30 tests passing ✅

## 🚀 Deployment

### Deploy to Render.com

1. **Connect Repository**: Link your GitHub repository to Render
2. **Configure Build**: 
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Node Version: 18+
3. **Environment Variables**: None required
4. **Deploy**: Automatic deployment on every push to main

### Other Deployment Options

- **Vercel**: `npm run build && npm start`
- **Netlify**: `npm run build`
- **Railway**: Automatic detection

## 👨‍💻 Developer

**Gaurav S** - Computer Science Student
- Full-Stack Developer
- Algorithm Enthusiast
- Operating Systems Project

## 📄 License

This project is built for educational purposes. Feel free to use and modify for learning.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

⭐ **Star this repository if you found it helpful!**