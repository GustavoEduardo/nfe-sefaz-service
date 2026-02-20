# NFE Service API

API RESTful para simulação de emissão de NF-e (Nota Fiscal Eletrônica),
com autenticação JWT, validação de XML via XSD, persistência em banco
relacional e integração simulada com SEFAZ (mock assíncrono).
A arquitetura já está preparada para substituição por [integração SOAP real](https://portal.fazenda.sp.gov.br/servicos/nfe/Paginas/URL-WEBSERVICES.aspx) com certificado digital.

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

http://localhost:3000/docs

------------------------------------------------------------------------

## 🔑 Fluxo de uso Swagger

1.  Fazer login em `/auth/login`
2.  Copiar o token JWT retornado
3.  No Swagger, clicar em **Authorize**
4.  Informar o token retornado
5.  Utilizar os endpoints protegidos

------------------------------------------------------------------------

## 🗄 Banco de Dados

Persistência de:

-   Clientes
-   Produtos
-   Notas Fiscais
-   XML autorizado
-   Usuários (apenas para testar autenticação JWT)


------------------------------------------------------------------------

## 🧪 Ambiente 100% Containerizado

O projeto roda totalmente via Docker, sem necessidade de:

-   Node instalado localmente
-   Banco local
-   Configuração manual de seed

------------------------------------------------------------------------

## 🧑‍💻 Autor

[Gustavo L](https://www.linkedin.com/in/gustavo-barbosa-438b6694/)

Projeto desenvolvido para Desafio Técnico – Engenheiro(a) de
Software Full Stack – Backend