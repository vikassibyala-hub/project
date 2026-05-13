import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import Home from "./pages/Home";
import Detection from "./pages/Detection";
import History from "./pages/History";
import AdminDashboard from "./pages/AdminDashboard";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import "./index.css";

const API_BASE_URL = "http://localhost:8000";

/* ─────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e, id) => {
    setMobileOpen(false);

    if (location.pathname === "/") {
      if (id === "hero") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className={`navbar${scrolled ? " navbar--scrolled" : ""} `}>
      <Link className="navbar__logo" to="/" onClick={(e) => handleNavClick(e, "hero")}>
        <div className="navbar__logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
        <span className="navbar__logo-text">Solar Vision AI</span>
      </Link>

      <button className="navbar__hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
        <span /><span /><span />
      </button>

      <ul className={`navbar__links${mobileOpen ? " navbar__links--open" : ""} `}>
        <li>
          <Link to="/#hero" onClick={(e) => handleNavClick(e, "hero")}>Home</Link>
        </li>
        {!isAdmin
          &&
          <li>
            <Link to="/detect" onClick={() => setMobileOpen(false)}>Detection</Link>
          </li>
        }
        {!isAdmin &&
          <li>
            <Link to="/history" onClick={() => setMobileOpen(false)}>History</Link>
          </li>
        }
        <li>
          <Link to="/#features" onClick={(e) => handleNavClick(e, "features")}>Features</Link>
        </li>
        <li>
          <Link to="/#about" onClick={(e) => handleNavClick(e, "about")}>About</Link>
        </li>
        {isAdmin && (
          <li>
            <Link to="/admin" onClick={() => setMobileOpen(false)} style={{ color: "var(--violet-main)", fontWeight: "bold" }}>Dashboard</Link>
          </li>
        )}
      </ul>

      <div className="navbar__actions">
        <ThemeToggle />
        <SignedOut>
          <SignInButton mode="modal">
            <button className="navbar__cta">Sign In</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="navbar__user">
            {isAdmin && <span className="badge--admin">Admin</span>}
            <UserButton afterSignOutUrl="/" />

          </div>
        </SignedIn>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────────
   SIGN-IN REQUIRED COMPONENT
───────────────────────────────────────────────── */
function SignInRequired() {
  return (
    <div className="access-denied">
      <h1 className="text-gradient">Sign In Required</h1>
      <p>You need to sign in to access this page.</p>
      <div style={{ display: "flex", gap: "16px", marginTop: "20px", flexWrap: "wrap", justifyContent: "center" }}>
        <SignInButton mode="modal">
          <button className="btn btn--primary">Sign In</button>
        </SignInButton>
        <Link to="/" className="btn btn--outline" style={{ borderColor: "var(--violet-main)", color: "var(--violet-main)" }}>Go Home</Link>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   ACCESS DENIED COMPONENT
───────────────────────────────────────────────── */
function AccessDenied() {
  return (
    <div className="access-denied">
      <h1 className="text-gradient">Access Restricted</h1>
      <p>Your account is currently pending approval. Please contact the administrator for access.</p>
      <Link to="/" className="navbar__cta" style={{ width: "fit-content", marginTop: "20px" }}>Return Home</Link>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────── */


/* ─────────────────────────────────────────────────
   APP WRAPPER (Inner App)
───────────────────────────────────────────────── */
function AppContent() {
  const { pathname, hash } = useLocation();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    // Scroll to top on route change if no hash
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      // Scroll to hash element if it exists
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [pathname, hash]);

  // Sync user with backend on login
  useEffect(() => {
    if (isLoaded && user) {
      fetch(`${API_BASE_URL}/admin/sync-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          first_name: user.firstName,
          last_name: user.lastName,
          image_url: user.imageUrl,
          email_addresses: user.emailAddresses.map(e => ({ email_address: e.emailAddress })),
          public_metadata: user.publicMetadata
        })
      }).catch(err => console.error("Sync error:", err));
    }
  }, [isLoaded, user]);

  return (
    <>
      <Navbar />
      <div className="global-bg-animation">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/detect"
            element={
              <>
                <SignedIn>
                  {user?.publicMetadata?.role === "admin" ? (
                    <AccessDenied />
                  ) : user?.publicMetadata?.hasAccess ? (
                    <Detection />
                  ) : (
                    <AccessDenied />
                  )}
                </SignedIn>
                <SignedOut>
                  <SignInRequired />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/history"
            element={
              <>
                <SignedIn>
                  {user?.publicMetadata?.role === "admin" ? (
                    <AccessDenied />
                  ) : user?.publicMetadata?.hasAccess ? (
                    <History />
                  ) : (
                    <AccessDenied />
                  )}
                </SignedIn>
                <SignedOut>
                  <SignInRequired />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/admin"
            element={
              <>
                <SignedIn>
                  <AdminDashboard />
                </SignedIn>
                <SignedOut>
                  <SignInRequired />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
