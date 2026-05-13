# SOLAR-PANEL-DEFECT-DETECTION-V8
# 🌞 Solar Panel Defect Detection using YOLOv8

## 📌 Overview
This project implements an **AI-powered solar panel defect detection system** using the **YOLOv8 object detection model**. The model is trained to identify defects in solar panels from images, enabling faster and more efficient inspection compared to manual methods.

The system can detect issues like **cracks, hotspots, and other anomalies**, helping improve solar panel efficiency and reduce maintenance costs.

---

## 🏆 Highlights
- Built using YOLOv8 (state-of-the-art object detection)
- Trained on a custom Roboflow dataset
- End-to-end pipeline: data → training → inference
- Solves a real-world problem in renewable energy

---

## 🚀 Features
- 🔍 Real-time defect detection using YOLOv8  
- 📸 Image-based object detection  
- ⚡ Fast and accurate predictions  
- ☁️ Trained on Google Colab (GPU)  
- 🧠 Uses Roboflow dataset  

---

## 🧠 Tech Stack
- Python  
- YOLOv8 (Ultralytics)  
- OpenCV  
- Google Colab  
- Roboflow  

---

## 📂 Project Structure
SOLAR-PANEL-DEFECT-DETECTION-V8/
│── dataset/ # Dataset (Roboflow export)
│── runs/ # Training results (YOLO outputs)
│── notebooks/ # Colab notebooks
│── models/ # Trained weights
│── inference/ # Predictions
│── README.md




---

## 📊 Dataset
- Source: Roboflow Universe  
- Dataset: Solar Panel PV Detection  
- Link: https://universe.roboflow.com/ruslan-raupov/solar-panel-pv  

### Contains:
- Defective solar panels  
- Normal solar panels  

- Annotated with bounding boxes  
- Preprocessed and augmented  

---

## ⚙️ Training (Google Colab)

### 1. Install YOLOv8
```bash
pip install ultralytics
