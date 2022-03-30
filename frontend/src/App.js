import { useState, useEffect, Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import { AuthContext } from "./shared/context/auth-context.js";
import MainNavigation from "./shared/components/navigation/MainNavigation.js";
const Pictures = lazy(() => import("./pictures/pages/Pictures.js"));
const Login = lazy(() => import("./users/pages/Login.js"));
const UserPictures = lazy(() => import("./pictures/pages/UserPictures.js"));
const NewPicture = lazy(() => import("./pictures/pages/NewPicture.js"));
const UpdatePictures = lazy(() => import("./pictures/pages/UpdatePictures.js"));
const SignUp = lazy(() => import("./users/pages/SignUp.js"));
const PageNotFound = lazy(() => import("./shared/components/PageNotFound.js"));

function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tokenExpTime, setTokenExpTime] = useState(null);

  const login = (uid, token, expirationTime) => {
    setToken(token);
    setUserId(uid);
    setTokenExpTime(expirationTime);
    localStorage.setItem(
      "userData",
      JSON.stringify({ userId: uid, expirationTime, token })
    );
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setTokenExpTime(null);
    localStorage.removeItem("userData");
  };

  if (tokenExpTime !== null && new Date().getTime() > tokenExpTime) {
    logout(); // the token is expired so we should logout the user programmatically immediately
  } else if (tokenExpTime !== null) {
    // the token still valid so we should set a timer to log the user out programmatically in the future
    setTimeout(() => {
      logout();
    }, tokenExpTime - new Date().getTime());
  }

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      storedData.userId &&
      storedData.expirationTime
    ) {
      login(storedData.userId, storedData.token, storedData.expirationTime);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, token, userId, login, logout }}
    >
      <MainNavigation />
      <main>
        <Suspense
          fallback={
            <div
              className="spinner-border"
              style={{ width: "3rem", height: "3rem", margin: "0 48vw" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Pictures />} />
            <Route
              path="/login"
              element={!token ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!token ? <SignUp /> : <Navigate to="/" />}
            />
            <Route path="/:userId/pictures" element={<UserPictures />} />
            <Route
              path="/pictures/new"
              element={token ? <NewPicture /> : <Navigate to="/login" />}
            />
            <Route
              path="/pictures/update/:picId"
              element={token ? <UpdatePictures /> : <Navigate to="/" />}
            />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </main>
    </AuthContext.Provider>
  );
}

export default App;