# NFE Service API

API RESTful para simulação de emissão de NF-e (Nota Fiscal Eletrônica),
com autenticação JWT, validação de XML via XSD, persistência em banco
relacional e integração simulada com SEFAZ (mock assíncrono).

------------------------------------------------------------------------

## 🛠️ Tecnologias

-   Node.js
-   NestJS
-   Prisma ORM
-   PostgreSQL
-   Docker
-   Swagger
-   JWT

------------------------------------------------------------------------

# ⚙️ Como Rodar o Projeto

## ✅ Pré-requisitos

-   Docker
-   Docker Compose

------------------------------------------------------------------------

## 🔹 Subir a aplicação

``` bash
docker compose up --build
```

O processo automaticamente:

-   Sobe o PostgreSQL
-   Aplica migrations
-   Executa seed automático (em produção para fins do teste)
-   Inicia a API

------------------------------------------------------------------------

## 🔐 Usuário padrão (seed)

Login: teste
Senha: mudar@123

------------------------------------------------------------------------

## 📚 Acessar Swagger

http://localhost:3000/api

------------------------------------------------------------------------

## 🔑 Fluxo de uso

1.  Fazer login em `/auth/login`
2.  Copiar o token JWT retornado
3.  No Swagger, clicar em **Authorize**
4.  Informar:

Bearer `<seu_token>`{=html}

5.  Utilizar os endpoints protegidos

------------------------------------------------------------------------

## 🗄 Banco de Dados

Persistência de:

-   Clientes
-   Produtos
-   Notas Fiscais
-   Status da NF-e
-   XML autorizado


------------------------------------------------------------------------

## 🧪 Ambiente 100% Containerizado

O projeto roda totalmente via Docker, sem necessidade de:

-   Node instalado localmente
-   Banco local
-   Configuração manual de seed

------------------------------------------------------------------------

## 🧑‍💻 Autor

Projeto desenvolvido para Desafio Técnico – Engenheiro(a) de
Software Full Stack – Backend