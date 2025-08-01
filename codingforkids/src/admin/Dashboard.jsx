import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="admin-dashboard d-flex flex-column flex-lg-row vh-100 bg-light">
      {/* Mobile Header */}
      <header className="d-lg-none bg-white shadow-sm p-3 d-flex justify-content-between align-items-center sticky-top">
        <button 
          className="btn btn-outline-primary btn-sm rounded-circle"
          onClick={toggleMobileSidebar}
          aria-label="Toggle menu"
        >
          <i className="bi bi-list"></i>
        </button>
        <h5 className="mb-0 fw-bold text-primary">Admin Panel</h5>
        <div className="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center">
          <i className="bi bi-person-fill text-white"></i>
        </div>
      </header>

      {/* Sidebar - Desktop */}
      <aside 
        className={`admin-sidebar d-none d-lg-flex flex-column p-4 bg-dark text-white ${sidebarCollapsed ? 'collapsed' : ''}`}
        style={{ minWidth: sidebarCollapsed ? '80px' : '280px' }}
      >
        <div className="d-flex flex-column h-100">
          {/* Branding */}
          <div className={`mb-5 ${sidebarCollapsed ? 'text-center' : ''}`}>
            {!sidebarCollapsed ? (
              <div>
                <h4 className="fw-bold text-primary mb-2">
                  <i className="bi bi-shield-lock me-2"></i>
                  Admin Panel
                </h4>
                <p className="text-muted small">Management Console</p>
              </div>
            ) : (
              <div className="py-2">
                <i className="bi bi-shield-lock fs-4 text-primary"></i>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-grow-1 overflow-auto">
            <ul className="nav flex-column">
              <NavItem 
                to="../add" 
                icon="bi-plus-circle" 
                label="Add Programme" 
                collapsed={sidebarCollapsed}
              />
              <NavItem 
                to="../programmelist" 
                icon="bi-list-ul" 
                label="Programme List" 
                collapsed={sidebarCollapsed}
              />
              <NavItem 
                to="../pending-enrollments" 
                icon="bi-hourglass-split" 
                label="Pending Enrollments" 
                collapsed={sidebarCollapsed}
              />
              <NavItem 
                to="../lectures" 
                icon="bi-collection-play" 
                label="Lecture List" 
                collapsed={sidebarCollapsed}
              />
              <NavItem 
                to="../lectures/add" 
                icon="bi-plus-square" 
                label="Add Lecture" 
                collapsed={sidebarCollapsed}
              />
              <NavItem 
                to="../chat" 
                icon="bi-chat-left-text" 
                label="Admin Chat" 
                collapsed={sidebarCollapsed}
              />
            </ul>
          </nav>

          {/* Footer */}
          <footer className="mt-auto pt-3 border-top border-secondary">
            <div className="d-flex align-items-center">
              <div className={`${sidebarCollapsed ? 'mx-auto' : 'me-3'}`}>
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                  style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-person-fill text-white"></i>
                </div>
              </div>
              {!sidebarCollapsed && (
                <div>
                  <p className="mb-0 small fw-bold">Admin User</p>
                  <p className="mb-0 text-muted small">Administrator</p>
                </div>
              )}
            </div>
          </footer>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      <div className={`mobile-sidebar-overlay ${mobileSidebarOpen ? 'active' : ''}`} 
           onClick={toggleMobileSidebar}></div>
      <aside 
        className={`mobile-sidebar d-lg-none p-4 bg-dark text-white ${mobileSidebarOpen ? 'open' : ''}`}
      >
        <div className="d-flex flex-column h-100">
          <div className="mb-5">
            <h4 className="fw-bold text-primary mb-2">
              <i className="bi bi-shield-lock me-2"></i>
              Admin Panel
            </h4>
            <p className="text-muted small">Management Console</p>
          </div>

          <nav className="flex-grow-1 overflow-auto">
            <ul className="nav flex-column">
              <NavItem 
                to="add" 
                icon="bi-plus-circle" 
                label="Add Programme" 
              />
              <NavItem 
                to="programmelist" 
                icon="bi-list-ul" 
                label="Programme List" 
              />
              <NavItem 
                to="pending-enrollments" 
                icon="bi-hourglass-split" 
                label="Pending Enrollments" 
              />
              <NavItem 
                to="lectures" 
                icon="bi-collection-play" 
                label="Lecture List" 
              />
              <NavItem 
                to="lectures/add" 
                icon="bi-plus-square" 
                label="Add Lecture" 
              />
              <NavItem 
                to="chat" 
                icon="bi-chat-left-text" 
                label="Admin Chat" 
              />
            </ul>
          </nav>

          <footer className="mt-auto pt-3 border-top border-secondary">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                  style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-person-fill text-white"></i>
                </div>
              </div>
              <div>
                <p className="mb-0 small fw-bold">Admin User</p>
                <p className="mb-0 text-muted small">Administrator</p>
              </div>
            </div>
          </footer>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-content flex-grow-1 d-flex flex-column overflow-auto">
        {/* Content Header */}
        <header className="content-header bg-white shadow-sm p-3 p-lg-4 border-bottom sticky-top">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <button 
                className="btn btn-outline-secondary btn-sm rounded-circle me-3 d-lg-none"
                onClick={toggleMobileSidebar}
                aria-label="Toggle menu"
              >
                <i className="bi bi-list"></i>
              </button>
              <h5 className="mb-0 fw-bold">Dashboard Overview</h5>
            </div>
            <div>
              <button className="btn btn-outline-secondary btn-sm rounded-circle me-2 position-relative">
                <i className="bi bi-bell"></i>
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                  <span className="visually-hidden">Notifications</span>
                </span>
              </button>
              <button className="btn btn-outline-secondary btn-sm rounded-circle">
                <i className="bi bi-gear"></i>
              </button>
            </div>
          </div>
        </header>
        
        {/* Content Body */}
        <div className="content-body p-3 p-lg-4 flex-grow-1">
          <Outlet />
        </div>
      </main>

      {/* Fixed CSS - Removed JSX style tag */}
    </div>
  );
};

const NavItem = ({ to, icon, label, collapsed }) => {
  return (
    <li className="nav-item mb-2">
      <NavLink 
        to={to} 
        className={({ isActive }) => 
          `nav-link d-flex align-items-center py-3 px-3 rounded-3 ${isActive ? 'active bg-primary text-white' : ''}`
        }
        end
      >
        <i className={`bi ${icon} ${collapsed ? 'me-0' : 'me-3'}`}></i>
        {!collapsed && <span>{label}</span>}
      </NavLink>
    </li>
  );
};

export default Dashboard;