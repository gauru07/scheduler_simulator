import { NextRequest, NextResponse } from 'next/server';
import { runSimulation } from '@/engine';

type ErrorLike = { message?: string };

function getErrorMessage(err: unknown): string {
  if (typeof err === 'string') return err;
  if (err && typeof err === 'object' && 'message' in err) {
    const e = err as ErrorLike;
    if (typeof e.message === 'string') return e.message;
  }
  return 'Unknown error';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = runSimulation(body);
    return NextResponse.json(result);
  } catch (e: unknown) {
    const message = getErrorMessage(e);
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message } },
      { status: 400 }
    );
  }
}
