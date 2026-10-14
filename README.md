# EZSmoke

> **Achou. Mirou. Jogou.**

O **EZSmoke** é uma biblioteca rápida de utilitárias para **Counter-Strike 2 (CS2)**, criada para consulta durante a partida.

A proposta é simples:

> **Abriu → encontrou a utilitária → executou.**

O projeto não tem como objetivo ser uma plataforma de treinamento, curso ou comunidade. O foco é oferecer uma experiência rápida, objetiva e fácil de consultar, principalmente em dispositivos móveis.

---

## 📌 Status do projeto

**Fase atual:** Planejamento e definição da arquitetura.

A interface, regras de negócio, modelo inicial de banco de dados e arquitetura foram definidos. A implementação ainda não foi iniciada.

---

## 🎯 Objetivo

O EZSmoke resolve um problema simples: durante uma partida, o jogador pode precisar consultar rapidamente uma smoke, flash, molotov ou HE.

Em vez de navegar por várias páginas, o usuário deve conseguir:

```text
Buscar → Encontrar → Executar
```

A experiência deve ser rápida o suficiente para não atrapalhar o ritmo da partida.

---

## 💡 Proposta

O EZSmoke será uma biblioteca de utilitárias organizada por:

- Mapa
- Lado (TR / CT)
- Região (A / B / MID)
- Tipo de utilitária
- Busca textual

Tipos de utilitária inicialmente suportados:

- Smoke
- Flash
- Molotov
- HE

---

# 🧭 Experiência do usuário

## Home

A Home será limpa e objetiva.

Elementos principais:

- Logo EZSmoke
- Slogan
- Busca principal
- Cards dos mapas

Não haverá, no MVP:

- Notícias
- Blog
- Feed
- Ranking
- XP
- Cursos
- Conteúdo desnecessário

### Busca

A busca é um dos principais elementos do produto.

Exemplos:

```text
mirage jungle
smoke jungle
dust xbox
inferno banana
flash b
mirage smoke a
```

O sistema deve conseguir encontrar resultados relevantes sem exigir que o usuário conheça o nome exato da lineup.

---

# 🗺️ Mapas

No lançamento, o modelo de acesso será:

### Free

- Dust II
- Inferno

Esses mapas terão o conteúdo completo disponível gratuitamente.

### Premium

Os demais mapas serão Premium.

Exemplos:

- Mirage
- Ancient
- Nuke
- Vertigo
- Anubis

A estrutura será preparada para adicionar novos mapas posteriormente.

---

# 🔎 Página do mapa

Ao entrar em um mapa, **todas as utilitárias disponíveis são exibidas inicialmente**.

Nenhum filtro é obrigatório.

O usuário pode refinar os resultados usando:

### Lado

```text
TR
CT
```

### Região

```text
A
B
MID
```

### Tipo

```text
Smoke
Flash
Molotov
HE
```

Os filtros são independentes e combináveis.

Exemplo:

```text
TR + A + Smoke
```

Depois, a busca pode refinar ainda mais:

```text
TR + A + Smoke + "jungle"
```

Um filtro ativo pode ser removido clicando novamente nele.

---

# 🃏 Cards de utilitárias

Os cards foram projetados para **identificação**, não para ensinar a execução.

Cada card apresenta:

- Imagem estática do resultado
- Nome da lineup
- Mapa
- Lado
- Região
- Tipo de utilitária
- Descrição curta

Exemplo:

```text
SMOKE JUNGLE

Mirage · TR · A · Smoke

Fecha a visão da Jungle.
```

### Regra

> **Card = "É essa que eu quero?"**

A execução fica na página individual.

---

# 🎯 Página da lineup

A página individual é voltada para execução rápida.

Estrutura:

```text
← Mirage

SMOKE JUNGLE
Mirage · TR · A · Smoke

[ GIF DA EXECUÇÃO ]

📍 Posição
Palace

🎯 Mira
Canto superior direito

🖱️ Arremesso
Jumpthrow

⚠️ Lineup incorreta?
```

O GIF aparece rapidamente na página e é reproduzido automaticamente em loop.

Não haverá:

