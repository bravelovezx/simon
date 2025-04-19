import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import Experience from "./pages/Experience";
import ChatPage from "./pages/ChatPage";
import OralReportPage from "./pages/OralReportPage";

const App = () => {
  return (
    <Router>
      <main className="bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/oral-report" element={<OralReportPage />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
