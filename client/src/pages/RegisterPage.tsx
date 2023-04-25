import React, {useState} from 'react'
import httpClient from "../httpClient";
import '../index.css';


const RegisterPage: React.FC = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const registerUser = async ()=>{
        console.log(email,firstName,lastName, password)

        try{
        const resp = await httpClient.post("//localhost:4500/register",{
            email,
            firstName,
            lastName,
            password,
        });

        window.location.href = "/spotify-authorization";
    }
        catch(error: any){
            if (error.response.status === 401){ //IF LOGIN DOESNT WORK
                alert("Invalid credentials");
            }
    };
    }
    return (<div>
        <h1>Create Your Account</h1>
        <form>
        <div>
            <label>First Name: </label>
            <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            id=""
            />
            </div>

            <div>
            <label>Last Name: </label>
            <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            id=""
            />
            </div>
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
            <button type="button" onClick={() => registerUser()}>Register</button>
        </form>
    </div>
    );
};

export default RegisterPage;