- botão Play obrigatório
- vídeo longo
- tutorial extenso
- texto desnecessário

### Regra

> **Detalhe = "Como eu faço?"**

---

# 🎞️ Mídia

O MVP utilizará GIFs para demonstrar a execução das lineups.

### Padrão inicial

- Formato: GIF
- Mesmo arquivo para desktop e mobile
- Aproximadamente 3–6 segundos
- Loop automático
- Aproximadamente 15–20 FPS
- Até aproximadamente 720p quando adequado
- Sem áudio
- Meta de aproximadamente 3 MB por GIF

Os valores são referências de otimização e podem ser ajustados durante a implementação.

### Carregamento

GIFs **não serão carregados na listagem de resultados**.

A listagem utilizará imagens estáticas.

O GIF será carregado quando o usuário abrir a lineup.

### Armazenamento

Os arquivos de mídia não serão armazenados diretamente no MySQL.

O banco armazenará apenas referências/URLs:

```text
result_image_url
execution_media_url
execution_media_type
```

O storage/CDN será definido posteriormente.

A estrutura será preparada para, no futuro, permitir formatos como WebM ou MP4 sem alterar o conceito da lineup.

---

# 🔒 Premium

O modelo definido é:

## Free

- Dust II completo
- Inferno completo
- Busca
- Filtros
- Lineups disponíveis nos mapas Free
- Anúncios

## Premium

- Todos os mapas
- Todas as utilitárias disponíveis
- Sem anúncios

---

## 💰 Conteúdo Premium como marketing

Os mapas Premium não serão simplesmente escondidos.

O usuário poderá visualizar a existência das lineups, porém o conteúdo de execução ficará bloqueado.

Exemplo:

```text
🔒 SMOKE WINDOW

Mirage · TR · MID · Smoke

[ prévia ]

🔥 PREMIUM
Desbloqueie esta lineup
```

Ao clicar em uma lineup bloqueada, será apresentada uma tela/modal contendo:

- Benefícios do Premium
- Preço
- Botão de compra

Exemplo:

```text
EZSMOKE PREMIUM

Desbloqueie esta lineup
e todo o conteúdo Premium.

✓ Todos os mapas
✓ Todas as utilitárias
✓ Sem anúncios

R$ XX,XX — pagamento único

[ COMPRAR PREMIUM ]
```

O preço definitivo ainda não foi definido.

### Modelo de pagamento

O Premium **não será uma assinatura recorrente**.

O modelo definido é:

```text
Pagamento único
        ↓
Pagamento aprovado
        ↓
Premium permanente
```

Não haverá inicialmente:

- Mensalidade
- Plano anual
- Renovação automática
- Cobrança recorrente

O acesso Premium ficará vinculado à conta do usuário.

### Reembolso

O reembolso será tratado **manualmente**.

Fluxo definido:

```text
Usuário solicita reembolso por e-mail
        ↓
Administrador analisa a solicitação
        ↓
Administrador realiza o reembolso pelo gateway
        ↓
Administrador acessa o painel Admin
        ↓
Revoga o Premium da conta
        ↓
Usuário volta ao acesso Free
```

A compra não será apagada do banco. Ela permanecerá registrada para manter o histórico, podendo ter o status alterado de `PAID` para `REFUNDED`.

Após a compra aprovada, o usuário deve retornar à lineup que estava tentando acessar.

---

# 👤 Contas

O cadastro **não será obrigatório para utilizar o conteúdo Free**.

Um visitante pode entrar no EZSmoke e utilizar:

- Dust II
- Inferno
- Busca
- Filtros
- Lineups Free

sem criar uma conta.

## Usuário Free cadastrado

Um usuário pode optar por criar uma conta mesmo sem Premium.

Nesse caso:

```text
Plano: FREE
Conta: cadastrada
```

Inicialmente, o cadastro não terá benefícios exclusivos obrigatórios.

A arquitetura será preparada para futuras funcionalidades, como:

- Favoritos
- Histórico
- Preferências
- Sincronização entre dispositivos
- Notificações
- Outras funcionalidades para usuários cadastrados

## Premium

Para comprar o Premium, o usuário terá uma conta.

