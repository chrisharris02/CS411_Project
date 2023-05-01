import React, {useState, useEffect} from 'react'
import { User } from '../types'
import httpClient from '../httpClient'
import './loginStyle.css';



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

const AiSession: React.FC = () => {

    const[user, setUser] = useState<User | null>(null)

    const [numSongs, setNumSongs] = useState("");
    const [musicVibe, setMusicVibe] = useState("");
    const [musicGenre, setMusicGenre] = useState("");
    const [artistName, setArtistName] = useState("");
    const [musicDecade, setMusicDecade] = useState("");
    const [musicType, setMusicType] = useState("");
    const u_id = user?.id;
    const sendMusicPreferences = async ()=>{

      if (!numSongs || !musicVibe || !musicGenre || !artistName || !musicDecade || !musicType) {
        alert('Please fill out all fields');
        return;
      }
      
      if (!/^\d+$/.test(numSongs) && numSongs !== "") {
        alert("Enter a valid integer");
        return;
      } 
      const numSongint = parseInt(numSongs, 10); 
      if (numSongint >15 || numSongint <= 0) {
        alert("Number of Songs Must be between 1 and 15");
        return;
      }

        try{
            console.log(musicType);
        const resp = await httpClient.post("//localhost:4500/sendUserPreferences",{
            numSongs,
            musicVibe,
            musicGenre,
            artistName,
            musicDecade,
            musicType,
            u_id,
            
        });
        console.log(resp);
        window.location.href = "/playlist-view";
    }
        catch(error: any){
            if (error.response.status === 404){ //If sending user preferences doesn't work
                alert("Invalid credentials");
            }
    };
    }

    const logoutUser = async() =>{
        const resp = await httpClient.post("//localhost:4500/logout");
        window.location.href="/"
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
<MDBContainer fluid style={{height:'100vh'}} className='p-4 background-radial-gradient overflow-hidden'>



<MDBRow className='justify-content-center align-items-center m-5'>

<MDBCard>
  <MDBCardBody className='px-4'>

    <h3 className="fw-bold mb-4 pb-2 pb-md-0 mb-md-1">Fill in your music preferences</h3>
    <h6 className="fw mb-4 pb-2 pb-md-0 mb-md-4">Please complete all the fields to generate a personalized playlist*</h6>


        <MDBInput labelStyle={{fontSize: '1.1em', paddingBlock: '0.5em'}} wrapperClass='mb-4' label='How many songs would you like in your playlist?' size='lg' value={numSongs} 
        onChange={(e) => {
            setNumSongs(e.target.value);
          }} type='text'/>

        <MDBInput labelStyle={{fontSize: '1.1em', paddingBlock: '0.5em'}} wrapperClass='mb-4' label='How would you describe the general vibe of the music?' size='lg' value={musicVibe} onChange={(e) => setMusicVibe(e.target.value)} type='text'/>
    
        <MDBInput labelStyle={{fontSize: '1.1em', paddingBlock: '0.5em'}} wrapperClass='mb-4' label='What genre of music do you want the playlist to have?' size='lg' id='form3' value= {musicGenre} onChange={(e) => setMusicGenre(e.target.value)} type='text'/>

        <MDBInput labelStyle={{fontSize: '1.1em', paddingBlock: '0.5em'}} wrapperClass='mb-4' label='Name an artist an artist that you want included in the playlist:' size='lg' value= {artistName} onChange={(e) => setArtistName(e.target.value)} id='form4' type='text'/>

                  <div className='d-md-flex justify-content-start align-items-center mb-4'>
                    <h6 className="fw-bold mb-0 me-4">Music Decade: </h6>
                    <MDBRadio name='decadeSelector' id='inlineRadio1' value='2010s' label='2010s'onChange={(e) => setMusicDecade(e.target.value)} inline />
                    <MDBRadio name='decadeSelector' id='inlineRadio2' value='2000s' label='2000s' onChange={(e) => setMusicDecade(e.target.value)} inline />
                    <MDBRadio name='decadeSelector' id='inlineRadio3' value='1990s' label='1990s' onChange={(e) => setMusicDecade(e.target.value)} inline />
                    <MDBRadio name='decadeSelector' id='inlineRadio4' value='1980s' label='1980s' onChange={(e) => setMusicDecade(e.target.value)} inline />
                    <MDBRadio name='decadeSelector' id='inlineRadio5' value='1970s' label='1970s' onChange={(e) => setMusicDecade(e.target.value)} inline />
                    <MDBRadio name='decadeSelector' id='inlineRadio6' value='1960s' label='1960s' onChange={(e) => setMusicDecade(e.target.value)} inline />
                  </div>

                  <div className='d-md-flex justify-content-start align-items-center mb-4'>
                    <h6 className="fw-bold mb-0 me-4">Music Type: </h6>
                    <MDBRadio name='musicTypeSelector' id='inlineRadio7' value='Vocal' onChange={(e) => setMusicType(e.target.value)} label='Vocal' inline />
                    <MDBRadio name='musicTypeSelector' id='inlineRadio8' value='Instrumental' onChange={(e) => setMusicType(e.target.value)} label='Instrumental' inline />
                  </div>
             
    <MDBBtn onClick={() => sendMusicPreferences()}color="success" className='w-100 mb-4 ' size='lg'>Generate my playlist</MDBBtn>

  </MDBCardBody>
</MDBCard>

</MDBRow>
</MDBContainer>

      <div>
      <h1>Logged in</h1>
      <h2>Email: {user.email}</h2>
      <h2>ID: {user.id}</h2>
      <h2>SpotifyId: {user.spotify_token}</h2>
      <h2>SpotifyRefresh: {user.spotify_refresh}</h2>
      <button onClick = {logoutUser}>Logout</button>
      </div>
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