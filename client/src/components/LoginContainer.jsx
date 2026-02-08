import { useState } from 'react';

function LoginContainer({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const loginContainerStyle = {
    maxWidth: '550px',
    margin: '40px auto',
    marginTop: '80px',
    padding: '40px',
    paddingTop: '110px',
    borderRadius: '25px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    border: '1px solid var(--primary-color)',
    backgroundColor: 'white'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '20px'
  };

  const welcomeStyle = {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '8px'
  };

  const subtitleStyle = {
    color: '#666',
    marginBottom: '30px'
  };

  const formGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--gray)',
    fontSize: '16px',
    boxSizing: 'border-box'
  };

  const primaryButtonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#222',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '10px',
    fontWeight: 'bold'
  };

  return (
    <div style={loginContainerStyle}>
      <div style={headerStyle}>
        <div style={welcomeStyle}>Welcome Back 👋</div>
        <div style={subtitleStyle}>Sign in to get started</div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* EMAIL */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>Email</label>
          <input
            data-testid="email"
            style={inputStyle}
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        {/* PASSWORD */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>Password</label>
          <input
            data-testid="password"
            style={inputStyle}
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" style={primaryButtonStyle}>
          Log In
        </button>
      </form>
    </div>
  );
}

export default LoginContainer;
