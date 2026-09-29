import { useState } from 'react'

const LoginForm = ({ login }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async event => {
        event.preventDefault()
        await login(username, password)

        setUsername('')
        setPassword('')
    }

    return (
        <>
        <h1>log in to application</h1>
        <form onSubmit={handleLogin}>
            <div>
                <label>
                    username
                    <input
                        type="text"
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    password
                    <input
                        type="password"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </label>
            </div>
            <button type="submit">login</button>
        </form>
        </>
    )
}

export default LoginForm