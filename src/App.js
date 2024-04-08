import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import UserDataPersistence from './components/UserDataPersistence';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import Admin from './pages/Admin/Admin';
import Company from './pages/Company/Company';
import Pro from './pages/Pro/Pro';
import Operationteam from './pages/Operationteam/Operationteam';
import Worker from './pages/Worker/Worker';
import PrivateRoute from './PrivateRoute';
import Unauthorized from './pages/Unauthorized';
import AdminUserList from './components/AdminUserList/AdminUserList';
import CompanyDetails from './pages/CompanyDetailsAll/CompanyDetails';

function App() {
  return (
    <>
      <Provider store={store}>
        <Router>
          <UserDataPersistence />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />




            <Route path="/admin" element={<PrivateRoute element={<Admin />} allowedRoles={['Admin']} />} />
            <Route path="/admin-user-list-page" element={<PrivateRoute element={<AdminUserList />} allowedRoles={['Admin']} />} />

            <Route path="/company/:companyId" element={<PrivateRoute element={<CompanyDetails />} allowedRoles={['Admin']} />} />


            <Route path="/company" element={<PrivateRoute element={<Company />} allowedRoles={['Company']} />} />
            <Route path="/pro" element={<PrivateRoute element={<Pro />} allowedRoles={['Pro']} />} />
            <Route path="/operation" element={<PrivateRoute element={<Operationteam />} allowedRoles={['Operation']} />} />
            <Route path="/worker" element={<PrivateRoute element={<Worker />} allowedRoles={['Worker']} />} />
          </Routes>
        </Router>
      </Provider>
    </>
  );
}

export default App;
