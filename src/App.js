import LoginPage from "pages/LoginPage/LoginPage";
import FeedPage from "pages/HomeFeed/FeedPage";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "pages/SignUp/SignUpPage";
import PrivateRoute from "components/PrivateRoute";

function App() {


  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
        path="home"
        element={
          <PrivateRoute>
            <FeedPage />
          </PrivateRoute>
        } /> 
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </div>
  );
}

export default App;
