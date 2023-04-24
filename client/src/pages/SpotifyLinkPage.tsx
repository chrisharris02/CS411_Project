import React, {useState, useEffect} from 'react'
import { User } from '../types'
import httpClient from '../httpClient'

const SpotifyLink: React.FC = () =>{

    const[user, setUser] = useState<User | null>(null)


    const goToSpotify = async() =>{
        const resp = await httpClient.post("//localhost:4500/spotifyLogin");
        window.location.href="http://localhost:3000/spotifyLogin"
    }
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
    return(
        <div>
            <h1>Before you get started, we need you to link your Spotify Account</h1>
            <br />
          {user != null && user.spotify_token==""? ( //If user is logged in
          <div>
          <h1>Link your account</h1>
          <button onClick = {goToSpotify}>Link Account</button>
          </div>
          ) : (
            <div>
                <p>You are already authenticated</p>
                <div>
                <a href = "/login"><button>Login</button></a>
                 <a href = "/register"><button>Register</button></a>
                </div>
                </div>
          )}
        </div>
    );
};

export default SpotifyLink