import LoginPage from "pages/LoginPage/LoginPage";
import FeedPage from "pages/Feed/FeedPage";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "pages/SignUp/SignUpPage";
import PrivateRoute from "components/PrivateRoute";
import Compose from "components/Compose";
import UserProfile from "components/UserProfile";
import { useContext } from "react";
import { AppContext } from "services/appContext";

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route 
          path="/*"
          element={
            <PrivateRoute>
              <FeedPage>
                <Routes>
                <Route path="/home" element={<Compose/>} />
                <Route path="/profile/:userId/*" element={<UserProfile/>} />
                </Routes>
              </FeedPage>
            </PrivateRoute>
          } />
      </Routes>
    </div>
  );
}

export default App;
