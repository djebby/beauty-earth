import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import { AuthContext } from "./shared/context/auth-context.js";
import MainNavigation from "./shared/components/navigation/MainNavigation.js";
import Pictures from "./pictures/pages/Pictures.js";
import Login from "./users/pages/Login.js";
import UserPictures from "./pictures/pages/UserPictures.js";
import NewPicture from "./pictures/pages/NewPicture.js";
import UpdatePictures from "./pictures/pages/UpdatePictures.js";
import SignUp from "./users/pages/SignUp.js";

function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tokenExpTime, setTokenExpTime] = useState(null);

  const login = (uid, token, expirationTime) => {
    setToken(token);
    setUserId(uid);
    setTokenExpTime(expirationTime);
    localStorage.setItem("userData", JSON.stringify({ userId: uid, expirationTime, token  }));
  };

  const logout = ()=>{
    setToken(null);
    setUserId(null);
    setTokenExpTime(null);
    localStorage.removeItem("userData");
  }


  if(tokenExpTime !== null && new Date().getTime() > tokenExpTime){
    logout(); // the token is expired so we should logout the user programmatically immediately
  } else if(tokenExpTime !== null) {
    // the token still valid so we should set a timer to log the user out programmatically in the future
    setTimeout(()=>{
      logout();
    }, tokenExpTime - new Date().getTime());
  }


  useEffect(()=>{
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if(storedData && storedData.token && storedData.userId && storedData.expirationTime){
      login(storedData.userId, storedData.token, storedData.expirationTime);
    }
  }, []);

  

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, token, userId, login, logout }}>
      <MainNavigation />
      <main>
        <Routes>
          <Route path="/" element={<Pictures />} />
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/"/>} />
          <Route path="/signup" element={!token ? <SignUp /> : <Navigate to="/"/>} />
          <Route path="/:userId/pictures" element={ <UserPictures /> } />
          <Route path="/pictures/new" element={ token ? <NewPicture /> : <Navigate to="/login"/>} />
          <Route path="/pictures/update/:picId" element={token ? <UpdatePictures /> : <Navigate to="/"/>} />
        </Routes>
      </main>
    </AuthContext.Provider>
  );
}

export default App;
