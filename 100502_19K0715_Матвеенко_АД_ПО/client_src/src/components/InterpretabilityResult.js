import React, { useState, useEffect } from "react";

const InterpretabilityResult = ({ data }) => {
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    if (data) {
      setFeatures(data.features);
      setLoading(false);
    }
  }, [data]);

  return (
    <div>
      <h3>Классы интерпретируемости</h3>
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div className="loader"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <table border="1" style={{ margin: "20px auto", width: "60%" }}>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {features.map((item, index) => (
              <tr key={index}>
                <td>{item[0]}</td>
                <td>{item[1].toExponential(6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InterpretabilityResult;
