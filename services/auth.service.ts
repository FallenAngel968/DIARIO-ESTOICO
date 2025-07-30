import { Platform } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { auth } from '@/config/firebase-config';

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    const clientId = Platform.select({
      ios: 'your-ios-client-id.googleusercontent.com',
      android: 'your-android-client-id.googleusercontent.com',
      web: 'your-web-client-id.googleusercontent.com',
    });

    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'diarioestoico',
    });

    const request = new AuthSession.AuthRequest({
      clientId: clientId!,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {
        access_type: 'offline',
      },
    });

    const result = await request.promptAsync({
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    });

    if (result.type === 'success' && result.params.code) {
      // Exchange the authorization code for an access token
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: clientId!,
          code: result.params.code,
          redirectUri,
          extraParams: {
            code_verifier: request.codeVerifier || '',
          },
        },
        {
          tokenEndpoint: 'https://oauth2.googleapis.com/token',
        }
      );

      if (tokenResponse.accessToken) {
        const credential = GoogleAuthProvider.credential(
          tokenResponse.idToken,
          tokenResponse.accessToken
        );
        const userCredential = await signInWithCredential(auth, credential);
        return userCredential.user;
      }
    }
    throw new Error('Google sign in failed');
  } catch (error) {
    console.error('Error with Google sign in:', error);
    throw error;
  }
};

// Facebook Sign In
export const signInWithFacebook = async () => {
  try {
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'diarioestoico',
    });

    const request = new AuthSession.AuthRequest({
      clientId: 'your-facebook-app-id',
      scopes: ['public_profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Token,
    });

    const result = await request.promptAsync({
      authorizationEndpoint: 'https://www.facebook.com/v2.12/dialog/oauth',
    });

    if (result.type === 'success' && result.params.access_token) {
      const credential = FacebookAuthProvider.credential(result.params.access_token);
      const userCredential = await signInWithCredential(auth, credential);
      return userCredential.user;
    }
    throw new Error('Facebook sign in failed');
  } catch (error) {
    console.error('Error with Facebook sign in:', error);
    throw error;
  }
};

// Apple Sign In (iOS only)
export const signInWithApple = async () => {
  try {
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Sign In is only available on iOS');
    }

    const nonce = Math.random().toString(36).substring(2, 10);
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      nonce,
      { encoding: Crypto.CryptoEncoding.HEX }
    );

    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });

    if (appleCredential.identityToken) {
      const provider = new OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: appleCredential.identityToken,
        rawNonce: nonce,
      });

      const userCredential = await signInWithCredential(auth, credential);
      return userCredential.user;
    }
    throw new Error('Apple sign in failed');
  } catch (error) {
    console.error('Error with Apple sign in:', error);
    throw error;
  }
};
