import { useState } from "react";
import { register } from "../api";

interface Props {
  onRegister: (accountId: number, balance: number, token: string) => void;
  goToLogin: () => void;
}

export default function Register({ onRegister, goToLogin }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const data = await register(name, email, password, pin);
      onRegister(data.accountId, data.balance, data.token);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-box">
      <h2>Create an account</h2>
      <p className="subtitle">Start banking with Micro Bank</p>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <label>PIN</label>
        <input type="password" placeholder="4-digit PIN" maxLength={4} value={pin} onChange={e => setPin(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <button type="submit">Register</button>
      </form>
      <p className="switch">Already have an account? <span onClick={goToLogin}>Log in</span></p>
    </div>
  );
}
