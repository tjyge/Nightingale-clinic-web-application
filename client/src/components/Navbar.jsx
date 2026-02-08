import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [usernameStored, setUsernameStored] = useState('');
  const [userType, setUserType] = useState('admin');
  const location = useLocation(); // Get current location

  useEffect(() => {
    const stored = localStorage.getItem('loggedInUser');
    setUsernameStored(stored || 'admin');
    
    // Determine user type from localStorage or URL
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType) {
      setUserType(storedUserType);
    } else {
      // Fallback: determine from URL if available
      const path = location.pathname;
      if (path.includes('cleaner')) {
        setUserType('cleaner');
      } else if (path.includes('homeowner')) {
        setUserType('homeowner');
      } else if (path.includes('platformadmin')) {
        setUserType('platformAdmin');
      } else if (path.includes('accountmanagement') || path.includes('profilemanagement')) {
        setUserType('admin');
      }
    }
  }, [location]);
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userType');
    window.location.href = '/'; // redirect to login or home
  };

  const navbarStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const logoStyle = {
    height: '40px',
    width: '40px'
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '2rem',
    marginLeft: '2rem'
  };

  const linkStyle = {
    color: 'var(--black)',
    textDecoration: 'none',
    fontSize: '1rem'
  };

  const profileContainerStyle = {
    marginLeft: 'auto',
    position: 'relative'
  };

  const profileButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer'
  };

  const profileCircleStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--gray)'
  };

  const arrowDownStyle = {
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '5px solid var(--black)'
  };

  const dropdownStyle = {
    position: 'absolute',
    right: 0,
    top: '100%',
    backgroundColor: 'white',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    width: '200px',
    padding: '1rem',
    zIndex: 999
  };

  return (
    <nav style={navbarStyle}>
      <div style={logoContainerStyle}>
        <img src={logo} alt="TidyMatch Logo" style={logoStyle} />
      </div>
        <div style={navLinksStyle}>
        {userType === 'admin' && (
          <>
            <Link 
              to="/accountmanagement" 
              style={{
                ...linkStyle, 
                fontWeight: location.pathname === '/accountmanagement' ? 'bold' : 'normal' 
              }}
            >
              Account Management
            </Link>
            <Link 
              to="/profilemanagement" 
              style={{
                ...linkStyle, 
                fontWeight: location.pathname === '/profilemanagement' ? 'bold' : 'normal' 
              }}
            >
              Profile Management
            </Link>
          </>
        )}
        
        {userType === 'cleaner' && (
          <>
            <Link 
              to="/cleaner" 
              style={{
                ...linkStyle, 
                fontWeight: location.pathname === '/cleaner' ? 'bold' : 'normal' 
              }}
            >
              Cleaning Services
            </Link>
            <Link 
              to="/cleanerhistory" 
              style={{
                ...linkStyle, 
                fontWeight: location.pathname === '/cleanerhistory' ? 'bold' : 'normal' 
              }}
            >
              Appointment History
            </Link>
          </>
        )}
        
        {userType === 'homeowner' && (
          <>
            <Link 
              to="/homeowner" 
              style={{
                ...linkStyle, 
                fontWeight: location.pathname === '/homeowner' ? 'bold' : 'normal' 
              }}
            >
              Cleaning Services
            </Link>
            <Link 
              to="/homeownershortlist" 
              style={{
                ...linkStyle, 
                fontWeight: location.pathname === '/homeownershortlist' ? 'bold' : 'normal' 
              }}
            >
              Shortlist
            </Link>
            <Link 
              to="/homeownerhistory" 
              style={{
                ...linkStyle, 
                fontWeight: location.pathname === '/homeownerhistory' ? 'bold' : 'normal' 
              }}
            >
              Appointment History
            </Link>
          </>
        )}
        
        {userType === 'platformAdmin' && (
          <>
            <Link 
              to="/platformadmin" 
              style={{
                ...linkStyle, 
                fontWeight: location.pathname === '/platformadmin' ? 'bold' : 'normal' 
              }}
            >
              Service Categories
            </Link>
            <Link 
              to="/platformadminreport" 
              style={{
                ...linkStyle, 
                fontWeight: location.pathname === '/platformadminreport' ? 'bold' : 'normal' 
              }}
            >
              Category report
            </Link>
          </>
        )}
      </div>

      <div style={profileContainerStyle}>
        <div style={profileButtonStyle} onClick={() => setDropdownOpen(prev => !prev)}>
          <div style={profileCircleStyle}></div>
          <div style={arrowDownStyle}></div>
        </div>

        {dropdownOpen && (
          <div style={dropdownStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <div style={{ ...profileCircleStyle, width: '40px', height: '40px' }}></div>
              <div>                <strong>{usernameStored}</strong>
                <div style={{ fontSize: '0.85rem', color: 'gray' }}>
                  {userType === 'admin' && 'User Admin'}
                  {userType === 'cleaner' && 'Cleaner'}
                  {userType === 'homeowner' && 'Homeowner'}
                  {userType === 'platformAdmin' && 'Platform Admin'}
                </div>
              </div>
            </div>
            <hr style={{ margin: '0rem' }} />
            <div style={{ marginTop: '0.5rem' }}>
              <button
                onClick={handleLogout}
                style={{
                  ...linkStyle,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                ↩ Log Out
              </button>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;
