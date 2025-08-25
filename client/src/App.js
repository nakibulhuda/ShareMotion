// client/src/App.js
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AuthForm from './components/AuthForm';
import RideForm from './components/RideForm';
import RideList from './components/RideList';
import RequestForm from './components/RequestForm';
import MyRides from './components/MyRides'; // ← NEW

export default function App() {
  return (
    <Routes>
      <Route element={<Layout/>}>
        <Route index element={<Navigate to="/rides" replace />} />
        <Route path="/login" element={<AuthForm mode="login" />} />
        <Route path="/register" element={<AuthForm mode="register" />} />
        <Route path="/rides" element={<RideList />} />
        <Route path="/post-ride" element={<RideForm />} />
        <Route path="/my-rides" element={<MyRides />} />  {/* NEW */}
        <Route path="/request/:rideId" element={<RequestForm />} />
        <Route path="*" element={<div className="container">Not found</div>} />
      </Route>
    </Routes>
  );
}
