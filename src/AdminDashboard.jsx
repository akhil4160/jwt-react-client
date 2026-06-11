import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function AdminDashboard() {

    const [users, setUsers] = useState([])
    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState("name")
    const [ascending, setAscending] = useState(true)
    const navigate = useNavigate()
    const logout = () => {

        localStorage.removeItem("token")
        localStorage.removeItem("role")

        window.location.href = "/"
    }

    useEffect(() => {

        const token = localStorage.getItem("token")

        fetch("http://localhost:8080/api/admin/users", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {

                console.log(data)

                setUsers(data)

            })

    }, [])

    const deleteUser = (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this user?"
        )

        if (!confirmed) {
            return
        }

        const token = localStorage.getItem("token")

        fetch(`http://localhost:8080/api/admin/users/${id}`, {

            method: "DELETE",

            headers: {

                Authorization: `Bearer ${token}`

            }
        })
            .then(() => {
                setUsers(users.filter(user => user.id !== id))
            })
    }

    const changeRole = (id, currentRole) => {
        const token = localStorage.getItem("token")

        const newRole =

            currentRole === "ADMIN"

                ? "USER"

                : "ADMIN"

        fetch(`http://localhost:8080/api/admin/users/${id}/role`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({

                role: newRole

            })

        })
            .then(response => {

                console.log("STATUS =", response.status)

                return response.text()

            })
            .then(message => {

                console.log("DATA =", message)

                alert(message)

                if (message === "Role Updated") {

                    setUsers(
                        users.map(user =>
                            user.id === id
                                ? { ...user, role: newRole }
                                : user
                        )
                    )

                }

            })
    }

    const resetPassword = (id) => {

        const token = localStorage.getItem("token")

        const newPassword = prompt("Enter new password")

        if (!newPassword) return

        fetch(`http://localhost:8080/api/admin/users/${id}/password`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({

                password: newPassword
            })
        })
            .then(response => response.text())
            .then(data => {

                alert(data)
            })
    }

    const editUser = (id, currentName) => {

        const newName = prompt(
            "Enter new name",
            currentName
        )

        if (!newName) {
            return
        }

        const token = localStorage.getItem("token")

        fetch(`http://localhost:8080/api/admin/users/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
                name: newName
            })

        })
            .then(response => response.text())
            .then(data => {

                alert(data)

                window.location.reload()

            })

    }

    return (
        <div className="admin-container">
            <div className="admin-header">

                <h1>User Management Portal</h1>

                <div className="admin-header button">
                    <button onClick={logout}>
                        Logout
                    </button>
                </div>

            </div>

            <input
                className="search-input"
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <br />
            <br />

            <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
            >

                <option value="name">
                    Name
                </option>

                <option value="role">
                    Role
                </option>

            </select>

            <button
                className="sort-button"
                onClick={() => setAscending(!ascending)}
            >
                {ascending ? "Ascending" : "Descending"}
            </button>

            <br />
            <br />

            <div className="stats-container">

                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p>{users.length}</p>
                </div>

                <div className="stat-card">
                    <h3>Admins</h3>
                    <p>
                        {users.filter(user => user.role === "ADMIN").length}
                    </p>
                </div>

                <div className="stat-card">
                    <h3>Users</h3>
                    <p>
                        {users.filter(user => user.role === "USER").length}
                    </p>
                </div>

            </div>

            <div className="table-wrapper">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {users
                            .filter(user =>

                                user.name
                                    .toLowerCase()

                                    .includes(search.toLowerCase())

                                ||

                                user.email

                                    .toLowerCase()

                                    .includes(search.toLowerCase())

                            )
                            .sort((a, b) => {

                                if (sortBy === "name") {

                                    const result =
                                        a.name.localeCompare(b.name)

                                    return ascending
                                        ? result
                                        : -result
                                }

                                const result =

                                    a.role === b.role
                                        ? 0
                                        : a.role === "ADMIN"
                                            ? -1
                                            : 1

                                return ascending
                                    ? result
                                    : -result

                            })
                            .map(user => (

                                <tr key={user.id}>

                                    <td>{user.id}</td>

                                    <td>{user.name}</td>

                                    <td>{user.email}</td>

                                    <td>
                                        <span
                                            className={
                                                user.role === "ADMIN"
                                                    ? "role-admin"
                                                    : "role-user"
                                            }
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>

                                        <div className="action-buttons">

                                            <button
                                                className="sort-button"
                                                onClick={() => editUser(user.id, user.name)}
                                            >
                                                Edit Name
                                            </button>

                                            <button
                                                className="sort-button"
                                                onClick={() => changeRole(user.id, user.role)}
                                            >
                                                Change Role
                                            </button>

                                            <button
                                                className="sort-button"
                                                onClick={() => resetPassword(user.id)}>
                                                Reset Password
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() => deleteUser(user.id)}
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                    </tbody>

                </table>
            </div>
        </div>
    )
}

export default AdminDashboard