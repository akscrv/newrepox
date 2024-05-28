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
// import AdminUserList from './components/AdminUserList/AdminUserList';
import CompanyDetails from './pages/CompanyDetailsAll/CompanyDetails';
import Clients from './pages/Clients/Clients';
import AdminAgency from './pages/Admin/AdminAgency/AdminAgency';
import Apro from './pages/Apro/Apro';
import Aoperation from './pages/Aoperation/Aoperation';
import Aworker from './pages/Aworker/Aworker';
import AdminOfficeStaff from './pages/Admin/AdminOfficeStaff/AdminOfficeStaff';
import AdminRepoAgent from './pages/Admin/AdminRepoAgent/AdminRepoAgent';
import CompanyOfficeStaff from './pages/Company/CompanyOfficeStaff/CompanyOfficeStaff';
import CompanyAgent from './pages/Company/CompanyAgent/CompanyAgent';
import AdminClient from './pages/Admin/AdminClient/AdminClient';
import Documents from './pages/Adocuments/Documents';
import DataList from './pages/Adocuments/DataList';
import DocumentAccess from './pages/Adocuments/DocumentAccess';
import AdminSearch from './pages/Admin/AdminSearch/AdminSearch';

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

            <Route path="/apro" element={<PrivateRoute element={<Apro />} allowedRoles={['Apro']} />} />
            <Route path="/aoperation" element={<PrivateRoute element={<Aoperation />} allowedRoles={['Aoperationteam']} />} />
            <Route path="/aworker" element={<PrivateRoute element={<Aworker />} allowedRoles={['Aworker']} />} />


            <Route path="/admin-document" element={<PrivateRoute element={<Documents />} allowedRoles={['Admin']} />} />
            <Route path="/admin-document/:id" element={<PrivateRoute element={<DataList />} allowedRoles={['Admin']} />} />
            <Route path="/admin-document/access/:id" element={<PrivateRoute element={<DocumentAccess />} allowedRoles={['Admin']} />} />
            <Route path="/admin-search" element={<PrivateRoute element={<AdminSearch />} allowedRoles={['Admin']} />} />

            <Route path="/admin-agency" element={<PrivateRoute element={<AdminAgency />} allowedRoles={['Admin']} />} />
            <Route path="/admin-staff" element={<PrivateRoute element={<AdminOfficeStaff />} allowedRoles={['Admin']} />} />
            <Route path="/admin-agent" element={<PrivateRoute element={<AdminRepoAgent />} allowedRoles={['Admin']} />} />
            <Route path="/admin-client" element={<PrivateRoute element={<AdminClient />} allowedRoles={['Admin']} />} />

            <Route path="/company/:companyId" element={<PrivateRoute element={<CompanyDetails />} allowedRoles={['Admin']} />} />


            <Route path="/company" element={<PrivateRoute element={<Company />} allowedRoles={['Company']} />} />
            <Route path="/company-staff" element={<PrivateRoute element={<CompanyOfficeStaff />} allowedRoles={['Company']} />} />
            <Route path="/company-agent" element={<PrivateRoute element={<CompanyAgent />} allowedRoles={['Company']} />} />

            <Route path="/pro" element={<PrivateRoute element={<Pro />} allowedRoles={['Pro']} />} />
            <Route path="/operation" element={<PrivateRoute element={<Operationteam />} allowedRoles={['Operation']} />} />
            <Route path="/worker" element={<PrivateRoute element={<Worker />} allowedRoles={['Worker']} />} />
            <Route path="/company-clients" element={<PrivateRoute element={<Clients />} allowedRoles={['Company']} />} />





          </Routes>
        </Router>
      </Provider>
    </>
  );
}

export default App;
