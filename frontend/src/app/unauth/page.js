import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Unauthorized Access
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
        You need to be logged in to access this page
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link 
          href="/auth/login"
          style={{
            padding: '12px 24px',
            backgroundColor: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '500'
          }}
        >
          Login
        </Link>
        <Link 
          href="/auth/register"
          style={{
            padding: '12px 24px',
            backgroundColor: '#fff',
            color: '#0070f3',
            textDecoration: 'none',
            borderRadius: '6px',
            border: '1px solid #0070f3',
            fontWeight: '500'
          }}
        >
          Register
        </Link>
      </div>
    </div>
  );
}