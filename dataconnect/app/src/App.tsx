import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ActorPage from "./pages/Actor";
import MoviePage from "./pages/Movie";
import MyProfilePage from "./pages/MyProfile";
import VectorSearchPage from "./pages/VectorSearch";
import AdvancedSearchPage from "./pages/AdvancedSearch";
import NotFound from "./pages/NotFound";
import RootLayout from "./layout/RootLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <Router>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/actor/:id" element={<ActorPage />} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/myprofile" element={<MyProfilePage />} />
          <Route path="/vectorsearch" element={<VectorSearchPage />} />
          <Route path="/advancedsearch" element={<AdvancedSearchPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </RootLayout>
    </Router>
    </QueryClientProvider>
  );
}
