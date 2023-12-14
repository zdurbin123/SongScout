
import axios from 'axios';
import express, { json, urlencoded } from 'express';
import cors from 'cors';


const app = express();
app.use(json());
app.use(cors())
app.use(urlencoded({extended: true}));
//hey test
app.get('/', async (req, res) => {
  const client_id = "447d1396abd344af93d97b6d31c44737"
  const client_secret = "fdb8073e596a4f5fabad20f501e8c453"
  const authOptions = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'grant_type=client_credentials'
  };

  try {
    console.log("hi")
    const response = await axios(authOptions);
    console.log(response.data)
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
