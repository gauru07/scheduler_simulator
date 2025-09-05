"use client";

import React, { useState, useEffect } from 'react';
import { Cpu, Play, Zap, BarChart3, Clock, Users, ArrowRight, Star, Code, Brain, Target, Rocket, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export function LandingPage() {
  const [showDemo, setShowDemo] = useState(false);
  const [currentProcess, setCurrentProcess] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number}>>([]);

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    }));
    setParticles(newParticles);

    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.vx + window.innerWidth) % window.innerWidth,
        y: (particle.y + particle.vy + window.innerHeight) % window.innerHeight
      })));
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  // Animate process execution
  useEffect(() => {
    if (showDemo) {
      const interval = setInterval(() => {
        setCurrentProcess(prev => (prev + 1) % 4);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [showDemo]);

  const algorithms = [
    {
      name: "First-Come-First-Served",
      description: "Processes executed in arrival order",
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Shortest Job First",
      description: "Shortest burst time first (non-preemptive)",
      icon: <Zap className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Shortest Remaining Time",
      description: "Shortest remaining time first (preemptive)",
      icon: <Clock className="w-6 h-6" />,
      color: "from-purple-500 to-violet-500"
    },
    {
      name: "Priority Scheduling",
      description: "Priority-based scheduling (non-preemptive)",
      icon: <Target className="w-6 h-6" />,
      color: "from-orange-500 to-red-500"
    },
    {
      name: "Round Robin",
      description: "Time-sliced scheduling with quantum",
      icon: <Brain className="w-6 h-6" />,
      color: "from-pink-500 to-rose-500"
    },
    {
      name: "Multilevel Feedback Queue",
      description: "Advanced adaptive scheduling",
      icon: <Rocket className="w-6 h-6" />,
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const features = [
    {
      title: "Interactive Visualization",
      description: "Real-time Gantt charts with step-by-step playback",
      icon: <BarChart3 className="w-8 h-8" />
    },
    {
      title: "Performance Metrics",
      description: "Comprehensive analysis of waiting time, turnaround time, and throughput",
      icon: <Clock className="w-8 h-8" />
    },
    {
      title: "Multiple Algorithms",
      description: "Compare 6 different CPU scheduling algorithms",
      icon: <Cpu className="w-8 h-8" />
    },
    {
      title: "Educational Tool",
      description: "Perfect for learning operating systems concepts",
      icon: <Code className="w-8 h-8" />
    }
  ];

  const sampleProcesses = [
    { id: "P1", arrival: 0, burst: 6, priority: 3 },
    { id: "P2", arrival: 2, burst: 3, priority: 1 },
    { id: "P3", arrival: 4, burst: 8, priority: 2 },
    { id: "P4", arrival: 5, burst: 2, priority: 4 }
  ];

  return (
    <div className="min-h-screen animated-bg relative">
      {/* Floating Particles Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-cyan-400/20 rounded-full animate-pulse"
            style={{
              left: particle.x,
              top: particle.y,
              transform: `scale(${0.5 + Math.sin(particle.id) * 0.5})`
            }}
          />
        ))}
      </div>

      {/* Dynamic Header */}
      <header className="relative z-10 bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg glow animate-pulse">
                <Cpu className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                CPU Scheduler Simulator
              </h1>
              <p className="text-xs text-gray-400">Interactive OS Learning Platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-300 bg-gray-800/50 px-3 py-2 rounded-lg backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
            
            <Button
              onClick={() => window.location.href = '/simulator'}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg shadow-lg hover:shadow-cyan-500/25 glow-hover transition-all duration-300"
            >
              <Terminal className="w-4 h-4 mr-2" />
              Launch Simulator
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            {/* Dynamic CPU Visualization */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Main CPU Core */}
                <div className="flex items-center justify-center w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl shadow-2xl glow animate-pulse">
                  <Cpu className="w-16 h-16 text-white" />
                </div>
                
                {/* Orbiting Process Elements */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="absolute w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${i * 90}deg) translateX(80px) translateY(-50%)`,
                        animationDelay: `${i * 0.5}s`
                      }}
                    >
                      <div className="w-full h-full bg-white/20 rounded-full animate-ping"></div>
                    </div>
                  ))}
                </div>
                
                {/* Memory Blocks */}
                <div className="absolute -top-4 -right-4 flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-3 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-sm animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Title with Typewriter Effect */}
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                CPU Scheduler
              </span>
              <br />
              <span className="text-white relative">
                Simulator
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full animate-pulse"></div>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Master CPU scheduling algorithms with our interactive visualization tool. 
              Compare performance metrics, understand process execution, and learn operating systems concepts.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                onClick={() => {
                  setShowDemo(true);
                  setIsAnimating(true);
                  setTimeout(() => setIsAnimating(false), 1000);
                }}
                className="px-8 py-4 text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl shadow-lg hover:shadow-cyan-500/25 glow-hover transition-all duration-300 transform hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                Try Interactive Demo
              </Button>
              <Button
                onClick={() => window.location.href = '/simulator'}
                className="px-8 py-4 text-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white rounded-xl shadow-lg hover:shadow-purple-500/25 glow-hover transition-all duration-300 transform hover:scale-105"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Launch Full Simulator
              </Button>
              <Button
                onClick={() => window.scrollTo({ top: document.getElementById('features')?.offsetTop, behavior: 'smooth' })}
                variant="outline"
                className="px-8 py-4 text-lg border-2 border-gray-600 text-gray-300 hover:border-cyan-500 hover:text-cyan-400 rounded-xl transition-all duration-300"
              >
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">6</div>
                <div className="text-gray-400">Algorithms</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
                <div className="text-gray-400">Interactive</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">Free</div>
                <div className="text-gray-400">Educational</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Our Simulator?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built for students, educators, and professionals who want to understand CPU scheduling algorithms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Algorithms Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Supported Algorithms</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore different CPU scheduling strategies and their performance characteristics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {algorithms.map((algorithm, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 group">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`p-2 bg-gradient-to-r ${algorithm.color} rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300`}>
                      {algorithm.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{algorithm.name}</h3>
                  </div>
                  <p className="text-gray-400">{algorithm.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Interactive Demo Section */}
      {showDemo && (
        <section className="py-20 bg-gray-900/50 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400/10 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in">
                🚀 Interactive Demo
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Watch processes execute in real-time with different scheduling algorithms
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 backdrop-blur-sm shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Live Process Execution */}
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping mr-3"></div>
                    Live Process Execution
                  </h3>
                  
                  {/* CPU Core Visualization */}
                  <div className="relative mb-6">
                    <div className="w-full h-32 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl border-2 border-gray-600 flex items-center justify-center relative overflow-hidden">
                      <div className="text-white font-bold text-lg">CPU Core</div>
                      
                      {/* Currently Executing Process */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-1000 ${
                          currentProcess === 0 ? 'bg-gradient-to-r from-red-500 to-pink-600 scale-110' :
                          currentProcess === 1 ? 'bg-gradient-to-r from-blue-500 to-cyan-600 scale-110' :
                          currentProcess === 2 ? 'bg-gradient-to-r from-green-500 to-emerald-600 scale-110' :
                          'bg-gradient-to-r from-purple-500 to-violet-600 scale-110'
                        }`}>
                          P{currentProcess + 1}
                        </div>
                      </div>
                      
                      {/* Process Queue */}
                      <div className="absolute top-2 left-2 flex space-x-1">
                        {sampleProcesses.map((process, index) => (
                          <div
                            key={index}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                              index === currentProcess 
                                ? 'bg-yellow-500 text-black scale-125' 
                                : 'bg-gray-600 text-white'
                            }`}
                          >
                            {index + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Process Details */}
                  <div className="space-y-3">
                    {sampleProcesses.map((process, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center justify-between p-3 rounded-lg transition-all duration-500 ${
                          index === currentProcess 
                            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50' 
                            : 'bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            index === currentProcess 
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 animate-pulse' 
                              : 'bg-gray-600'
                          }`}>
                            {process.id}
                          </div>
                          <div>
                            <div className="text-white font-medium">{process.id}</div>
                            <div className="text-gray-400 text-sm">Priority: {process.priority}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-cyan-400 font-medium">Arrival: {process.arrival}</div>
                          <div className="text-blue-400 font-medium">Burst: {process.burst}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Algorithm Performance Comparison */}
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                    <BarChart3 className="w-6 h-6 mr-3 text-cyan-400" />
                    Performance Comparison
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { name: "FCFS", wt: 5.25, color: "from-cyan-500 to-blue-600", width: "70%" },
                      { name: "SJF", wt: 3.75, color: "from-green-500 to-emerald-600", width: "50%" },
                      { name: "Priority", wt: 4.50, color: "from-purple-500 to-violet-600", width: "60%" },
                      { name: "Round Robin", wt: 4.00, color: "from-orange-500 to-red-600", width: "55%" }
                    ].map((algo, index) => (
                      <div key={index} className="p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white font-medium flex items-center">
                            <div className={`w-3 h-3 bg-gradient-to-r ${algo.color} rounded-full mr-2 animate-pulse`}></div>
                            {algo.name}
                          </span>
                          <span className="text-cyan-400 font-bold">Avg WT: {algo.wt}</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`bg-gradient-to-r ${algo.color} h-3 rounded-full transition-all duration-1000 ease-out`} 
                            style={{ width: isAnimating ? '0%' : algo.width }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {algo.wt < 4 ? 'Excellent' : algo.wt < 5 ? 'Good' : 'Average'} Performance
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Real-time Metrics */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-lg border border-gray-600">
                    <h4 className="text-white font-semibold mb-3 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-green-400" />
                      Real-time Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Current Process</div>
                        <div className="text-cyan-400 font-bold">P{currentProcess + 1}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Execution Time</div>
                        <div className="text-green-400 font-bold">2.0s</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Queue Length</div>
                        <div className="text-blue-400 font-bold">4</div>
                      </div>
                      <div>
                        <div className="text-gray-400">CPU Utilization</div>
                        <div className="text-purple-400 font-bold">100%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    onClick={() => window.location.href = '/simulator'}
                    className="px-8 py-4 text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl shadow-lg hover:shadow-cyan-500/25 glow-hover transition-all duration-300 transform hover:scale-105"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    Launch Full Simulator
                  </Button>
                  <Button
                    onClick={() => setShowDemo(false)}
                    variant="outline"
                    className="px-6 py-3 border-2 border-gray-600 text-gray-300 hover:border-cyan-500 hover:text-cyan-400 rounded-xl transition-all duration-300"
                  >
                    Close Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg mr-3">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">CPU Scheduler</span>
              </div>
              <p className="text-gray-400 mb-4">
                Interactive CPU scheduling algorithm simulator for educational purposes.
              </p>
              <div className="flex items-center text-cyan-400">
                <Star className="w-4 h-4 mr-1" />
                <span className="text-sm">Built with Next.js & React</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Algorithms</h3>
              <ul className="space-y-2 text-gray-400">
                <li>First-Come-First-Served</li>
                <li>Shortest Job First</li>
                <li>Shortest Remaining Time</li>
                <li>Priority Scheduling</li>
                <li>Round Robin</li>
                <li>Multilevel Feedback Queue</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2 text-cyan-400" />
                Developer
              </h3>
              <div className="text-gray-400">
                <div className="mb-3 p-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
                  <p className="text-cyan-400 font-bold text-lg">Gaurav S</p>
                  <p className="text-sm text-gray-300">Computer Science Student</p>
                  <p className="text-xs text-gray-400">Operating Systems Project</p>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>Full-Stack Developer</span>
                </div>
                <div className="flex items-center space-x-2 text-sm mt-1">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span>Algorithm Enthusiast</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 CPU Scheduler Simulator. Built for educational purposes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
