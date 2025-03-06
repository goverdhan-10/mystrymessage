import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';

export async function DELETE(request: NextRequest, { params }: { params: { messageid: string } }) {
  await dbConnect();

  try {
    const { messageid } = params;

    // Validate message ID
    if (!messageid) {
      return NextResponse.json(
        { success: false, message: 'Message ID is required' },
        { status: 400 }
      );
    }

    // Find the user who has the message
    const user = await UserModel.findOne({ 'messages._id': messageid });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User or message not found' },
        { status: 404 }
      );
    }

    // Remove the message from the user's messages array
    user.messages = user.messages.filter(
      (message: any) => message._id.toString() !== messageid
    );

    // Save the updated user document
    await user.save();

    return NextResponse.json(
      { success: true, message: 'Message deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete message' },
      { status: 500 }
    );
  }
}