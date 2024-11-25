import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePageComponent from "./components/HomePageComponent";
import Login from "./components/Login";
import Tv from './components/it/tv';
import Register from "./components/Register";
import Flash from './components/it/flash';
import Cou from './components/it/conter';
import { noterAuth } from "./firebase";
import Quote from './components/it/Quote';
import Todo from './components/it/Todo';
import Song from './components/it/Song';
import G from './components/it/Guidedsolving';
import Chat from './components/it/Chat';
import Blog from './components/it/blog';
import Url from './components/it/url';
import Can from './components/it/main';
import Experiences from './components/it/experiences';
import Tinder from './components/it/tinder';
import Show from './show/show';
import One from './components/it/One';
import Reward from './components/it/gamify/Tinder'
import Cc from './components/it/gamify/Hack'
import Idk from './components/it/gamify/Timer'
import Fit from './components/it/gamify/Fit'
import Gof from './components/it/gamify/Gameoflife'
import Teach from './will/Teach'
import Rule from './components/it/gamify/d'
// Protected Route Component
const ProtectedRoute = () => {
  const [user, loading, error] = useAuthState(noterAuth);
  const location = useLocation();

  if (error) return null;
  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Outlet />;
};

// Public Route Component
const PublicRoute = () => {
  const [user] = useAuthState(noterAuth);
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  if (user) {
    return <Navigate to={from} />;
  }

  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      { path: "", element: <One /> },
      { path: "Quote", element: <Quote /> },
      { path: "Notes", element: <HomePageComponent /> },
      { path: "Todo", element: <Todo /> },
      { path: "Song", element: <Song /> },
      { path: "G", element: <G /> },
      { path: "Chat", element: <Chat /> },
      { path: "Blog", element: <Blog /> },
      { path: "Url", element: <Url /> },
      { path: "can", element: <Can /> },
      { path: "Experiences", element: <Experiences /> },
      { path: "tinder", element: <Tinder /> },
      { path: "Flash", element: <Flash /> },
      { path: "Cou", element: <Cou /> },
      { path: "Tv", element: <Tv /> },
      { path: "One", element: <One /> },
      { path: "Fuck", element: <Reward /> },
      { path: "Cc", element: <Cc /> },
      { path: "tmkc", element: <Idk /> },
      { path: "fit", element: <Fit /> },
      { path: "gof", element: <Gof /> },
      { path: "Teach", element: <Teach /> },
      { path: "Rule", element: <Rule /> },
    ]
  },
  {
    path: "/",
    element: <PublicRoute />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ]
  },
  { path: "Show", element: <Show /> },
  { path: "*", element: <Navigate to="/Show" /> }
]);

const App: FC = () => {
  return (
    <div className="bg-black min-h-screen w-full">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
      />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;