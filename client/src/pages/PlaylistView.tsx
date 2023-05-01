import React, {useState, useEffect} from 'react'
import { User } from '../types'
import httpClient from '../httpClient'
import {
    MDBNavbar,
    MDBNavbarToggler,
    MDBBtn,
    MDBIcon,
    MDBNavbarNav,
    MDBCard,
    MDBRow,
    MDBRadio,
    MDBCardBody,
    MDBCol,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBInput,
    MDBContainer
    
  } from 'mdb-react-ui-kit';
const PlaylistView: React.FC = () =>{

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
           console.log(user?.playlistInfo)
            }catch(error){
                console.log("Not authenticated");
            }
        })();
    }, []);
    return( 
        <div>
        {user !== null? ( //If user is logged in
        <div >
        <header style={{ paddingLeft: 0 }}>
        <MDBNavbar expand='lg' light  bgColor='white'>
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
        </header>
        
        <h1>Test</h1>
        <h2>Email: {user.email}</h2>
        <h2>ID: {user.id}</h2>
        <h2>playlistInfo: {user.playlistInfo}</h2>

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
export default PlaylistView;