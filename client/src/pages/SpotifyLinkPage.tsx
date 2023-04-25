import React, {useState, useEffect} from 'react'
import { User } from '../types'
import httpClient from '../httpClient'
import {
    MDBNavbar,
    MDBNavbarToggler,
    MDBBtn,
    MDBIcon,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBContainer
  } from 'mdb-react-ui-kit';

const SpotifyLink: React.FC = () =>{

    const[user, setUser] = useState<User | null>(null)
    const logoutUser = async() =>{
        const resp = await httpClient.post("//localhost:4500/logout");
        window.location.href="/"
    }

    useEffect(() => {
        (async () => {
            try{
           const resp = await httpClient.get("//localhost:4500/@me");

           setUser(resp.data);

           //NEED TO ADD CONDITION TO CHECK IF USER NOT LOGGED IN-> GO TO LOGIN PAGE
           //window.location.href ="/ai-session";
            }catch(error){
                console.log("Not authenticated");
            }
            if(user!= null && user.spotify_token!=""){
                window.location.href = "/ai-session";
            }
        })();
    }, []);
    
    return(
        <header style={{ paddingLeft: 0 }}>
        <MDBNavbar expand='lg' light bgColor='white'>
          <MDBContainer fluid >
            <MDBNavbarToggler
              aria-controls='navbarExample01'
              aria-expanded='false'
              aria-label='Toggle navigation'
            >
              <MDBIcon fas icon='bars' />
            </MDBNavbarToggler>
            <div className='collapse navbar-collapse' id='navbarExample01'>
              <MDBNavbarNav right className='mb-2 mb-lg-0'>
                <MDBNavbarItem active>
                  <MDBNavbarLink aria-current='page' href='/ai-session'>
                    Home
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink onClick = {logoutUser} href="/"> Logout</MDBNavbarLink>
                </MDBNavbarItem>
               
              </MDBNavbarNav>
            </div>
          </MDBContainer >
        </MDBNavbar>
  
        <div className='p-5 text-center bg-light' style={{height:'100vh', marginTop:"5%"}}>
            <img object-fit="cover"style={{width: "10vh", height:"10vh"}}  src={require('./images/account.png')}></img>
            <br></br><br></br><br></br>
          <h1 className='mb-3'>Please link your Spotify account to continue</h1>
          <br></br>
          <MDBBtn href="http://localhost:4500/spotifyLogin" color="success" className='w-100 mb-4' size='lg'>Connect to Spotify</MDBBtn>

          
        </div>
      </header>

        // <div>
        //     <h1>Before you get started, we need you to link your Spotify Account</h1>
        //     <br />
        //   <div>
        //   <h1>Link your account</h1>
        //  <a href = "http://localhost:4500/spotifyLogin"><button>Link Account</button></a> 
        //   </div>
        //   </div>
        
    );
};

export default SpotifyLink