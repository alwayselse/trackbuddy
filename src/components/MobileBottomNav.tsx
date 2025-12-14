import { NavLink } from 'react-router-dom';
import { Clock, Target, TrendingUp } from 'lucide-react';
import './MobileBottomNav.css';

export default function MobileBottomNav() {
  const navItems = [
    { path: '/', icon: Clock, label: 'Log' },
    { path: '/goals', icon: Target, label: 'Goals' },
    { path: '/progress', icon: TrendingUp, label: 'Progress' },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map(({ path, icon: Icon, label }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => 
            `mobile-nav-item ${isActive ? 'mobile-nav-active' : ''}`
          }
        >
          <Icon size={22} strokeWidth={2.5} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
