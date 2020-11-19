import React from 'react';
import { FiChevronRight } from 'react-icons/fi';

import { CardContainer } from './styles';

export interface Repository {
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string;
}

const Card: React.FC<Repository> = ({
  full_name,
  owner,
  description,
}: Repository) => {
  return (
    <CardContainer>
      <a href={`https://github.com/${full_name}`}>
        <img src={owner.avatar_url} alt="teste" />
        <div>
          <strong>{full_name}</strong>
          <p>{description}</p>
        </div>

        <FiChevronRight size={20} />
      </a>
    </CardContainer>
  );
};

export default Card;
