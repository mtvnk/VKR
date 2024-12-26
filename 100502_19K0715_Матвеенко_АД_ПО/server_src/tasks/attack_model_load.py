import torch
from torchvision import models


def load_pretrained_model():
    model = models.resnet18()
    model.load_state_dict(torch.load("model/resnet18-f37072fd.pth"))
    return model
