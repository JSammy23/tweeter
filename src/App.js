import LoginPage from "pages/LoginPage/LoginPage";
import FeedPage from "pages/HomeFeed/FeedPage";
import { useEffect, useState } from "react";
import auth from "./services/auth";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "pages/SignUp/SignUpPage";

function App() {

  const [user, setUser] = useState(null);
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user)
    });
    return unsubscribe;
  }, []);


  return (
    <div className="App">
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <LoginPage />} />
        <Route path="/home" element={<FeedPage user={user} />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </div>
  );
}

export default App;
