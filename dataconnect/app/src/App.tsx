import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ActorPage from "./pages/Actor";
import MoviePage from "./pages/Movie";
import GenrePage from "./pages/Genre";
import MyProfilePage from "./pages/MyProfile";
import VectorSearchPage from "./pages/VectorSearch";
import AdvancedSearchPage from "./pages/AdvancedSearch";
import NotFound from "./pages/NotFound";
import RootLayout from "./layout/RootLayout";

export default function App() {
  return (
    <Router>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/actor/:id" element={<ActorPage />} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/genre/:genre" element={<GenrePage />} />
          <Route path="/myprofile" element={<MyProfilePage />} />
          <Route path="/vectorsearch" element={<VectorSearchPage />} />
          <Route path="/advancedsearch" element={<AdvancedSearchPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </RootLayout>
    </Router>
  );
}
