import React, { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useReveal } from "../hooks/useReveal";

const API_BASE = "http://127.0.0.1:8000";

/* ─────────────────────────────────────────────────
   DETECTION PAGE
 ───────────────────────────────────────────────── */
export default function Detection() {
    const { user } = useUser();
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [drag, setDrag] = useState(false);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);
    const inputRef = useRef(null);

    const handleFile = (file) => {
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
        setResult(null);
        setError(null);
        setSaved(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDrag(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const runDetection = async () => {
        if (!image) return;
        setLoading(true);
        setError(null);
        setResult(null);
        setSaved(false);

        try {
            const fd = new FormData();
            fd.append("file", image);
            const res = await fetch(`${API_BASE}/predict/yolov8`, {
                method: "POST",
                body: fd,
            });
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            setResult(data);

            const historyEntry = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                fileName: image.name,
                fileSize: image.size,
                preview: preview,
                model_used: data.model_used,
                total_defects: data.total_defects,
                defects: data.defects || {},
                result_image_url: data.result_image_url || null,
            };

            // 1. Update localStorage as local cache (instant reads)
            const existing = JSON.parse(localStorage.getItem("detectionHistory") || "[]");
            existing.unshift(historyEntry);
            localStorage.setItem("detectionHistory", JSON.stringify(existing.slice(0, 50)));

            // 2. Persist to MongoDB if user is logged in
            if (user?.id) {
                fetch(`${API_BASE}/history/save`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        clerkUserId: user.id,
                        fileName: image.name,
                        fileSize: image.size,
                        model_used: data.model_used,
                        total_defects: data.total_defects,
                        defects: data.defects || {},
                        result_image_url: data.result_image_url || null,
                    }),
                }).catch(err => console.warn("History DB save failed:", err));
            }

            setSaved(true);
        } catch (err) {
            setError(`Detection failed: ${err.message}. Make sure the backend server is running on port 8000.`);
        } finally {
            setLoading(false);
        }
    };

    const clearImage = () => {
        setImage(null);
        setPreview(null);
        setResult(null);
        setError(null);
        setSaved(false);
        if (inputRef.current) inputRef.current.value = "";
    };

    const defects = result?.defects || {};
    const defectEntries = Object.entries(defects);
    const maxCount = Math.max(...Object.values(defects), 1);
    const totalDefects = result?.total_defects ?? 0;
    const isHealthy = result && totalDefects === 0;

    const headerRef = useReveal();
    const leftPanelRef = useReveal({ threshold: 0.1 });
    const rightPanelRef = useReveal({ threshold: 0.1 });

    return (
        <section className="detect-page" id="detect">
            {/* Loading Overlay */}
            {loading && (
                <div className="detect__loading-overlay">
                    <div className="detect__loading-box">
                        <div className="detect__spinner" />
                        <p className="detect__loading-title">Analyzing Solar Panel...</p>
                        <p className="detect__loading-sub">YOLOv8 model is processing your image</p>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div className="detect-page__header">
                <div className="detect-page__header-inner reveal reveal-up" ref={headerRef}>
                    <span className="section__eyebrow">AI Detection</span>
                    <h1 className="detect-page__title">
                        Solar Panel <span className="text-gradient">Fault Detection</span>
                    </h1>
                    <p className="detect-page__subtitle">
                        Upload an Electroluminescence (EL) image and get an instant, AI-powered defect analysis using YOLOv8.
                    </p>
                    <div className="detect-page__badges">
                        <span className="detect-badge"><span className="detect-badge__dot detect-badge__dot--green" />YOLOv8 Active</span>
                        <span className="detect-badge"><span className="detect-badge__dot detect-badge__dot--violet" />12 Defect Classes</span>
                        <span className="detect-badge"><span className="detect-badge__dot detect-badge__dot--blue" />GPU Accelerated</span>
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div className="detect-page__body">
                {/* Left Panel — Upload */}
                <div className="detect__upload-panel reveal reveal-scale delay-100" ref={leftPanelRef}>
                    <div className="detect__panel-header">
                        <div className="detect__panel-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        </div>
                        <div>
                            <h3 className="detect__panel-title">Upload Image</h3>
                            <p className="detect__panel-sub">Supports JPG, PNG, WEBP · Max 20 MB</p>
                        </div>
                    </div>

                    {/* Dropzone */}
                    <div
                        className={`detect__dropzone${drag ? " detect__dropzone--active" : ""}${preview ? " detect__dropzone--has-file" : ""}`}
                        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                        onDragLeave={() => setDrag(false)}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            ref={inputRef}
                            style={{ display: "none" }}
                            onChange={(e) => handleFile(e.target.files[0])}
                        />
                        <div className="detect__dropzone-inner">
                            <div className="detect__dropzone-icon">
                                {preview ? (
                                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                                ) : (
                                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                )}
                            </div>
                            <p className="detect__dropzone-text">
                                {preview ? "Click or drop to replace image" : "Drag & drop your EL solar panel image"}
                            </p>
                            <span className="detect__dropzone-browse">Browse Files</span>
                        </div>
                    </div>

                    {/* Image Preview */}
                    {preview && (
                        <div className="detect__preview">
                            <img src={preview} alt="Upload preview" />
                            <div className="detect__preview-footer">
                                <div className="detect__preview-info">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>
                                    <span>{image?.name}</span>
                                    <span className="detect__preview-size">{(image?.size / 1024).toFixed(0)} KB</span>
                                </div>
                                <button className="detect__preview-clear" onClick={clearImage} title="Remove image">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="detect__error">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                            {error}
                        </div>
                    )}

                    {/* Saved toast */}
                    {saved && (
                        <div className="detect__saved-toast">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                            Result saved to history
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="detect__actions">
                        <button
                            className="btn btn--primary btn--detect"
                            disabled={!image || loading}
                            onClick={runDetection}
                        >
                            {loading ? "Analyzing..." : "Run Detection"}
                        </button>
                        {result && (
                            <a href="/history" className="btn btn--outline-dark">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                View History
                            </a>
                        )}
                    </div>

                    {/* Tips */}
                    <div className="detect__tips">
                        <h4 className="detect__tips-title">Tips for Best Results</h4>
                        <ul className="detect__tips-list">
                            <li>Use Electroluminescence (EL) images for best accuracy</li>
                            <li>Ensure the panel fills most of the image frame</li>
                            <li>Recommended resolution: 640×640 or higher</li>
                            <li>Avoid heavily compressed or blurry images</li>
                        </ul>
                    </div>
                </div>

                {/* Right Panel — Results */}
                <div className="detect__results-panel reveal reveal-scale delay-200" ref={rightPanelRef}>
                    {!result ? (
                        <div className="detect__results-empty">
                            <div className="detect__results-empty-icon">
                                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                            </div>
                            <p className="detect__results-empty-title">Results will appear here</p>
                            <p className="detect__results-empty-sub">Upload an EL image and click "Run Detection" to begin analysis</p>
                            <div className="detect__results-empty-steps">
                                {["Upload EL Image", "Run Detection", "View Results"].map((s, i) => (
                                    <div className="detect__empty-step" key={s}>
                                        <span className="detect__empty-step-num">{i + 1}</span>
                                        <span>{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="detect__result-card">
                            {/* Result Header */}
                            <div className="detect__result-header">
                                <div className="detect__result-model">
                                    <div className="detect__result-dot" />
                                    <span>{result.model_used}</span>
                                </div>
                                <span className={`detect__result-badge ${isHealthy ? "detect__result-badge--healthy" : "detect__result-badge--defect"}`}>
                                    {isHealthy ? (
                                        <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg> Healthy Panel</>
                                    ) : (
                                        <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg> {totalDefects} Defect{totalDefects !== 1 ? "s" : ""} Found</>
                                    )}
                                </span>
                            </div>

                            {/* Annotated Image */}
                            {result.result_image_url && (
                                <div className="detect__result-img">
                                    <img src={result.result_image_url} alt="Detection result" />
                                    <div className="detect__result-img-label">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                                        AI Annotated Output
                                    </div>
                                    <a href={result.result_image_url} download="detection_result.jpg" className="detect__result-download">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                        Download
                                    </a>
                                </div>
                            )}

                            {/* Summary Stats */}
                            <div className="detect__result-stats">
                                <div className="detect__stat-item">
                                    <span className="detect__stat-value">{totalDefects}</span>
                                    <span className="detect__stat-label">Total Defects</span>
                                </div>
                                <div className="detect__stat-item">
                                    <span className="detect__stat-value">{defectEntries.length}</span>
                                    <span className="detect__stat-label">Defect Types</span>
                                </div>
                                <div className="detect__stat-item">
                                    <span className={`detect__stat-value ${isHealthy ? "detect__stat-value--green" : "detect__stat-value--red"}`}>
                                        {isHealthy ? "Good" : "Faulty"}
                                    </span>
                                    <span className="detect__stat-label">Status</span>
                                </div>
                            </div>

                            {/* Defect Breakdown */}
                            <div className="detect__result-body">
                                {defectEntries.length > 0 ? (
                                    <>
                                        <h4 className="detect__result-breakdown-title">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></svg>
                                            Defect Breakdown
                                        </h4>
                                        <div className="detect__defects-list">
                                            {defectEntries.sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                                                <div className="detect__defect-item" key={type}>
                                                    <div className="detect__defect-row">
                                                        <span className="detect__defect-name">{type}</span>
                                                        <span className="detect__defect-count">{count}</span>
                                                    </div>
                                                    <div className="detect__defect-bar">
                                                        <div
                                                            className="detect__defect-bar-fill"
                                                            style={{ width: `${(count / maxCount) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="detect__no-defects">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                        <p>No defects detected</p>
                                        <span>This solar panel appears to be in healthy condition.</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
