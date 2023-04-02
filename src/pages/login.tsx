import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../firebase/firebaseConfig';

interface LoginError extends Error {
  message: string;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoggedIn(!!user);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      if (isLogin) {
        await auth.signInWithEmailAndPassword(email, password);
      } else {
        await auth.createUserWithEmailAndPassword(email, password);
      }
      router.push('/');
    } catch (err) {
      throw { message: err.message } as LoginError;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (err: LoginError) {
      setError(err.message);
    }
  };

  const handleToggleAuth = () => {
    setIsLogin((prevValue) => !prevValue);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setLoggedIn(false);
      router.push('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {loggedIn ? (
        <>
          <p>You are already logged in.</p>
          <button onClick={handleLogout}>Log out</button>
        </>
      ) : (
        <>
          <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
            <button type="button" onClick={handleToggleAuth}>
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </form>
          {error && <p>{error}</p>}
        </>
      )}
    </div>
  );
};

export default LoginPage;
