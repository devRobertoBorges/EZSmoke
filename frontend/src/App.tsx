import { Route, Routes } from "react-router";
import Header from "./components/Header";
import MapsSection from "./components/MapsSection";
import Home from "./pages/Home";
import MapPage from "./pages/MapPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mapas" element={<MapsSection />} />
          <Route path="/mapas/:slug" element={<MapPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}