import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { TextField, Button } from '@mui/material'

const LoginForm = ({ login }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const handleLogin = async event => {
        event.preventDefault()
        await login(username, password)

        navigate('/')
        setUsername('')
        setPassword('')
    }

    return (
        <>
            <h1>log in to application</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <TextField
                        variant="standard"
                        label="username"
                        type="text"
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    <TextField
                        variant="standard"
                        label="password"
                        type="password"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>

                <Button style={{ marginTop: 10, marginBottom: 10 }} variant='contained' type="submit">login</Button>
            </form>
        </>
    )
}

export default LoginForm