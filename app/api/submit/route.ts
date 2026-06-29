//app\api\submit\route.ts
import { NextResponse } from 'next/server';
import { addParticipant } from '@/lib/googleSheets';

// Define the expected shape of the request body
interface SubmitParticipantRequest {
  name: string;
  phone: string;
  amount: string;
  returnNumber: string;
  paymentMethod: string;
}

export async function POST(request: Request) {
  try {
    // Parse the JSON body
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'phone', 'amount', 'returnNumber', 'paymentMethod'];
    for (const field of requiredFields) {
      if (!body[field] || typeof body[field] !== 'string' || body[field].trim() === '') {
        return NextResponse.json(
          { error: `Missing or invalid field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Prepare the data for Google Sheets
    const participantData = {
      name: body.name.trim(),
      phone: body.phone.trim(),
      amount: body.amount.trim(),
      returnNumber: body.returnNumber.trim(),
      paymentMethod: body.paymentMethod.trim(),
    };

    // Add participant to Google Sheets
    await addParticipant(participantData);

    // Return success response
    return NextResponse.json(
      { message: 'Participant added successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in /api/submit:', error);
    // Check if it's a configuration error from Google Sheets integration
    if (error.message && (
      error.message.includes('not configured') ||
      error.message.includes('Unable to access') ||
      error.message.includes('No worksheets found')
    )) {
      // Service configuration issue - return 503
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}