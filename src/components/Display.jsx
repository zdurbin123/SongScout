import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button,Card,Row,Container,InputGroup,FormControl} from 'react-bootstrap';


function Display() {
    const[searchTerm,setsearchTerm]=useState('');
    const [token, setToken] = useState('');
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
    async function to() {
        const {data} = await axios.get('http://localhost:3000')
        console.log(data)
        setToken(data.access_token); 
    }

    to();
  }, []);

  async function querySearch(){
    console.log("hi")
    const parameters = {
        headers:{
          'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    try {
      const { data } = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track`, parameters);
      setTracks(data.tracks.items)
      console.log(data.tracks.items);
  } catch (error) {
      console.error('Error from Spotify:', error);
  }
  }

    return (
    <div>
        <Container>
            <InputGroup size="lg" className="mb-3">  
        
        <FormControl
          aria-label="Large"
          aria-describedby="inputGroup-sizing-sm"
          placeholder="Search Artists"
          type="input"
          onChange={event=>setsearchTerm(event.target.value)}
    />
    
        <Button onClick={()=>{querySearch()}}variant="primary">Search</Button>
         </InputGroup>
         </Container>
         <Container>
         <Row  lg={3} className="g-4">
         {tracks.map((track, index) => (
                        <Card key={index} style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={track.album.images[0]?.url} />
                            <Card.Body>
                                <Card.Title>{track.name}</Card.Title>
                                <Card.Text>
                                    Artist: {track.artists.map(artist => artist.name).join(', ')}
                                </Card.Text>
                                <Button variant="primary" href={track.external_urls.spotify} target="_blank">Listen on Spotify</Button>
                            </Card.Body>
                        </Card>
                    ))}

        </Row>
        </Container>
       </div>
      );

};

export default Display;
