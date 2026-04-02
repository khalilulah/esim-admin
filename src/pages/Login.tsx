import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";

function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const { token, user } = await loginAdmin(email, password);
      setAuth(user, token);
      navigate("/home");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <p className="uppercase tracking-widest text-sm text-neutral-400 mb-1 text-center">
          Admin
        </p>
        <h1 className="font-league text-6xl uppercase leading-none text-white text-center mb-12">
          eSim
        </h1>

        <div className="bg-neutral-800 p-8 flex flex-col gap-6">
          {error && (
            <p className="text-error text-sm uppercase tracking-widest">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <label className="uppercase tracking-widest text-xs text-neutral-400">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-neutral-700 text-white px-4 py-3 outline-none focus:ring-1 focus:ring-white text-sm"
              placeholder="admin@esim.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="uppercase tracking-widest text-xs text-neutral-400">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="bg-neutral-700 text-white px-4 py-3 outline-none focus:ring-1 focus:ring-white text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-white text-neutral-900 py-4 uppercase tracking-widest text-sm hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
