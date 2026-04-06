import { useState, useEffect } from "react";
import { deposit, withdraw, transfer, getHistory } from "../api";

interface Transaction {
  transactionId: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface Props {
  accountId: number;
  initialBalance: number;
  onLogout: () => void;
}

export default function Dashboard({ accountId, initialBalance, onLogout }: Props) {
  const [balance, setBalance] = useState(initialBalance);
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState<Transaction[]>([]);
  const [activeAction, setActiveAction] = useState<"deposit" | "withdraw" | "transfer">("deposit");

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const data = await getHistory(accountId);
      setHistory(data);
    } catch {
      setError("Failed to load history");
    }
  }

  function reset() {
    setAmount("");
    setPin("");
    setReceiverId("");
    setError("");
  }

  async function handleDeposit() {
    try {
      await deposit(accountId, parseFloat(amount));
      const amt = parseFloat(amount);
      setBalance(b => b + amt);
      setMessage(`Deposited ₹${amount} successfully`);
      reset();
      loadHistory();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleWithdraw() {
    try {
      await withdraw(accountId, parseFloat(amount), pin);
      const amt = parseFloat(amount);
      setBalance(b => b - amt);
      setMessage(`Withdrew ₹${amount} successfully`);
      reset();
      loadHistory();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleTransfer() {
    const amt = parseFloat(amount);
    if (amt > 10000) {
      const ok = window.confirm(`You are transferring ₹${amt}. This is a large amount. Do you want to proceed?`);
      if (!ok) return;
    }
    try {
      await transfer(accountId, parseInt(receiverId), amt, pin, amt > 10000);
      setBalance(b => b - amt);
      setMessage(`Transferred ₹${amount} successfully`);
      reset();
      loadHistory();
    } catch (err: any) {
      setError(err.message);
    }
  }

  const totalDeposited = history.filter(t => t.type === "DEPOSIT").reduce((s, t) => s + t.amount, 0);
  const totalWithdrawn = history.filter(t => t.type === "WITHDRAW").reduce((s, t) => s + t.amount, 0);
  const totalTransferred = history.filter(t => t.type === "TRANSFER").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="db-page">
      <div className="db-topbar">
        <div className="db-brand">Micro Bank</div>
        <button className="logout-btn" onClick={onLogout}>Log out</button>
      </div>

      <div className="db-hero">
        <div>
          <p className="db-hero-label">Account #{accountId}</p>
          <h1 className="db-hero-balance">₹{balance.toFixed(2)}</h1>
          <p className="db-hero-label">Current Balance</p>
        </div>
      </div>

      <div className="db-stats">
        <div className="stat-card stat-green">
          <p className="stat-label">Total Deposited</p>
          <p className="stat-value">₹{totalDeposited.toFixed(2)}</p>
        </div>
        <div className="stat-card stat-red">
          <p className="stat-label">Total Withdrawn</p>
          <p className="stat-value">₹{totalWithdrawn.toFixed(2)}</p>
        </div>
        <div className="stat-card stat-blue">
          <p className="stat-label">Total Transferred</p>
          <p className="stat-value">₹{totalTransferred.toFixed(2)}</p>
        </div>
        <div className="stat-card stat-purple">
          <p className="stat-label">Transactions</p>
          <p className="stat-value">{history.length}</p>
        </div>
      </div>

      <div className="db-main">
        <div className="db-left">
          <div className="panel">
            <h3 className="panel-title">Quick Actions</h3>

            <div className="action-tabs">
              {(["deposit", "withdraw", "transfer"] as const).map(a => (
                <button
                  key={a}
                  className={activeAction === a ? "action-tab active" : "action-tab"}
                  onClick={() => { setActiveAction(a); reset(); setMessage(""); }}
                >
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </button>
              ))}
            </div>

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            <div className="action-form">
              <label>Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={e => { setAmount(e.target.value); setMessage(""); setError(""); }}
              />

              {(activeAction === "withdraw" || activeAction === "transfer") && (
                <>
                  <label>PIN</label>
                  <input
                    type="password"
                    placeholder="Enter your PIN"
                    maxLength={4}
                    value={pin}
                    onChange={e => { setPin(e.target.value); setMessage(""); setError(""); }}
                  />
                </>
              )}

              {activeAction === "transfer" && (
                <>
                  <label>Receiver Account ID</label>
                  <input
                    type="number"
                    placeholder="Enter receiver account ID"
                    value={receiverId}
                    onChange={e => { setReceiverId(e.target.value); setMessage(""); setError(""); }}
                  />
                </>
              )}

              <button
                className="submit-btn"
                onClick={activeAction === "deposit" ? handleDeposit : activeAction === "withdraw" ? handleWithdraw : handleTransfer}
                disabled={
                  !amount ||
                  (activeAction !== "deposit" && !pin) ||
                  (activeAction === "transfer" && !receiverId)
                }
              >
                {activeAction.charAt(0).toUpperCase() + activeAction.slice(1)}
              </button>
            </div>
          </div>
        </div>

        <div className="db-right">
          <div className="panel">
            <h3 className="panel-title">Recent Transactions</h3>
            {history.length === 0 ? (
              <p className="empty">No transactions yet</p>
            ) : (
              <div className="txn-list">
                {history.slice(0, 8).map(t => (
                  <div key={t.transactionId} className="txn-row">
                    <div className={`txn-icon ${t.type.toLowerCase()}`}>
                      {t.type === "DEPOSIT" ? "↓" : t.type === "WITHDRAW" ? "↑" : "⇄"}
                    </div>
                    <div className="txn-info">
                      <span className="txn-type-text">{t.type}</span>
                      <span className="txn-date">{new Date(t.createdAt).toLocaleString()}</span>
                    </div>
                    <span className={`txn-amount ${t.type.toLowerCase()}`}>
                      {t.type === "DEPOSIT" ? "+" : "-"}₹{t.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
