import 'antd/dist/antd.min.css'; // or 'antd/dist/antd.less'
import './resources/global.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/Loader';
import { useSelector } from 'react-redux';
import AdminHome from './pages/Admin/AdminHome';
import AdminBuses from './pages/Admin/AdminBuses';
import AdminUsers from './pages/Admin/AdminUsers';
import BookNow from './pages/BookNow';
import Bookings from './pages/Bookings';



function App() {
  const { loading } = useSelector(state => state.alerts)
  return (
    <div className="App">
      {loading && <Loader />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/book-now/:id" element={<ProtectedRoute><BookNow /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          {/* <Route path="/admin" element={<ProtectedRoute><AdminHome /></ProtectedRoute>} /> */}
          <Route path="/admin/buses" element={<ProtectedRoute><AdminBuses /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
