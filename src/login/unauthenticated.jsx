import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import { MessageDialog } from './messageDialog'

export function Unauthenticated(props) {
  const [userName, setUserName] = useState(props.userName || '')
  const [password, setPassword] = useState('')
  const [displayError, setDisplayError] = useState(null)

  async function loginUser() {
    loginOrCreate('/api/auth/login')
  }

  async function createUser() {
    loginOrCreate('/api/auth/create')
  }

  async function loginOrCreate(endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: 'post',
        body: JSON.stringify({ email: userName, password }),
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        credentials: 'include',
      })

      if (response.ok) {
        localStorage.setItem('userName', userName)
        props.onAuthChange(userName, true)
        return
      }

      const body = await response.json().catch(() => ({}))
      setDisplayError(`⚠ Error: ${body.msg ?? 'Unable to reach the backend service.'}`)
    } catch {
      setDisplayError('⚠ Error: Unable to reach the backend service.')
    }
  }

  return (
    <>
      <div>
        <div className="input-group mb-3">
          <span className="input-group-text">@</span>
          <input
            className="form-control"
            type="text"
            value={userName}
            onChange={e => setUserName(e.target.value)}
            placeholder="your@email.com"
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">🔒</span>
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="password"
          />
        </div>
        <Button variant="primary" onClick={loginUser} disabled={!userName || !password}>
          Login
        </Button>
        <Button variant="secondary" onClick={createUser} disabled={!userName || !password}>
          Create
        </Button>
      </div>

      <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
    </>
  )
}