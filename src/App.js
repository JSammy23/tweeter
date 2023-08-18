import LoginPage from "pages/LoginPage/LoginPage";
import FeedPage from "pages/Feed/FeedPage";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "pages/SignUp/SignUpPage";
import PrivateRoute from "components/PrivateRoute";
import HomeContent from "components/HomeContent";
import UserProfile from "components/UserProfile";
import ExploreContent from "components/ExploreContent";
import Thread from "components/Thread";
import ProfileContent from "components/ProfileContent";


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
                <Route path="/explore" element={<ExploreContent/>} />
                <Route path="/profile/:userUid/*" element={<ProfileContent/>} />
                <Route path="/thread/:activeThread" element={<Thread />} />
                </Routes>
              </FeedPage>
            </PrivateRoute>
          } />
      </Routes>
    </div>
  );
}

export default App;
