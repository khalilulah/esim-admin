import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const links = [
  { to: "/home", label: "Dashboard" },
  { to: "/products", label: "Products" },
  { to: "/orders", label: "Orders" },
];

function Sidebar() {
  const { admin, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="w-64 min-h-screen bg-neutral-900 text-white flex flex-col justify-between px-6 py-10 shrink-0">
      <div>
        {/* Brand */}
        <p className="uppercase tracking-widest text-sm text-neutral-400 mb-1">
          Admin
        </p>
        <h1 className="font-league text-3xl uppercase leading-none mb-12">
          eSim
        </h1>

        {/* Nav */}
        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/home"}
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
      </div>

      {/* Admin info + logout */}
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
  );
}

export default Sidebar;
