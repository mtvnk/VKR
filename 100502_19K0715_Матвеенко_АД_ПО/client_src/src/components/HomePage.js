import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Анализ Безопасности Моделей ИИ</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <button onClick={() => navigate("/noise")}>Анализ шума</button>
        <button onClick={() => navigate("/toxicity")}>Анализ токсичности текста</button>
        <button onClick={() => navigate("/interpretability")}>
          Анализ интерпретируемости данных
        </button>
        <button onClick={() => navigate("/dataset")}>Анализ набора данных</button>
        <button onClick={() => navigate("/attack")}>Анализ устойчивости к атакам</button>
      </div>
    </div>
  );
};

export default HomePage;
