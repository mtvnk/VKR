import React, { useState, useRef } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { useNavigate } from "react-router-dom";
import { fetchDatasetAnalysis } from "../services/api";
import "../styles/App.css";
import DatasetAnalysisResult from "./DatasetAnalisisResult";

const DatasetAnalysisPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [lineColor, setLineColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);
  const [datasetType, setDatasetType] = useState("mnist");
  const [image, setImage] = useState(null);  // Состояние для изображения
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!canvasRef.current && !image) {
      alert("Пожалуйста, нарисуйте что-нибудь или загрузите изображение!");
      return;
    }

    setLoading(true);
    setData(null);

    let dataUrl;
    if (image) {
      // Используем загруженное изображение
      dataUrl = image;
    } else {
      // Используем данные с канваса
      dataUrl = await canvasRef.current.exportImage("png");
    }

    const response = await fetchDatasetAnalysis(dataUrl, datasetType);
    setData(response);
    setLoading(false);
  };

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.resetCanvas();
    }
    setImage(null);  // Очистить изображение при сбросе
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);  // Устанавливаем изображение в состояние
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="App">
      <h1>Анализ набора данных для обучения</h1>

      {/* Контейнер для рисования и блока управления */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Канвас или изображение */}
        <div style={{ position: "relative" }}>
          {image ? (
            <img src={image} alt="Загруженное изображение" width="400px" height="400px" />
          ) : (
            <ReactSketchCanvas
              ref={canvasRef}
              width="400px"
              height="400px"
              strokeColor={lineColor}
              strokeWidth={lineWidth}
              backgroundColor="white"
            />
          )}
        </div>

        {/* Блок управления */}
        <div style={{
          width: "250px",
          height: "380px",  // Увеличена высота блока
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",  // Это поможет располагать элементы равномерно
          alignItems: "center",
          padding: "15px",  // Уменьшен отступ для более компактного вида
          border: "1px solid #ccc",
          borderRadius: "10px",
          backgroundColor: "#f9f9f9",
          marginLeft: "20px",
        }}>
          <div style={{ marginBottom: "10px", width: "100%" }}>
            <label>Цвет линии</label>
            <input
              type="color"
              value={lineColor}
              onChange={(e) => setLineColor(e.target.value)}
              style={{ width: "100%", marginTop: "5px" }}  // Ширина 100% для равномерного расположения
            />
          </div>

          <div style={{ marginBottom: "10px", width: "100%" }}>
            <label>Толщина линии</label>
            <input
              type="range"
              min="1"
              max="10"
              value={lineWidth}
              onChange={(e) => setLineWidth(e.target.value)}
              style={{ width: "100%", marginTop: "5px" }}  // Ширина 100% для равномерного расположения
            />
          </div>

          {/* Выбор типа датасета */}
          <div style={{ marginBottom: "10px", width: "100%" }}>
            <label>Выберите набор данных: </label>
            <select
              value={datasetType}
              onChange={(e) => setDatasetType(e.target.value)}
              style={{ width: "100%", marginTop: "5px" }}  // Ширина 100% для равномерного расположения
            >
              <option value="mnist">MNIST Dataset</option>
              <option value="parse">Parse Dataset</option>
              <option value="random">Случайный Dataset</option>
            </select>
          </div>

          {/* Загрузка изображения */}
          <div style={{ marginBottom: "10px", width: "100%" }}>
            <label>Загрузить изображение: </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ width: "100%" }}
            />
          </div>

          {/* Кнопки */}
          <div className="button-group" style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
            <button onClick={handleAnalyze} disabled={loading} style={{ width: "100%" }}>
              {loading ? "Анализ..." : "Анализировать"}
            </button>
            <button onClick={handleClear} style={{ width: "100%" }}>Очистить</button>
            <button onClick={() => navigate("/")} style={{ width: "100%" }}>Назад</button>
          </div>
        </div>
      </div>
      {loading && <p>Загрузка...</p>}
      {data && <DatasetAnalysisResult data={data} />}
    </div>
  );
};

export default DatasetAnalysisPage;
