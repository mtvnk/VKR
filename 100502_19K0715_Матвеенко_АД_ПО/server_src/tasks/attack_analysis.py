import asyncio
import torch
import time
import psutil
import base64
import io
from tasks.attack_model_load import load_pretrained_model
from tasks.attack_trained_model_load import load_trained_model
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt


def plot_metrics(metrics):
    img_buf = io.BytesIO()

    plt.figure(figsize=(10, 6))

    # Оставляем только график задержки запроса
    plt.subplot(1, 1, 1)
    plt.plot(metrics["latencies"], marker="o")
    plt.title("Задержка запроса (с)")
    plt.xlabel("Индекс запроса")
    plt.ylabel("Задержка (с)")

    plt.tight_layout()

    plt.savefig(img_buf, format="png")
    plt.close()

    img_buf.seek(0)
    img_base64 = base64.b64encode(img_buf.getvalue()).decode("utf-8")

    return img_base64


pretrained_model = load_pretrained_model()
custom_model = load_trained_model()


def generate_input(pattern, size):
    if pattern == "random":
        return torch.rand(size)
    elif pattern == "zeros":
        return torch.zeros(size)
    elif pattern == "ones":
        return torch.ones(size)
    else:
        raise ValueError("Unsupported input_data_pattern")


async def ddos_attack(model, requests_count, input_size, pattern, timeout, log_metrics, metrics):
    tasks = []
    for _ in range(requests_count):
        input_data = generate_input(pattern, input_size)
        task = asyncio.create_task(run_model_inference(model, input_data, timeout, log_metrics, metrics))
        tasks.append(task)
    await asyncio.gather(*tasks)


async def run_model_inference(model, input_data, timeout, log_metrics, metrics):
    try:
        start_time = time.time()
        with torch.no_grad():
            result = await asyncio.wait_for(asyncio.to_thread(model, input_data), timeout=timeout)
        end_time = time.time()

        latency = end_time - start_time
        metrics["latencies"].append(latency)

        if log_metrics:
            print(f"Prediction: {torch.argmax(result)} | Time: {latency:.4f}s")
            print(f"CPU: {psutil.cpu_percent()}% | Memory: {psutil.virtual_memory().percent}%")
    except asyncio.TimeoutError:
        print("Inference timed out!")


async def run_attack_test(model_type, requests_count, input_size, attack_type, pattern, timeout, repeat, log_metrics):
    metrics = {
        "latencies": []  # Оставляем только список latencies
    }

    model = pretrained_model if model_type == "pretrained" else custom_model

    for _ in range(repeat):
        if attack_type == "flood":
            await ddos_attack(model, requests_count, input_size, pattern, timeout, log_metrics, metrics)
        elif attack_type == "sequential":
            for _ in range(requests_count):
                input_data = generate_input(pattern, input_size)
                await run_model_inference(model, input_data, timeout, log_metrics, metrics)
        else:
            raise ValueError("Unsupported attack_type")

    img_base64 = plot_metrics(metrics)
    return {"status": "success", "message": "Test completed", "graph": img_base64}
