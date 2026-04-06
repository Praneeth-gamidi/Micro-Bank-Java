const BASE = "http://localhost:9090/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function register(name: string, email: string, password: string, pin: string) {
  const res = await fetch(`${BASE}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, pin }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deposit(accountId: number, amount: number) {
  const res = await fetch(`${BASE}/account/deposit`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ accountId, amount }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.text();
}

export async function withdraw(accountId: number, amount: number, pin: string) {
  const res = await fetch(`${BASE}/account/withdraw`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ accountId, amount, pin }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.text();
}

export async function transfer(senderAccountId: number, receiverAccountId: number, amount: number, pin: string, confirmed: boolean) {
  const res = await fetch(`${BASE}/transaction/transfer`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ senderAccountId, receiverAccountId, amount, pin, confirmed }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.text();
}

export async function getHistory(accountId: number) {
  const res = await fetch(`${BASE}/transaction/history/${accountId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
