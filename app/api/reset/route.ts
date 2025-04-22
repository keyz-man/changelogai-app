import { NextResponse } from 'next/server';
import { resetStore } from '@/app/lib/data';

// POST handler to reset all data
export async function POST() {
  try {
    // Reset the store to empty state
    resetStore();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Data store has been reset to empty state' 
    });
  } catch (error) {
    console.error('Error resetting data store:', error);
    return NextResponse.json(
      { error: 'Failed to reset data store' },
      { status: 500 }
    );
  }
}

// For development purposes, also allow GET requests to reset
export async function GET() {
  try {
    // Reset the store to empty state
    resetStore();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Data store has been reset to empty state' 
    });
  } catch (error) {
    console.error('Error resetting data store:', error);
    return NextResponse.json(
      { error: 'Failed to reset data store' },
      { status: 500 }
    );
  }
} 