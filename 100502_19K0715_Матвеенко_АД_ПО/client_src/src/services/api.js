import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

export const fetchNoiseData = async (inputText) => {
  const response = await axios.post(`${BASE_URL}/noise`, { input_text: inputText });
  return response.data;
};

export const fetchToxicityData = async (inputText) => {
  const response = await axios.post(`${BASE_URL}/toxicity`, { input_text: inputText });
  return response.data;
};

export const fetchInterpretabilityData = async (formData) => {
  const response = await axios.post(`${BASE_URL}/interpretability`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const fetchDatasetAnalysis = async (imageData, datasetType) => {
  try {
    const response = await fetch(`${BASE_URL}/dataset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: imageData, dataset: datasetType }),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze image");
    }

    const result = await response.json();
    return result
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const fetchAttackData = async (attackParams) => {
  try {
    const response = await axios.post(`${BASE_URL}/attack`, attackParams);
    return response.data;
  } catch (error) {
    console.error("Error fetching attack data:", error);
    throw error;
  }
};




