import { Link } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Register() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const [message, setMessage] = useState("")

    return (
        <div className="auth-container">

            <h1>User Management Portal</h1>

            <div className="auth-card">
                <input
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

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

                <h3>{message}</h3>

                <button onClick={() => {

                    fetch('http://localhost:8080/api/auth/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: name,
                            email: email,
                            password: password
                        })
                    })
                        .then((response) => response.json())
                        .then((data) => {

                            console.log(data)

                            setMessage(data.message)

                            setTimeout(() => {

                                navigate("/")

                            }, 2000)
                        })

                }}>
                    Register
                </button>

                <Link to="/">
                    Back To Login
                </Link>
            </div>

        </div>
    )
}

export default Register