import { useState } from "react";
import { login } from "../api";

interface Props {
  onLogin: (accountId: number, balance: number, token: string) => void;
  goToRegister: () => void;
}

export default function Login({ onLogin, goToRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const data = await login(email, password);
      onLogin(data.accountId, data.balance, data.token);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-box">
      <h2>Welcome back</h2>
      <p className="subtitle">Log in to your Micro Bank account</p>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <button type="submit">Log in</button>
      </form>
      <p className="switch">Don't have an account? <span onClick={goToRegister}>Register</span></p>
    </div>
  );
}
