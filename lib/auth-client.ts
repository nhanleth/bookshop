"use client"

// Updated: Fixed authentication check to properly verify user session and get user ID
// Cập nhật: Sửa hàm kiểm tra xác thực để chính xác lấy ID người dùng từ session

import { toast } from 'sonner'
import { redirect } from 'next/navigation'

// Function to check if user is authenticated and get their ID
export async function checkAuthentication(): Promise<{authenticated: boolean, userId?: number}> {
  try {
    const sessionResponse = await fetch('/api/auth/session');
    if (!sessionResponse.ok) {
      console.log('Session response not OK:', sessionResponse.status);
      return { authenticated: false };
    }
    
    const session = await sessionResponse.json();
    console.log('Session data:', session);
    
    // Kiểm tra cấu trúc đúng của session
    if (!session || session.error) {
      console.log('Session error or empty', session?.error);
      return { authenticated: false };
    }
    
    // Truy cập trực tiếp vào id của người dùng từ session
    // Access directly user ID from session
    let userId = null;
    
    // Try to get userId from all possible properties
    if (session.id && !isNaN(Number(session.id))) {
      userId = Number(session.id);
    } else if (session.user && session.user.id && !isNaN(Number(session.user.id))) {
      userId = Number(session.user.id);
    } else if (session.userId && !isNaN(Number(session.userId))) {
      userId = Number(session.userId);
    }
    
    if (!userId) {
      console.log('No user ID found in session. Session data:', session);
      return { authenticated: false };
    }
    
    console.log('Successfully authenticated with user ID:', userId);
    return { 
      authenticated: true, 
      userId: userId
    };
  } catch (error) {
    console.error('Error checking authentication:', error);
    return { authenticated: false };
  }
}

// Function to ensure authentication, with redirect if not authenticated
export async function ensureAuth(redirectPath: string = '/login'): Promise<{userId: number} | null> {
  const { authenticated, userId } = await checkAuthentication();
  
  if (!authenticated) {
    console.log('User not authenticated, redirecting to', redirectPath);
    toast.error('Vui lòng đăng nhập để tiếp tục');
    
    if (typeof window !== 'undefined') {
      window.location.href = redirectPath;
      return null;
    } else {
      redirect(redirectPath);
      return null;
    }
  }
  
  console.log('User authenticated with ID:', userId);
  return { userId: userId! };
} 