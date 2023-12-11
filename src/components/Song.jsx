import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button,Card,Row,Col,Container,InputGroup,FormControl} from 'react-bootstrap';
function Song() {
    const [token, setToken] = useState('');
    const [song, setSong] = useState([]);
  // waiting for parent class to send the id to this func for me to display the info
  const id="11dFghVXANMlKmJXsNCbNl"

    useEffect(() => {
        async function to() {
            const {data} = await axios.get('http://localhost:3000')
            console.log(data)
            setToken(data.access_token); 
        }
    
        to();
      }, []);
      

      useEffect(()=>{
        async function SongInfo(){
            console.log("hi")
            const parameters = {
                headers:{
                  'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
            try {
              const { data } = await axios.get(`https://api.spotify.com/v1/tracks/${encodeURIComponent(id)}`, parameters);
              setSong(data)
              console.log(data);
          } catch (error) {
              console.error('Error from Spotify:', error);
          }
          }
        SongInfo()
      },[])

      if (!song || !song.album || !song.album.images) {
        return <div>Loading...</div>; 
    }

     
        return (
            <div>
                <Container className="mt-4">
                    {song && (
                        <Card className="mb-3">
                            <Row >
                                <Col md={4}>
                                    {song.album && song.album.images && song.album.images[0] && (
                                        <Card.Img 
                                            src={song.album.images[0].url} 
                                            alt={`${song.name}`} 
                                            className="img-fluid" 
                                            style={{ minHeight: '300px', objectFit: 'cover' }}
                                        />
                                    )}
                                </Col>
                                <Col md={8}>
                                    <Card.Body>
                                        <Card.Title className="display-4">{song.name}</Card.Title>
                                        <Card.Text className="lead">
                                            <strong>Artists:</strong> {song.artists && song.artists.map(artist => artist.name).join(', ')}
                                        </Card.Text>
                                        {song.album && (
                                            <Card.Text>
                                                <strong>Album:</strong> {song.album.name} <em>({song.album.album_type})</em>
                                                <br/>
                                                <strong>Release Date:</strong> {song.album.release_date} <em>({song.album.release_date_precision})</em>
                                                <br/>
                                                <strong>Track Number:</strong> {song.track_number} of {song.album.total_tracks}
                                                <br/>
                                                <strong>Duration:</strong> {new Date(song.duration_ms).toISOString().substr(11, 8)} (mm:ss)
                                                <br/>
                                                <strong>Available in Markets:</strong> {song.available_markets && song.available_markets.join(', ')}
                                            </Card.Text>
                                        )}
                                        <Button variant="success" href={song.external_urls.spotify} target="_blank">Listen on Spotify</Button>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card>
                    )}
                    {song && song.artists && (
                        <Row>
                            {song.artists.map((artist, index) => (
                                <Col md={4} key={index}>
                                    <Card className="mb-3">
                                        {artist.images && artist.images[0] && (
                                            <Card.Img 
                                                variant="top" 
                                                src={artist.images[0].url} 
                                                alt={artist.name} 
                                                style={{ minHeight: '200px', objectFit: 'cover' }}
                                            />
                                        )}
                                        <Card.Body>
                                            <Card.Title>{artist.name}</Card.Title>
                                            <Card.Text>
                                                <strong>Genres:</strong> {artist.genres && artist.genres.join(', ')}
                                                <br/>
                                                <strong>Followers:</strong> {artist.followers && artist.followers.total.toLocaleString()}
                                                <br/>
                                                <strong>Popularity:</strong> {artist.popularity}
                                            </Card.Text>
                                            <Button variant="primary" href={artist.external_urls.spotify} target="_blank">View on Spotify</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Container>
            </div>
        );
        
    
}
export default Song