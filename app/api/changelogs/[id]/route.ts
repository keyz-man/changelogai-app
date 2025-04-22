import { NextResponse } from 'next/server';
import { getChangelog, deleteChangelog } from '@/app/lib/data';

// GET handler to retrieve a specific changelog
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Changelog ID is required' },
        { status: 400 }
      );
    }
    
    const changelog = await getChangelog(id);
    
    if (!changelog) {
      return NextResponse.json(
        { error: 'Changelog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ changelog });
  } catch (error) {
    console.error('Error fetching changelog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch changelog' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Changelog ID is required' },
        { status: 400 }
      );
    }
    
    // First check if the changelog exists
    const changelog = await getChangelog(id);
    
    if (!changelog) {
      return NextResponse.json(
        { error: 'Changelog not found' },
        { status: 404 }
      );
    }
    
    // Delete the changelog
    const success = await deleteChangelog(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete changelog' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Changelog deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting changelog:', error);
    return NextResponse.json(
      { error: 'Failed to delete changelog' },
      { status: 500 }
    );
  }
} 