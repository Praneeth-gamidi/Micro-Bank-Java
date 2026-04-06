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
  const [tab, setTab] = useState<"actions" | "history">("actions");

  useEffect(() => {
    if (tab === "history") loadHistory();
  }, [tab]);

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
      setBalance(b => b + parseFloat(amount));
      setMessage(`Deposited ₹${amount} successfully`);
      reset();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleWithdraw() {
    try {
      await withdraw(accountId, parseFloat(amount), pin);
      setBalance(b => b - parseFloat(amount));
      setMessage(`Withdrew ₹${amount} successfully`);
      reset();
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
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="label">Account #{accountId}</p>
          <h2 className="balance">₹{balance.toFixed(2)}</h2>
          <p className="label">Current Balance</p>
        </div>
        <button className="logout-btn" onClick={onLogout}>Log out</button>
      </div>

      <div className="tabs">
        <button className={tab === "actions" ? "active" : ""} onClick={() => setTab("actions")}>Actions</button>
        <button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>History</button>
      </div>

      {tab === "actions" && (
        <div className="actions">
          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}

          <div className="input-row">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={e => { setAmount(e.target.value); setMessage(""); setError(""); }}
            />
            <input
              type="password"
              placeholder="PIN"
              value={pin}
              onChange={e => { setPin(e.target.value); setMessage(""); setError(""); }}
            />
          </div>

          <div className="action-buttons">
            <button onClick={handleDeposit} disabled={!amount}>Deposit</button>
            <button onClick={handleWithdraw} disabled={!amount || !pin}>Withdraw</button>
          </div>

          <div className="transfer-section">
            <p className="section-label">Transfer to another account</p>
            <input
              type="number"
              placeholder="Receiver Account ID"
              value={receiverId}
              onChange={e => { setReceiverId(e.target.value); setMessage(""); setError(""); }}
            />
            <button onClick={handleTransfer} disabled={!amount || !pin || !receiverId}>Transfer</button>
          </div>
        </div>
      )}

      {tab === "history" && (
        <div className="history">
          {history.length === 0 ? (
            <p className="empty">No transactions yet</p>
          ) : (
            history.map(t => (
              <div key={t.transactionId} className="txn-row">
                <div>
                  <span className={`txn-type ${t.type.toLowerCase()}`}>{t.type}</span>
                  <span className="txn-date">{new Date(t.createdAt).toLocaleString()}</span>
                </div>
                <span className="txn-amount">₹{t.amount.toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
