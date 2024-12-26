import React, { useState } from "react";
import { fetchNoiseData } from "../services/api";
import NoiseResult from "./NoiseResult";
import { useNavigate } from "react-router-dom";
import { FaFileUpload, FaTimesCircle, FaCheckCircle } from "react-icons/fa";

const NoisePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState(null);  // добавляем состояние для файла
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!inputText) {
      alert("Пожалуйста, введите текст!");
      return;
    }

    setLoading(true);
    setData(null);

    const response = await fetchNoiseData(inputText);  // запрос по прежнему идет с текстом
    setData(response);
    setLoading(false);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className="App">
      <h1>Анализ шума</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Введите текст для анализа"
          style={{ width: "300px", padding: "10px", fontSize: "16px" }}
        />

        {/* Поле для загрузки файла (не функциональное) */}
        <div className="file-input-container">
          <input
            type="file"
            accept=".pth"
            onChange={handleFileChange}
            id="file-upload"
            className="custom-file-input"
          />
          <label htmlFor="file-upload" className="custom-file-label">
            <span>Выберите файл в формате .pth</span>
            <FaFileUpload /> {/* Иконка загрузки файла */}
          </label>
        </div>

        {/* Индикация выбора файла */}
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          {file ? (
            <>
              <FaCheckCircle color="green" style={{ marginRight: "5px" }} />
              <span>Файл выбран: {file.name}</span>
            </>
          ) : (
            <>
              <FaTimesCircle color="red" style={{ marginRight: "5px" }} />
              <span>Файл не выбран</span>
            </>
          )}
        </div>

        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Анализируем..." : "Анализировать"}
        </button>
        <button onClick={() => navigate("/")}>Назад</button>
      </div>
      {loading && <p>Загрузка...</p>}
      {data && <NoiseResult data={data} />}
    </div>
  );
};

export default NoisePage;
