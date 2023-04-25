
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import RegistrationPage from "./pages/RegistrationPage";
import SpotifyLinkPage from "./pages/SpotifyLinkPage";
import AiSession from "./pages/AiSession";
import HomePage from "./pages/HomePage";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element={<HomePage />} />
        <Route path = "/login" element={<LoginPage />} />
        <Route path = "/register" element={<RegistrationPage />} />
        <Route path = "/spotify-authorization" element={<SpotifyLinkPage />} />
        <Route path = "/ai-session" element={<AiSession />} />
        <Route path = "/home" element={<LandingPage />} />
        <Route path = "*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;