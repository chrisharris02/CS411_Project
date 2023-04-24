
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import RegisterPage from "./pages/RegisterPage";
import SpotifyLinkPage from "./pages/SpotifyLinkPage";
import AiSession from "./pages/AiSession";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element={<LandingPage />} />
        <Route path = "/login" element={<LoginPage />} />
        <Route path = "/register" element={<RegisterPage />} />
        <Route path = "/spotify-authorization" element={<SpotifyLinkPage />} />
        <Route path = "/ai-session" element={<AiSession />} />
        <Route path = "*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;