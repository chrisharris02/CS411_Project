
import React from 'react';
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

function HomePage() {
  return (
    <div className="login-body" style={{height:'100vh'}}>
    <MDBContainer fluid>

      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='12'>

          <MDBCard className='bg-dark text-white my-5 mx-auto' style={{borderRadius: '1rem', maxWidth: '400px'}}>
            <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>

              <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
              <p className="text-white-50 mb-5">Please enter your login and password</p>

              <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Email address' labelStyle={{fontSize: '1.1em', paddingBlock: '0.5em'}} id='formControlLg' type='email' size="lg"/>
              <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Password' labelStyle={{fontSize: '1.1em', paddingBlock: '0.5em'}} id='formControlLg' type='password' size="lg"/>

         {/*    <p className="small mb-3 pb-lg-2"><a className="text-white-50" href="#!">Forgot password?</a></p>*/}
              <MDBBtn outline className='mx-2 px-5' color='light' size='lg'>
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
}

export default HomePage;