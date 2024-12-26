import React from "react";

const DatasetAnalysisResult = ({ data }) => {
  const sortedData = Object.entries(data)
    .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1])) // Сортировка по убыванию процентов
    .map(([key, value]) => ({ label: key, percentage: value }));

  return (
    <div>
      <h3>Dataset Analysis Results</h3>
      <table
        border="1"
        style={{
          margin: "20px auto",
          width: "50%",
          textAlign: "center",
        }}
      >
        <thead>
          <tr>
            <th>Label</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, idx) => (
            <tr
              key={idx}
              style={{
                backgroundColor: idx === 0 ? "green" : "red", // Зеленый для первой строки, красный для остальных
                color: "white", // Цвет текста белый для контраста
              }}
            >
              <td>{item.label}</td>
              <td>{item.percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DatasetAnalysisResult;
