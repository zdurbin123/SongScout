import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button,Card,Row,Col,Container,InputGroup,FormControl} from 'react-bootstrap';


function Songs() {
    const[searchTerm,setsearchTerm]=useState('');
    const [token, setToken] = useState('');
    const [songs, setSongs] = useState([]);
    let names = [];

    useEffect(() => {
    async function to() {
        const {data} = await axios.get('http://localhost:3000')
        console.log(data)
        setToken(data.access_token); 
    }

    to();
  }, []);

   function getNames(artists){
    let names = [];
    artists.map((artist) => {                         
        names.push(artist.name);
    });
    return names.join(', ');
  }
  

  async function querySearch(){
    const parameters = {
        headers:{
          'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    try {
      const { data } = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track`, parameters);
      console.log(data);

      setSongs(data.tracks.items)
      console.log(data.tracks.items);
      
  } catch (error) {
      console.error('Error from Spotify:', error);
  }
  }
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      querySearch();
    }
  };
    return (
    <div>
        <Container>
            <InputGroup size="lg" className="mb-3">  
        
        <FormControl
          aria-label="Large"
          aria-describedby="inputGroup-sizing-sm"
          placeholder="Search Songs"
          type="input"
          onChange={event=>setsearchTerm(event.target.value)}
          onKeyDown={handleKeyPress}
    />
    
        <Button onClick={()=>{querySearch()}}variant="primary">Search</Button>
         </InputGroup>
         </Container>
         


         <Container>
        
         <Row  lg={4} className="g-4">
         {songs.map((song, index) => (
                      <Col key={index} md={6} lg={3}>
                        <Card key={index}  style={{ width: '18rem' }} className="h-100 w-100">
                        <Card.Img variant="top" src={song.album.images[0]?.url} alt={`${song.name}`} />
                        <Card.Body>
                            <Card.Title>{song.name}</Card.Title>
                            <Card.Text>
                                <strong>Artists:</strong> {getNames(song.artists)}
                                <br/>
                                <strong>Duration:</strong> {song.duration_ms}
                                <br/>
                                <strong>Popularity:</strong> {song.popularity}
                                <br/>
                                <strong>Id:</strong> {song.id}
                            </Card.Text>
                            <Button variant="primary" href={song.external_urls.spotify} target="_blank">View on Spotify</Button>
                        </Card.Body>
                    </Card>
                    </Col>
                    ))}

        </Row>
         
        </Container>
       </div>
      );

};

export default Songs;