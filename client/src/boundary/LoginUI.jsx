import { useNavigate } from 'react-router-dom';
import LoginContainer from '../components/LoginContainer';

function LoginUI() {
  const navigate = useNavigate();

  const handleLogin = async (loginEmail, password) => {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ email: loginEmail, password })
    });

    const data = await res.json();

    if (!data.success) {
      alert('Login failed');
      return;
    }
    console.log('LOGIN RESPONSE:', data);

    // ✅ THIS WAS MISSING / WRONG BEFORE
    localStorage.setItem('email', loginEmail);
    localStorage.setItem('userType', data.user.user_type);

    // Navigate based on role
    switch (data.user.user_type) {
      case 'admin':
        alert('Login successful');
        navigate('/admin');
        break;
      case 'staff':
        alert('Login successful');
        navigate('/staff');
        break;
      case 'clinician':
        alert('Login successful');
        navigate('/clinician');
        break;
      case 'patient':
        alert('Login successful');
        navigate('/patient');
        break;
      default:
        alert('Unknown role');
    }
  };

  return <LoginContainer onLogin={handleLogin} />;
}

export default LoginUI;