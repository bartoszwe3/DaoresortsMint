import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import MainPage from "./components/MainPage";
import MyNfts from "./components/MyNfts";
import Mint from "./components/Mint";
import ProjectsShowcase from "./components/ProjectsShowcase";
import Container from "./layouts/Container";
import NftVoting from "./components/NftVoting";
import AdminWhitelist from "./components/AdminWhitelist";
import AdminUsersManagement from "./components/AdminUsersManagement";
import AdminPanel from "./components/AdminPanel";
import Team from "./components/Team";
import Regulamin from "./components/legal/Regulamin";
import PolitykaPrywatnosci from "./components/legal/PolitykaPrywatnosci";
import Disclaimer from "./components/legal/Disclaimer";
import FounderPage from "./components/FounderPage";
import CheckoutPage from "./components/CheckoutPage";
import CheckoutReservePage from "./components/CheckoutReservePage";
import Prezentacja from "./components/Prezentacja";

import AppLayout from "./components/layout/AppLayout";

function RoutesFile() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/members" element={<ProjectsShowcase />} />
          <Route path="/faq" element={<Navigate to="/?tab=faq" replace />} />
          <Route path="/passport" element={<MyNfts />} />
          <Route path="/my-nfts" element={<MyNfts />} />
          <Route path="/projects" element={<ProjectsShowcase />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/my-collection" element={<MyNfts />} />
          <Route path="/voting" element={<NftVoting />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/users" element={<AdminPanel />} />
          <Route path="/team" element={<Team />} />
          <Route path="/regulamin" element={<Regulamin />} />
          <Route path="/polityka-prywatnosci" element={<PolitykaPrywatnosci />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/founder" element={<FounderPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/stage/:stage" element={<CheckoutPage />} />
          <Route path="/checkout/reserve" element={<CheckoutReservePage />} />
          <Route path="/checkout/activate" element={<CheckoutReservePage />} /> {/* Placeholder reuse for now */}
          <Route path="/prezentacja" element={<Prezentacja />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default RoutesFile;
