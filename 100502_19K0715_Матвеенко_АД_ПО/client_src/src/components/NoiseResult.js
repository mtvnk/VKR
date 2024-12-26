import React from "react";

const NoiseResult = ({ data }) => {
  const renderData = (data, title) => (
    <div>
      <h3>{title}</h3>
      {data.map((nestedArray, index) => (
        <table
          key={index}
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
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {nestedArray.map((item, idx) => (
              <tr key={idx}>
                <td>{item.label}</td>
                <td>{item.score.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  );

  return (
    <div>
      {renderData(data.original, "Оригинальный текст")}
      {renderData(data.perturbed, "Изменённый текст")}
    </div>
  );
};

export default NoiseResult;
