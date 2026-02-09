// components/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    // Clear auth info
    localStorage.removeItem('email');
    localStorage.removeItem('userType');

    // Redirect to login
    navigate('/');
  };

  return (
    <nav style={navbarStyle}>
      <div style={navbarContentStyle}>
        <div style={logoContainerStyle}>
          <img src="/images.jpg" alt="Nightingale Clinic Logo" style={logoStyle} />
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
      </div>
    </nav>
  );
}

const navbarStyle = {
  position: 'fixed',           // ✅ Fixed to top
  top: 0,                       // ✅ Stick to top
  left: 0,                      // ✅ Start from left edge
  right: 0,                     // ✅ Extend to right edge
  width: '100%',                // ✅ Full width
  backgroundColor: 'white',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  zIndex: 1000,                 // ✅ Stay on top
  padding: '0.75rem 0',         // ✅ Reduced padding (less vertical space)
  marginBottom: '2rem'          // ✅ Space below navbar
};

const navbarContentStyle = {
  display: 'flex',
  alignItems: 'center',
  maxWidth: '1400px',           // ✅ Optional: limit max width for large screens
  margin: '0 auto',             // ✅ Center the content
  padding: '0 2rem'             // ✅ Horizontal padding
};

const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const logoStyle = {
  height: '35px',               // ✅ Slightly smaller logo
  width: '35px'
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
  backgroundColor: '#ccc'
};

const arrowDownStyle = {
  width: 0,
  height: 0,
  borderLeft: '5px solid transparent',
  borderRight: '5px solid transparent',
  borderTop: '5px solid #333'
};

const dropdownStyle = {
  position: 'absolute',
  right: 0,
  top: '100%',
  marginTop: '0.5rem',
  backgroundColor: 'white',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  borderRadius: '8px',
  width: '200px',
  padding: '1rem',
  zIndex: 999
};

export default Navbar;