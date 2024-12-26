import torch
from torchvision import datasets, transforms
from PIL import Image
from torch import nn
import numpy as np

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


model = SimpleNN()
model.load_state_dict(torch.load('../model/accurancy_nn_model_false.pth'))


def preprocess_image(image_path):
    transform = transforms.Compose([
        transforms.Grayscale(num_output_channels=1),
        transforms.Resize((28, 28)),
        transforms.ToTensor(),
        transforms.Normalize((0.5,), (0.5,))
    ])
    img = Image.open(image_path)
    img = transform(img)
    img = img.unsqueeze(0)
    return img

image_path = '6.png'
img = preprocess_image(image_path)
model.eval()
with torch.no_grad():
    output = model(img)
    predicted_class = torch.argmax(output).item()
    print(f"Тест 1 - Предсказание: {predicted_class} (ожидалось: 5)")

image_path = 'A.png'
img = preprocess_image(image_path)
model.eval()
with torch.no_grad():
    output = model(img)
    predicted_class = torch.argmax(output).item()
    print(f"Тест 2 - Предсказание: {predicted_class} (ожидалось: ошибка или неопределенность)")
