import { ReactNode, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Target, Clock, TrendingUp } from 'lucide-react';
import MobileBottomNav from './MobileBottomNav';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { path: '/', icon: Clock, label: 'Time Log' },
    { path: '/goals', icon: Target, label: 'Goals' },
    { path: '/progress', icon: TrendingUp, label: 'Progress' },
  ];

  // Mobile Layout - No header, bottom nav only
  if (isMobile) {
    return (
      <div className="mobile-layout">
        <main className="mobile-main">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  // Desktop Layout - Full header with nav
  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="logo">📊 TrackBuddy</h1>
          </div>

          <nav className="nav">
            {navItems.map(({ path, icon: Icon, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="main">
        {children}
      </main>
    </div>
  );
}
