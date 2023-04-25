
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

    <div className="login-body" style={{height:'100vh'}}>
    <MDBContainer fluid>

      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='12'>

          <MDBCard className='bg-dark text-white my-5 mx-auto' style={{borderRadius: '1rem', maxWidth: '400px'}}>
            <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>

              <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
              <p className="text-white-50 mb-5">Please enter your login and password</p>

              <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Email address' 
              labelStyle={{fontSize: '1.1em', paddingBlock: '0.5em'}} style={{color: 'white'}}  id='formControlLg'
               value={email} onChange={(e) => setEmail(e.target.value)} type='email' size="lg"/>


              <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' style={{color: 'white'}} label='Password' labelStyle={{fontSize: '1.1em', paddingBlock: '0.5em'}} id='formControlLg' value={password} onChange={(e) => setPassword(e.target.value)} type='password' size="lg"/>

         {/*    <p className="small mb-3 pb-lg-2"><a className="text-white-50" href="#!">Forgot password?</a></p>*/}
              <MDBBtn itemType = "submit" type="submit" outline className='mx-2 px-5' color='light' size='lg' onClick={() => logInUser()}>
                Login
              </MDBBtn>



              <div>
                <br></br>
                <p className="mb-0">Don't have an account? <a href="/register" className="text-white-50 fw-bold">Sign Up</a></p>

              </div>
            </MDBCardBody>
          </MDBCard>

        </MDBCol>
      </MDBRow>

    </MDBContainer>
    </div>
  );
};


export default HomePage;