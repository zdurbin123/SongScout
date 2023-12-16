import React from 'react';
import { useNavigate } from 'react-router-dom';
import {doSignOut} from '../firebase/FirebaseFunctions';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from 'react-bootstrap';

const SignOutButton = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await doSignOut();
    navigate('/');
  };
  return (
    <Button variant="danger" onClick={handleSignOut}>
       <i className="bi bi-x-lg"></i> 
      Sign Out
    </Button>
  );
};

export default SignOutButton;
