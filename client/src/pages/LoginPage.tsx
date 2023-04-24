import React, {useState} from 'react'
import httpClient from "../httpClient";


const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const logInUser = async ()=>{
        console.log(email, password)

        try{
        const resp = await httpClient.post("//localhost:4500/login",{
            email,
            password,
        });

        window.location.href = "/";
    }
        catch(error: any){
            if (error.response.status === 401){ //IF LOGIN DOESNT WORK
                alert("Invalid credentials");
            }
    };
    }
    return (<div>
        <h1>Log Into Your Account</h1>
        <form>
            <div>
            <label>Email: </label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id=""
            />
            </div>

            <div>
            <label>Password: </label>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id=""
            />
            </div>
            <button type="button" onClick={() => logInUser()}>Login</button>
        </form>
    </div>
    );
};

export default LoginPage;