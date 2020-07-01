import React, { useState, useEffect, FormEvent } from "react";
import { Title, Form, Repositories, Error } from "./styles";
import logoImg from "../../assets/logo.svg";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../../services/api";

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
      "@GithubExplorer:repositories"
    );

    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    } else {
      return [];
    }
  });
  const [newRepo, setNewRepo] = useState("");
  const [inputError, setInputError] = useState("");

  async function handleAddRepository(
    e: FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    if (!newRepo) {
      setInputError("Digite o autor/nome do repositório");
      return;
    }

    try {
      const response = await api.get<Repository>(`/repos/${newRepo}`);

      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo("");
      setInputError("");
    } catch (error) {
      setInputError("Erro na busca por esse repositório");
    }
  }

  useEffect(() => {}, []);

  useEffect(() => {
    localStorage.setItem(
      "@GithubExplorer:repositories",
      JSON.stringify(repositories)
    );
  }, [repositories]);

  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore repositórios no Github</Title>
      <Form hasError={!!inputError} action="" onSubmit={handleAddRepository}>
        <input
          type="text"
          value={newRepo}
          placeholder="Digite o nome do repositório"
          onChange={(e) => setNewRepo(e.target.value)}
        />
        <button type="submit">Pesquisar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map((repo) => (
          <Link to={`/repository/${repo.full_name}`} key={repo.full_name}>
            <img src={repo.owner.avatar_url} alt={repo.owner.login} />
            <div>
              <strong>{repo.full_name}</strong>
              <p>{repo.description}</p>
            </div>
            <FiChevronRight size={30} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
