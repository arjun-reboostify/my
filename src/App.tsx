import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePageComponent from "./components/HomePageComponent";
import Login from "./components/Login";
import Register from "./components/Register";
import { noterAuth } from "./firebase";
import Quote from './components/it/Quote'
import Todo from './components/it/Todo'
import Song from './components/it/Song'
import G from './components/it/Guidedsolving'
import Chat from './components/it/Chat'
import Blog from './components/it/blog'
import Url from './components/it/url'
import Can from './components/it/main'

const App: FC = () => {
  return (
    // Add a wrapper div with black background and full height
    <div className="bg-black min-h-screen w-full">
      <Router>
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
        <WhichRouter />
      </Router>
    </div>
  );
};

export default App;

const WhichRouter = () => {
  const [user, loading, error] = useAuthState(noterAuth);
  if (error) return null;
  // Add background color to loading state as well
  if (loading) return <div className="bg-black min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (user === null) {
    return (
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </Switch>
    );
  }
  if (user) {
    return (
      <Switch>
        <Route path="/login">
          <Redirect to="/" />
        </Route>
        <Route path="/register">
          <Redirect to="/" />
        </Route>
        <Route exact path="/">
          <HomePageComponent />
        </Route>
        <Route path="/Quote" component={Quote} />
        <Route path="/Notes" component={HomePageComponent} />
        <Route path="/Todo" component={Todo} />
        <Route path="/Song" component={Song} />
        <Route path="/G" component={G} />
        <Route path="/Chat" component={Chat} />
        <Route path="/Blog" component={Blog} />
        <Route path="/Url" component={Url} />
        <Route path="/can" component={Can} />
      </Switch>
    );
  }
  return <Login />;
};