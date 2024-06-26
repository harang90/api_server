
const path = require('path');
const fs = require('fs');

async function playVideo(req, res) {

  const filename = req.params.filename;

  const videoPath = path.join(__dirname, '..', 'uploads', filename);
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }

}

async function playImage(req, res) {

  const filename = req.params.filename;

  const imagePath = path.join(__dirname, '..', 'uploads', filename);
  fs.readFile(imagePath, (err, data) => {
    if (err) {
      res.status(500).send('Error reading the image file');
    } else {
      res.setHeader('Content-Type', 'image/jpeg');
      res.send(data);
    }
  });

}

module.exports = {
  playVideo,
  playImage,
};