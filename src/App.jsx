import React, { useEffect, useRef, useState, useCallback } from 'react';
import './App.css';

// Redux-like state management using React Context
const AppContext = React.createContext();

const initialState = {
  animation: {
    currentScene: 0,
    scrollProgress: 0,
    activeFeatures: []
  },
  ui: {
    isMobileMenuOpen: false,
    theme: 'light',
    isLoading: false,
    notifications: []
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_SCENE':
      return {
        ...state,
        animation: { ...state.animation, currentScene: action.payload }
      };
    case 'SET_SCROLL_PROGRESS':
      return {
        ...state,
        animation: { ...state.animation, scrollProgress: action.payload }
      };
    case 'SET_ACTIVE_FEATURES':
      return {
        ...state,
        animation: { ...state.animation, activeFeatures: action.payload }
      };
    case 'TOGGLE_MOBILE_MENU':
      return {
        ...state,
        ui: { ...state.ui, isMobileMenuOpen: !state.ui.isMobileMenuOpen }
      };
    case 'SET_THEME':
      return {
        ...state,
        ui: { ...state.ui, theme: action.payload }
      };
    default:
      return state;
  }
};

// Custom hook for scroll animations
const useScrollAnimation = (ref, options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: options.threshold || 0.1 }
    );

    observer.observe(element);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ref, options.threshold]);

  return { isVisible, scrollY };
};

// Chrome Logo Component
const ChromeLogo = ({ size = 80, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="chrome-red" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ea4335" />
        <stop offset="100%" stopColor="#d33b2c" />
      </linearGradient>
      <linearGradient id="chrome-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbc04" />
        <stop offset="100%" stopColor="#f9ab00" />
      </linearGradient>
      <linearGradient id="chrome-green" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34a853" />
        <stop offset="100%" stopColor="#0f9d58" />
      </linearGradient>
      <linearGradient id="chrome-blue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4285f4" />
        <stop offset="100%" stopColor="#3367d6" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#chrome-blue)" />
    <path
      d="M50 5 A45 45 0 0 1 83.3 72.5 L66.7 57.5 A25 25 0 0 0 50 25 Z"
      fill="url(#chrome-red)"
    />
    <path
      d="M16.7 72.5 A45 45 0 0 1 50 5 L50 25 A25 25 0 0 0 33.3 57.5 Z"
      fill="url(#chrome-yellow)"
    />
    <path
      d="M83.3 72.5 A45 45 0 0 1 16.7 72.5 L33.3 57.5 A25 25 0 0 0 66.7 57.5 Z"
      fill="url(#chrome-green)"
    />
    <circle cx="50" cy="50" r="15" fill="white" />
  </svg>
);

// Header Component
const Header = () => {
  const { state, dispatch } = React.useContext(AppContext);
  const headerRef = useRef();
  const [isScrolled, setIsScrolled] = useState(false);
  
  const scenes = ['Browser', 'Extensions', 'Tabs', 'Security'];

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      ref={headerRef} 
      className={`header ${isScrolled ? 'header--scrolled' : ''}`}
    >
      <div className="header__container">
        <div className="header__logo">
          <ChromeLogo size={32} />
          <span>Chrome</span>
        </div>
        
        <nav className="header__nav">
          <div className="header__scene-indicator">
            Scene: {scenes[state.animation.currentScene]} 
            <span className="header__progress">
              ({Math.round(state.animation.scrollProgress * 100)}%)
            </span>
          </div>
        </nav>

        <button
          className="header__menu-toggle"
          onClick={() => dispatch({ type: 'TOGGLE_MOBILE_MENU' })}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

// Hero Section Component
const HeroSection = () => {
  const heroRef = useRef();
  const { isVisible } = useScrollAnimation(heroRef);
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    if (isVisible && !animationStarted) {
      setAnimationStarted(true);
    }
  }, [isVisible, animationStarted]);

  return (
    <section ref={heroRef} className="hero">
      <div className="hero__container">
        <div className={`hero__logo ${animationStarted ? 'hero__logo--animate' : ''}`}>
          <ChromeLogo size={120} />
        </div>
        
        <h1 className={`hero__title ${animationStarted ? 'hero__title--animate' : ''}`}>
          The browser built to be yours
        </h1>
        
        <p className={`hero__subtitle ${animationStarted ? 'hero__subtitle--animate' : ''}`}>
          Fast, secure, and customizable. Chrome adapts to your way of browsing.
        </p>
        
        <button className={`hero__cta ${animationStarted ? 'hero__cta--animate' : ''}`}>
          Experience Chrome
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </button>
      </div>
      
      <div className="hero__scroll-indicator">
        <div className="hero__scroll-text">Scroll to explore</div>
        <div className="hero__scroll-arrow">↓</div>
      </div>
    </section>
  );
};

