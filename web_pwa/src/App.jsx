import React, { useState, useEffect } from 'react';
import { Schedule, minutesUntilNextDeparture, getNextDepartureTime, formatTime, getOperatingStatus } from './etaEngine';
import { nmrcAquaLineSchedule, stations } from './scheduleData';
import './App.css';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const [schedule] = useState(() => new Schedule(nmrcAquaLineSchedule));
  const [now, setNow] = useState(new Date());
  const [minutesUntilNext, setMinutesUntilNext] = useState(null);
  const [nextTime, setNextTime] = useState(null);
  const [opStatus, setOpStatus] = useState({ status: "Operating", firstHM: "--:--", lastHM: "--:--", freq: "--" });

  const [selectedStation, setSelectedStation] = useState(stations[0]);
  const [direction, setDirection] = useState(localStorage.getItem('direction') || 'Towards Depot');
  
  // Hook to handle service worker updates
  const { needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW();

  // Init theme based on saved preference, falling back to dark mode
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return 'dark';
  });

  // Security: Validate localStorage against our known list of stations
  const getValidStoredStation = (key) => {
    const stored = localStorage.getItem(key);
    return stations.includes(stored) ? stored : null;
  };

  const [homeStation, setHomeStation] = useState(getValidStoredStation('homeStation'));
  const [workStation, setWorkStation] = useState(getValidStoredStation('workStation'));

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent default browser mini-infobar
      setDeferredPrompt(e); // Stash event to trigger our custom button later
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Analytics: Track when the user successfully installs the PWA to their home screen
    const handleAppInstalled = () => {
      if (window.gtag) window.gtag('event', 'pwa_installed');
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    // Analytics: Track if the user opened the app directly from their home screen widget
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      if (window.gtag) window.gtag('event', 'pwa_opened_from_home_screen');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Persist saved stations
  useEffect(() => {
    if (homeStation) localStorage.setItem('homeStation', homeStation);
    if (workStation) localStorage.setItem('workStation', workStation);
    if (direction) localStorage.setItem('direction', direction);
    
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [homeStation, workStation, direction, theme]);

  // Provide native-feeling physical feedback on mobile
  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50); // 50ms light tap
    }
  };

  useEffect(() => {
    const update = () => {
      const currentTime = new Date();
      const stationIndex = stations.indexOf(selectedStation);
      const isTowardsDepot = direction === 'Towards Depot';
      
      setNow(currentTime);
      setMinutesUntilNext(minutesUntilNextDeparture(schedule, currentTime, stationIndex, isTowardsDepot));
      setNextTime(getNextDepartureTime(schedule, currentTime, stationIndex, isTowardsDepot));
      setOpStatus(getOperatingStatus(schedule, currentTime));
    };

    update(); // Initial update
    const timer = setInterval(update, 1000);

    // Instantly refresh data when the app comes back to the foreground/wakes up
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') update();
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', update);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', update);
    };
  }, [schedule, selectedStation, direction]);

  // Swipe Gestures Logic
  const [touchStartPos, setTouchStartPos] = useState({ x: null, y: null });
  const [touchEndPos, setTouchEndPos] = useState({ x: null, y: null });

  const onTouchStart = (e) => {
    setTouchEndPos({ x: null, y: null });
    setTouchStartPos({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchMove = (e) => {
    setTouchEndPos({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchEndHandler = () => {
    if (!touchStartPos.x || !touchEndPos.x) return;
    const distanceX = touchStartPos.x - touchEndPos.x;
    const distanceY = touchStartPos.y - touchEndPos.y;
    
    // Check if it's mostly a horizontal swipe (swipe distance > 50px)
    if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > 50) {
      if (distanceX > 0 && direction !== 'Towards Depot') {
        setDirection('Towards Depot');
        triggerHaptic();
      } else if (distanceX < 0 && direction !== 'Towards Sector 51') {
        setDirection('Towards Sector 51');
        triggerHaptic();
      }
    }
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <h1>Metro Pulse</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="live-time">
              <span className="pulse-dot"></span>
              {formatTime(now)}
            </div>
            <button 
              className="theme-toggle" 
              onClick={() => { setTheme(t => t === 'light' ? 'dark' : 'light'); triggerHaptic(); }}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              )}
            </button>
          </div>
        </div>
        <p className="subtitle">NMRC Aqua Line</p>
      </header>

      <main className="widget" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEndHandler}>

        <div className="eta-display">
          {minutesUntilNext === null ? (
            <div className="no-trains">
              <p className="message">No more trains today</p>
              <p className="note">Next service at {opStatus.firstHM} tomorrow</p>
            </div>
          ) : (
            <div className="next-train">
              <p className="minutes-label">Next train arriving in</p>
              <p className="minutes-value">{minutesUntilNext}</p>
              <p className="minutes-unit">minutes</p>
              {nextTime && (
                <div className="next-time-pill">
                  Departing at {formatTime(nextTime)}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Station Controls */}
        <div className="station-card">
          <div>
            <label className="station-header">Current Station</label>
            <select 
              className="station-select"
              value={selectedStation} 
              onChange={(e) => setSelectedStation(e.target.value)}
            >
              {stations.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>

          <div className="direction-toggle">
            <button 
              className={`dir-btn ${direction === 'Towards Sector 51' ? 'active' : ''}`}
              onClick={() => { setDirection('Towards Sector 51'); triggerHaptic(); }}
            >
              To Sector 51
            </button>
            <button 
              className={`dir-btn ${direction === 'Towards Depot' ? 'active' : ''}`}
              onClick={() => { setDirection('Towards Depot'); triggerHaptic(); }}
            >
              To Depot
            </button>
          </div>

          <div className="quick-actions">
            <div className="action-col">
              <button 
                className="action-btn quick-jump-btn"
                onClick={() => { 
                  if(homeStation) { setSelectedStation(homeStation); } 
                  else { setHomeStation(selectedStation); }
                  triggerHaptic(); 
                }} 
                style={{ 
                  background: homeStation ? 'var(--home-btn-bg)' : 'var(--btn-inactive-bg)', 
                  color: homeStation ? 'var(--home-btn-text)' : 'var(--btn-inactive-text)' 
                }}>
                <span className="quick-jump-icon">🏠</span>
                <span className="quick-jump-text">
                  {homeStation ? homeStation : 'Set Home'}
                </span>
              </button>
              {homeStation ? (
                <button className="set-btn" onClick={() => { setHomeStation(selectedStation); triggerHaptic(); }}>
                  Update Home
                </button>
              ) : (
                <span className="set-btn-hint">Saves current</span>
              )}
            </div>
            
            <div className="action-col">
              <button 
                className="action-btn quick-jump-btn"
                onClick={() => { 
                  if(workStation) { setSelectedStation(workStation); } 
                  else { setWorkStation(selectedStation); }
                  triggerHaptic(); 
                }} 
                style={{ 
                  background: workStation ? 'var(--work-btn-bg)' : 'var(--btn-inactive-bg)', 
                  color: workStation ? 'var(--work-btn-text)' : 'var(--btn-inactive-text)' 
                }}>
                <span className="quick-jump-icon">💼</span>
                <span className="quick-jump-text">
                  {workStation ? workStation : 'Set Work'}
                </span>
              </button>
              {workStation ? (
                <button className="set-btn" onClick={() => { setWorkStation(selectedStation); triggerHaptic(); }}>
                  Update Work
                </button>
              ) : (
                <span className="set-btn-hint">Saves current</span>
              )}
            </div>
          </div>
        </div>

        <div className="info">
          <p><strong>Operating Hours Today:</strong> {opStatus.firstHM} — {opStatus.lastHM}</p>
          <p><strong>Current Frequency:</strong> ~{opStatus.freq} min</p>
        </div>

        {deferredPrompt && (
          <button className="install-app-btn" onClick={handleInstallClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Install App to Home Screen
          </button>
        )}
        
      </main>

      <footer className="footer">
        <p>Metro Pulse — NMRC companion app. Save to your home screen for quick access.</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>
          Unofficial • Community-built • Not affiliated with NMRC
        </p>
      </footer>

      {/* PWA Update Prompt */}
      {needRefresh && (
        <div className="update-toast">
          <span>New version available!</span>
          <button className="update-btn" onClick={() => updateServiceWorker(true)}>Update</button>
          <button className="close-btn" onClick={() => setNeedRefresh(false)}>×</button>
        </div>
      )}
      <Analytics />
    </div>
  );
}
