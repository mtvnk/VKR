import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import NoisePage from "./components/NoisePage";
import ToxicityPage from "./components/ToxicityPage";
import InterpretabilityPage from "./components/InterpretabilityPage";
import DatasetAnalysisPage from "./components/DatasetAnalisisPage";
import AttackAnalysisPage from "./components/AttackAnalysisPage";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/noise" element={<NoisePage />} />
        <Route path="/toxicity" element={<ToxicityPage />} />
        <Route path="/interpretability" element={<InterpretabilityPage />} />
        <Route path="/dataset" element={<DatasetAnalysisPage />} />
        <Route path="/attack" element={<AttackAnalysisPage />} />
      </Routes>
    </Router>
  );
}

export default App;
