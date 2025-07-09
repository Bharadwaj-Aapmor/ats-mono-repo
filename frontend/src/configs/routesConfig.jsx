import Upload from "../pages/Upload";
import ResumeAnaylze from "../pages/ResumeAnaylze";
import LandingPage from "../pages/LandingPage";
import ResumesList from "../pages/ResumesList";
import AdminDashboard from '../pages/AdminDashboard';
import LoginCallback from "../pages/LoginCallback";
import NavigatetoAuthX from "../pages/NavigateToAuthX";
import AccessTags from '../utils/accessTags'
import Unauthorized from '../pages/Unauthorized'
import NotFound from "../pages/NotFound";

const routes = [
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/login',
    element: <NavigatetoAuthX />

  },
  {
    path: "/upload",
    element: <Upload />,
    requiredAccess: [AccessTags.ATS_PRD_USER, AccessTags.ATS_PRD_ADMIN]
  },
  {
    path: "/resume-analyze",
    element: <ResumeAnaylze />,
    requiredAccess: [AccessTags.ATS_DEV_USER, AccessTags.ATS_DEV_ADMIN],
    // allowedPreviousPaths: ["/upload", "/admin"]
  },
  {
    path: "/home",
    element: <LandingPage />,
    requiredAccess: [AccessTags.ATS_DEV_USER, AccessTags.ATS_DEV_ADMIN]
  },
  {
    path: "/resumes-list",
    element: <ResumesList />,
    requiredAccess: [AccessTags.ATS_DEV_USER, AccessTags.ATS_DEV_ADMIN],
    // allowedPreviousPaths: ["/upload"]
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
    requiredAccess: [AccessTags.ATS_DEV_ADMIN, AccessTags.ATS_PRD_ADMIN]
  },
  {
    path: "/callback/login",
    element: <LoginCallback />
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;
