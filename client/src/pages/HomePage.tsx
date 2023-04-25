
import React, {useState, useEffect} from 'react';
import httpClient from "../httpClient";
import { User } from '../types'
import './loginStyle.css';
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



const HomePage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const[user, setUser] = useState<User | null>(null)


    const logInUser = async ()=>{
        try{
        const resp = await httpClient.post("//localhost:4500/login",{
            email,
            password,
        });

        window.location.href = "/ai-session";
    }
        catch(error: any){
            if (error.response.status === 401){ //IF LOGIN DOESNT WORK
                alert("Invalid credentials");
            }
    };
    }
    
useEffect(() => {
        (async () => {
            try{
           const resp = await httpClient.get("//localhost:4500/@me");

           setUser(resp.data);
           window.location.href ="/ai-session";
            }catch(error){
                console.log("Not authenticated");
            }
            if(user!= null){
                window.location.href = "/ai-session";
            }
        })();
    }, []);
  return ( 
    <MDBContainer style={{height:'100vh'}} fluid className='p-4 background-radial-gradient overflow-hidden'>

    <MDBRow style={{marginTop:'10%'}}>

      <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>

        <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{color: 'hsl(218, 81%, 95%)'}}>
          An Ai Music Service <br />
          <span style={{color: 'hsl(218, 81%, 75%)'}}>designed for you</span>
        </h1>

        <p className='px-3' style={{color: 'hsl(218, 81%, 85%)'}}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Eveniet, itaque accusantium odio, soluta, corrupti aliquam
          quibusdam tempora at cupiditate quis eum maiores libero
          veritatis? Dicta facilis sint aliquid ipsum atque?
        </p>

      </MDBCol>

      <MDBCol md='6' className='position-relative'>

        <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
        <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

        <MDBCard className='my-5 bg-glass'>
          <MDBCardBody className='p-5'>
          <div className="text-center">
          <h2 style={{alignItems: 'center'}} className="fw-bold mb-2">Sign in</h2>
          <br></br>
</div>
            <MDBInput labelStyle={{fontSize: '1.1em', paddingBlock: '0.2em'}} wrapperClass='mb-4'  value={email} onChange={(e) => setEmail(e.target.value)} label='Email*' id='form3' type='email'/>
            <MDBInput labelStyle={{fontSize: '1.1em', paddingBlock: '0.2em'}} wrapperClass='mb-4'  value={password} onChange={(e) => setPassword(e.target.value)} label='Password*' id='form4' type='password'/>

    

            <MDBBtn  onClick={() => logInUser()} className='w-100 mb-4' size='lg'>Log in</MDBBtn>

            <div className="text-center">

<p>Don't have an account? <a href= "/register"style={{fontWeight: "bold"}}>Register</a></p>
</div>

          </MDBCardBody>
        </MDBCard>

      </MDBCol>

    </MDBRow>

  </MDBContainer>
);

};


export default HomePage;