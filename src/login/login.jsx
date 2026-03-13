import React from 'react';

import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from '../authState';

export function Login({ userName, authState, onAuthChange }) {
  
  async function handleLogin(email, password) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        onAuthChange(data.email, AuthState.Authenticated);
      } else {
        const err = await res.json();
        alert(`Login failed: ${err.msg}`);
        onAuthChange(email, AuthState.Unauthenticated);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRegister(email, password) {
    try {
      const res = await fetch("/api/auth/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        onAuthChange(data.email, AuthState.Authenticated);
      } else {
        const err = await res.json();
        alert(`Registration failed: ${err.msg}`);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "DELETE" });
      onAuthChange(userName, AuthState.Unauthenticated);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className='container-fluid bg-secondary text-center'>
      <div>
        {authState !== AuthState.Unknown && <h1>Welcome to RippleConnections</h1>}
        {authState !== AuthState.Unknown && <p>Please login to continue</p>}
        {authState === AuthState.Authenticated && (
          <Authenticated userName={userName} onLogout={handleLogout} />
        )}
        {authState === AuthState.Unauthenticated && (
          <Unauthenticated
            userName={userName}
            onLogin={handleLogin}
            onRegister={handleRegister}
          />
        )}
      </div>
    </main>
  );
}