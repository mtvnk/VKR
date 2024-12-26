import React from "react";

const AttackAnalysisResult = ({ data }) => {
  return (
    <div className="result-container">
      <h2>Attack Test Results</h2>

      {/* Статус и сообщение */}
      <div>
        <p><strong>Status:</strong> {data.status}</p>
        <p><strong>Message:</strong> {data.message}</p>
      </div>

      {/* Отображение графиков или других данных, если они есть */}
      {data.graph && (
        <div>
          <h3>Graph Result</h3>
          <img
            src={`data:image/png;base64,${data.graph}`}
            alt="Graph"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      )}

      {/* Дополнительная информация */}
      {data.details && (
        <div>
          <h3>Details</h3>
          <pre>{JSON.stringify(data.details, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AttackAnalysisResult;
