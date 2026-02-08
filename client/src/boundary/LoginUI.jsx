import { useNavigate } from 'react-router-dom';
import LoginContainer from '../components/LoginContainer';

function LoginUI() {
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.success) {
      alert('Login failed.');
      return;
    }

    const { user_id, user_type, clinic_id } = data.user;

    // Store login info
    localStorage.setItem('user_id', user_id);
    localStorage.setItem('user_type', user_type);
    localStorage.setItem('clinic_id', clinic_id);

    alert('Login successful!');

    // Route based on role
    switch (user_type) {
      case 'admin':
        navigate('/admin');
        break;
      case 'staff':
        navigate('/staff');
        break;
      case 'clinician':
        navigate('/clinician');
        break;
      case 'patient':
        navigate('/patient');
        break;
      default:
        alert('Unknown user type');
    }
  };

  return <LoginContainer onLogin={handleLogin} />;
}

export default LoginUI;
