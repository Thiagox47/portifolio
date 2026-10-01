# Portfólio — Thiago Vinicius

Meu portfólio profissional, criado para apresentar projetos, experiências e formas de contato.

### Tecnologias

HTML · CSS · JavaScript · Vite

## Deploy no EasyPanel

Crie um serviço do tipo **App**, conecte este repositório e escolha **Dockerfile** como método de build. O arquivo fica na raiz do projeto e não exige variáveis de ambiente.

- Porta interna: `8080`
- Health check: `/healthz`
- Protocolo: `HTTP`

Depois, associe o domínio ao serviço e ative HTTPS no proxy do EasyPanel.

### Teste local

```sh
docker build -t thiago-portfolio .
docker run --rm -p 8080:8080 thiago-portfolio
```

Abra `http://localhost:8080`.
