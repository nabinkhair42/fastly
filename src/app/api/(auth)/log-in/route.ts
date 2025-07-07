import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { loginSchema } from '@/zod/authValidation';
import { UserAuthModel } from '@/models/users';
import { verifyPassword } from '@/helpers/hashPassword';
import { generateJwtToken } from '@/helpers/jwtToken';

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { email, password } = await request.json();
    const { error } = loginSchema.safeParse({ email, password });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    // check if user exists
    const userAuth = await UserAuthModel.findOne({ email });
    if (!userAuth) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // check if password is correct
    const isPasswordCorrect = await verifyPassword(password, userAuth.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: 'Invalid password' },
        { status: 400 }
      );
    }

    // TODO: check if user is verified : If Not Verified, Send Verification Email and redirect to the email verification page
    // if(!userAuth.isVerified){
    //     return NextResponse.json({message: 'User not verified'}, {status: 400});
    // }

    // generate jwt token
    const jwtToken = generateJwtToken({ userId: userAuth._id });

    return NextResponse.json(
      { message: 'Login successful', jwtToken },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
