from transformers import pipeline


toxicity_model = pipeline("text-classification", model="unitary/toxic-bert")


def test_toxicity(input_text):
    return toxicity_model(input_text)