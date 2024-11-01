import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const router = express.Router();


const auth = new google.auth.GoogleAuth({
  credentials: {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});


router.use(cors());
router.use(express.json());

const spreadsheetId = process.env.SPREADSHEET_ID; 
const authMessage = process.env.AUTH_MESSAGE; 
const range = 'Sheet1!A:C'; 

// Middleware for authentication
function authenticate(req, res, next) {
  const clientAuthMessage = req.headers['authorization'] || req.body.authMessage;

  if (clientAuthMessage === authMessage) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized access' });
  }
}

// Function to add contact details to the Google Sheet
async function addContactDetailsToSheet(contactData) {
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource: {
        values: [
          [contactData.name, contactData.email, contactData.message],
        ],
      },
    });

    console.log('Contact details added successfully!');
  } catch (err) {
    console.error('Error adding contact details:', err);
    throw err;
  }
}


// Route to add contact details, protected by authentication middleware
router.post('/submit', authenticate, async (req, res) => {
  const contactData = req.body;

  try {
    await addContactDetailsToSheet(contactData);
    res.status(200).json({ message: 'Contact details added successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add contact details', details: err.message });
  }
});

export default router;
