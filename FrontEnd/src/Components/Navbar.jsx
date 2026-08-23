import { navbarStyles as s } from "../assets/dummyStyles";
import { Logo } from "../assets/ui";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useRef, useState } from "react";
import { Zap, Settings, X, Menu, LogOut, Plus, Sun, Moon } from "lucide-react";

// ── ThemeToggle ──────────────────────────────────────────────────────────
function ThemeToggle({ className = "" }) {
  const { isLight, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      title={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className={`w-9 h-9 shrink-0 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center transition ${className}`}
    >
      {isLight ? (
        <Moon className="w-4 h-4 text-white/70" />
      ) : (
        <Sun className="w-4 h-4 text-white/70" />
      )}
    </button>
  );
}


const links = [
  { label: "Home", to: "/" },
  { label: "My Projects", to: "/dashboard", protected: true },
  { label: "Community", to: "/community" },
  { label: "Pricing", to: "/pricing" },
];

const accountLinks = [
  {
    label: "Buy credits",
    icon: Zap,
    to: "/pricing",
    iconClass: s.accountIconIndigo,
  },
  { label: "Settings", icon: Settings, to: "/settings" },
];

// ── UserMenu ─────────────────────────────────────────────────────────────
function UserMenu() {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  if (!user) return null;

  const initials = (user.name || user.email || "U")
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div ref={ref} className={s.userMenuWrapper}>
      <button
        onClick={() => navigate("/pricing")}
        title="Buy more credits"
        className={s.creditsPill}
      >
        <Zap className={s.creditsIcon} />
        <span className={s.creditsLabel}>Credits :</span>
        <span className={s.creditsNumber}>{user.credits ?? 0}</span>
        <Plus className={s.plusIcon} />
      </button>

      <button
        onClick={() => setOpen((o) => !o)}
        className={s.avatar}
      >
        {initials}
      </button>

      {open && (
        <div className={s.dropdown}>
          <div className={s.dropdownHeader}>
            <div className={s.avatar}>{initials}</div>
            <div className={s.dropdownUserInfo}>
              <p className={s.dropdownUserName}>{user.name}</p>
              <p className={s.dropdownUserEmail}>{user.email}</p>
            </div>
          </div>
          <div className={s.dropdownBody}>
            {accountLinks.map(({ label, icon: Icon, to, iconClass }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={s.dropdownItem}
              >
                <Icon className={`${s.iconMd} ${iconClass || ""}`} /> {label}
              </Link>
            ))}
            <button
              onClick={() => {
                logoutUser();
                setOpen(false);
                navigate("/");
              }}
              className={s.dropdownSignOut}
            >
              <LogOut className={s.iconMd} /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



const Navbar = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const isAuthed = Boolean(user);
  const [isOpen, setIsOpen] = useState(false);
  const visibleLinks = links.filter((link) => !link.protected || isAuthed);

  return (
    <nav className={s.root}>
      <div className={s.container}>
        <Logo />

        <div className={s.centerLinks}>
          {visibleLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `${s.navLinkBase} ${isActive ? s.navLinkActive : s.navLinkInactive}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className={s.desktopRight}>
          <ThemeToggle />
          {isAuthed ? (
            <UserMenu />
          ) : (
            <>
              <Link to='/login' className={s.signInLink}>
                Sign in
              </Link>

              <button onClick={() => navigate("/register")} className={`${s.btnPrimary} text-[13px] px-4 py-2`}>
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setIsOpen(!isOpen)} className={s.hamburger}>
            {isOpen ? (
              <X className={s.hamburgerIcon} />
            ) : (
              <Menu className={s.hamburgerIcon} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <div className={s.mobileMenu}>
            {visibleLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={s.mobileLink}
                onClick={() => setIsOpen(false)}
              >
                {l.label}
              </Link>
            ))}

            <div className={s.mobileDivider}>
              {isAuthed ? (
                <>
                  {accountLinks.map(({ label, icon: Icon, to }) => (
                    <Link
                      key={to}
                      to={to}
                      className={s.mobileAccountLink}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className={s.iconMd} />
                      {label}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logoutUser();
                      navigate("/");
                    }}
                    className={s.mobileSignOut}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={s.mobileAccountLink}
                    onClick={() => setIsOpen(false)}
                  >
                    Sign in
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/register");
                    }}
                    className={`${s.btnPrimary} ${s.mobileGetStarted}`}
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;