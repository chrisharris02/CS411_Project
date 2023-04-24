
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element={<LandingPage />} />
        <Route path = "*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;