// Scroll Animation Section Component
const ScrollAnimationSection = () => {
  const { dispatch } = React.useContext(AppContext);
  const sectionRef = useRef();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const scenes = [
    {
      title: "Lightning Fast",
      subtitle: "Browse at the speed of thought",
      features: ["V8 JavaScript Engine", "Fast Page Loading", "Optimized Performance"],
      icon: "⚡",
      color: "#4285f4"
    },
    {
      title: "Powerful Extensions",
      subtitle: "Customize your browsing experience",
      features: ["Chrome Web Store", "Developer Tools", "Custom Themes"],
      icon: "🧩",
      color: "#34a853"
    },
    {
      title: "Smart Tabs",
      subtitle: "Organize and manage effortlessly",
      features: ["Tab Groups", "Memory Optimization", "Tab Search"],
      icon: "📑",
      color: "#fbbc04"
    },
    {
      title: "Advanced Security",
      subtitle: "Browse with confidence",
      features: ["Safe Browsing", "Automatic Updates", "Sandboxing"],
      icon: "🔒",
      color: "#ea4335"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress through the section
      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        const progress = Math.abs(rect.top) / (rect.height - windowHeight);
        const clampedProgress = Math.max(0, Math.min(1, progress));
        
        // Calculate current scene based on progress
        const sceneIndex = Math.floor(clampedProgress * scenes.length);
        const clampedSceneIndex = Math.min(sceneIndex, scenes.length - 1);
        
        setScrollProgress(clampedProgress);
        setCurrentSceneIndex(clampedSceneIndex);
        
        // Update Redux state
        dispatch({ type: 'SET_CURRENT_SCENE', payload: clampedSceneIndex });
        dispatch({ type: 'SET_SCROLL_PROGRESS', payload: clampedProgress });
        dispatch({ type: 'SET_ACTIVE_FEATURES', payload: scenes[clampedSceneIndex]?.features || [] });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch, scenes]);

  return (
    <section ref={sectionRef} className="scroll-animation">
      <div className="scroll-animation__container">
        {scenes.map((scene, index) => (
          <div
            key={index}
            className={`scroll-animation__content ${
              index === currentSceneIndex ? 'scroll-animation__content--active' : ''
            }`}
            style={{ '--scene-color': scene.color }}
          >
            <div className="scroll-animation__icon">{scene.icon}</div>
            <h2 className="scroll-animation__title">{scene.title}</h2>
            <p className="scroll-animation__subtitle">{scene.subtitle}</p>
            
            <div className="scroll-animation__features">
              {scene.features.map((feature, fIndex) => (
                <div 
                  key={fIndex} 
                  className="scroll-animation__feature"
                  style={{ 
                    animationDelay: `${fIndex * 0.1}s`,
                    opacity: index === currentSceneIndex ? 1 : 0,
                    transform: index === currentSceneIndex ? 'translateY(0)' : 'translateY(20px)'
                  }}
                >
                  <div className="scroll-animation__feature-icon">✓</div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="scroll-animation__progress">
        <div className="scroll-animation__progress-bar">
          <div 
            className="scroll-animation__progress-fill"
            style={{ width: `${scrollProgress * 100}%` }}
          ></div>
        </div>
      </div>
    </section>
  );
};

// Final Section Component
const FinalSection = () => {
  const { state } = React.useContext(AppContext);
  const sectionRef = useRef();
  const { isVisible } = useScrollAnimation(sectionRef, { threshold: 0.3 });

  const scenes = ['Browser', 'Extensions', 'Tabs', 'Security'];

  return (
    <section ref={sectionRef} className="final">
      <div className="final__container">
        <div className={`final__content ${isVisible ? 'final__content--animate' : ''}`}>
          <h2 className="final__title">Ready to get started?</h2>
          <p className="final__subtitle">
            Join millions who browse with Chrome every day
          </p>
          
          <div className="final__features">
            <div className="final__feature">
              <div className="final__feature-icon">🚀</div>
              <h3>Fast & Reliable</h3>
              <p>Optimized for speed and stability</p>
            </div>
            <div className="final__feature">
              <div className="final__feature-icon">🔐</div>
              <h3>Secure & Private</h3>
              <p>Advanced security features built-in</p>
            </div>
            <div className="final__feature">
              <div className="final__feature-icon">🎨</div>
              <h3>Customizable</h3>
              <p>Make it yours with themes and extensions</p>
            </div>
          </div>
          
          <button className="final__cta">
            Download Chrome
            <ChromeLogo size={24} className="final__cta-icon" />
          </button>
        </div>
        
        <div className={`final__state ${isVisible ? 'final__state--animate' : ''}`}>
          <h3>Current State</h3>
          <div className="final__state-item">
            <strong>Scene:</strong> {scenes[state.animation.currentScene]}
          </div>
          <div className="final__state-item">
            <strong>Progress:</strong> {Math.round(state.animation.scrollProgress * 100)}%
          </div>
          <div className="final__state-item">
            <strong>Active Features:</strong>
            <ul>
              {state.animation.activeFeatures.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main App Component
const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div className="app">
        <Header />
        <main className="main">
          <HeroSection />
          <ScrollAnimationSection />
          <FinalSection />
        </main>
      </div>
    </AppContext.Provider>
  );
};

export default App;
