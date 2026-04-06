import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./index.css";

type Page = "login" | "register" | "dashboard";

export default function App() {
  const [page, setPage] = useState<Page>("login");
  const [accountId, setAccountId] = useState<number | null>(null);
  const [balance, setBalance] = useState<number>(0);

  function handleAuth(id: number, bal: number, token: string) {
    localStorage.setItem("token", token);
    setAccountId(id);
    setBalance(bal);
    setPage("dashboard");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setAccountId(null);
    setBalance(0);
    setPage("login");
  }

  return (
    <div className="app">
      <div className="brand">🏦 Micro Bank</div>
      {page === "login" && (
        <Login onLogin={handleAuth} goToRegister={() => setPage("register")} />
      )}
      {page === "register" && (
        <Register onRegister={handleAuth} goToLogin={() => setPage("login")} />
      )}
      {page === "dashboard" && accountId !== null && (
        <Dashboard accountId={accountId} initialBalance={balance} onLogout={handleLogout} />
      )}
    </div>
  );
}
