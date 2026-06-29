import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Initialize Google Sheets document
// This function should be called in server-side code only (API routes, getServerSideProps, etc.)
const getDoc = async () => {
  // Check for required environment variables
  if (!process.env.GOOGLE_SPREADSHEET_ID) {
    throw new Error('Google Spreadsheet ID is not configured. Set GOOGLE_SPREADSHEET_ID in .env.local');
  }
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error('Google Sheets service account credentials are not configured. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY in .env.local');
  }

  // Create JWT client for service account authentication
  const auth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  // Create document instance with auth passed to constructor (correct for v5.3.0)
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID!, auth);
  await doc.loadInfo(); // Loads document properties and worksheets
  return doc;
};

/**
 * Add a new participant to the Google Sheet
 * @param data - Participant data to add
 */
export const addParticipant = async (data: {
  name: string;
  phone: string;
  amount: string;
  returnNumber: string;
  paymentMethod: string;
}) => {
  try {
    const doc = await getDoc();
    // Check if the sheet exists
    if (!doc.sheetsByIndex || doc.sheetsByIndex.length === 0) {
      throw new Error('No worksheets found in the spreadsheet');
    }
    const sheet = doc.sheetsByIndex[0];
    if (!sheet) {
      throw new Error('Unable to access the first worksheet');
    }

    // Add a new row with the participant data
    await sheet.addRow({
      Name: data.name,
      Phone: data.phone,
      Amount: data.amount,
      ReturnNumber: data.returnNumber,
      PaymentMethod: data.paymentMethod,
      Timestamp: new Date().toISOString(), // Optional: add timestamp
    });

    return { success: true };
  } catch (error) {
    console.error('Error adding participant to Google Sheets:', error);
    throw new Error('Failed to add participant to Google Sheets');
  }
};

/**
 * Get all participants from the Google Sheet
 * @returns Array of participant objects
 */
export const getParticipants = async () => {
  try {
    const doc = await getDoc();
    // Check if the sheet exists
    if (!doc.sheetsByIndex || doc.sheetsByIndex.length === 0) {
      throw new Error('No worksheets found in the spreadsheet');
    }
    const sheet = doc.sheetsByIndex[0];
    if (!sheet) {
      throw new Error('Unable to access the first worksheet');
    }
    const rows = await sheet.getRows();

    // Convert rows to plain objects
    return rows.map((row) => ({
      name: String(row.get('Name') ?? ''),
      phone: String(row.get('Phone') ?? ''),
      amount: String(row.get('Amount') ?? ''),
      returnNumber: String(row.get('ReturnNumber') ?? ''),
      paymentMethod: String(row.get('PaymentMethod') ?? ''),
      timestamp: String(row.get('Timestamp') ?? ''),
    }));
  } catch (error) {
    console.error('Error fetching participants from Google Sheets:', error);
    throw new Error('Failed to fetch participants from Google Sheets');
  }
};

/**
 * Get statistics about participants
 * @returns Object with statistics
 */
export const getStats = async () => {
  try {
    const participants = await getParticipants();

    // Calculate total participants (number of rows)
    const totalParticipants = participants.length;

    // Calculate total amount (sum of all amount values)
    // Extract numeric values from amount strings (e.g., "20 PKR" -> 20)
    const totalAmount = participants.reduce(
      (sum: number, participant: { amount: string }) => {
        const amountNumber = parseFloat(participant.amount.replace(/[^0-9.-]+/g, ''));
        return sum + (isNaN(amountNumber) ? 0 : amountNumber);
      },
      0
    );

    // Return clean JSON object with requested stats
    return {
      totalParticipants,
      totalAmount,
    };
  } catch (error) {
    console.error('Error calculating stats:', error);
    throw new Error('Failed to calculate stats from Google Sheets data');
  }
};