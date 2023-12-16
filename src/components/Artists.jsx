import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button,Card,Row,Col,Container,InputGroup,FormControl} from 'react-bootstrap';


function Display() {
    const[searchTerm,setsearchTerm]=useState('');
    const [token, setToken] = useState('');
    const [artists, setArtists] = useState([]);

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
      const { data } = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=artist`, parameters);
      setArtists(data.artists.items)
      console.log(data.artists.items);
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
          placeholder="Search Artists"
          type="input"
          onChange={event=>setsearchTerm(event.target.value)}
          onKeyDown={handleKeyPress}
    />
    
        <Button onClick={()=>{querySearch()}}variant="primary">Search</Button>
         </InputGroup>
         </Container>
         


         <Container>
         <Row  lg={4} className="g-4">
         {artists.map((artist, index) => (
                      <Col key={index} md={6} lg={3}>
                        <Card key={index}  style={{ width: '18rem' }} className="h-100 w-100">
                        <Card.Img variant="top" src={artist.images[0]?.url} alt={`${artist.name}`} />
                        <Card.Body>
                            <Card.Title>{artist.name}</Card.Title>
                            <Card.Text>
                                <strong>Genres:</strong> {artist.genres.join(', ')}
                                <br/>
                                <strong>Followers:</strong> {artist.followers.total.toLocaleString()}
                                <br/>
                                <strong>Popularity:</strong> {artist.popularity}
                            </Card.Text>
                            <Button variant="primary" href={artist.external_urls.spotify} target="_blank">View on Spotify</Button>
                        </Card.Body>
                    </Card>
                    </Col>
                    ))}

        </Row>
        </Container>
       </div>
      );

};

export default Display;
