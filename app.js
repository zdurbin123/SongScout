
import axios from 'axios';
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { convert } from 'imagemagick'; 
import multer from 'multer'; 
import path from 'path'; 
import fs from 'fs'; 
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


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

app.post('/api/generateImage', (req, res) => {
  const { name, uid, backgroundColor,fontColor} = req.body;
  const outputImagePath = `./images/${uid}.jpg`;
  const fontSize = 400;
  let xc = 'xc:'+backgroundColor.toString()

  convert([
    '-size', '400x400',
    xc.toString() ,
    '-fill', fontColor.toString(),
    '-gravity', 'center',
    '-pointsize', fontSize.toString(),
    `-draw`, `text 0,0 "${name}"`,
    outputImagePath
  ], (err, stdout, stderr) => {
    if (err) {
      console.error('Error creating image with text:', err);
      console.error('stderr:', stderr);
      res.status(500).json({ success: false, error: 'Image processing error' });
    } else {
      console.log(`Image for ${name} with UID ${uid} generated successfully at ${outputImagePath}`);
      res.status(200).json({ success: true, imagePath: outputImagePath });
    }
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'images');
    fs.mkdirSync(uploadPath, { recursive: true });


    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uid = req.body.uid || req.query.uid || 'default'; 
    const fileName = `${uid}_banner${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

app.post('/api/uploadBanner', upload.single('image'), (req, res) => {

  try {
    const uploadedFile = req.file;

    const newFileName = req.body.uid+"_banner"+'.jpg'; 

    fs.renameSync(uploadedFile.path, path.join(__dirname, 'images', newFileName));

    res.status(200).json({ success: true, message: 'File uploaded successfully!' });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, error: 'File upload failed.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
