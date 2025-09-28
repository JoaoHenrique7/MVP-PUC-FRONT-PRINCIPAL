# Documentação do Projeto: Gerenciador de Endereços

## Visão Geral
Sistema composto por dois repositórios:
1. **Backend**: API em Flask que consulta a ViaCEP, salva dados em SQLite e oferece CRUD completo.
2. **Frontend**: Aplicação React + TypeScript + Vite que consome a API e permite gerenciar endereços.

Arquitetura:
- Frontend (React TSX) → chama API Flask → consulta ViaCEP → salva dados no SQLite
- Comunicação via HTTP REST

# Frontend

## Tecnologias
- React 18
- TypeScript
- Vite
- Fetch API
- CSS

## Instalação Local
```bash
git clone https://github.com/JoaoHenrique7/MVP-PUC-FRONT-PRINCIPAL.git
cd frontend
npm install
npm run dev
```
A aplicação estará disponível em: `http://localhost:5173`

⚠️ Certifique-se que o backend esteja rodando em `http://localhost:5000`.

## Rodando com Docker
```bash
docker build -t frontend-enderecos .
docker run -p 3000:80 frontend-enderecos
```
A aplicação estará disponível em: `http://localhost:3000`

## Usando docker-compose (frontend + backend)
```bash
docker compose up
```
Sobe frontend (3000) e backend (5000) juntos.

## Funcionalidades
- Listar endereços cadastrados
- Adicionar endereço via CEP
- Editar endereço (logradouro, bairro, cidade, UF)
- Deletar endereço

---

# Observações
- Banco de dados SQLite (`enderecos.db`) criado automaticamente no backend.
- Swagger UI para testar rotas: `http://localhost:5000/`
- Comunicação entre frontend e backend via HTTP REST.
- Pode ser rodado localmente ou via Docker.

