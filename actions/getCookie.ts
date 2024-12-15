import { NextRequest } from 'next/server';

export function GET(request: NextRequest) {
  const jwtCookie = request.cookies.get('jwt');
  
  if (jwtCookie) {
    console.log('JWT value:', jwtCookie.value);
    // Use the JWT value as needed
  } else {
    console.log('JWT cookie not found');
  }
}