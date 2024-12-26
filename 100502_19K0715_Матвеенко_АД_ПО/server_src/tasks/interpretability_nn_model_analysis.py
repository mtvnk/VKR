import torch
import lime
import lime.lime_tabular
import numpy as np
from torch import nn


class MyNN(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.flatten = nn.Flatten()
        self.linear_relu_stack = nn.Sequential(
            nn.Linear(28 * 28, 64),
            nn.ReLU(),
            nn.Linear(64, 64),
            nn.ReLU(),
            nn.Linear(64, 10),
        )

    def forward(self, x):
        x = self.flatten(x)
        logits = self.linear_relu_stack(x)
        return logits

class SimpleNN(torch.nn.Module):
    def __init__(self):
        super(SimpleNN, self).__init__()
        self.fc1 = torch.nn.Linear(28 * 28, 128)
        self.fc2 = torch.nn.Linear(128, 64)
        self.fc3 = torch.nn.Linear(64, 10)

    def forward(self, x):
        x = x.view(-1, 28 * 28)
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        x = self.fc3(x)
        return x


def test_interpretability(model_file):
    try:
        model = SimpleNN()
        model.load_state_dict(torch.load(model_file))
    except:
        model = torch.load(model_file)
    model.eval()

    input_data = np.random.rand(1, 28 * 28)

    def classifier_fn(x):
        x = torch.tensor(x, dtype=torch.float32).view(-1, 28, 28)
        with torch.no_grad():
            output = model(x)
        return output.numpy()

    training_data = np.random.rand(100, 28 * 28)

    explainer = lime.lime_tabular.LimeTabularExplainer(
        training_data=training_data,
        mode='classification',
        class_names=[str(i) for i in range(10)],
        kernel_width=3
    )

    explanation = explainer.explain_instance(input_data[0], classifier_fn, num_features=6)
    explanation_dict = {
        "instance": input_data[0].tolist(),
        "features": explanation.as_list(),
        "raw_prediction": explanation.predict_proba.tolist()
    }
    return explanation_dict
