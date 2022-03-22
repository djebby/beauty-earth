import './App.css';
import { Routes, Route } from "react-router-dom";

import MainNavigation from "./shared/components/navigation/MainNavigation.js";
import Pictures from './pictures/pages/Pictures.js';
import Login from "./users/pages/Login.js";
import UserPictures from "./pictures/pages/UserPictures.js";
import NewPicture from "./pictures/pages/NewPicture.js";
import UpdatePictures from "./pictures/pages/UpdatePictures.js";
import SignUp from "./users/pages/SignUp.js";

function App() {

  return (
    <div>
      <MainNavigation />
      <main>
      <Routes>
        <Route path="/" element={<Pictures />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<SignUp />}/>
        <Route path="/:userId/pictures" element={<UserPictures />}/>
        <Route path="/pictures/new" element={<NewPicture />}/>
        <Route path="/pictures/update/:picId" element={<UpdatePictures />} />
      </Routes>
      </main>
    </div>
  );
}

export default App;
