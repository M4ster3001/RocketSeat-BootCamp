import React from 'react';
import {} from 'react-icons/fi';

import { ErrorContainer } from './styles';

export interface Error {
  message: string;
}

const Error: React.FC<Error> = ({ message }: Error) => {
  return <ErrorContainer>{message}</ErrorContainer>;
};

export default Error;
