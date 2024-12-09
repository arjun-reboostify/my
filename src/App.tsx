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
import Yay from './Project/yay'
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
import Doto from './components/it/gamify/todo'
import Cum from './will/Cam'
import Chatai from './Project/Chatbot'
import Side from './components/it/Sidebar'
import PremiumAccess from "./Project/premiumaccess";
import { PremiumRoute } from "./Project/premiumroute";

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


  if (!user && location.pathname !== "/tinder") {
    return <Navigate to="/show" state={{ from: location }} />;
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
      
      { path: "Quote", element: <Quote /> },
      { path: "Notes", element: <HomePageComponent /> },
      { path: "/", element: <Todo /> },
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
      { 
        path: "Fu", 
        element: (
          <PremiumRoute>
            <Reward />
          </PremiumRoute>
        ) 
      },
      { path: "Cc", element: <Cc /> },
      { path: "tmkc", element: <Idk /> },
      { path: "fit", element: <Fit /> },
      { path: "gof", element: <Gof /> },
      { path: "Teach", element: <Teach /> },
      { path: "Rule", element: <Rule /> },
      { path: "Doto", element: <Doto /> },
      { path: "Cam", element: <Cum /> },
      { path: "yay", element: <Yay /> },
      { path: "premium", element: <PremiumAccess /> },
    ]
  },
  {
    path: "/",
    element: <PublicRoute />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "tinder", element: <Tinder /> },
    ]
  },
  { path: "Show", element: <Show /> },
  { path: "*", element: <Navigate to="/Show" /> }
]);

const App: FC = () => {
  return (<>
  {/* <Chatai /> */}

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
    </>
  );
};

export default App;