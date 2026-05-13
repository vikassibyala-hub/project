import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useReveal, useRevealList } from "../hooks/useReveal";

const API_BASE = "http://127.0.0.1:8000";

/* ─────────────────────────────────────────────────
   HISTORY PAGE
 ───────────────────────────────────────────────── */
export default function History() {
    const { user } = useUser();
    const [history, setHistory] = useState([]);
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [loadingHistory, setLoadingHistory] = useState(true);

    // Build a preview map from localStorage (DB doesn't store base64 blobs)
    const buildPreviewMap = () => {
        const local = JSON.parse(localStorage.getItem("detectionHistory") || "[]");
        const map = {};
        local.forEach(item => {
            if (item.fileName && item.preview) map[item.fileName] = item.preview;
        });
        return map;
    };

    useEffect(() => {
        const load = async () => {
            setLoadingHistory(true);
            try {
                if (user?.id) {
                    // Fetch from DB
                    const res = await fetch(`${API_BASE}/history/${user.id}`);
                    if (!res.ok) throw new Error("DB fetch failed");
                    const dbData = await res.json();

                    // Merge localStorage previews (DB has no image blobs)
                    const previewMap = buildPreviewMap();
                    const merged = dbData.map(h => ({
                        ...h,
                        id: h._id || h.id,
                        timestamp: h.timestamp || new Date().toISOString(),
                        preview: previewMap[h.fileName] || null,
                    }));
                    setHistory(merged);
                    if (merged.length > 0) setSelected(merged[0]);
                } else {
                    // No user — fall back to localStorage
                    const local = JSON.parse(localStorage.getItem("detectionHistory") || "[]");
                    setHistory(local);
                    if (local.length > 0) setSelected(local[0]);
                }
            } catch {
                // DB error — fall back to localStorage
                const local = JSON.parse(localStorage.getItem("detectionHistory") || "[]");
                setHistory(local);
                if (local.length > 0) setSelected(local[0]);
            } finally {
                setLoadingHistory(false);
            }
        };
        load();
    }, [user]);

    const clearHistory = async () => {
        if (!window.confirm("Clear all detection history? This cannot be undone.")) return;
        if (user?.id) {
            await fetch(`${API_BASE}/history/${user.id}`, { method: "DELETE" }).catch(console.warn);
        }
        localStorage.removeItem("detectionHistory");
        setHistory([]);
        setSelected(null);
    };

    const deleteEntry = async (id) => {
        // Delete from DB (id is MongoDB _id string)
        if (user?.id) {
            await fetch(`${API_BASE}/history/${user.id}/${id}`, { method: "DELETE" }).catch(console.warn);
        }
        // Also remove from localStorage cache
        const local = JSON.parse(localStorage.getItem("detectionHistory") || "[]");
        localStorage.setItem("detectionHistory", JSON.stringify(local.filter(h => String(h.id) !== String(id))));

        const updated = history.filter(h => String(h.id) !== String(id));
        setHistory(updated);
        if (selected?.id === id) setSelected(updated[0] || null);
    };

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    };

    const handleDownload = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `annotated_${filename}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Failed to download image:", error);
            // Fallback for cross-origin issues
            window.open(url, '_blank');
        }
    };

    const filtered = history.filter((h) => {
        const matchFilter =
            filter === "all" ||
            (filter === "defective" && h.total_defects > 0) ||
            (filter === "healthy" && h.total_defects === 0);
        const matchSearch = (h.fileName || "").toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const defectTypes = selected ? Object.keys(selected.defects || {}).length : 0;
    const maxCount = selected ? Math.max(...Object.values(selected.defects || {}), 1) : 1;

    const headerRef = useReveal();
    const [, addToStats] = useRevealList({ threshold: 0.1 });
    const controlsRef = useReveal();
    const [, addToList] = useRevealList({ threshold: 0.05 });
    const detailRef = useReveal({ threshold: 0.05 });

    return (
        <section className="history-page" id="history">
            {/* Page Header */}
            <div className="history-page__header">
                <div className="history-page__header-inner reveal reveal-up" ref={headerRef}>
                    <span className="section__eyebrow">Detection History</span>
                    <h1 className="history-page__title">
                        Analysis <span className="text-gradient">History</span>
                    </h1>

                </div>
                <div className="history-page__header-actions">
                    <Link to="/detect" className="btn btn--primary" style={{ fontSize: "13px", padding: "11px 24px" }}>
                        New Detection
                    </Link>
                    {history.length > 0 && (
                        <button className="btn btn--ghost-danger" onClick={clearHistory}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" /></svg>
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            {loadingHistory ? (
                <div className="history-loading">
                    <div className="detect__spinner" style={{ margin: "80px auto" }} />
                    <p>Loading your detection history...</p>
                </div>
            ) : history.length === 0 ? (
                <div className="history-empty">
                    <div className="history-empty__icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </div>
                    <h3>No History Yet</h3>
                    <p>Your detection results will appear here after you run your first analysis.</p>
                    <Link to="/detect" className="btn btn--primary">
                        Start First Detection
                    </Link>
                </div>
            ) : (
                <>
                    {/* Summary Stats */}
                    <div className="history-stats">
                        <div className="history-stat reveal reveal-scale delay-100" ref={addToStats}>
                            <span className="history-stat__value">{history.length}</span>
                            <span className="history-stat__label">Total Scans</span>
                        </div>
                        <div className="history-stat reveal reveal-scale delay-200" ref={addToStats}>
                            <span className="history-stat__value history-stat__value--red">
                                {history.filter(h => h.total_defects > 0).length}
                            </span>
                            <span className="history-stat__label">Defective</span>
                        </div>
                        <div className="history-stat reveal reveal-scale delay-300" ref={addToStats}>
                            <span className="history-stat__value history-stat__value--green">
                                {history.filter(h => h.total_defects === 0).length}
                            </span>
                            <span className="history-stat__label">Healthy</span>
                        </div>
                        <div className="history-stat reveal reveal-scale delay-400" ref={addToStats}>
                            <span className="history-stat__value">
                                {history.reduce((a, h) => a + (h.total_defects || 0), 0)}
                            </span>
                            <span className="history-stat__label">Total Defects</span>
                        </div>
                    </div>

                    {/* Filters & Search */}
                    <div className="history-controls reveal reveal-up delay-200" ref={controlsRef}>
                        <div className="history-filters">
                            {["all", "defective", "healthy"].map((f) => (
                                <button
                                    key={f}
                                    className={`history-filter-btn${filter === f ? " history-filter-btn--active" : ""}`}
                                    onClick={() => setFilter(f)}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div className="history-search">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            <input
                                type="text"
                                placeholder="Search by filename..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* History & Detail Layout */}
                    <div className="history-layout">
                        {/* Left: History List */}
                        <div className="history-list">
                            {filtered.length === 0 ? (
                                <div className="history-list__empty">No results match your filter.</div>
                            ) : (
                                filtered.map((h, i) => (
                                    <div
                                        key={h.id}
                                        className={`history-item ${selected?.id === h.id ? " history-item--active" : ""}`}
                                        style={{ animation: `fadeUp 0.4s var(--ease) ${(i % 10) * 0.05}s both` }}
                                        onClick={() => setSelected(h)}
                                    >
                                        <div className="history-item__thumb">
                                            {h.result_image_url || h.preview ? (
                                                <img
                                                    src={h.result_image_url || h.preview}
                                                    alt={h.fileName}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="history-item__thumb-placeholder">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="history-item__info">
                                            <div className="history-item__name" title={h.fileName}>
                                                {h.fileName || "Unknown file"}
                                            </div>
                                            <div className="history-item__meta">
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                                {formatDate(h.timestamp)}
                                            </div>
                                            <div className="history-item__tags">
                                                <span className={`history-tag ${h.total_defects > 0 ? "history-tag--defect" : "history-tag--healthy"}`}>
                                                    {h.total_defects > 0 ? `${h.total_defects} defects` : "Healthy"}
                                                </span>
                                                <span className="history-tag history-tag--model">{h.model_used}</span>
                                            </div>
                                        </div>
                                        <button
                                            className="history-item__delete"
                                            onClick={(e) => { e.stopPropagation(); deleteEntry(h.id); }}
                                            title="Delete this entry"
                                        >
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Right: Selected Detail */}
                        <div className="history-detail">
                            {!selected ? (
                                <div className="history-detail__empty">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                    <p>Select a scan from the list to view details</p>
                                </div>
                            ) : (
                                <>
                                    <div className="history-detail__card-header">
                                        <div>
                                            <h3 className="history-detail__filename">{selected.fileName}</h3>
                                            <p className="history-detail__timestamp">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                                {formatDate(selected.timestamp)}
                                                &nbsp;·&nbsp;
                                                {selected.fileSize ? `${(selected.fileSize / 1024).toFixed(0)} KB` : ""}
                                            </p>
                                        </div>
                                        <span className={`detect__result-badge ${selected.total_defects > 0 ? "detect__result-badge--defect" : "detect__result-badge--healthy"}`}>
                                            {selected.total_defects > 0
                                                ? `${selected.total_defects} Defect${selected.total_defects !== 1 ? "s" : ""}`
                                                : "Healthy"}
                                        </span>
                                    </div>

                                    {/* Summary Row */}
                                    <div className="detect__result-stats">
                                        <div className="detect__stat-item">
                                            <span className="detect__stat-value">{selected.total_defects}</span>
                                            <span className="detect__stat-label">Total Defects</span>
                                        </div>
                                        <div className="detect__stat-item">
                                            <span className="detect__stat-value">{defectTypes}</span>
                                            <span className="detect__stat-label">Defect Types</span>
                                        </div>
                                        <div className="detect__stat-item">
                                            <span className={`detect__stat-value ${selected.total_defects === 0 ? "detect__stat-value--green" : "detect__stat-value--red"}`}>
                                                {selected.total_defects === 0 ? "Good" : "Faulty"}
                                            </span>
                                            <span className="detect__stat-label">Status</span>
                                        </div>
                                    </div>

                                    {/* Images */}
                                    <div className="history-detail__images">
                                        {selected.result_image_url && (
                                            <div className="history-detail__img-wrap">
                                                <img src={selected.result_image_url} alt="Annotated result" />
                                                <span className="history-detail__img-label">AI Annotated Result</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Defect Breakdown */}
                                    {Object.keys(selected.defects || {}).length > 0 ? (
                                        <div className="detect__result-body">
                                            <h4 className="detect__result-breakdown-title">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></svg>
                                                Defect Breakdown
                                            </h4>
                                            <div className="detect__defects-list">
                                                {Object.entries(selected.defects)
                                                    .sort((a, b) => b[1] - a[1])
                                                    .map(([type, count]) => (
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
                                        </div>
                                    ) : (
                                        <div className="detect__no-defects">
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                            <p>No defects detected</p>
                                            <span>This solar panel was healthy at time of scan.</span>
                                        </div>
                                    )}

                                    {/* Model Used & Download */}
                                    <div className="history-detail__footer">
                                        <div className="history-detail__model">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                            Model used: <strong>{selected.model_used}</strong>
                                        </div>

                                        {selected.result_image_url && (
                                            <button
                                                className="btn btn--outline"
                                                style={{ fontSize: "12px", padding: "8px 16px" }}
                                                onClick={() => handleDownload(selected.result_image_url, selected.fileName)}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                                Download Image
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