A compra ficará vinculada à conta para que o acesso continue disponível em diferentes dispositivos.

---

# 🛡️ Segurança do Premium

A proteção Premium será feita no **backend**.

Não será suficiente esconder conteúdo ou botões no React.

Fluxo:

```text
Usuário solicita lineup
        ↓
Backend verifica o mapa
        ↓
Mapa é FREE?
   ├── SIM → libera
   │
   └── NÃO
        ↓
Usuário possui Premium?
   ├── SIM → libera
   └── NÃO → acesso bloqueado
```

---

# ⚠️ Reports

Usuários poderão informar quando uma lineup estiver incorreta ou desatualizada.

Exemplo:

```text
⚠️ Essa lineup está incorreta?
```

Possíveis motivos:

- Lineup não funciona mais
- Imagem/GIF incorreto
- Informações incorretas
- Outro

O administrador poderá:

- Visualizar report
- Resolver
- Ignorar
- Desativar/atualizar a lineup

---

# 👨‍💻 Administração

O conteúdo será administrado inicialmente por um único administrador.

O painel administrativo deverá permitir:

### Lineups

- Criar
- Editar
- Desativar
- Excluir
- Publicar
- Enviar imagem
- Enviar GIF
- Definir Free/Premium através do mapa
- Revogar o Premium de uma conta após reembolso manual

### Reports

- Listar reports
- Visualizar motivo
- Visualizar comentário
- Alterar status
- Resolver
- Ignorar

### Mapas

- Criar
- Editar
- Ativar/desativar

### Usuários

- Visualizar usuários
- Gerenciar permissões administrativas quando necessário

---

# 🗄️ Banco de dados

O modelo inicial possui cinco tabelas principais:

```text
users
maps
lineups
premium_purchases
reports
```

A estrutura principal do produto é:

```text
MAPS
  ↓
LINEUPS
  ↓
DETALHES DA LINEUP
```

Os recursos auxiliares se relacionam assim:

```text
USERS
  ├──< PREMIUM_PURCHASES
  │
  └──< REPORTS >──── LINEUPS >──── MAPS
```

`reports` é uma funcionalidade secundária: ele apenas registra um problema relacionado a uma lineup. Não é parte do fluxo principal de consulta.

---

## `users`

Responsável pelas contas.

Principais campos:

```text
id
name
email
password_hash
role
created_at
updated_at
```

Roles:

```text
USER
ADMIN
```

---

## `maps`

Responsável pelos mapas.

Principais campos:

```text
id
name
slug
image_url
is_free
is_active
created_at
updated_at
```

A característica Free/Premium pertence ao mapa.

Exemplo:

```text
Dust II → FREE
Inferno → FREE
Mirage → PREMIUM
Ancient → PREMIUM
```

---

## `lineups`

Tabela central do produto.

Principais campos:

```text
id
map_id
name
side
region
utility_type
description
position
aim
throw_type
keywords
result_image_url
execution_media_url
execution_media_type
is_active
created_at
updated_at
```

Valores oficiais:

### Side

```text
TR
CT
```

### Region

```text
A
B
MID
```

### Utility type

```text
SMOKE
FLASH
MOLOTOV
HE
```

### Keywords

Campo utilizado para auxiliar a busca.

Exemplo:

```text
jungle, palace, tetris, a
```

Isso permite encontrar uma lineup mesmo quando o termo pesquisado não está exatamente no nome.

---

## `premium_purchases`

Responsável pelas compras únicas do Premium.

Principais campos:

```text
id
user_id
status
provider
provider_payment_id
purchased_at
created_at
updated_at
```

Status definidos:

```text
PENDING
PAID
REFUNDED
```

O Premium não possui `expires_at`, `plan`, `MONTHLY` ou `YEARLY`, pois o modelo é de **pagamento único com acesso permanente** enquanto a compra estiver válida.

O reembolso é tratado manualmente por e-mail e pelo administrador. Após o reembolso, a compra permanece registrada com status `REFUNDED` e o acesso Premium é revogado pelo painel administrativo.

## `reports`

Responsável pelas denúncias de lineups.

