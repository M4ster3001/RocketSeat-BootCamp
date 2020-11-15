/* eslint-disable react/jsx-props-no-spreading */
import React, { FormEvent, useState } from 'react';
import {} from 'react-icons/fi';

import { Title, Form, Repositories } from './styles';

import logoImg from '../../assets/Logo.svg';
import api from '../../services/api';
import Card from '../../components/Card';

interface Repository {
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string;
}

const Dashboard: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [newRepo, setNewRepo] = useState('');

  async function handleAddRepository(
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();

    await api
      .get<Repository>(`repos/${newRepo}`)
      .then(resp => {
        const repository = resp.data;

        setRepositories([...repositories, repository]);
      })
      .catch(er => {
        alert(er);
      });
  }

  return (
    <>
      <img src={logoImg} alt="Logo github" />
      <Title>Dashboard</Title>

      <Form onSubmit={handleAddRepository}>
        <input
          placeholder="Digite o nome do repositorio"
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
        />
        <button type="submit">Pesquisar</button>
      </Form>

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
