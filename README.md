# Portfolio Contact API

API backend para o formulário de contato do meu portfólio.

Responsável por: - Receber mensagens via POST `/contact` - Validar dados
com Zod - Proteger contra spam (honeypot + rate limit) - Sanitizar
conteúdo HTML - Enviar e-mail via SMTP (Nodemailer)

------------------------------------------------------------------------

## 🚀 Tecnologias

-   Node.js
-   Express
-   Zod (validação)
-   Nodemailer (SMTP)
-   Helmet (segurança HTTP)
-   Express-rate-limit (anti spam)
-   Dotenv (variáveis de ambiente)

------------------------------------------------------------------------

## 📌 Endpoint

### POST `/contact`

Body esperado:

``` json
{
  "name": "Nome",
  "email": "email@email.com",
  "message": "Mensagem",
  "_hp": ""
}
```

-   `_hp` é um campo honeypot invisível para bots.
-   Se preenchido, a API ignora silenciosamente a requisição.

------------------------------------------------------------------------

## 🔐 Segurança implementada

-   Validação de entrada com Zod
-   Rate limit (5 requisições/minuto por IP)
-   Sanitização de HTML para evitar injeção
-   CORS configurável
-   Uso de variáveis de ambiente (.env)

------------------------------------------------------------------------

## ⚙️ Variáveis de ambiente

``` env
PORT=3000
CORS_ORIGIN=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_app_password
CONTACT_TO=destino@email.com
```

⚠️ Para Gmail é necessário utilizar **App Password**.

------------------------------------------------------------------------

## 🧪 Teste via curl

``` bash
curl -X POST http://localhost:3000/contact ^
-H "Content-Type: application/json" ^
-d "{"name":"Teste","email":"teste@email.com","message":"Mensagem","_hp":""}"
```

------------------------------------------------------------------------

## 📦 Objetivo

Projeto criado para uso pessoal no portfólio, seguindo boas práticas de
segurança, organização e preparo para ambiente de produção.

------------------------------------------------------------------------

## 📄 Licença

Uso pessoal e educacional.
