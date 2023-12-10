import LoginForm from "../components/forms/LoginForm.js"
import { useState,useEffect  } from 'react';

export default function Login(){
    return (
        <div className="user-login-form">
            <LoginForm />
        </div>
    );
}