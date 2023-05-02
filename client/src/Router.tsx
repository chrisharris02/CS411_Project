
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import RegistrationPage from "./pages/RegistrationPage";
import SpotifyLinkPage from "./pages/SpotifyLinkPage";
import AiSession from "./pages/AiSession";
import HomePage from "./pages/HomePage";

import PlaylistView from "./pages/PlaylistView";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element={<HomePage />} />
        <Route path = "/login" element={<HomePage />} />
        <Route path = "/register" element={<RegistrationPage />} />
        <Route path = "/spotify-authorization" element={<SpotifyLinkPage />} />
        <Route path = "/ai-session" element={<AiSession />} />
        <Route path = "/playlist-view" element={<PlaylistView />} />
        <Route path = "*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;