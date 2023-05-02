import React, {useState} from 'react';
import './loginStyle.css';
import httpClient from "../httpClient";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBIcon
}
from 'mdb-react-ui-kit';

const RegistrationPage: React.FC = () => {
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

  return (
    <MDBContainer style={{height:'100vh'}} fluid className='p-4 background-radial-gradient overflow-hidden'>

      <MDBRow style={{marginTop:'10%'}}>

        <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>

          <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{color: 'hsl(218, 81%, 95%)'}}>
            An Ai Music Service <br />
            <span style={{color: 'hsl(218, 81%, 75%)'}}>designed for you</span>
          </h1>

          <p className='px-3' style={{color: 'hsl(218, 81%, 85%)'}}>
          Create your own unique playlist and discover new music with our web application.
        Login with Spotify, answer a few questions about your musical preferences, and enjoy a custom playlist tailored just for you.
          </p>

        </MDBCol>

        <MDBCol md='6' className='position-relative'>

          <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
          <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

          <MDBCard className='my-5 bg-glass'>
            <MDBCardBody className='p-5'>
            <div className="text-center">
            <h2 style={{alignItems: 'center'}} className="fw-bold mb-2">Registration</h2>
            <br></br>
</div>
            <MDBInput labelStyle={{fontSize: '1.1em', paddingBlock: '0.2em'}} wrapperClass='mb-4' 
            value={firstName} onChange={(e) => setFirstName(e.target.value)} label='First name*' id='form1' type='text'/>
             

               
              <MDBInput labelStyle={{fontSize: '1.1em', paddingBlock: '0.2em'}} wrapperClass='mb-4' value={lastName}
            onChange={(e) => setLastName(e.target.value)} label='Last name*' id='form2' type='text'/>


              <MDBInput labelStyle={{fontSize: '1.1em', paddingBlock: '0.2em'}} value={email} onChange={(e) => setEmail(e.target.value)} wrapperClass='mb-4' label='Email*' id='form3' type='email'/>
              
              <MDBInput value={password}onChange={(e) => setPassword(e.target.value)} labelStyle={{fontSize: '1.1em', paddingBlock: '0.2em'}} wrapperClass='mb-4' label='Password*' id='form4' type='password'/>

      

              <MDBBtn  onClick={() => registerUser()} className='w-100 mb-4' size='lg'>sign up</MDBBtn>

              <div className="text-center">

<p>Already have an account? <a href= "/"style={{fontWeight: "bold"}}>Sign in</a></p>
</div>

            </MDBCardBody>
          </MDBCard>

        </MDBCol>

      </MDBRow>

    </MDBContainer>
  );
}

export default RegistrationPage;