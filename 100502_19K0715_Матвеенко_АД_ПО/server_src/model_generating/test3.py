import torch
from torchvision import datasets, transforms
from PIL import Image
from torch import nn
import numpy as np


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

model = torch.load('../model/accurancy_nn_model_true.pth')
model.eval()

transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=1),
    transforms.Resize((28, 28)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5], std=[0.5])
])

image_path = '5.png'
image = Image.open(image_path)

image_tensor = transform(image).unsqueeze(0)

with torch.no_grad():
    raw_res = model(image_tensor)
    ar_res = torch.nn.Softmax(dim=1)(raw_res).numpy().flatten()
    res = np.argmax(ar_res)

print(f"Тест 1 - Предсказание: {res} (ожидалось: 5)")

image_path = 'A.png'
image = Image.open(image_path)

image_tensor = transform(image).unsqueeze(0)

with torch.no_grad():
    raw_res = model(image_tensor)
    ar_res = torch.nn.Softmax(dim=1)(raw_res).numpy().flatten()
    res = np.argmax(ar_res)

print(f"Тест 2 - Предсказание: {res} (ожидалось: ошибка или неопределенность)")