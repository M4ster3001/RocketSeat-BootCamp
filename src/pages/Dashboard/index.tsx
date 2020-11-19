/* eslint-disable react/jsx-props-no-spreading */
import React, { FormEvent, useEffect, useState } from 'react';
import {} from 'react-icons/fi';

import { Title, Form, Repositories } from './styles';

import logoImg from '../../assets/Logo.svg';
import api from '../../services/api';
import Card from '../../components/Card';
import Error from '../../components/Error';

interface Repository {
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string;
}

const Dashboard: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem(
      '@GithubExplorer:repositories',
    );

    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    }

    return [];
  });
  const [error, setError] = useState('');
  const [newRepo, setNewRepo] = useState('');

  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  async function handleAddRepository(
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();

    if (!newRepo) {
      setError('Digite o autor/nome do repositório');
      return;
    }

    await api
      .get<Repository>(`repos/${newRepo}`)
      .then(resp => {
        const repository = resp.data;

        setRepositories([...repositories, repository]);
        setError('');
      })
      .catch(er => {
        setError('Erro na busca pelo repositório');
      });
  }

  return (
    <>
      <img src={logoImg} alt="Logo github" />
      <Title>Dashboard</Title>

      <Form hasError={!!error} onSubmit={handleAddRepository}>
        <input
          placeholder="Digite o nome do repositorio"
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {error && <Error message={error} />}

      <Repositories>
        {repositories &&
          repositories.map(repository => (
            <Card key={repository.full_name} {...repository} />
          ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
