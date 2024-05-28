import { NextResponse } from "next/server";
import connectDatabase from '@/app/libs/database';
import generateToken from '@/app/libs/generateToken'

export const POST = async (request: Request) => {
  try {
    const dataRequest = await request.json();
    const query = `SELECT * FROM wp_users WHERE user_email = '${dataRequest.email}'`;
    const results = await connectDatabase.query(query);
    await connectDatabase.end();

    const dataResult: any = results[0];

    if (dataResult[0]) {
      const strToken = generateToken(dataResult[0].ID, dataResult[0].user_email);
      return NextResponse.json({ message: 'success', data: strToken }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Login is fail', data: {} }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'fail', err: error }, { status: 500 });
  }
}
