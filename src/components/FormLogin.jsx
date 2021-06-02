import React, { useState } from 'react';
import call_api from '../services/request';

function FormLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function login() {
        const res = await call_api({
            method: 'POST',
            url: '/login',
            data: {
                username,
                password
            }
        });

        const { data } = res;

        if (data.code === 200) {
            localStorage.setItem('token', data.data?.token);
            localStorage.setItem('user', data.data?.username);
            window.location = '/';
        } else {
            setError(data.data)
        }
    }

    return (
        <div className="col-md-6 bg-main">
            <div className="container d-flex justify-content-center align-items-center full-height">
                <form className="shadow border rounded col-md-7 bg-white p-4 mb-3 mt-3">
                    <h2>Sign in</h2>
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" class="form-control" value={username} onChange={(e) => setUsername(e.target.value)} name="username" placeholder="Enter username" />
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" value={password} onChange={(e) => setPassword(e.target.value)} name="password" placeholder="Enter Password" />
                    </div>
                    {error && <span className="d-block mb-3 badge badge-danger">{error}</span>}
                    <button type="button" onClick={login} class="btn btn-custom">Login</button>
                </form>
            </div>
        </div>
    );
}

export default FormLogin;