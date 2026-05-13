import React from "react";
import { useReveal, useRevealList } from "../hooks/useReveal";
import { useUser } from "@clerk/clerk-react";

/* ─────────────────────────────────────────────────
   HERO SECTION
 ───────────────────────────────────────────────── */
function Hero() {
    const titleRef = useReveal({ threshold: 0.1 });
    const subtitleRef = useReveal({ threshold: 0.1 });
    const actionsRef = useReveal({ threshold: 0.1 });
    const [statsRootRef, addToStatsRefs] = useRevealList({ threshold: 0.1 });

    const { user } = useUser();
    const isAdmin = user?.publicMetadata?.role === "admin";

    const handleScroll = (e, id) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="hero" id="hero">
            <div className="hero__bg">
                <div className="hero__orb hero__orb--1" />
                <div className="hero__orb hero__orb--2" />
                <div className="hero__orb hero__orb--3" />
                <div className="hero__grid-overlay" />
            </div>

            <div className="hero__panels">
                <div className="hero__panel hero__panel--1">
                    <svg viewBox="0 0 60 40" fill="none"><rect x="2" y="2" width="56" height="36" rx="4" stroke="currentColor" strokeWidth="1.5" opacity="0.3" /><line x1="20" y1="2" x2="20" y2="38" stroke="currentColor" strokeWidth="0.8" opacity="0.2" /><line x1="40" y1="2" x2="40" y2="38" stroke="currentColor" strokeWidth="0.8" opacity="0.2" /><line x1="2" y1="14" x2="58" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.2" /><line x1="2" y1="26" x2="58" y2="26" stroke="currentColor" strokeWidth="0.8" opacity="0.2" /></svg>
                </div>
                <div className="hero__panel hero__panel--2">
                    <svg viewBox="0 0 60 40" fill="none"><rect x="2" y="2" width="56" height="36" rx="4" stroke="currentColor" strokeWidth="1.5" opacity="0.3" /><line x1="20" y1="2" x2="20" y2="38" stroke="currentColor" strokeWidth="0.8" opacity="0.2" /><line x1="40" y1="2" x2="40" y2="38" stroke="currentColor" strokeWidth="0.8" opacity="0.2" /><line x1="2" y1="14" x2="58" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.2" /><line x1="2" y1="26" x2="58" y2="26" stroke="currentColor" strokeWidth="0.8" opacity="0.2" /></svg>
                </div>
            </div>

            <div className="hero__content">
                <div className="hero__badge reveal reveal-scale" ref={titleRef}>
                    <span className="hero__badge-dot" />
                    AI-Powered Solar Analysis
                </div>

                <h1 className="hero__title reveal reveal-up delay-100" ref={titleRef}>
                    AI-Powered Solar Panel <span className="hero__title-accent">Defect Detection</span>
                </h1>

                <p className="hero__subtitle reveal reveal-up delay-200" ref={subtitleRef}>
                    Our  interface leverages YOLOv8 deep learning to provide
                    real-time defect detection for high-scale solar photovoltaic systems.
                </p>

                <div className="hero__actions reveal reveal-up delay-300" ref={actionsRef}>
                    {isAdmin ? <a href="/admin" className="btn btn--primary">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                        Go to Dashboard
                    </a> : <a href="/detect" className="btn btn--primary">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                        Start Detection
                    </a>}
                    <a href="#workflow" className="btn btn--outline" onClick={(e) => handleScroll(e, "workflow")}>
                        View Workflow
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </a>
                </div>

                <div className="hero__stats">
                    {[
                        ["78%", "Precision"],
                        ["79%", "Recall"],
                        ["12", "Defect Types"],
                        ["100", "Epochs"],
                    ].map(([val, label], i) => (
                        <div className={`hero__stat reveal reveal-scale delay-${(i + 4) * 100}`} key={label} ref={addToStatsRefs}>
                            <div className="hero__stat-value">{val}</div>
                            <div className="hero__stat-label">{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="hero__scroll">
                <span>Explore the  Architecture</span>
                <div className="hero__scroll-line" />
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────
   SOLAR ENERGY IMPORTANCE SECTION
 ───────────────────────────────────────────────── */
function SolarEnergyImportance() {
    const benefits = [
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
            ),
            title: "Unlimited & Renewable",
            desc: "The sun delivers approximately 173,000 terawatts of energy to the Earth continuously — over 10,000 times the world's total energy consumption. Solar power is the most abundant energy source available on the planet."
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 22c1.25-1.25 2.5-2 4-2 1.5 0 2.75.75 4 2 1.25-1.25 2.5-2 4-2 1.5 0 2.75.75 4 2" /><path d="M2 17c1.25-1.25 2.5-2 4-2 1.5 0 2.75.75 4 2 1.25-1.25 2.5-2 4-2 1.5 0 2.75.75 4 2" /><path d="M10 3v4" /><path d="M14 3v4" /><path d="M6 7h12" /><path d="M8 7v4" /><path d="M16 7v4" /><path d="M6 11h12" />
                </svg>
            ),
            title: "Zero Carbon Emissions",
            desc: "Solar panels produce electricity with zero direct carbon emissions during operation. A typical residential solar system offsets 3-4 tonnes of CO₂ annually — equivalent to planting over 100 trees each year."
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            ),
            title: "Economic Growth",
            desc: "The global solar industry supports over 4.3 million jobs worldwide. Solar energy reduces electricity costs by 50-90% for adopters and has seen a 99% cost reduction in panel prices since 1977."
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
            ),
            title: "Energy Independence",
            desc: "Solar power enables nations to reduce dependence on imported fossil fuels, enhancing energy security. Distributed solar generation makes communities resilient against power grid failures and price volatility."
        }
    ];

    const globalStats = [
        { value: "1.6 TW", label: "Global Solar Capacity", sub: "Installed as of 2024" },
        { value: "33%", label: "Growth Rate", sub: "Year-over-year increase" },
        { value: "4.3M", label: "Jobs Created", sub: "Worldwide employment" },
        { value: "99%", label: "Cost Reduction", sub: "Since 1977" }
    ];

    const headerRef = useReveal();
    const [statsRootRef, addToStats] = useRevealList();
    const [cardsRootRef, addToCards] = useRevealList();
    const bannerRef = useReveal();

    return (
        <section className="section solar-importance" id="solar-importance">
            <div className="section__header reveal reveal-up" ref={headerRef}>
                <span className="section__eyebrow">Why Solar Energy?</span>
                <h2 className="section__title">
                    The Power of <span className="text-gradient">Solar Energy</span>
                </h2>
                <p className="section__desc">
                    Solar energy is the cornerstone of a sustainable future. As the world's fastest-growing energy source,
                    it holds the key to combating climate change and powering global progress.
                </p>
            </div>

            {/* Global Impact Stats */}
            <div className="solar-stats-bar">
                {globalStats.map((stat, i) => (
                    <div className={`solar-stats-bar__item reveal reveal-scale delay-${(i % 5) * 100}`} key={stat.label} ref={addToStats}>
                        <div className="solar-stats-bar__value">{stat.value}</div>
                        <div className="solar-stats-bar__label">{stat.label}</div>
                        <div className="solar-stats-bar__sub">{stat.sub}</div>
                    </div>
                ))}
            </div>

            {/* Benefit Cards */}
            <div className="solar-benefits__grid">
                {benefits.map((b, i) => (
                    <div className={`solar-benefit-card reveal reveal-up delay-${(i % 5) * 100}`} key={b.title} ref={addToCards}>
                        <div className="solar-benefit-card__icon">{b.icon}</div>
                        <h3 className="solar-benefit-card__title">{b.title}</h3>
                        <p className="solar-benefit-card__desc">{b.desc}</p>
                    </div>
                ))}
            </div>

            {/* Highlight Banner */}
            <div className="solar-highlight-banner reveal reveal-scale delay-100" ref={bannerRef}>
                <div className="solar-highlight-banner__icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                    </svg>
                </div>
                <div className="solar-highlight-banner__content">
                    <h3>The Future is Solar</h3>
                    <p>
                        By 2050, solar energy is projected to become the world's largest source of electricity,
                        supplying up to 45% of global energy demand. With panel efficiency improving every year,
                        the economic case for solar has never been stronger. Every additional megawatt of solar
                        capacity installed prevents approximately 1,500 tonnes of CO₂ emissions over its lifetime.
                    </p>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────
   DEFECT DETECTION IMPORTANCE SECTION
 ───────────────────────────────────────────────── */
function DefectDetectionImportance() {
    const impacts = [
        {
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
            ),
            label: "Power Loss Risk",
            stat: "Up to 25%",
            desc: "A single undetected defect like a micro-crack or a hot spot can reduce a solar panel's power output by up to 25%. Across a large solar farm, this silent degradation translates to thousands of dollars in lost revenue annually.",
            color: "red"
        },
        {
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
            ),
            label: "Early Detection Saves",
            stat: "$16B+",
            desc: "The global solar O&M market is valued at over $16 billion. Early defect detection through automated AI analysis can reduce maintenance costs by 30-40% compared to reactive repairs and extend panel lifespan by 5-10 years.",
            color: "green"
        },
        {
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
            ),
            label: "Time Efficiency",
            stat: "100x Faster",
            desc: "Manual visual inspection of solar panels is time-consuming and error-prone. AI-powered defect detection systems can analyze thousands of panels in minutes — a task that would take human inspectors weeks to complete.",
            color: "violet"
        },
        {
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
                </svg>
            ),
            label: "ROI Improvement",
            stat: "15-20%",
            desc: "Solar farms that implement automated defect detection see a 15-20% improvement in return on investment. Catching defects early prevents cascading failures and ensures every panel operates at peak efficiency.",
            color: "black"
        }
    ];

    const defectEffects = [
        { defect: "Micro-Cracks", effect: "8-12% power loss", severity: "high" },
        { defect: "Hot Spots", effect: "10-25% power loss", severity: "critical" },
        { defect: "Snail Trails", effect: "5-8% power loss", severity: "medium" },
        { defect: "PID Effect", effect: "Up to 30% degradation", severity: "critical" },
        { defect: "Delamination", effect: "Module failure risk", severity: "high" },
        { defect: "Cell Fractures", effect: "15-20% power loss", severity: "high" }
    ];

    const headerRef = useReveal();
    const [impactsRootRef, addToImpacts] = useRevealList();
    const tableRef = useReveal();
    const ctaRef = useReveal();

    return (
        <section className="section defect-importance" id="defect-importance">
            <div className="section__header reveal reveal-up" ref={headerRef}>
                <span className="section__eyebrow">Why Defect Detection?</span>
                <h2 className="section__title">
                    Maximizing <span className="text-gradient--alt">Power Output</span> Through Detection
                </h2>
                <p className="section__desc">
                    Solar panel defects are invisible to the naked eye but devastating to power output.
                    Automated detection is essential for maintaining peak energy generation efficiency.
                </p>
            </div>

            {/* Impact Cards */}
            <div className="defect-impact__grid">
                {impacts.map((item, i) => (
                    <div className={`defect-impact-card defect-impact-card--${item.color} reveal reveal-scale delay-${(i % 5) * 100}`} key={item.label} ref={addToImpacts}>
                        <div className="defect-impact-card__header">
                            <div className="defect-impact-card__icon">{item.icon}</div>
                            <span className="defect-impact-card__stat">{item.stat}</span>
                        </div>
                        <h3 className="defect-impact-card__label">{item.label}</h3>
                        <p className="defect-impact-card__desc">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* Defect Effects Table */}
            <div className="defect-effects-panel reveal reveal-up delay-200" ref={tableRef}>
                <div className="defect-effects-panel__header">
                    <h3 className="defect-effects-panel__title">Common Defects & Their Impact on Power Output</h3>
                    <p className="defect-effects-panel__subtitle">
                        Understanding how each defect type impacts performance is critical for prioritizing maintenance.
                    </p>
                </div>
                <div className="defect-effects-panel__list">
                    {defectEffects.map((item) => (
                        <div className="defect-effect-row" key={item.defect}>
                            <div className="defect-effect-row__name">{item.defect}</div>
                            <div className="defect-effect-row__effect">{item.effect}</div>
                            <span className={`defect-effect-row__badge defect-effect-row__badge--${item.severity}`}>
                                {item.severity}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Banner */}
            <div className="defect-cta-banner reveal reveal-scale delay-300" ref={ctaRef}>
                <div className="defect-cta-banner__content">
                    <h3>Don't Let Defects Drain Your Solar Investment</h3>
                    <p>
                        Every undetected defect reduces your energy yield and shortens panel lifespan.
                        Our YOLOv8-powered AI detection system identifies 12 types of defects in seconds,
                        helping you maintain optimal power output and maximize your ROI.
                    </p>
                </div>
                <a href="/detect" className="btn btn--primary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                    Start Detection Now
                </a>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────
   WORKFLOW SECTION
 ───────────────────────────────────────────────── */
function Workflow() {
    const steps = [
        {
            idx: "01",
            title: "Data Ingestion",
            desc: "Upload EL images through our secure  endpoint or API.",
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
        },
        {
            idx: "02",
            title: "Distributed Analysis",
            desc: "Cloud-based YOLOv8 processing at 640x640 resolution.",
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        },
        {
            idx: "03",
            title: "Visual Intelligence",
            desc: "Get annotated results and structured defect heatmaps instantly.",
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
        }
    ];

    const headerRef = useReveal();
    const [stepsRootRef, addToSteps] = useRevealList();

    return (
        <section className="section workflow" id="workflow">
            <div className="section__header reveal reveal-up" ref={headerRef}>
                <span className="section__eyebrow">Operational Flow</span>
                <h2 className="section__title"><span className="text-gradient">Automated Workflow</span></h2>
                <p className="section__desc">
                    Experience a streamlined  workflow designed for solar farm operators.
                </p>
            </div>

            <div className="workflow__grid">
                <div className="workflow__connector" />
                {steps.map((s, i) => (
                    <div className={`workflow__item reveal reveal-up delay-${(i % 5) * 100}`} key={s.idx} ref={addToSteps}>
                        <div className="workflow__step">{s.idx}</div>
                        <div className="workflow__icon">{s.icon}</div>
                        <h3 className="workflow__item-title">{s.title}</h3>
                        <p className="workflow__item-desc">{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────
   TECH STACK SECTION
 ───────────────────────────────────────────────── */
function TechStack() {
    const techItems = [
        {
            title: "YOLOv8",
            subtitle: "CV Engine",
            icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
        },
        {
            title: "FastAPI",
            subtitle: "REST Infrastructure",
            icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" /></svg>
        },
        {
            title: "React ",
            subtitle: "User Interface",
            icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4" /><path d="m4.93 4.93 2.83 2.83" /><path d="M2 12h4" /><path d="m4.93 19.07 2.83-2.83" /><path d="M12 18v4" /><path d="m16.24 16.24 2.83 2.83" /><path d="M18 12h4" /><path d="m16.24 7.76 2.83-2.83" /></svg>
        },
        {
            title: "Tesla T4",
            subtitle: "GPU Acceleration",
            icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6" y2="6" /><line x1="6" y1="18" x2="6" y2="18" /></svg>
        }
    ];

    const headerRef = useReveal();
    const [techRootRef, addToTech] = useRevealList();

    return (
        <section className="section tech" id="tech">
            <div className="section__header reveal reveal-up" ref={headerRef}>
                <span className="section__eyebrow">Enterprise Stack</span>
                <h2 className="section__title">Powered By <span className="text-gradient--alt"> Cloud</span></h2>
                <p className="section__desc">
                    Robust industrial-grade technologies for maximum reliability and uptime.
                </p>
            </div>

            <div className="tech__grid">
                {techItems.map((item, i) => (
                    <div className={`tech-card reveal reveal-scale delay-${(i % 5) * 100}`} key={item.title} ref={addToTech}>
                        <div className="tech-card__icon">{item.icon}</div>
                        <h3 className="tech-card__title">{item.title}</h3>
                        <p className="tech-card__subtitle">{item.subtitle}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────
   DEFECT TYPES SECTION
 ───────────────────────────────────────────────── */
function DefectTypes() {
    const defects = [
        "Crack", "Scratch", "Corner", "Black Core",
        "Finger", "Fragment", "Horizontal Dislocation", "Printing Error",
        "Short Circuit", "Star Crack", "Thick Line", "Vertical Dislocation"
    ];

    const headerRef = useReveal();
    const [defectsRootRef, addToDefects] = useRevealList();
    const summaryRef = useReveal();

    return (
        <section className="section defects" id="defects">
            <div className="section__header reveal reveal-up" ref={headerRef}>
                <span className="section__eyebrow">Visual Analysis</span>
                <h2 className="section__title"><span className="text-gradient">12 Core Defect Classes</span></h2>
                <p className="section__desc">
                    Comprehensive detection of all critical structural and electrical anomalies.
                </p>
            </div>

            <div className="defects__grid">
                {defects.map((name, i) => (
                    <div className={`defect-type reveal reveal-scale delay-${((i % 6) + 1) * 100}`} key={name} ref={addToDefects}>
                        <div className="defect-type__idx">{(i + 1).toString().padStart(2, '0')}</div>
                        <span className="defect-type__name">{name}</span>
                    </div>
                ))}
            </div>

            <div className="defect-summary-card reveal reveal-up delay-300" ref={summaryRef}>
                <div className="defect-summary-card__content">
                    <h3 className="defect-summary-card__title">Dataset Precision</h3>
                    <p className="defect-summary-card__text">
                        The YOLOv8 model was trained on 4,108 EL images for 100 epochs,
                        achieving a 76% mAP@0.5 across all 12 defect classes.
                    </p>
                </div>
                <div className="defect-summary-card__stats">
                    <div className="defect-stat">
                        <span className="defect-stat__val">76%</span>
                        <span className="defect-stat__lbl">mAP@0.5</span>
                    </div>
                    <div className="defect-stat">
                        <span className="defect-stat__val">4.1K</span>
                        <span className="defect-stat__lbl">EL Images</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────
   FAQ SECTION
 ───────────────────────────────────────────────── */
function FAQ() {
    const faqs = [
        {
            q: "How accurate is the YOLOv8 model?",
            a: "The model achieves a 78% precision and 79% recall, making it highly reliable for automated solar inspection tasks."
        },
        {
            q: "What types of images are supported?",
            a: "System supports Electroluminescence (EL) images in JPG, PNG, and WEBP formats at 640x640 resolution."
        },
        {
            q: "Is detection performed in real-time?",
            a: "Yes, using NVIDIA Tesla T4 GPU acceleration, inference is completed in less than 2 seconds."
        },
        {
            q: "Can it detect multiple defects in one image?",
            a: "Absolutely. The system can detect and annotate multiple defect classes simultaneously within a single panel scan."
        }
    ];

    const headerRef = useReveal();
    const [faqRootRef, addToFaq] = useRevealList();

    return (
        <section className="section faq" id="faq">
            <div className="section__header reveal reveal-up" ref={headerRef}>
                <span className="section__eyebrow">Common Queries</span>
                <h2 className="section__title">Frequently Asked <span className="text-gradient">Questions</span></h2>
            </div>
            <div className="faq__grid">
                {faqs.map((faq, i) => (
                    <div className={`faq-item reveal reveal-scale delay-${(i % 4) * 100}`} key={i} ref={addToFaq}>
                        <div className="faq-item__question">
                            <div className="faq-item__icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                            </div>
                            {faq.q}
                        </div>
                        <p className="faq-item__answer">{faq.a}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────
   FEATURES SECTION
 ───────────────────────────────────────────────── */
function Features() {
    const features = [
        {
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>
            ),
            color: "violet",
            title: "Automated Inspection",
            desc: "Reduces manual inspection effort for large-scale solar farms.",
        },
        {
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            ),
            color: "black",
            title: "Efficiency Boost",
            desc: "Early detection critical for ensuring optimal energy production.",
        },
        {
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            ),
            color: "violet-deep",
            title: "GPU Accelerated",
            desc: "High-speed inference suitable for real-time monitoring tasks.",
        },
        {
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>
            ),
            color: "black-deep",
            title: "Enterprise Grade",
            desc: "Powered by the latest YOLOv8 model for reliable  performance.",
        },
    ];

    const headerRef = useReveal();
    const [featuresRootRef, addToFeatures] = useRevealList();

    return (
        <section className="section" id="features">
            <div className="section__header reveal reveal-up" ref={headerRef}>
                <span className="section__eyebrow">Enterprise Value</span>
                <h2 className="section__title"> <span className="text-gradient">Core Features</span></h2>
            </div>

            <div className="features__grid">
                {features.map((f, i) => (
                    <div className={`feature-card feature-card--${f.color} reveal reveal-up delay-${(i % 4) * 100}`} key={f.title} ref={addToFeatures}>
                        <div className="feature-card__icon">{f.icon}</div>
                        <h3 className="feature-card__title">{f.title}</h3>
                        <p className="feature-card__desc">{f.desc}</p>
                        <div className="feature-card__glow" />
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────
   ABOUT SECTION
 ───────────────────────────────────────────────── */
function About() {
    const headerRef = useReveal();
    const contentRef = useReveal();

    return (
        <section className="section section--about" id="about">
            <div className="section__header reveal reveal-up" ref={headerRef}>
                <span className="section__eyebrow">Technical Overview</span>
                <h2 className="section__title">Our <span className="text-gradient">Mission</span></h2>
            </div>

            <div className="about__content reveal reveal-up delay-200" ref={contentRef}>
                <div className="about__card">
                    <div className="about__icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                    </div>
                    <p className="about__text">
                        Digital Transformation in solar inspection is essential for reliability.
                        Our  system leverages YOLOv8 trained on 4,108 EL images to ensure
                        every panel performs at peak efficiency. We automate detection across
                        12 defect classes, reducing downtime and operational overhead.
                    </p>

                    <div className="about__highlights">
                        {[
                            ["Enterprise ", "Cloud-native infrastructure for global solar asset management"],
                            ["Automated Quality", "Real-time verification of PV cell integrity using CV"],
                            ["Predictive Maintenance", "Identify faults before they impact your yield"],
                        ].map(([title, desc], i) => (
                            <div className="about__highlight" key={title}>
                                <div className="about__highlight-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
                                <div>
                                    <div className="about__highlight-title">{title}</div>
                                    <div className="about__highlight-desc">{desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function Home() {
    return (
        <>
            <Hero />
            <SolarEnergyImportance />
            <DefectDetectionImportance />
            <Workflow />
            <TechStack />
            <DefectTypes />
            <Features />
            <FAQ />
            <About />
        </>
    );
}
