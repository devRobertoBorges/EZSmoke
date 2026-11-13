import { Route, Routes } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import MapsSection from "./components/MapsSection";
import Home from "./pages/Home";
import MapPage from "./pages/MapPage";
import LineupPage from "./pages/LineupPage";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import AboutPage from "./pages/AboutPage";
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
          <Route path="/mapas/:mapSlug/:lineupSlug" element={<LineupPage />} />
          <Route path="/busca" element={<SearchPage />} />
          <Route path="/entrar" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
          <Route path="/conta" element={<AccountPage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}