import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

function RoutesFile() {
  return (
    <Router>
      <Container>

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/projects" element={<ProjectsShowcase />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/my-collection" element={<MyNfts />} />
          <Route path="/voting" element={<NftVoting />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/users" element={<AdminPanel />} />
          <Route path="/team" element={<Team />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default RoutesFile;
