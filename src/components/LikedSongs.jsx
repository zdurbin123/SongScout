import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button,Card,Row,Col,Container,InputGroup,FormControl, CardImg} from 'react-bootstrap';
import { getLikedSongs } from '../../data/music';
import { getAuth } from 'firebase/auth';

function LikedSongs() {
  const [likedSongs, setLikedSongs] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    async function fetchLikedSongs() {
      try {
        const uid = auth.currentUser.uid; // Replace with the actual user ID
        const songs = await getLikedSongs(uid);
        setLikedSongs(songs);
      } catch (error) {
        console.error('Error fetching liked songs:', error);
      }
    }

    fetchLikedSongs();
  }, []);

  return (
    <div>
      <h1>Liked Songs</h1>
      <Row>
        {likedSongs.map(song => (
          <Col md={4} key={song.song_id}>
            <Card>
              {song.image_url && <Card.Img variant="top" src={song.image_url} alt={song.name} />}
              <Card.Body>
                <Card.Title className="display-4">{song.name}</Card.Title>
                <Card.Text className="lead">
                  <strong>Artists:</strong> {song.artists && song.artists.map(artist => artist.name).join(', ')}
                </Card.Text>
                <Button variant="success" href={song.song_url} target="_blank">
                  Listen on Spotify
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default LikedSongs;
