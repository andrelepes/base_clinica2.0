import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function ProtectedPageLayout({ redirectPath }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <>
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </>
  );
}
