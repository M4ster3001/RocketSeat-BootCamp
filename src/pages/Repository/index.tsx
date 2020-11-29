import React, { useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Header, RepositoryInfo, Issues } from './styles';
import logoImg from '../../assets/Logo.svg';

interface RepositoryParams {
  repository: string;
}

const Repository: React.FC = () => {
  const { params } = useRouteMatch<RepositoryParams>();

  return (
    <>
      <Header>
        <img src={logoImg} alt="Github explorer" />
        <Link to="/dashboard">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>

      <RepositoryInfo>
        <header>
          <img
            src="https://avatars1.githubusercontent.com/u/42715849?s=460&v=4"
            alt=""
          />
          <div>
            <strong>rocketseat/unform</strong>
            <p>teste</p>
          </div>
        </header>
        <ul>
          <li>
            <strong>1000</strong>
            <span>stars</span>
          </li>
          <li>
            <strong>154</strong>
            <span>stars</span>
          </li>
          <li>
            <strong>23</strong>
            <span>forks</span>
          </li>
          <li>
            <strong>10</strong>
            <span>issues</span>
          </li>
        </ul>
      </RepositoryInfo>

      <Issues>
        <Link to="seila">
          <div>
            <strong>teste</strong>
            <p>1 2 3 testando</p>
          </div>

          <FiChevronRight size={20} />
        </Link>
      </Issues>
    </>
  );
};

export default Repository;
