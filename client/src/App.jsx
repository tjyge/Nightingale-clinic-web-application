// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginUI from './boundary/LoginUI';
import AdminManagementUI from './boundary/AdminManagementUI';
import ClinicianManagementUI from './boundary/ClinicianManagementUI';
import StaffManagementUI from './boundary/StaffManagementUI';
import PatientManagementUI from './boundary/PatientManagementUI';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<LoginUI />} />

        {/* Role-based dashboards */}
        <Route path="/admin" element={<AdminManagementUI />} />
        <Route path="/clinician" element={<ClinicianManagementUI />} />
        <Route path="/staff" element={<StaffManagementUI />} />
        <Route path="/patient" element={<PatientManagementUI />} />
      </Routes>
    </Router>
  );
}

export default App;
