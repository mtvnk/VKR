import React from "react";

const ToxicityResult = ({ data }) => {
  return (
    <div>
      <h3>Toxicity Analysis</h3>
      <table border="1" style={{ margin: "20px auto", width: "50%" }}>
        <thead>
          <tr>
            <th>Label</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.label}</td>
              <td>{item.score.toFixed(6)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ToxicityResult;
