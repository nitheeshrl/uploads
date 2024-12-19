/* 
Google Drive API:
Demonstration to:
1. upload 
2. delete 
3. create public URL of a file.

required npm package: googleapis
*/
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const express = require('express');
const PORT = 3000;
const server = express()
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
server.use(cors(corsOptions))
server.use(express.json())
const CLIENT_ID = '91306685738-la4urqts57u1u2jkv2p225g336vhr9cr.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04aLhQeRxNN58CgYIARAAGAQSNwF-L9IrDGYbQYR2oIJEAM5qJVWvui15wor9XNNYrX7ULXFvAW1NLogpfx1ySIuYpmI1yNEMmSg';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});

/* 
filepath which needs to be uploaded
Note: Assumes example.jpg file is in root directory, 
though this can be any filePath
*/
const filePath = path.join(__dirname, 'Base_2-1 2.pdf');
//var file = path.basename(filePath);
//console.log(fs.createReadStream(filePath))
async function uploadFile(file) {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: file,
       //This can be name of your choice

      },
      media: {

        body: fs.createReadStream(filePath),
    
      },
    
    });

    console.log(response.data);
  } catch (error) {
    console.log(error.message);
  }
}



async function deleteFile() {
  try {
    const response = await drive.files.delete({
      fileId: 'YOUR FILE ID',
    });
    console.log(response.data, response.status);
  } catch (error) {
    console.log(error.message);
  }
}

// deleteFile();

async function generatePublicUrl() {
  try {
    const fileId = 'YOUR FILE ID';
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    /* 
    webViewLink: View the file in browser
    webContentLink: Direct download link 
    */
    const result = await drive.files.get({
      fileId: fileId,
      fields: 'webViewLink, webContentLink',
    });
    console.log(result.data);
  } catch (error) {
    console.log(error.message);
  }
}

// generatePublicUrl();
server.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
server.post("/upload", (req, res) => {
 // const { password } = req.body;
//const { salt } = req.body;
 //console.log(req)
   uploadFile('file')
 ;

 })