Principais campos:

```text
id
lineup_id
user_id
reason
comment
status
created_at
updated_at
```

Status:

```text
PENDING
RESOLVED
DISMISSED
```

---

# 🔍 Busca

A busca será combinada com os filtros estruturados.

Exemplo:

```text
mirage jungle smoke
```

O backend deverá conseguir interpretar os termos e procurar informações relevantes em campos como:

- Nome
- Descrição
- Keywords
- Mapa
- Região
- Tipo
- Lado

A primeira versão não exigirá inteligência artificial.

A busca será baseada em dados estruturados e pesquisa textual.

Posteriormente poderão ser adicionados:

- Sinônimos
- Tolerância a erros
- Relevância
- Ranking dos resultados
- Busca mais inteligente

---

# ⚡ Performance

A experiência deve priorizar rapidez.

Principais decisões:

- Busca direta
- Filtros simples
- Imagens estáticas nas listagens
- GIF somente na página da lineup
- Storage separado do banco
- Índices para consultas frequentes
- Interface mobile-first

O banco terá índices voltados principalmente para consultas como:

```text
map
side
region
utility_type
is_active
```

---

# 🏗️ Arquitetura

A arquitetura planejada do backend:

```text
Frontend
   ↓
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
MySQL
```

Estrutura inicial:

```text
src/
├── controllers/
├── services/
├── repositories/
├── routes/
├── middlewares/
├── models/
├── utils/
├── config/
├── app.ts
└── server.ts
```

### Responsabilidades

**Routes**

Definem os endpoints.

**Controllers**

Recebem requests e retornam responses.

**Services**

Contêm as regras de negócio.

**Repositories**

Responsáveis pelo acesso ao banco.

**Middlewares**

Autenticação, autorização, validações e outras verificações.

---

# 🔌 API inicial

## Autenticação

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

## Mapas

```http
GET /api/maps
GET /api/maps/:slug
```

## Lineups

```http
GET /api/lineups
GET /api/lineups/:id
```

## Reports

```http
POST /api/lineups/:id/reports
```

## Administração

```http
POST   /api/admin/lineups
PUT    /api/admin/lineups/:id
DELETE /api/admin/lineups/:id

GET    /api/admin/reports
PATCH  /api/admin/reports/:id
```

## Premium

```http
POST /api/premium/purchase
GET  /api/premium/me
POST /api/premium/webhook
```

O webhook confirma o pagamento com o gateway e registra a compra. O reembolso não será automatizado pelo sistema no MVP: ele será realizado manualmente pelo administrador e, depois, o Premium será revogado pelo Admin.

A API poderá evoluir conforme a implementação.

---

# 🔐 Segurança

A aplicação deverá considerar:

- Senhas armazenadas somente como hash
- Argon2id ou bcrypt
- Autenticação segura
- Autorização por função
- Validação de entrada
- Proteção contra SQL Injection
- Proteção contra XSS
- CORS configurado
- Rate limiting
- Validação de uploads
- Limitação de tamanho de arquivos
- Variáveis de ambiente para segredos
- Proteção das rotas administrativas
- Validação Premium no backend

A estratégia definitiva de sessão/token será definida durante a implementação da autenticação.

---

# 💵 Monetização

Modelo inicial:

```text
FREE
├── Dust II
├── Inferno
└── anúncios

PREMIUM
├── todos os mapas
├── todas as utilitárias
└── sem anúncios
```

O preço e o gateway de pagamento ainda serão definidos.

Os anúncios nunca deverão interromper a consulta principal.

Não serão utilizados, como regra de UX:

- Pop-ups sobre a lineup
- Vídeos obrigatórios
- Anúncios antes do GIF
- Esperas de 10–30 segundos para acessar uma utilitária

---

# 🎨 Identidade visual

Direção visual:

- Dark
- Profissional
- Gamer
- Minimalista
- Mobile-first
- Interface rápida

Paleta de referência:

```text
Background:       #08090B
Cards:            #15171B
Surface:          #1B1D22
Borders:          #292C32
Text:             #F2F2F2
Secondary text:   #9CA3AF
Accent:           #FF7A00
Hover:            #FF8C1A
```

