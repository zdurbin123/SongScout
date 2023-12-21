import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button,Card,Row,Col,Container,InputGroup,FormControl,Alert } from 'react-bootstrap';
import noImage from '../img/download.jpeg';

function Artists() {
    const[searchTerm,setsearchTerm]=useState('');
    const [token, setToken] = useState('');
    const [artists, setArtists] = useState([]);
    const [error, setError] = useState('');
    const MAX_SEARCH_TERM_LENGTH = 40;

    useEffect(() => {
    async function to() {
      try{
        const {data} = await axios.get('http://localhost:3000')
        console.log(data)
        setToken(data.access_token); }
        catch (error) {
          console.error('Error fetching token:', error);
          setError('Failed to fetch authentication token.');
      }
    }
    

    to();
  }, []);
  

  async function querySearch(){
    if (!searchTerm) {
      setError('Please enter a search term.');
      return;
  }
  if (searchTerm.length > MAX_SEARCH_TERM_LENGTH) {
    setError(`Search term is too long. Please limit it to ${MAX_SEARCH_TERM_LENGTH} characters.`);
    return;
}
  setError(''); // it is used for clearing existing errors
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
      if (data.artists.items.length === 0) {
        setError('No artists found.');
    }
  } catch (error) {
      console.error('Error from Spotify:', error);
      setError('Failed to fetch artists!!! Please try again later.');
  }
  }
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      querySearch();
    }
  };
    return (
    <div id="inputGroup-sizing-sm">
        <Container>
            <InputGroup size="lg" className="mb-3">  
        
        <FormControl
          aria-label="Large"
          aria-describedby="inputGroup-sizing-sm"
          placeholder="Search Artists"
          type="text"
          onChange={event=>setsearchTerm(event.target.value.trim())}
          onKeyDown={handleKeyPress}
    />
    
        <Button onClick={()=>{querySearch()}}variant="primary">Search</Button>
         </InputGroup>
         {error && <Alert variant="danger">{error}</Alert>}
         </Container>
         


         <Container>
         <Row  lg={4} className="g-4">
         {artists.map((artist, index) => (
                      <Col key={index} md={6} lg={3}>
                        <Card key={index}  style={{ width: '18rem' }} className="h-100 w-100">
                        <Card.Img variant="top" src={artist.images[0]?.url || noImage} alt={`${artist.name}`} />
                        <Card.Body>
                            <Card.Title>{artist.name}</Card.Title>
                            <Card.Text>
                                <strong>Genres:</strong> {artist.genres.join(', ')}
                                <br/>
                                <strong>Followers:</strong> {artist.followers.total.toLocaleString()}
                                <br/>
                                <strong>Popularity:</strong> {artist.popularity}
                                <br/>
                                <strong>Id:</strong> {artist.id}
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

export default Artists;
