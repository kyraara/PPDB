import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

export default function GoogleSignInButton({ onSuccess, onError, text = 'signin_with' }) {
  return (
    <div className="flex justify-center w-full">
      <GoogleLogin
        onSuccess={(credentialResponse) => onSuccess(credentialResponse.credential)}
        onError={onError}
        text={text}
        theme="outline"
        size="large"
        width="100%"
        shape="rectangular"
      />
    </div>
  );
}
