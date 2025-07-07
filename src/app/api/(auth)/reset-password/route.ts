import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { resetPasswordSchema } from '@/zod/authValidation';
import { UserAuthModel } from '@/models/users';
import { hashPassword } from '@/helpers/hashPassword';

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { password, confirmPassword } = await request.json();
    const resetPasswordToken = request.headers.get('Authorization');
    const { error } = resetPasswordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    // check if reset password token is valid
    const userAuth = await UserAuthModel.findOne({ resetPasswordToken });
    if (!userAuth) {
      return NextResponse.json(
        { message: 'Invalid reset password token' },
        { status: 400 }
      );
    }

    // check if reset password token has expired
    if (
      userAuth.resetPasswordTokenExpiresAt &&
      userAuth.resetPasswordTokenExpiresAt < new Date()
    ) {
      return NextResponse.json(
        { message: 'Reset password token has expired' },
        { status: 400 }
      );
    }

    // check if password and confirm password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: 'Password and confirm password do not match' },
        { status: 400 }
      );
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // update user auth
    userAuth.password = hashedPassword;
    userAuth.resetPasswordToken = '';
    userAuth.resetPasswordTokenExpiresAt = null;
    await userAuth.save();

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
