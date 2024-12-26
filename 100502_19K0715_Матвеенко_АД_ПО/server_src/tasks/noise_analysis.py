from transformers import pipeline


model_name = "bert-base-uncased"
model = pipeline("text-classification", model=model_name, return_all_scores=True)

label_map = {
    'LABEL_0': 'positive',
    'LABEL_1': 'negative'
}

def test_robustness(input_text):
    perturbed_text = input_text.replace("o", "0").replace("e", "3")
    result_original = model(input_text)
    result_original[0][0]['label'] = 'Positive'
    result_original[0][1]['label'] = 'Negative'
    result_perturbed = model(perturbed_text)
    result_perturbed[0][0]['label'] = 'Positive'
    result_perturbed[0][1]['label'] = 'Negative'
    return {"original": result_original, "perturbed": result_perturbed}