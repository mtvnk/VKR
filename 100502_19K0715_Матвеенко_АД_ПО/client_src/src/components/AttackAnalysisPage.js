import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAttackData } from "../services/api";
import "../styles/App.css";
import AttackAnalysisResult from "./AttackAnalysisResult";

const AttackAnalysisPage = () => {
  const [loading, setLoading] = useState(false);
  const [attackResults, setAttackResults] = useState(null);
  const [attackParams, setAttackParams] = useState({
    requests_count: 50,
    model_type: "pretrained",
    input_data_pattern: "random",
    attack_type: "flood",
    timeout: 5,
    repeat: 1,
    input_size: [1, 3, 224, 224],
    log_metrics: true,
  });
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    setLoading(true);
    setAttackResults(null);

    const response = await fetchAttackData(attackParams);

    setAttackResults(response);
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Анализ устойчивости к атакам</h1>

      {/* Блок управления */}
      <div
        style={{
          width: "350px",
          height: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          backgroundColor: "#f9f9f9",
          margin: "20px auto",
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <label>Количество запросов: </label>
          <input
            type="number"
            value={attackParams.requests_count}
            onChange={(e) =>
              setAttackParams({ ...attackParams, requests_count: e.target.value })
            }
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Тип модели: </label>
          <select
            value={attackParams.model_type}
            onChange={(e) =>
              setAttackParams({ ...attackParams, model_type: e.target.value })
            }
          >
            <option value="pretrained">Предобученная модель</option>
            <option value="custom">Пользовательская модель</option>
          </select>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Тип атаки: </label>
          <select
            value={attackParams.attack_type}
            onChange={(e) =>
              setAttackParams({ ...attackParams, attack_type: e.target.value })
            }
          >
            <option value="flood">Flood-атака</option>
            <option value="sequential">Последовательная атака</option>
          </select>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Таймаут (секунды): </label>
          <input
            type="number"
            value={attackParams.timeout}
            onChange={(e) =>
              setAttackParams({ ...attackParams, timeout: e.target.value })
            }
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Размер входных данных: </label>
          <input
            type="text"
            value={attackParams.input_size.join(", ")}
            onChange={(e) =>
              setAttackParams({
                ...attackParams,
                input_size: e.target.value.split(",").map(Number),
              })
            }
          />
        </div>
        <div
          className="button-group"
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <button onClick={handleAnalyze} disabled={loading}>
            {loading ? "Запуск атаки..." : "Запустить атаку"}
          </button>
          <button onClick={() => navigate("/")}>Назад</button>
        </div>
      </div>

      {/* Отображение результатов */}
      {loading && <p>Загрузка...</p>}
      {attackResults && <AttackAnalysisResult data={attackResults} />}
    </div>
  );
};

export default AttackAnalysisPage;
