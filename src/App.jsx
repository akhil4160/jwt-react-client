import { useState } from "react";
import Register from "./Register"
import Dashboard from "./Dashboard"
import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom"
import AdminDashboard from "./AdminDashboard"
import ProtectedRoute from "./ProtectedRoute"
import AdminRoute from "./AdminRoute"

function App() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  return (
    <Routes>

      <Route
        path="/"
        element={
          <div className="auth-container">
            <h1>User Management Portal</h1>

            <div className="auth-card">
              <input
                type="text"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button onClick={() => {

                fetch('https://jwtauthapi-4rsw.onrender.com/api/auth/login', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    email: email,
                    password: password
                  })
                })
                  .then((response) => response.json())
                  .then((data) => {

                    if (
                      data.message &&
                      data.message.startsWith("eyJ")
                    ) {

                      console.log(data)
                      localStorage.setItem("token", data.message)
                      localStorage.setItem("role", data.role)

                      if (data.role === "ADMIN") {
                        navigate("/admin")
                      } else {
                        navigate("/dashboard")
                      }

                    } else {

                      alert(data.message)

                    }

                  })

              }}>
                Login
              </button>

              <Link to="/register">
                Go To Register
              </Link>

            </div>

          </div>
        }
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  )
}

export default App