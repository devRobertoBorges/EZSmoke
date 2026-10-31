-- =====================================================================
-- EZSmoke — Schema MySQL 8 (revisão v2)
-- =====================================================================
-- Mudanças em relação ao modelo inicial:
--   * lineups: slug, area (callout), click_type, movement, throw_technique
--   * lineups: status DRAFT/PUBLISHED/INACTIVE no lugar de is_active
--   * lineups: execution_media_key (chave no storage, não URL pública)
--   * lineups: mídia padrão em vídeo (MP4/WebM); GIF só como fallback
--   * lineups: índice FULLTEXT para busca
--   * premium_purchases: amount_cents, currency, refunded_at, refunded_by,
--     status FAILED e UNIQUE (provider, provider_payment_id)
--   * nova tabela webhook_events (idempotência dos webhooks)
--   * nova tabela password_reset_tokens (recuperação de senha)
--   * reports: user_id opcional (visitante pode reportar), resolved_by/at
--   * maps: sort_order
--
-- Regra do Premium (fonte única da verdade):
--   Um usuário é Premium se e somente se existir uma linha em
--   premium_purchases com status = 'PAID' para ele.
--   Revogar após reembolso = mudar o status para 'REFUNDED'.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS ezsmoke
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE ezsmoke;

-- ---------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------
CREATE TABLE users (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name              VARCHAR(100) NOT NULL,
  email             VARCHAR(255) NOT NULL,
  password_hash     VARCHAR(255) NOT NULL,
  role              ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
  email_verified_at DATETIME NULL,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- password_reset_tokens
-- O token enviado por e-mail nunca é salvo em texto puro: grava-se
-- apenas o SHA-256 dele. Tokens expiram e só podem ser usados uma vez.
-- ---------------------------------------------------------------------
CREATE TABLE password_reset_tokens (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED NOT NULL,
  token_hash  CHAR(64) NOT NULL,
  expires_at  DATETIME NOT NULL,
  used_at     DATETIME NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_prt_token_hash (token_hash),
  KEY idx_prt_user (user_id),
  CONSTRAINT fk_prt_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- maps
-- Free/Premium pertence ao mapa.
-- ---------------------------------------------------------------------
CREATE TABLE maps (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(50) NOT NULL,
  slug        VARCHAR(50) NOT NULL,
  image_url   VARCHAR(500) NOT NULL,
  is_free     BOOLEAN NOT NULL DEFAULT FALSE,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_maps_slug (slug),
  KEY idx_maps_active_order (is_active, sort_order)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- lineups
-- ---------------------------------------------------------------------
CREATE TABLE lineups (
  id                    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  map_id                INT UNSIGNED NOT NULL,

  -- Identificação (card)
  name                  VARCHAR(100) NOT NULL,
  slug                  VARCHAR(120) NOT NULL,
  side                  ENUM('TR', 'CT') NOT NULL,
  region                ENUM('A', 'B', 'MID') NOT NULL,
  area                  VARCHAR(60) NULL,          -- callout: Jungle, Banana, Long...
  utility_type          ENUM('SMOKE', 'FLASH', 'MOLOTOV', 'HE') NOT NULL,
  description           VARCHAR(255) NOT NULL,
  keywords              VARCHAR(500) NULL,         -- "jungle, palace, tetris"

  -- Execução (página da lineup — bloqueada para quem não tem acesso)
  position              VARCHAR(120) NULL,
  aim                   VARCHAR(255) NULL,
  click_type            ENUM('LEFT', 'RIGHT', 'BOTH') NOT NULL DEFAULT 'LEFT',
  movement              ENUM('STANDING', 'CROUCHING', 'WALKING', 'RUNNING') NOT NULL DEFAULT 'STANDING',
  throw_technique       ENUM('NORMAL', 'JUMPTHROW') NOT NULL DEFAULT 'NORMAL',

  -- Mídia
  result_image_url      VARCHAR(500) NULL,         -- prévia estática pública (listagem)
  execution_media_key   VARCHAR(500) NULL,         -- chave no storage; URL é gerada pelo backend
  execution_media_type  ENUM('MP4', 'WEBM', 'GIF') NULL,

  -- Publicação
  status                ENUM('DRAFT', 'PUBLISHED', 'INACTIVE') NOT NULL DEFAULT 'DRAFT',

  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_lineups_map_slug (map_id, slug),

  -- Consulta principal: mapa + publicadas + filtros combináveis
  KEY idx_lineups_filters (map_id, status, side, region, utility_type),
  -- Busca global por tipo (sem mapa definido)
  KEY idx_lineups_status_type (status, utility_type),

  -- Busca textual. Termos curtos (A, B, TR, CT) não entram aqui:
  -- são interpretados antes como filtros estruturados.
  FULLTEXT KEY ft_lineups_search (name, area, description, keywords),

  CONSTRAINT fk_lineups_map
    FOREIGN KEY (map_id) REFERENCES maps (id) ON DELETE RESTRICT
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- premium_purchases
-- Pagamento único. Premium = existe compra PAID.
-- ---------------------------------------------------------------------
CREATE TABLE premium_purchases (
  id                    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id               INT UNSIGNED NOT NULL,
  status                ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
  provider              VARCHAR(30) NOT NULL,      -- ex.: mercadopago, stripe
  provider_payment_id   VARCHAR(100) NULL,         -- preenchido quando o gateway devolve o ID
  amount_cents          INT UNSIGNED NOT NULL,     -- valor efetivamente cobrado
  currency              CHAR(3) NOT NULL DEFAULT 'BRL',
  purchased_at          DATETIME NULL,             -- quando virou PAID
  refunded_at           DATETIME NULL,
  refunded_by           INT UNSIGNED NULL,         -- admin que revogou
  refund_note           VARCHAR(255) NULL,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  -- Impede registrar o mesmo pagamento duas vezes (webhook reenviado)
  UNIQUE KEY uq_pp_provider_payment (provider, provider_payment_id),
  KEY idx_pp_user_status (user_id, status),

  CONSTRAINT fk_pp_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT,
  CONSTRAINT fk_pp_refunded_by
    FOREIGN KEY (refunded_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- webhook_events
-- Registro dos eventos recebidos do gateway. O UNIQUE garante que um
-- evento reenviado não seja processado duas vezes.
-- ---------------------------------------------------------------------
CREATE TABLE webhook_events (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  provider      VARCHAR(30) NOT NULL,
  event_id      VARCHAR(100) NOT NULL,
  event_type    VARCHAR(60) NOT NULL,
  payload       JSON NOT NULL,
  processed_at  DATETIME NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_webhook_provider_event (provider, event_id)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- reports
-- Visitantes também podem reportar (user_id opcional).
-- O endpoint precisa de rate limit.
-- ---------------------------------------------------------------------
CREATE TABLE reports (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  lineup_id    INT UNSIGNED NOT NULL,
  user_id      INT UNSIGNED NULL,
  reason       ENUM('NOT_WORKING', 'WRONG_MEDIA', 'WRONG_INFO', 'OTHER') NOT NULL,
  comment      VARCHAR(500) NULL,
  status       ENUM('PENDING', 'RESOLVED', 'DISMISSED') NOT NULL DEFAULT 'PENDING',
  resolved_by  INT UNSIGNED NULL,
  resolved_at  DATETIME NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY idx_reports_status_created (status, created_at),
  KEY idx_reports_lineup (lineup_id),

  CONSTRAINT fk_reports_lineup
    FOREIGN KEY (lineup_id) REFERENCES lineups (id) ON DELETE CASCADE,
  CONSTRAINT fk_reports_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT fk_reports_resolved_by
    FOREIGN KEY (resolved_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE = InnoDB;

-- =====================================================================
-- Seed inicial de mapas (imagens são placeholders)
-- =====================================================================
INSERT INTO maps (name, slug, image_url, is_free, sort_order) VALUES
  ('Dust II',  'dust2',    '/maps/dust2.webp',    TRUE,  1),
  ('Inferno',  'inferno',  '/maps/inferno.webp',  TRUE,  2),
  ('Mirage',   'mirage',   '/maps/mirage.webp',   FALSE, 3),
  ('Nuke',     'nuke',     '/maps/nuke.webp',     FALSE, 4),
  ('Vertigo',  'vertigo',  '/maps/vertigo.webp',  FALSE, 5),
  ('Ancient',  'ancient',  '/maps/ancient.webp',  FALSE, 6),
  ('Anubis',   'anubis',   '/maps/anubis.webp',   FALSE, 7),
  ('Overpass', 'overpass', '/maps/overpass.webp', FALSE, 8);

-- =====================================================================
-- Consultas de referência
-- =====================================================================

-- O usuário é Premium?
-- SELECT EXISTS (
--   SELECT 1 FROM premium_purchases
--   WHERE user_id = ? AND status = 'PAID'
-- ) AS is_premium;

-- Página do mapa com filtros opcionais + busca textual
-- SELECT l.id, l.slug, l.name, l.side, l.region, l.area, l.utility_type,
--        l.description, l.result_image_url
-- FROM lineups l
-- WHERE l.map_id = ?
--   AND l.status = 'PUBLISHED'
--   AND (? IS NULL OR l.side = ?)
--   AND (? IS NULL OR l.region = ?)
--   AND (? IS NULL OR l.utility_type = ?)
--   AND (? IS NULL OR MATCH (l.name, l.area, l.description, l.keywords)
--                     AGAINST (? IN BOOLEAN MODE))
-- ORDER BY l.name;

-- Revogar Premium após reembolso manual
-- UPDATE premium_purchases
-- SET status = 'REFUNDED', refunded_at = NOW(), refunded_by = ?, refund_note = ?
-- WHERE id = ? AND status = 'PAID';
