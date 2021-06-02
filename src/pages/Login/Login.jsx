import React from 'react';
import FormLogin from '../../components/FormLogin';
import Banner from '../../components/Banner';

function Login() {

    return (
        <div className="row">
            <FormLogin />
            <Banner />
        </div>
    );
}

export default Login;