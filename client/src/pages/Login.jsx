import LoginForm from "../components/forms/LoginForm"
import { useState,useEffect  } from 'react';

export default function Login(){
    return (
        <div className="user-login-form">
            <LoginForm />
        </div>
    );
}