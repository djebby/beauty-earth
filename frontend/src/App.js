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

  const login = (uid, token) => {
    setToken(token);
    setUserId(uid);
    localStorage.setItem("userData", JSON.stringify({ userId: uid, token }));
  };

  const logout = ()=>{
    setToken(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }

  useEffect(()=>{
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if(storedData && storedData.token && storedData.userId){
      login(storedData.userId, storedData.token);
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
