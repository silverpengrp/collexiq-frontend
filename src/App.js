import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

function App() {
  useEffect(() => {
    // This code runs after the component mounts, similar to DOMContentLoaded

    // Mobile menu toggle
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuButton && mobileMenu) {
      const toggleMenu = () => {
        const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden');
      };
      menuButton.addEventListener('click', toggleMenu);
      
      // Cleanup function to remove event listener
      return () => menuButton.removeEventListener('click', toggleMenu);
    }

    // HERO LINE CHART (Chart.js)
    const canvas = document.getElementById('followerChart');
    let followerChart = null;
    if (canvas) {
      const ctx = canvas.getContext('2d');

      // Panel gradient plugin
      const panelBG = {
          id: 'panelBG',
          beforeDraw(chart) {
              const {ctx, chartArea} = chart;
              if (!chartArea) return;
              const {left, top, width, height} = chartArea;
              const g = ctx.createLinearGradient(0, top, 0, top + height);
              g.addColorStop(0, 'rgba(99, 102, 241, 0.08)');
              g.addColorStop(1, 'rgba(236, 72, 153, 0.06)');
              ctx.save();
              ctx.fillStyle = g;
              ctx.fillRect(left, top, width, height);
              ctx.restore();
          }
      };

      const orangeFill = ctx.createLinearGradient(0, 0, 0, 160);
      orangeFill.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
      orangeFill.addColorStop(1, 'rgba(245, 158, 11, 0.00)');

      const blueFill = ctx.createLinearGradient(0, 0, 0, 160);
      blueFill.addColorStop(0, 'rgba(96, 165, 250, 0.20)');
      blueFill.addColorStop(1, 'rgba(96, 165, 250, 0.00)');

      followerChart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: ['W1','W2','W3','W4','W5','W6'],
              datasets: [
                  {
                      label: 'Follower Growth',
                      data: [19, 25, 38, 45, 57, 76],
                      borderColor: '#f59e0b',
                      backgroundColor: orangeFill,
                      fill: true,
                      tension: 0.2,
                      borderWidth: 3,
                      pointRadius: 4,
                      pointHoverRadius: 5,
                      pointBackgroundColor: '#f59e0b',
                      pointBorderColor: '#0f172a',
                      pointBorderWidth: 2,
                      order: 2
                  },
                  {
                      label: 'Engagement',
                      data: [19, 35, 57, 19, 57, 28],
                      borderColor: '#60a5fa',
                      backgroundColor: blueFill,
                      fill: true,
                      tension: 0.45,
                      borderWidth: 3,
                      pointRadius: 4,
                      pointHoverRadius: 5,
                      pointBackgroundColor: '#60a5fa',
                      pointBorderColor: '#0f172a',
                      pointBorderWidth: 2,
                      order: 1
                  }
              ]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                  legend: { display: false },
                  tooltip: {
                      backgroundColor: '#0b1220',
                      borderColor: '#334155',
                      borderWidth: 1,
                      titleColor: '#e5e7eb',
                      bodyColor: '#cbd5e1',
                      padding: 10,
                      mode: 'index',
                      intersect: false
                  }
              },
              scales: {
                  x: {
                      grid: { display: false },
                      ticks: { color: '#94a3b8', font: { size: 10 } }
                  },
                  y: {
                      beginAtZero: true,
                      suggestedMax: 80,
                      ticks: {
                          stepSize: 20,
                          color: '#94a3b8',
                          font: { size: 10 }
                      },
                      grid: {
                          color: '#1f2937',
                          borderDash: [5,5],
                          drawBorder: false
                      }
                  }
              }
          },
          plugins: [panelBG]
      });
    }

    // FAQ accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    const handleFaqClick = (event) => {
        const q = event.currentTarget;
        const answer = q.nextElementSibling;
        const icon = q.querySelector('svg');
        if (answer.style.maxHeight) {
            answer.style.maxHeight = null;
            icon.style.transform = 'rotate(0deg)';
        } else {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            icon.style.transform = 'rotate(180deg)';
        }
    };
    faqQuestions.forEach(q => q.addEventListener('click', handleFaqClick));

    // Modals
    const privacyModal = document.getElementById('privacyModal');
    const termsModal = document.getElementById('termsModal');
    const openPrivacyBtn = document.getElementById('openPrivacyModal');
    const openTermsBtn = document.getElementById('openTermsModal');
    const closePrivacyBtn = document.getElementById('closePrivacyModal');
    const closeTermsBtn = document.getElementById('closeTermsModal');

    const openPrivacy = () => privacyModal?.classList.remove('hidden');
    const openTerms = () => termsModal?.classList.remove('hidden');
    const closePrivacy = () => privacyModal?.classList.add('hidden');
    const closeTerms = () => termsModal?.classList.add('hidden');

    openPrivacyBtn?.addEventListener('click', openPrivacy);
    openTermsBtn?.addEventListener('click', openTerms);
    closePrivacyBtn?.addEventListener('click', closePrivacy);
    closeTermsBtn?.addEventListener('click', closeTerms);

    const handleWindowClick = (e) => {
        if (e.target === privacyModal) privacyModal.classList.add('hidden');
        if (e.target === termsModal) termsModal.classList.add('hidden');
    };
    window.addEventListener('click', handleWindowClick);

    // Cleanup function
    return () => {
        if (followerChart) {
          followerChart.destroy();
        }
        faqQuestions.forEach(q => q.removeEventListener('click', handleFaqClick));
        openPrivacyBtn?.removeEventListener('click', openPrivacy);
        openTermsBtn?.removeEventListener('click', openTerms);
        closePrivacyBtn?.removeEventListener('click', closePrivacy);
        closeTermsBtn?.removeEventListener('click', closeTerms);
        window.removeEventListener('click', handleWindowClick);
    };

  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <>
      <header className="bg-slate-900/70 backdrop-blur-lg fixed top-0 left-0 right-0 z-50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <a href="# " className="flex items-center space-x-2">
                            <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#A855F7"></stop>
                                        <stop offset="100%" stopColor="#EC4899"></stop>
                                    </linearGradient>
                                </defs>
                                <rect width="32" height="32" rx="8" fill="url(#logoGradient)"/>
                                <circle cx="15" cy="15" r="6" stroke="white" strokeWidth="2.5"/>
                                <line x1="19.5" y1="19.5" x2="25" y2="25" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                            <span className="text-2xl font-bold tracking-tight text-white">Collex<span className="gradient-text">IQ</span></span>
                        </a>
                    </div>
                </div>
                <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                        <a href="#features" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Features</a>
                        <a href="#how-it-works" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">How It Works</a>
                        <a href="#pricing" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Pricing</a>
                    </div>
                </div>
                <div className="flex items-center">
                       <div className="hidden md:block">
                            <a href="# " className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Log In</a>
                            <a href="# " className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white gradient-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-pink-500 transition-all">Get Started Free</a>
                        </div>
                    <div className="md:hidden">
                        <button type="button" className="bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-pink-500" aria-controls="mobile-menu" aria-expanded="false" id="mobile-menu-button">
                            <span className="sr-only">Open main menu</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div className="hidden md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="#features" className="text-slate-300 hover:bg-slate-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Features</a>
                <a href="#how-it-works" className="text-slate-300 hover:bg-slate-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium">How It Works</a>
                <a href="#pricing" className="text-slate-300 hover:bg-slate-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Pricing</a>
                <a href="# " className="text-slate-300 hover:bg-slate-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Log In</a>
                <a href="# " className="gradient-bg text-white block px-3 py-2 rounded-md text-base font-medium text-center mt-2">Get Started Free</a>
            </div>
        </div>
    </header>

    <main className="pt-16">
        <div className="section-padding bg-slate-900">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                <div className="relative text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                        Stop Guessing. Pick <span className="gradient-text">Winning Influencers</span> with Confidence.
                    </h1>
                    <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-slate-300">
                        Collexiq gives you unbiased, API-verified stats and a powerful <strong className="text-white">Fit Score</strong> to find the perfect Instagram creators for your brand—in minutes, not days.
                    </p>
                    <div className="mt-8 flex justify-center lg:justify-start gap-x-4">
                        <a href="# " className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white gradient-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-pink-500 transition-transform hover:scale-105">
                            Start Vetting for Free
                        </a>
                        <a href="#how-it-works" className="inline-flex items-center px-6 py-3 border border-slate-600 text-base font-medium rounded-md text-slate-100 bg-slate-800/50 hover:bg-slate-700 transition-transform hover:scale-105">
                            How It Works
                        </a>
                    </div>
                    <p className="mt-4 text-sm text-slate-500">No credit card required. 10 free reports.</p>
                </div>
                
                <div>
                    <div className="p-4 bg-slate-800/50 rounded-2xl shadow-2xl hero-glow ring-1 ring-slate-700">
                        <div className="bg-slate-900 rounded-lg p-4 flex flex-col gap-3">
                            <div>
                                <div className="flex items-center gap-2 p-2 bg-slate-800 rounded-lg ring-1 ring-slate-700">
                                    <svg className="h-5 w-5 text-cyan-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm text-slate-300">
                                        Search: <span className="text-white font-semibold">'Fitness in NYC'</span>
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:items-stretch">
                                <div className="lg:col-span-2 flex flex-col gap-2">
                                    <h4 className="text-slate-400 text-xs font-semibold px-1">Shortlist</h4>
                                    <div className="bg-slate-800/70 p-2.5 rounded-lg ring-1 ring-cyan-500/30 hover-glow">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-white text-sm">Aria Gomez</p>
                                                <p className="text-xs text-slate-400">@fit.with.aria</p>
                                            </div>
                                            <div className="text-xl font-bold gradient-text">91</div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-800/70 p-2.5 rounded-lg ring-1 ring-slate-700 hover-glow">
                                         <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-white text-sm">Kai Patel</p>
                                                <p className="text-xs text-slate-400">@plantplate</p>
                                            </div>
                                            <div className="text-xl font-bold text-slate-300">84</div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-800/70 p-2.5 rounded-lg ring-1 ring-slate-700 hover-glow">
                                         <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-white text-sm">Mina Lee</p>
                                                <p className="text-xs text-slate-400">@citythreads</p>
                                            </div>
                                            <div className="text-xl font-bold text-slate-300">79</div>
                                        </div>
                                    </div>
                                    <div className="mt-1">
                                        <a href="# " className="block w-full text-center py-2 bg-slate-700/50 hover:bg-slate-700 transition-colors text-sm font-semibold text-slate-300 rounded-lg hover-glow">
                                            Compare Shortlist
                                        </a>
                                    </div>
                                </div>

                                <div className="lg:col-span-3 flex flex-col gap-3">
                                      <div>
                                        <h4 className="text-slate-400 text-xs font-semibold px-1 mb-1.5">Key Metrics</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="bg-slate-800/70 p-2 rounded-lg text-center hover-glow">
                                                <p className="text-xs text-slate-400">Avg ER</p>
                                                <p className="text-lg font-bold text-white">4.8%</p>
                                                <p className="text-xs text-cyan-400">+0.6%</p>
                                            </div>
                                            <div className="bg-slate-800/70 p-2 rounded-lg text-center hover-glow">
                                                <p className="text-xs text-slate-400">Audience Match</p>
                                                <p className="text-lg font-bold text-white">92%</p>
                                                <p className="text-xs text-cyan-400">+5%</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-800/70 p-3 rounded-lg flex-grow flex flex-col hover-glow">
                                        <div className="flex items-center gap-2">
                                             <svg className="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                                            </svg>
                                            <p className="text-sm font-semibold text-white">Follower Growth</p>
                                        </div>
                                        <div className="flex-grow relative h-40">
                                            <canvas id="followerChart"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left mt-2">
                                        <thead className="text-xs text-slate-400 uppercase">
                                            <tr>
                                                <th scope="col" className="py-2 pr-2">Metric</th>
                                                <th scope="col" className="py-2 px-2 text-center">Aria</th>
                                                <th scope="col" className="py-2 px-2 text-center">Kai</th>
                                                <th scope="col" className="py-2 pl-2 text-center">Mina</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-white">
                                            <tr className="border-b border-slate-800">
                                                <td className="py-2 pr-2 font-semibold">Engagement Rate</td>
                                                <td className="py-2 px-2 text-center">5.3%</td>
                                                <td className="py-2 px-2 text-center">4.6%</td>
                                                <td className="py-2 pl-2 text-center">3.9%</td>
                                            </tr>
                                            <tr className="border-b border-slate-800">
                                                <td className="py-2 pr-2 font-semibold">Audience Match</td>
                                                <td className="py-2 px-2 text-center">96%</td>
                                                <td className="py-2 px-2 text-center">88%</td>
                                                <td className="py-2 pl-2 text-center">80%</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2 pr-2 font-semibold">Brand Safety</td>
                                                <td className="py-2 px-2 text-center"><span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs">Green</span></td>
                                                <td className="py-2 px-2 text-center"><span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs">Green</span></td>
                                                <td className="py-2 pl-2 text-center"><span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-xs">Amber</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <section id="how-it-works" className="section-padding bg-slate-900/50">
            <div className="max-w-xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">From Chaos to Clarity in 3 Simple Steps</h2>
                <p className="mt-4 text-lg text-slate-300">Get from influencer discovery to data-driven decision in record time.</p>
            </div>
            <div className="mt-12 max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
                <div className="text-center p-8 bg-slate-800 rounded-xl shadow-lg border border-slate-700 hover-glow">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-500/20 mx-auto">
                        <svg className="h-8 w-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-white">1. Connect Creators Securely</h3>
                    <p className="mt-2 text-base text-slate-400">Invite creators with a unique link. They authorize via Instagram's official API in one click. No passwords exchanged, ever.</p>
                </div>
                <div className="text-center p-8 bg-slate-800 rounded-xl shadow-lg border border-slate-700 hover-glow">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-pink-500/20 mx-auto">
                        <svg className="h-8 w-8 text-pink-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-white">2. Analyze Verified Insights</h3>
                    <p className="mt-2 text-base text-slate-400">We instantly fetch real-time performance data—audience demographics, engagement rates, growth trends, and more.</p>
                </div>
                <div className="text-center p-8 bg-slate-800 rounded-xl shadow-lg border border-slate-700 hover-glow">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-cyan-500/20 mx-auto">
                         <svg className="h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-white">3. Decide with Data</h3>
                    <p className="mt-2 text-base text-slate-400">Use the Fit Score™, side-by-side comparisons, and one-click PDF reports to select the best creators for your campaign.</p>
                </div>
            </div>
        </section>

        <section id="features" className="section-padding bg-slate-900">
            <div className="max-w-xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">The Tools You Need for Smarter Vetting</h2>
                <p className="mt-4 text-lg text-slate-300">Everything you need to move from discovery to decision with absolute confidence.</p>
            </div>
            <div className="mt-12 max-w-7xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-6 bg-slate-800 rounded-lg border border-slate-700 flex items-start space-x-4 hover-glow">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center"><svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg></div>
                    <div>
                        <h3 className="font-bold text-white">The Collexiq Fit Score™</h3>
                        <p className="mt-1 text-slate-400">Our proprietary score instantly tells you how well a creator aligns with your brand.</p>
                    </div>
                </div>
                <div className="p-6 bg-slate-800 rounded-lg border border-slate-700 flex items-start space-x-4 hover-glow">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-pink-500/20 flex items-center justify-center"><svg className="h-6 w-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                    <div>
                        <h3 className="font-bold text-white">Trustable Profile Cards</h3>
                        <p className="mt-1 text-slate-400">Get a complete, unbiased view with API-verified data: follower growth, real ER, and demographics.</p>
                    </div>
                </div>
                <div className="p-6 bg-slate-800 rounded-lg border border-slate-700 flex items-start space-x-4 hover-glow">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center"><svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg></div>
                    <div>
                        <h3 className="font-bold text-white">Side-by-Side Comparisons</h3>
                        <p className="mt-1 text-slate-400">Shortlist candidates and compare them head-to-head on key metrics to easily spot the top performer.</p>
                    </div>
                </div>
                 <div className="p-6 bg-slate-800 rounded-lg border border-slate-700 flex items-start space-x-4 hover-glow">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center"><svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg></div>
                    <div>
                        <h3 className="font-bold text-white">One-Click Reporting</h3>
                        <p className="mt-1 text-slate-400">Instantly generate a shareable link or a branded PDF report. Perfect for clients and stakeholders.</p>
                    </div>
                </div>
                 <div className="p-6 bg-slate-800 rounded-lg border border-slate-700 flex items-start space-x-4 hover-glow">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-pink-500/20 flex items-center justify-center"><svg className="h-6 w-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                    <div>
                        <h3 className="font-bold text-white">Fraud & Quality Flags</h3>
                        <p className="mt-1 text-slate-400">Our heuristics automatically flag suspicious activity with a simple Green/Amber/Red badge.</p>
                    </div>
                </div>
                 <div className="p-6 bg-slate-800 rounded-lg border border-slate-700 flex items-start space-x-4 hover-glow">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center"><svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg></div>
                    <div>
                        <h3 className="font-bold text-white">Deep Performance Snapshots</h3>
                        <p className="mt-1 text-slate-400">Track recent performance (30/90 days) including reach, impressions, saves, and reel completion rates.</p>
                    </div>
                </div>
            </div>
        </section>

        <section className="section-padding bg-slate-900/50">
            <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-left">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">What's Inside the Fit Score™?</h2>
                    <p className="mt-4 text-lg text-slate-300">Our transparent, weighted algorithm gives you a holistic view of a creator's value to your brand.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-4 flex items-start gap-4">
                        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center"><svg className="h-6 w-6 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3 3 0 013 10.5V18a3 3 0 01-3-3v-2.25m15 5.25v-2.25m-15 0a3 3 0 013-3H6a3 3 0 013 3v2.25m0 0a3 3 0 013-3h3a3 3 0 013 3v2.25" /></svg></div>
                        <div><h4 className="font-semibold text-white">Audience Match</h4><p className="text-purple-400 font-bold">35%</p></div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 flex items-start gap-4">
                        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-pink-500/20 flex items-center justify-center"><svg className="h-6 w-6 text-pink-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg></div>
                        <div><h4 className="font-semibold text-white">Engagement</h4><p className="text-pink-400 font-bold">25%</p></div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 flex items-start gap-4">
                        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center"><svg className="h-6 w-6 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg></div>
                        <div><h4 className="font-semibold text-white">Growth</h4><p className="text-cyan-400 font-bold">15%</p></div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 flex items-start gap-4">
                        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center"><svg className="h-6 w-6 text-amber-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" /></svg></div>
                        <div><h4 className="font-semibold text-white">Consistency</h4><p className="text-amber-400 font-bold">15%</p></div>
                    </div>
                </div>
            </div>
        </section>

        <section id="pricing" className="section-padding bg-slate-900">
            <div className="max-w-xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Simple, Scalable Pricing</h2>
                <p className="mt-4 text-lg text-slate-300">Choose the plan that's right for you. Cancel anytime.</p>
            </div>
            <div className="mt-12 max-w-5xl mx-auto grid gap-8 lg:grid-cols-3 items-stretch">
                <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 hover-glow flex flex-col">
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold text-cyan-400">Starter</h3>
                        <p className="mt-2 text-slate-400">Perfect for small businesses and single brands.</p>
                        <p className="mt-6"><span className="text-4xl font-extrabold text-white">$19</span> <span className="text-base font-medium text-slate-400">/ mo</span></p>
                    </div>
                    <div className="mt-8">
                        <a href="# " className="block w-full bg-slate-700 text-white text-center py-3 rounded-md font-semibold hover:bg-slate-600 transition-all">Choose Starter</a>
                        <ul className="mt-8 space-y-4 text-slate-300 text-left">
                            <li className="flex items-start"><svg className="flex-shrink-0 h-6 w-6 text-cyan-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>10 Creator Reports / mo</li>
                            <li className="flex items-start"><svg className="flex-shrink-0 h-6 w-6 text-cyan-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>2 Projects</li>
                            <li className="flex items-start"><svg className="flex-shrink-0 h-6 w-6 text-cyan-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>Basic PDF Exports</li>
                            <li className="flex items-start"><svg className="flex-shrink-0 h-6 w-6 text-cyan-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>Fit Score™ & Verified Stats</li>
                        </ul>
                    </div>
                </div>
                <div className="bg-slate-800 rounded-xl p-8 relative shadow-2xl gradient-border hover-glow transform lg:scale-105 flex flex-col">
                     <p className="absolute top-0 -translate-y-1/2 gradient-bg text-white text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full">Most Popular</p>
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold gradient-text">Pro</h3>
                        <p className="mt-2 text-slate-400">For marketers and small agencies managing multiple campaigns.</p>
                        <p className="mt-6"><span className="text-4xl font-extrabold text-white">$59</span> <span className="text-base font-medium text-slate-400">/ mo</span></p>
                    </div>
                    <div className="mt-8">
                        <a href="# " className="block w-full gradient-bg text-white text-center py-3 rounded-md font-semibold hover:opacity-90 transition-all">Choose Pro</a>
                        <ul className="mt-8 space-y-4 text-slate-300 text-left">
                            <li className="flex items-start"><svg className="flex-shrink-0 h-6 w-6 text-cyan-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>50 Creator Reports / mo</li>
                            <li className="flex items-start"><svg className="flex-shrink-0 h-6 w-6 text-cyan-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>10 Projects</li>
                            <li className="flex items-start"><svg className="flex-shrink-0 h-6 w-6 text-cyan-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>Compare up to 5 Creators</li>
                            <li className="flex items-start"><svg className="flex-shrink-0 h-6 w-6 text-cyan-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>Custom Logo on PDFs</li>
                            <li className="flex items-start"><svg className="flex-shrink-0 h-6 w-6 text-cyan-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>Shareable Report Links</li>
                        </ul>
                    </div>
                </div>
                 <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 hover-glow flex flex-col">
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold text-cyan-400">Agency</h3>
                        <p className="mt-2 text-slate-400">For agencies and teams that need scale and power.</p>
                        <p className="mt-6"><span className="text-4xl font-extrabold text-white">$199</span> <span className="text-base font-medium text-slate-400">/ mo</span></p>
                    </div>
                    <div className="mt-8">
                        <a href="# " className="block w-full bg-slate-700 text-white text-center py-3 rounded-md font-semibold hover:bg-slate-600 transition-all">Contact Us</a>
                        <ul className="mt-8 space-y-4 text-slate-300 text-left">
                            <li className="flex items-start"><svg className="flex-shrink-0 h-6 w-6 text-cyan-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>200+ Creator Reports</li>
                            <li className="flex items-start"><svg className="flex-shrink-0 h-6 w-6 text-cyan-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>Unlimited Projects</li>
                            <li className="flex items-start"><svg className="flex-shrink-0 h-6 w-6 text-cyan-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>Team Seats</li>
                            <li className="flex items-start"><svg className="flex-shrink-0 h-6 w-6 text-cyan-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>API Export</li>
                            <li className="flex items-start"><svg className="flex-shrink-0 h-6 w-6 text-cyan-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>Priority Support (SLA)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section id="faq" className="section-padding bg-slate-900/50">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Frequently Asked Questions</h2>
                <p className="mt-4 text-lg text-slate-300">Have questions? We've got answers. If you don't see what you're looking for, feel free to contact us.</p>
            </div>
            <div className="mt-12 max-w-3xl mx-auto space-y-4">
                <div className="bg-slate-800 rounded-lg">
                    <button className="faq-question w-full flex justify-between items-center text-left p-6">
                        <span className="text-lg font-semibold text-white">How is the Fit Score™ calculated?</span>
                        <svg className="w-6 h-6 text-slate-400 transform transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className="faq-answer px-6 pb-6">
                        <p className="text-slate-400">The Fit Score™ blends Audience Match (35%), Engagement (25%), Growth (15%), Consistency (15%), and Relevance (10%) into one transparent score.</p>
                    </div>
                </div>
                <div className="bg-slate-800 rounded-lg">
                    <button className="faq-question w-full flex justify-between items-center text-left p-6">
                        <span className="text-lg font-semibold text-white">Is the data from Instagram accurate?</span>
                        <svg className="w-6 h-6 text-slate-400 transform transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className="faq-answer px-6 pb-6">
                        <p className="text-slate-400">Yes. We use the official Instagram Graph API with creator consent—no scraping—so numbers are verified and up-to-date.</p>
                    </div>
                </div>
                <div className="bg-slate-800 rounded-lg">
                    <button className="faq-question w-full flex justify-between items-center text-left p-6">
                        <span className="text-lg font-semibold text-white">Can I cancel anytime?</span>
                        <svg className="w-6 h-6 text-slate-400 transform transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className="faq-answer px-6 pb-6">
                        <p className="text-slate-400">Absolutely. Cancel monthly plans whenever you like; access persists through the current billing cycle.</p>
                    </div>
                </div>
                <div className="bg-slate-800 rounded-lg">
                    <button className="faq-question w-full flex justify-between items-center text-left p-6">
                        <span className="text-lg font-semibold text-white">How do you ensure creator privacy?</span>
                        <svg className="w-6 h-6 text-slate-400 transform transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className="faq-answer px-6 pb-6">
                        <p className="text-slate-400">Access is consent-based via OAuth. Creators can revoke at any time. We never store passwords.</p>
                    </div>
                </div>
            </div>
        </section>

        <section className="section-padding">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Ready to Build Your Most Successful Influencer Campaign Yet?</h2>
                <p className="mt-4 text-lg text-slate-300">Stop wasting time and money on the wrong creators. Get the verified data and clear insights you need to drive real results.</p>
                <a href="# " className="mt-8 inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-lg text-white gradient-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-pink-500 transition-transform hover:scale-105">
                    Get Started with 10 Free Reports
                </a>
            </div>
        </section>

        <footer className="bg-slate-900 border-t border-slate-700">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center space-x-2">
                             <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="logoGradientFooter" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#A855F7"></stop>
                                        <stop offset="100%" stopColor="#EC4899"></stop>
                                    </linearGradient>
                                </defs>
                                 <rect width="32" height="32" rx="8" fill="url(#logoGradientFooter)"/>
                                 <circle cx="15" cy="15" r="6" stroke="white" strokeWidth="2.5"/>
                                 <line x1="19.5" y1="19.5" x2="25" y2="25" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                            <span className="text-2xl font-bold text-white">Collex<span className="gradient-text">IQ</span></span>
                        </div>
                        <p className="mt-2 text-sm text-slate-400">© 2025 CollexIQ.com. All rights reserved.</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">Links</h4>
                        <ul className="mt-4 space-y-2 text-slate-400">
                            <li><a href="#features" className="hover:text-white">Features</a></li>
                            <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                            <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">Resources</h4>
                        <ul className="mt-4 space-y-2 text-slate-400">
                            <li><a href="# " className="hover:text-white">Blog</a></li>
                            <li><a href="# " className="hover:text-white">Case Studies</a></li>
                            <li><a href="# " className="hover:text-white">Free Tools</a></li>
                        </ul>
                    </div>
                     <div>
                        <h4 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">Company</h4>
                        <ul className="mt-4 space-y-2 text-slate-400">
                            <li><a href="# " className="hover:text-white">About Us</a></li>
                            <li><a href="# " className="hover:text-white">Contact</a></li>
                            <li><button id="openPrivacyModal" className="hover:text-white text-left">Privacy Policy</button></li>
                            <li><button id="openTermsModal" className="hover:text-white text-left">Terms of Service</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>

        <div id="privacyModal" className="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
                <button id="closePrivacyModal" className="absolute top-4 right-4 text-slate-400 hover:text-white">&times;</button>
                <div className="prose prose-dark lg:prose-xl mx-auto">
                    <h1>Privacy Policy for CollexIQ</h1>
                    <p className="text-slate-400">Last updated: September 25, 2025</p>
                    <p>We are committed to protecting your personal information and your right to privacy. If you have any questions about this notice or our practices, contact us.</p>
                </div>
            </div>
        </div>

        <div id="termsModal" className="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
                <button id="closeTermsModal" className="absolute top-4 right-4 text-slate-400 hover:text-white">&times;</button>
                <div className="prose prose-dark lg:prose-xl mx-auto">
                    <h1>Terms and Conditions</h1>
                    <p className="text-slate-400">Last updated: September 25, 2025</p>
                    <p>By using our services, you agree to be bound by these Terms.</p>
                </div>
            </div>
        </div>
    </main>
    </>
  );
}

export default App;