O **laranja** será utilizado como cor de destaque.

Tipografia sugerida:

**Manrope**

A identidade visual oficial foi definida a partir da referência visual aprovada durante o planejamento.

---

## 🖼️ Referência visual aprovada

A imagem abaixo é a referência visual oficial do frontend definida durante o planejamento do EZSmoke.

![Referência visual do frontend](docs/design/ezsmoke-frontend-reference.png)

Essa referência deve ser preservada durante a implementação. Novos componentes podem ser criados, mas não devem descaracterizar o padrão visual aprovado.

Princípios visuais:

- Dark e profissional
- Estética gamer sem excesso de elementos
- Laranja como destaque
- Busca como elemento central
- Cards objetivos
- Interface mobile-first
- Sem aparência de portal de notícias, curso ou rede social

# 📱 Responsividade

O projeto será **mobile-first**.

No mobile:

- Busca em destaque
- Dois cards de mapas por linha
- Filtros compactos
- Cards de lineup adaptados à largura
- GIF otimizado para visualização
- Navegação simples

No desktop:

- Mais colunas
- Maior aproveitamento horizontal
- Navegação completa
- Conteúdo centralizado

A experiência e o conteúdo devem permanecer consistentes entre dispositivos.

---

# 🚀 MVP

O MVP deverá conter:

### Produto

- [ ] Home
- [ ] Mapas
- [ ] Busca
- [ ] Filtros
- [ ] Cards de lineups
- [ ] Página individual
- [ ] GIF de execução
- [ ] Free/Premium

### Usuários

- [ ] Cadastro
- [ ] Login
- [ ] Sessão persistente
- [ ] Usuário Free
- [ ] Usuário Premium

### Administração

- [ ] Login administrativo
- [ ] CRUD de lineups
- [ ] Upload de mídia
- [ ] Gerenciamento de mapas
- [ ] Reports

### Backend

- [ ] API REST
- [ ] MySQL
- [ ] Autenticação
- [ ] Autorização
- [ ] Validação Premium
- [ ] Busca
- [ ] Filtros

### Infraestrutura

- [ ] Hosting frontend
- [ ] Hosting backend
- [ ] MySQL
- [ ] Storage de mídia
- [ ] Domínio
- [ ] HTTPS

---

# 🔮 Futuro

Funcionalidades que podem ser consideradas posteriormente:

- Favoritos
- Histórico
- Preferências do usuário
- Sincronização entre dispositivos
- Notificações
- Busca avançada
- Sinônimos
- Estatísticas
- Novos benefícios para usuários cadastrados
- Formatos de mídia mais eficientes
- Novos modelos de monetização, se necessários

Essas funcionalidades não fazem parte do MVP atual.

---

# 📍 Princípio principal do projeto

Toda decisão de produto deve respeitar a proposta:

> **EZSmoke não quer ensinar o jogador a jogar CS2.**
>
> **EZSmoke quer ajudá-lo a encontrar rapidamente a utilitária que ele já quer executar.**

### Fluxo ideal

```text
                 EZSMOKE

                    ↓

              🔎 BUSCAR

                    ↓

              ENCONTRAR

                    ↓

             VER A EXECUÇÃO

                    ↓

                EXECUTAR

          Achou. Mirou. Jogou.
```

---

## 🛠️ Próximos passos de desenvolvimento

1. Finalizar e validar o schema SQL
2. Criar o projeto backend
3. Configurar TypeScript + Express
4. Configurar MySQL
5. Implementar repositories
6. Implementar services
7. Implementar controllers
8. Implementar rotas
9. Implementar autenticação
10. Criar frontend
11. Integrar frontend e API
12. Implementar painel administrativo
13. Configurar storage de mídia
14. Implementar Premium/pagamento
15. Testar
16. Deploy

---

## 📄 Documentação

Este README representa as decisões de produto e arquitetura definidas durante a fase inicial de planejamento do EZSmoke.

Decisões futuras devem ser adicionadas à documentação antes de alterar componentes importantes do sistema.

---

**EZSmoke**

> **Achou. Mirou. Jogou.**
