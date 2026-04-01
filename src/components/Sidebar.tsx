import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const links = [
  { to: "/home", label: "Dashboard" },
  { to: "/products", label: "Products" },
  { to: "/orders", label: "Orders" },
];

// ✅ Moved outside Sidebar
function NavLinks({ onClose }: { onClose?: () => void }) {
  return (
    <nav className="flex flex-col gap-2">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === "/home"}
          onClick={onClose}
          className={({ isActive }) =>
            `px-4 py-3 uppercase tracking-widest text-sm transition-colors rounded-sm ${
              isActive
                ? "bg-white text-neutral-900"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

function Sidebar() {
  const { admin, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* ── Desktop sidebar (md+) ── */}
      <aside className="hidden md:flex w-64 min-h-screen bg-neutral-900 text-white flex-col justify-between px-6 py-10 shrink-0">
        <div>
          <p className="uppercase tracking-widest text-sm text-neutral-400 mb-1">
            Admin
          </p>
          <h1 className="font-league text-3xl uppercase leading-none mb-12">
            eSim
          </h1>
          <NavLinks />
        </div>
        <div>
          <p className="text-sm text-neutral-400 mb-1 uppercase tracking-widest">
            Logged in as
          </p>
          <p className="text-white mb-6">{admin?.name ?? "Admin"}</p>
          <button
            onClick={handleLogout}
            className="w-full border border-neutral-700 text-neutral-400 hover:text-white hover:border-white py-2 uppercase tracking-widest text-sm transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ── Mobile topbar (below md) ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-neutral-900 text-white flex items-center justify-between px-5 py-4">
        <h1 className="font-league text-2xl uppercase leading-none">eSim</h1>
        <button
          onClick={() => setOpen(true)}
          className="text-neutral-400 hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </header>

      {/* ── Mobile drawer overlay ── */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <aside className="relative z-10 w-64 min-h-screen bg-neutral-900 text-white flex flex-col justify-between px-6 py-10">
            <div>
              <div className="flex items-center justify-between mb-12">
                <div>
                  <p className="uppercase tracking-widest text-sm text-neutral-400 mb-1">
                    Admin
                  </p>
                  <h1 className="font-league text-3xl uppercase leading-none">
                    eSim
                  </h1>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-neutral-400 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <NavLinks onClose={() => setOpen(false)} />
            </div>
            <div>
              <p className="text-sm text-neutral-400 mb-1 uppercase tracking-widest">
                Logged in as
              </p>
              <p className="text-white mb-6">{admin?.name ?? "Admin"}</p>
              <button
                onClick={handleLogout}
                className="w-full border border-neutral-700 text-neutral-400 hover:text-white hover:border-white py-2 uppercase tracking-widest text-sm transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;
