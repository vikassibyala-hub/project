from ultralytics import YOLO

# Load YOLOv8 model once at startup
model = YOLO("models/best.pt")

def get_model():
    return model
