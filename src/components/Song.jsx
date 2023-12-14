import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

import Carousel from 'react-bootstrap/Carousel';
import {Button,Card,Row,Col,Container} from 'react-bootstrap';
function Song() {
    const [token, setToken] = useState('');
    const [song, setSong] = useState({});
    const [artistsDetails, setArtistsDetails] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
  // waiting for parent class to send the id to this func for me to display the info
  //one more light 
  const id="5b2bu6yyATC1zMXDGScJ2d"

    useEffect(() => {
        async function to() {
            const {data} = await axios.get('http://localhost:3000')
            console.log(data)
            setToken(data.access_token); 
        }
    
        to();
      }, []);
      

      useEffect(()=>{
        if (!token) return; 
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
              if (data.artists && data.artists.length > 0) {
                artistfunc(data.artists);
            } 
              console.log(data);
          } catch (error) {
              console.error('Error from Spotify:', error);
          }
          }
        SongInfo()
      },[token])

      if (!song || !song.album || !song.album.images) {
        return <div>Loading...</div>; 
    }
    async function artistfunc(artists) {
      const newArt = [];
  
      for (const art of artists) {
          const parameters = {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              }
          };
  
          try {
              const { data } = await axios.get(`https://api.spotify.com/v1/artists/${encodeURIComponent(art.id)}`, parameters);
              newArt.push(data);
          } catch (error) {
              console.error('Error from Spotify when searching artist:', error);
          }
      }
  
      setArtistsDetails(newArt);
  }
  const playPreview = () => {
    const audio = document.getElementById('song-preview');
    if (audio) {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying); 
    }
}
     
    return (
        <div>
            <Carousel data-bs-theme="dark" fade >
            <Carousel.Item>
              <Container className="mt-4">
                <Card className="mb-3 ">
                  <Row>
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
                            <br />
                            <strong>Release Date:</strong> {song.album.release_date} <em>({song.album.release_date_precision})</em>
                            <br />
                            <strong>Track Number:</strong> {song.track_number} of {song.album.total_tracks}
                            <br />
                            <strong>Popularity Score:</strong><em>{song.popularity}</em>
                            <br />
                            <strong>Duration:</strong> {new Date(song.duration_ms).toISOString().slice(11, 19)} (mm:ss)
                            <br />
                            <strong>Available in Markets:</strong> {song.available_markets && song.available_markets.join(', ')}
                          </Card.Text>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '27px' }}>
                        {song.preview_url &&
                        <div>
                        <audio id="song-preview" src={song.preview_url} preload="none"></audio>
                        <Button variant="success" onClick={playPreview}>
                            <i className={`bi ${isPlaying ? 'bi-stop-fill' : 'bi-play-fill'}`}></i>
                            {isPlaying ? ' Stop' : ' Play Preview'}
                        </Button>
                        </div>}
                        <Button variant="success" href={song.external_urls.spotify} target="_blank">Listen on Spotify</Button>
                        </div>
                        <br/>
                        <Card.Text>Switch slides to see Artist/Artists Info!!!</Card.Text>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Container>

            </Carousel.Item>
            {/* Carousel items for each artist */}
            
            {artistsDetails&&artistsDetails.map((artist, index) => (
    <Carousel.Item key={index}>
        <Container className="mt-4">
            <Card className="mb-3 ">
                <Row>
                    <Col md={4}>
                        {artist.images && artist.images[0] && (
                            <Card.Img
                                variant="top"
                                src={artist.images[0].url}
                                alt={artist.name}
                                style={{ minHeight: '200px', objectFit: 'cover' }}
                            />
                        )}
                    </Col>
                    <Col md={8}>
                        <Card.Body >
                            <Card.Title>{artist.name}</Card.Title>
                            <Card.Text>
                                <strong>Genres:</strong> {artist.genres && artist.genres.join(', ')}
                                <br />
                                <strong>Followers:</strong> {artist.followers && artist.followers.total.toLocaleString()}
                                <br />
                                <strong>Popularity:</strong> {artist.popularity}
                            </Card.Text>
                            <Button variant="primary" href={artist.external_urls.spotify} target="_blank">View on Spotify</Button>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    </Carousel.Item>
))}

          </Carousel>
        </div>
      );
      
    
}
export default Song