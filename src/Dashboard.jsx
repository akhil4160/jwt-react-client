import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


function Dashboard() {

    const token = localStorage.getItem("token")
    console.log("TOKEN =", token)
    const [user, setUser] = useState(null)
    const navigate = useNavigate()
    const logout = () => {

        localStorage.removeItem("token")
        localStorage.removeItem("role")

        window.location.href = "/"
    }

    useEffect(() => {

        fetch("http://localhost:8080/api/user/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {

                console.log(data)

                setUser(data)

            })

    }, [])

    if (!token) {
        return <Navigate to="/" />
    }

    return (
        <div className="dashboard-container">

            {user && (
                <div className="profile-card">

                    <h2>{user.name}</h2>

                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>

                    <p>
                        {user.role}
                    </p>

                </div>
            )}

            <div className="dashboard-actions">

                {user && user.role === "ADMIN" && (
                    <button onClick={() => navigate("/admin")}>
                        Manage Users
                    </button>
                )}

                <button onClick={logout}>
                    Logout
                </button>

            </div>

        </div>
    )
}

export default Dashboard