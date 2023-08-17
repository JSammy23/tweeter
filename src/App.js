import LoginPage from "pages/LoginPage/LoginPage";
import FeedPage from "pages/Feed/FeedPage";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "pages/SignUp/SignUpPage";
import PrivateRoute from "components/PrivateRoute";
import HomeContent from "components/HomeContent";
import UserProfile from "components/UserProfile";


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
                <Route path="/home" element={<HomeContent/>} />
                <Route path="/profile/:userId/*" element={<UserProfile/>} />
                <Route exact path="/profile/:userId/likes" element={<UserProfile/>} />
                </Routes>
              </FeedPage>
            </PrivateRoute>
          } />
      </Routes>
    </div>
  );
}

export default App;
