import torch
from torch import nn
from torchvision import transforms
from PIL import Image
import io
import numpy as np
import base64
from collections import Counter


class Network(nn.Module):
    def __init__(self):
        super(Network, self).__init__()
        self.hidden_0 = nn.Linear(784, 128)
        self.hidden_1 = nn.Linear(128, 64)
        self.output = nn.Linear(64, 10)
        self.softmax = nn.LogSoftmax(dim=1)
        self.activation = nn.ReLU()
        self.dropout = nn.Dropout(0.25)

    def forward(self, x):
        x = x.view(x.shape[0], -1)
        x = self.hidden_0(x)
        x = self.activation(x)
        x = self.dropout(x)
        x = self.hidden_1(x)
        x = self.activation(x)
        x = self.dropout(x)
        x = self.output(x)
        x = self.softmax(x)

        return x


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


def preprocess_image(image_data):
    transform = transforms.Compose([
        transforms.Grayscale(num_output_channels=1),
        transforms.Resize((28, 28)),
        transforms.ToTensor(),
        transforms.Normalize((0.5,), (0.5,))
    ])
    img = decode_image(image_data)
    img = transform(img)
    img = img.unsqueeze(0)
    return img

def decode_image(image_data):
    image_data = image_data.split(",")[1]
    img_bytes = base64.b64decode(image_data)
    img = Image.open(io.BytesIO(img_bytes))
    return img


def element_count(array):
    element_counts = Counter(array)

    total_elements = sum(element_counts.values())

    percentages_dict = {element: f"{(count / total_elements) * 100:.2f}%" for element, count in element_counts.items()}

    return percentages_dict


def test_training_dataset(image_data, dataset_type):
    if dataset_type == "mnist":
        item_array = []
        for i in range(100):
            weights = torch.load('model/mnist_full_dataset.pth', map_location=torch.device('cpu'), weights_only=True)
            model = Network()
            model.load_state_dict(weights)

            device = 'cuda' if torch.cuda.is_available() else 'cpu'
            model = model.to(device)

            image = preprocess_image(image_data)

            image = image.to(device)

            proba = torch.exp(model(image))
            _, pred_label = torch.max(proba, dim=1)
            item_array.append(pred_label.item())

        return element_count(item_array)

    elif dataset_type == "parse":
        item_array = []

        for i in range(50):
            model = SimpleNN()
            model.load_state_dict(torch.load('model/accurancy_nn_model_false.pth', weights_only=True))

            image = preprocess_image(image_data)

            model.eval()

            with torch.no_grad():
                output = model(image)
                predicted_class = torch.argmax(output).item()
                item_array.append(predicted_class)

        return element_count(item_array)

    elif dataset_type == "random":
        item_array = []

        for i in range(50):
            model = torch.load('model/accurancy_nn_model_true.pth')
            image = preprocess_image(image_data)
            model.eval()

            with torch.no_grad():
                raw_res = model(image)
                ar_res = torch.nn.Softmax(dim=1)(raw_res).numpy().flatten()
                item_array.append(int(np.argmax(ar_res)))

        return element_count(item_array)





