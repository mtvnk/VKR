import React, { useState } from "react";
import { fetchInterpretabilityData } from "../services/api";
import InterpretabilityResult from "./InterpretabilityResult";
import { useNavigate } from "react-router-dom";

import { FaFileUpload } from "react-icons/fa";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const InterpretabilityPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Пожалуйста, загрузите файл в формате .pth.");
      return;
    }

    setLoading(true);
    setData(null);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetchInterpretabilityData(formData);
    setData(response);
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Анализ интерпретируемости данных</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
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
      {data && <InterpretabilityResult data={data} />}
    </div>
  );
};

export default InterpretabilityPage;
