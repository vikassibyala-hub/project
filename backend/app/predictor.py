import shutil
import uuid
import os
from collections import Counter
from fastapi import UploadFile

from app.model_loader import get_model

UPLOAD_FOLDER = "uploads"

# Absolute result folder
RESULT_FOLDER = os.path.abspath("runs/detect/results")

# Create folder if not exists
os.makedirs(RESULT_FOLDER, exist_ok=True)


def predict_image(file: UploadFile):

    model = get_model()

    # Save uploaded file
    filename = f"{uuid.uuid4()}.jpg"
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run prediction
    results = model(
        filepath,
        save=True,
        project=RESULT_FOLDER,
        name="predict",
        exist_ok=True
    )

    # Extract defect names
    class_names = model.names

    detected = []

    for box in results[0].boxes:
        cls_id = int(box.cls[0])
        detected.append(class_names[cls_id])

    defect_counts = dict(Counter(detected))

    total_defects = len(detected)

    # Correct URL
    result_image_url = f"http://127.0.0.1:8000/results/predict/{filename}"

    return {
        "result_image_url": result_image_url,
        "total_defects": total_defects,
        "defects": defect_counts,
        "model_used": "YOLOv8"
    }
