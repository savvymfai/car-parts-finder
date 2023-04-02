import React from 'react';

interface LoginError {
  message: string;
}

const LoginErrors: React.FC<{ errors: LoginError[] }> = ({ errors }): JSX.Element => (
  <>
    {errors.map((error) => (
      <React.Fragment key={error.message}>{error.message}</React.Fragment>
    ))}
  </>
);

export default LoginErrors;
