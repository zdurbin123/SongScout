import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Card, ListGroup } from 'react-bootstrap';

function Home() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="container mt-4">
      <Card  className='shadow-lg p-3 mb-5 bg-white rounded'>
        <Card.Body>
          <Card.Title style={{ fontWeight: 'bold' ,color: '#0D98BA', fontSize: '27px'}}>
            {currentUser && currentUser.displayName
              ? `Hello ${currentUser.displayName}, welcome to SongScout!`
              : 'Hello! Welcome to SongScout.'}
          </Card.Title>
          <br/><br/>
          <Card.Text style={{ fontWeight: 'bold' ,color: '#0D98BA'}}>
            Welcome to SongScout, your premier destination for exploring and discovering new music. Here's what you can do on our platform:
          </Card.Text>
          <br/>
          <ListGroup variant="flush">
            <ListGroup.Item>Trending section:</ListGroup.Item>
            <ListGroup.Item>Recommendations Section:</ListGroup.Item>
            <ListGroup.Item>Song Section:</ListGroup.Item>
            <ListGroup.Item>Tracks/Artists Section:</ListGroup.Item>
            <ListGroup.Item>Account Section:</ListGroup.Item>
            <ListGroup.Item>MySongs Section:</ListGroup.Item>
          </ListGroup> 
          <Card.Text style={{ fontWeight: 'bold' ,color: '#0D98BA'}} >
            Our SongScout team is excited to have you on this musical journey with us. Start exploring now and find your next favorite song with SongScout!
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Home;
