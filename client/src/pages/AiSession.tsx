import React, {useState, useEffect} from 'react'
import { User } from '../types'
import httpClient from '../httpClient'


const AiSession: React.FC = () => {

    const[user, setUser] = useState<User | null>(null)
    useEffect(() => {
        (async () => {
            try{
           const resp = await httpClient.get("//localhost:4500/@me");

           setUser(resp.data);
            }catch(error){
                console.log("Not authenticated");
            }
        })();
    }, []);
    return( <div>
        <h1>AiSession Page</h1>
        <br />
      {user != null? ( //If user is logged in
      <div>
      <h1>Logged in</h1>
      <h2>Email: {user.email}</h2>
      <h2>ID: {user.id}</h2>
      <h2>SpotifyId: {user.spotify_token}</h2>
      </div>
      ) : (
        <div>
            <p>You are not logged in</p>
            <div>
            <a href = "/login"><button>Login</button></a>
             <a href = "/register"><button>Register</button></a>
            </div>
            </div>
      )}
    </div>
    );
};
export default AiSession;