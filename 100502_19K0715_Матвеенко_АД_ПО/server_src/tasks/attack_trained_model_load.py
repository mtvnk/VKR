import torch
from torchvision import models
import torch.nn as nn


def load_trained_model(model_path="model/attack_model_test.pth"):
    num_classes = 10
    model = models.resnet18(pretrained=False)
    model.fc = nn.Linear(model.fc.in_features, num_classes)

    model.load_state_dict(torch.load(model_path))
    model.eval()
    return model