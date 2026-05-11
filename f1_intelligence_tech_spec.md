# F1 Intelligence Dataset & Claim Tracking Platform

**Версия:** 0.1  
**Дата:** 2026-05-07  
**Стек:** Angular + NestJS + Prisma + PostgreSQL  
**Назначение:** fullstack-платформа для сбора, разметки, проверки и анализа новостей, слухов, инсайдов и заявлений по Формуле‑1 с учётом исторической точности источников.

---

## 1. Краткое описание проекта

Цель проекта — создать систему, которая позволяет собирать информацию по Формуле‑1: новости, инсайды, слухи, заявления пилотов, глав команд, журналистов, FIA, команд и других источников.

Главная идея: хранить не просто статьи или новости, а **проверяемые утверждения** — `Claim`.

Пример:

```text
Инсайдер X заявил, что Team A использует спорную технологию в заднем крыле.
```

В системе это должно стать сущностью:

```text
Claim: Team A использует спорную технологию в заднем крыле
Source: Insider X
Status: unconfirmed
Claim type: technical_illegality
Published at: 2026-05-07
Resolution: pending
```

Если через какое-то время FIA, команда, журналисты или другие источники подтверждают или опровергают это утверждение, claim получает новый статус:

```text
Status: confirmed / refuted / partially_confirmed / expired / unverifiable
Resolved at: 2026-07-12
Evidence: FIA technical directive / official team statement / journalist report
```

На основе истории таких утверждений система должна рассчитывать **репутацию источников**:

- кто насколько точен в целом;
- кто точен в driver market;
- кто точен в технических слухах;
- кто часто ошибается в обвинениях;
- кто первым сообщает информацию, которая потом подтверждается.

---

## 2. Основные задачи системы

Система должна решать следующие задачи:

1. **Сбор информации**
   - новости;
   - статьи;
   - интервью;
   - посты;
   - инсайды;
   - слухи;
   - заявления пилотов;
   - заявления глав команд;
   - официальные заявления FIA/F1/команд.

2. **Разметка данных**
   - выделение пилотов;
   - выделение команд;
   - определение типа утверждения;
   - определение темы;
   - определение статуса;
   - определение уровня чувствительности;
   - определение источника.

3. **Отслеживание жизненного цикла claim**
   - когда утверждение появилось;
   - кто его сделал;
   - когда его можно будет проверить;
   - какие доказательства появились позже;
   - подтвердилось ли утверждение;
   - было ли оно опровергнуто;
   - стало ли оно устаревшим или непроверяемым.

4. **Оценка источников**
   - общий reliability score;
   - score по категориям;
   - история подтверждённых и опровергнутых заявлений;
   - учёт частичных подтверждений;
   - учёт отложенной проверки.

5. **Подготовка данных для LLM/RAG**
   - база знаний для F1-ассистента;
   - датасеты для классификации;
   - датасеты для extraction;
   - датасеты для chat fine-tuning;
   - eval dataset для проверки качества ответов.

---

## 3. Что система не делает в MVP

В первой версии не нужно делать:

- автоматическое обучение LLM из UI;
- сложную систему ролей и команд;
- оплату и подписки;
- real-time collaboration;
- полноценный crawler для всего интернета;
- поддержку видео/аудио;
- автоматическую юридическую проверку контента;
- автоматическую публикацию выводов.

MVP должен быть сфокусирован на ручном или полуавтоматическом создании качественной базы:

- источники;
- статьи;
- claims;
- evidence;
- deferred verification;
- scoring источников;
- dataset export.

---

## 4. Общая архитектура

```text
Angular UI
  ↓
NestJS API
  ↓
Prisma ORM
  ↓
PostgreSQL
  ↓
Article chunks / embeddings / search
  ↓
RAG / LLM assistant
```

### Основные части

```text
Frontend:
Angular

Backend:
NestJS

ORM:
Prisma

Database:
PostgreSQL

Search:
PostgreSQL full-text search на MVP
pgvector / embeddings — на следующем этапе

LLM layer:
OpenAI / локальная модель / другой LLM-провайдер

Import:
manual import / JSON import / RSS adapter

Export:
JSON / JSONL / CSV
```

---

## 5. Backend-модули NestJS

Рекомендуемая структура backend:

```text
src/
  app.module.ts

  auth/
    auth.module.ts
    auth.service.ts
    auth.controller.ts

  users/
    users.module.ts
    users.service.ts
    users.controller.ts

  sources/
    sources.module.ts
    sources.controller.ts
    sources.service.ts
    dto/

  articles/
    articles.module.ts
    articles.controller.ts
    articles.service.ts
    dto/

  claims/
    claims.module.ts
    claims.controller.ts
    claims.service.ts
    claim-lifecycle.service.ts
    dto/

  evidences/
    evidences.module.ts
    evidences.controller.ts
    evidences.service.ts
    dto/

  claim-reviews/
    claim-reviews.module.ts
    claim-reviews.controller.ts
    claim-reviews.service.ts
    dto/

  source-scores/
    source-scores.module.ts
    source-scores.controller.ts
    source-scores.service.ts
    score-calculation.service.ts

  datasets/
    datasets.module.ts
    datasets.controller.ts
    datasets.service.ts
    dto/

  exports/
    exports.module.ts
    exports.controller.ts
    exports.service.ts

  imports/
    imports.module.ts
    imports.controller.ts
    imports.service.ts

  rag/
    rag.module.ts
    rag.controller.ts
    rag.service.ts
    retrieval.service.ts
    prompt-builder.service.ts

  embeddings/
    embeddings.module.ts
    embeddings.service.ts

  prisma/
    prisma.module.ts
    prisma.service.ts

  common/
    guards/
    filters/
    decorators/
    utils/
```

---

## 6. Основные доменные сущности

### 6.1 Source

`Source` — источник информации.

Примеры:

- FIA;
- Formula1.com;
- команда;
- глава команды;
- пилот;
- инженер;
- журналист;
- инсайдер;
- аккаунт в X/Twitter;
- форум;
- фанатский блог.

Источник может быть официальным, медийным, персональным или неофициальным.

---

### 6.2 Article

`Article` — оригинальный материал.

Это может быть:

- статья;
- пресс-релиз;
- пост;
- заметка;
- интервью;
- summary;
- manually created note.

Важно: для платных или защищённых материалов лучше хранить:

- title;
- url;
- summary;
- extracted claims;
- metadata;
- ссылку на источник.

Полный текст стоит хранить только если это допустимо.

---

### 6.3 Claim

`Claim` — проверяемое утверждение.

Примеры:

```text
Driver X перейдёт в Ferrari в 2027.
Team Y готовит новое днище к Гран-при Испании.
Team Z использует запрещённую гибкость крыла.
FIA рассматривает изменение технического регламента.
```

Claim должен быть достаточно конкретным, чтобы его можно было проверить.

Плохой claim:

```text
В паддоке что-то происходит вокруг Red Bull.
```

Хороший claim:

```text
Red Bull готовит обновление днища к Гран-при Испании 2026.
```

---

### 6.4 Evidence

`Evidence` — доказательство, подтверждение, опровержение или нейтральное обновление по claim.

Примеры:

- official FIA statement;
- official team statement;
- interview;
- technical directive;
- journalist report;
- team denial;
- race weekend observation;
- photo analysis;
- later article.

---

### 6.5 ClaimReview

`ClaimReview` — запланированная или выполненная проверка claim.

Нужна для случаев, когда claim нельзя проверить сейчас, но можно будет проверить позже.

Пример:

```text
Claim: Ferrari привезёт новое днище в Имолу.
Next review: пятница гоночного уикенда в Имоле.
Expected resolution: конец уикенда.
```

---

### 6.6 SourceScore

`SourceScore` — историческая оценка точности источника.

Оценка должна быть не только общей, но и по темам:

```text
overall
driver_market
technical_updates
technical_illegality
team_politics
regulations
race_strategy
```

---

### 6.7 Dataset

`Dataset` — набор данных для обучения, evaluation или RAG.

Типы:

- chat_finetuning;
- classification;
- extraction;
- rag_eval;
- preference.

---

## 7. Статусы Claim

```text
unconfirmed          — неподтверждённое утверждение
watching             — утверждение активно отслеживается
confirmed            — подтверждено
refuted              — опровергнуто
partially_confirmed  — частично подтвердилось
disputed             — есть сильные источники за и против
outdated             — потеряло актуальность
expired              — ожидаемый срок прошёл, подтверждения нет
unverifiable         — невозможно проверить
```

### Важное правило

`unconfirmed` или `watching` не означает, что claim ложный.

Это означает:

```text
Утверждение пока нельзя подтвердить или опровергнуть.
```

Такие claims не должны сильно влиять на рейтинг источника до момента resolution.

---

## 8. Типы Claim

```text
driver_market
technical_update
technical_illegality
regulation_change
team_politics
contract_extension
sponsor_deal
car_performance
race_strategy
management_change
fia_investigation
other
```

---

## 9. Типы источников

```text
official_fia
official_f1
official_team
team_principal
driver
engineer
journalist
reputable_media
insider
social_media
forum
fan_theory
unknown
```

---

## 10. Statement Intent

У claim должно быть поле `statementIntent`, потому что заявление может быть:

```text
informational
prediction
denial
accusation
pr_statement
technical_analysis
political_pressure
```

Это важно, потому что глава команды может делать PR-заявление, которое не является нейтральным фактом.

Пример:

```text
"Our car has no fundamental aerodynamic issue."
```

Позже команда может признать проблему. Это не всегда значит, что источник "ошибся". Возможно, это было PR-заявление.

---

## 11. Legal Sensitivity

Для обвинений в нарушении правил нужен отдельный уровень чувствительности.

```text
normal
medium
high
```

Пример high sensitivity claim:

```text
Team X uses illegal flexible wing technology.
```

Для таких утверждений LLM и UI должны использовать осторожные формулировки:

```text
Это неподтверждённое обвинение, а не установленный факт.
```

---

## 12. Deferred Verification — отложенная проверка

### 12.1 Зачем это нужно

Многие F1-claims нельзя проверить сразу.

Например:

```text
Driver X подпишет контракт с Mercedes на 2027.
```

Сейчас это может быть слух. Проверить можно будет:

- после официального объявления;
- после окончания сезона;
- после дедлайна контрактов;
- после появления нескольких независимых подтверждений.

Поэтому claim должен жить в системе как **pending claim**.

---

### 12.2 Основные поля для отложенной проверки

В `Claim` нужны поля:

```text
expectedResolveAt — когда примерно claim можно будет проверить
nextReviewAt      — когда система должна снова предложить проверить claim
resolvedAt        — когда claim был финально проверен
status            — текущий статус
confidenceCurrent — текущая уверенность
```

---

### 12.3 Пример

```json
{
  "claimText": "Team A uses a controversial rear wing technology",
  "status": "watching",
  "claimType": "technical_illegality",
  "publishedAt": "2026-05-07",
  "expectedResolveAt": "2026-07-31",
  "nextReviewAt": "2026-05-21",
  "confidenceInitial": 0.35,
  "confidenceCurrent": 0.35,
  "resolutionStatus": null
}
```

---

### 12.4 Lifecycle claim

Примеры переходов:

```text
unconfirmed → watching → confirmed
unconfirmed → watching → refuted
unconfirmed → watching → expired
unconfirmed → disputed → partially_confirmed
unconfirmed → watching → unverifiable
```

---

### 12.5 Как выбирать дату проверки

#### Driver market

```text
Claim: Driver X перейдёт в Mercedes в 2027.
```

Проверять:

- через 2 недели;
- после летнего перерыва;
- после окончания сезона;
- после официальных announcement periods;
- когда команда объявит состав.

#### Technical update

```text
Claim: Ferrari привезёт новое днище в Имолу.
```

Проверять:

- в неделю Гран-при;
- после FP1/FP2;
- после технических фото;
- после race weekend.

#### Technical illegality

```text
Claim: Team A использует запрещённую технологию.
```

Проверять:

- после FIA technical directive;
- после протеста другой команды;
- после scrutineering;
- после официального решения FIA;
- после заявления команды.

#### Regulation change

```text
Claim: FIA изменит правила по гибким крыльям.
```

Проверять:

- после заседаний FIA;
- после публикации technical directive;
- после обновления регламента.

---

### 12.6 Что делать, если срок прошёл

Если `expectedResolveAt` прошёл, а claim не подтверждён, система должна предложить пользователю выбрать:

```text
expired
refuted
still watching
partially_confirmed
unverifiable
```

Не каждый просроченный claim является ложным.

Пример:

```text
Driver X ведёт переговоры с Ferrari.
```

Если контракт не подписан, это не обязательно ложь. Возможно, переговоры действительно были.

А вот:

```text
Driver X will be announced by Ferrari before May 1.
```

Если объявления не было, это ближе к `refuted` или `expired`.

---

### 12.7 Влияние на рейтинг источника

Нерешённые claims не должны сильно влиять на score источника.

Рекомендуемая логика:

```text
confirmed            → положительно влияет
partially_confirmed  → частично положительно влияет
refuted              → отрицательно влияет
expired              → слабо отрицательно или нейтрально
unverifiable         → почти не влияет
unconfirmed          → пока не влияет
watching             → пока не влияет
```

---

## 13. Prisma schema draft

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  createdClaims Claim[] @relation("ClaimCreatedBy")
}

enum UserRole {
  ADMIN
  EDITOR
  REVIEWER
  USER
}

model Source {
  id          String     @id @default(uuid())
  name        String
  type        SourceType
  description String?
  websiteUrl  String?
  country     String?
  language    String?
  team        String?

  baseReliability Float?
  isActive        Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  articles Article[]
  claims   Claim[]
  scores   SourceScore[]

  @@index([type])
  @@index([name])
}

enum SourceType {
  official_fia
  official_f1
  official_team
  team_principal
  driver
  engineer
  journalist
  reputable_media
  insider
  social_media
  forum
  fan_theory
  unknown
}

model Article {
  id          String   @id @default(uuid())
  sourceId    String?
  title       String
  url         String?
  language    String?
  publishedAt DateTime?
  importedAt  DateTime @default(now())

  rawText     String?
  summary     String?
  contentHash String?

  metadata    Json?
  entities    Json?

  source      Source? @relation(fields: [sourceId], references: [id])
  claims      Claim[]
  chunks      ArticleChunk[]

  @@index([publishedAt])
  @@index([sourceId])
  @@unique([url])
}

model ArticleChunk {
  id        String   @id @default(uuid())
  articleId String
  text      String
  index     Int
  metadata  Json?

  article   Article @relation(fields: [articleId], references: [id])

  @@index([articleId])
}

model Claim {
  id          String      @id @default(uuid())

  sourceId    String?
  articleId   String?
  createdById String?

  claimText   String
  normalizedText String?

  claimType   ClaimType
  topic       String?
  status      ClaimStatus @default(unconfirmed)

  statementIntent StatementIntent?
  legalSensitivity LegalSensitivity @default(normal)

  publishedAt DateTime?
  firstSeenAt  DateTime @default(now())
  expectedResolveAt DateTime?
  nextReviewAt DateTime?
  resolvedAt DateTime?

  confidenceInitial Float?
  confidenceCurrent Float?
  specificityScore Float?
  originalityScore Float?

  season      Int?
  teams       Json?
  drivers     Json?
  entities    Json?
  tags        Json?

  resolutionSummary String?
  notes             String?

  source      Source?  @relation(fields: [sourceId], references: [id])
  article     Article? @relation(fields: [articleId], references: [id])
  createdBy   User?    @relation("ClaimCreatedBy", fields: [createdById], references: [id])

  evidences   ClaimEvidence[]
  snapshots   ClaimSnapshot[]
  reviews     ClaimReview[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([claimType])
  @@index([status])
  @@index([publishedAt])
  @@index([sourceId])
  @@index([expectedResolveAt])
  @@index([nextReviewAt])
}

enum ClaimType {
  driver_market
  technical_update
  technical_illegality
  regulation_change
  team_politics
  contract_extension
  sponsor_deal
  car_performance
  race_strategy
  management_change
  fia_investigation
  other
}

enum ClaimStatus {
  unconfirmed
  watching
  confirmed
  refuted
  partially_confirmed
  disputed
  outdated
  expired
  unverifiable
}

enum StatementIntent {
  informational
  prediction
  denial
  accusation
  pr_statement
  technical_analysis
  political_pressure
}

enum LegalSensitivity {
  normal
  medium
  high
}

model ClaimEvidence {
  id          String   @id @default(uuid())
  claimId     String

  sourceId    String?
  articleId   String?

  title       String?
  url         String?
  sourceName  String?
  sourceType  SourceType?
  stance      EvidenceStance

  summary     String?
  notes       String?
  publishedAt DateTime?

  reliabilityWeight Float?

  claim       Claim    @relation(fields: [claimId], references: [id])
  source      Source?  @relation(fields: [sourceId], references: [id])
  article     Article? @relation(fields: [articleId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([claimId])
  @@index([stance])
}

enum EvidenceStance {
  supports
  denies
  confirms
  refutes
  neutral
  updates
}

model ClaimSnapshot {
  id        String   @id @default(uuid())
  claimId   String

  status    ClaimStatus
  confidenceCurrent Float?
  snapshotReason String?
  metadata  Json?

  claim     Claim @relation(fields: [claimId], references: [id])

  createdAt DateTime @default(now())

  @@index([claimId])
}

model ClaimReview {
  id          String   @id @default(uuid())
  claimId     String

  reviewAt    DateTime
  status      ReviewStatus @default(pending)

  notes       String?
  result      String?
  checkedById String?

  claim       Claim    @relation(fields: [claimId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([claimId])
  @@index([reviewAt])
  @@index([status])
}

enum ReviewStatus {
  pending
  completed
  skipped
}

model SourceScore {
  id              String   @id @default(uuid())
  sourceId         String
  topic            String

  resolvedCount    Int      @default(0)
  confirmedCount   Int      @default(0)
  partialCount     Int      @default(0)
  refutedCount     Int      @default(0)
  expiredCount     Int      @default(0)
  unverifiableCount Int     @default(0)

  score            Float
  priorScore       Float    @default(0.5)
  priorWeight      Float    @default(5)

  lastCalculatedAt DateTime @default(now())

  source           Source   @relation(fields: [sourceId], references: [id])

  @@unique([sourceId, topic])
  @@index([topic])
}

model Dataset {
  id          String   @id @default(uuid())
  name        String
  description String?
  type        DatasetType
  version     String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  examples   DatasetExample[]
}

enum DatasetType {
  chat_finetuning
  classification
  extraction
  rag_eval
  preference
}

model DatasetExample {
  id         String   @id @default(uuid())
  datasetId  String

  input      Json
  output     Json?
  metadata   Json?
  status     DatasetExampleStatus @default(draft)

  dataset    Dataset @relation(fields: [datasetId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([datasetId])
  @@index([status])
}

enum DatasetExampleStatus {
  draft
  needs_review
  approved
  rejected
  exported
}
```

---

## 14. Расчёт reliability score

### 14.1 Простая формула

```text
score = confirmed_claims / resolved_claims
```

Недостаток: источник с одним верным claim сразу получит 100%.

---

### 14.2 Рекомендуемая формула со сглаживанием

```text
score =
  (confirmedWeight + partialWeight * 0.5 + priorScore * priorWeight)
  /
  (resolvedWeight + priorWeight)
```

Пример:

```text
confirmedWeight = 12
partialWeight = 4
resolvedWeight = 20
priorScore = 0.5
priorWeight = 5

score = (12 + 4 * 0.5 + 0.5 * 5) / (20 + 5)
score = 16.5 / 25
score = 0.66
```

---

### 14.3 Что попадает в расчёт

В расчёт входят:

```text
confirmed
partially_confirmed
refuted
expired
```

Не входят или почти не влияют:

```text
unconfirmed
watching
unverifiable
```

---

### 14.4 Веса статусов

Рекомендуемые веса:

```text
confirmed: 1.0
partially_confirmed: 0.5
refuted: 0
expired: 0.2 или 0.3
unverifiable: не учитывать
unconfirmed: не учитывать
watching: не учитывать
```

---

### 14.5 Claim weight

Не каждый claim должен одинаково влиять на рейтинг.

Факторы:

```text
specificityScore
originalityScore
claimTypeWeight
sourceRoleWeight
legalSensitivity
timeToConfirmation
```

Пример:

```text
claimWeight =
  specificityScore
  * originalityScore
  * claimTypeWeight
  * sourceRoleWeight
```

Пример:

```json
{
  "specificityScore": 0.85,
  "originalityScore": 0.9,
  "claimTypeWeight": 1.0,
  "sourceRoleWeight": 0.8,
  "finalWeight": 0.612
}
```

---

## 15. API endpoints

### 15.1 Sources

```http
GET    /sources
GET    /sources/:id
POST   /sources
PATCH  /sources/:id
DELETE /sources/:id

GET    /sources/:id/scores
GET    /sources/:id/claims
```

Пример создания source:

```json
{
  "name": "Insider X",
  "type": "insider",
  "description": "F1 paddock insider focused on driver market and technical rumors",
  "baseReliability": 0.45
}
```

---

### 15.2 Articles

```http
GET    /articles
GET    /articles/:id
POST   /articles
PATCH  /articles/:id
DELETE /articles/:id

POST   /articles/import
POST   /articles/:id/extract-claims
```

Пример создания article:

```json
{
  "sourceId": "source_uuid",
  "title": "Rumors about Team A rear wing",
  "url": "https://example.com/article",
  "language": "en",
  "publishedAt": "2026-05-07T10:00:00.000Z",
  "summary": "The article discusses paddock rumors about Team A rear wing flexibility.",
  "entities": {
    "teams": ["Team A"],
    "drivers": [],
    "people": ["Insider X"]
  }
}
```

---

### 15.3 Claims

```http
GET    /claims
GET    /claims/:id
POST   /claims
PATCH  /claims/:id
DELETE /claims/:id

POST   /claims/:id/evidence
POST   /claims/:id/resolve
POST   /claims/:id/recalculate-confidence
POST   /claims/:id/schedule-review
GET    /claims/:id/timeline
GET    /claims/due-for-review
```

Пример создания claim:

```json
{
  "sourceId": "source_uuid",
  "articleId": "article_uuid",
  "claimText": "Team A uses an illegal flexible rear wing",
  "claimType": "technical_illegality",
  "status": "watching",
  "statementIntent": "accusation",
  "legalSensitivity": "high",
  "publishedAt": "2026-05-07T10:00:00.000Z",
  "expectedResolveAt": "2026-07-31T00:00:00.000Z",
  "nextReviewAt": "2026-05-21T00:00:00.000Z",
  "specificityScore": 0.85,
  "confidenceInitial": 0.42,
  "confidenceCurrent": 0.42,
  "teams": ["Team A"],
  "drivers": []
}
```

---

### 15.4 Evidence

```http
GET    /claims/:claimId/evidences
POST   /claims/:claimId/evidences
PATCH  /evidences/:id
DELETE /evidences/:id
```

Пример evidence:

```json
{
  "stance": "confirms",
  "sourceType": "official_fia",
  "sourceName": "FIA",
  "title": "FIA technical investigation result",
  "url": "https://example.com/fia-statement",
  "summary": "FIA confirmed that the component violated technical regulations.",
  "publishedAt": "2026-07-12T12:00:00.000Z",
  "reliabilityWeight": 0.95
}
```

---

### 15.5 Claim reviews

```http
GET    /claim-reviews
GET    /claim-reviews/due
POST   /claims/:claimId/reviews
PATCH  /claim-reviews/:id
POST   /claim-reviews/:id/complete
POST   /claim-reviews/:id/skip
```

Пример создания review:

```json
{
  "claimId": "claim_uuid",
  "reviewAt": "2026-05-21T00:00:00.000Z",
  "notes": "Check if FIA or reliable media mention the rear wing issue after the next race weekend."
}
```

---

### 15.6 Source scores

```http
GET    /source-scores
GET    /source-scores/:sourceId
POST   /source-scores/recalculate
POST   /source-scores/recalculate/:sourceId
```

---

### 15.7 Datasets

```http
GET    /datasets
GET    /datasets/:id
POST   /datasets
PATCH  /datasets/:id
DELETE /datasets/:id

POST   /datasets/:id/examples
PATCH  /dataset-examples/:id
DELETE /dataset-examples/:id

POST   /datasets/:id/export
```

---

### 15.8 RAG

```http
POST /rag/ask
POST /rag/search
POST /rag/build-context
```

Пример:

```json
{
  "question": "Можно ли верить слуху, что Team A использует запрещённое заднее крыло?",
  "filters": {
    "teams": ["Team A"],
    "claimTypes": ["technical_illegality"],
    "season": 2026
  }
}
```

---

## 16. Angular UI

### 16.1 Роуты

```text
/
  dashboard

/sources
/sources/new
/sources/:id

/articles
/articles/new
/articles/:id

/claims
/claims/new
/claims/:id
/claims/:id/timeline

/reviews
/reviews/due

/datasets
/datasets/new
/datasets/:id

/rag

/settings
```

---

### 16.2 Структура Angular-приложения

```text
src/app/
  core/
    api/
    auth/
    guards/
    interceptors/
    models/

  shared/
    components/
    pipes/
    utils/

  features/
    dashboard/
    sources/
    articles/
    claims/
    evidences/
    claim-reviews/
    datasets/
    rag/
    settings/

  app.routes.ts
  app.config.ts
```

---

### 16.3 Dashboard

Показывает:

- total claims;
- unresolved claims;
- claims due for review;
- recently confirmed claims;
- recently refuted claims;
- top reliable sources;
- weakest sources;
- claims by category;
- claims by status.

---

### 16.4 Source profile

Страница источника:

```text
Insider X

Overall reliability: 68%
Driver market: 82%
Technical updates: 51%
Technical illegality: 44%

Claims:
✅ Confirmed: 12
🟡 Partially confirmed: 5
❌ Refuted: 8
⏳ Watching: 14
⌛ Expired: 3
```

Таблица:

```text
Claim | Type | Status | Published | Expected resolve | Resolved | Impact
```

---

### 16.5 Claim detail

Страница claim:

```text
Claim:
Team A uses an illegal flexible rear wing

Status:
Watching

Type:
Technical illegality

Legal sensitivity:
High

Source:
Insider X

Initial confidence:
42%

Current confidence:
45%

Expected resolution:
31 July 2026

Next review:
21 May 2026
```

Timeline:

```text
May 7 — Insider X made the claim
May 9 — Journalist Y mentioned similar paddock rumors
May 18 — Team A denied it
June 2 — FIA introduced additional checks
July 12 — FIA published investigation result
```

Кнопки:

```text
[Add evidence]
[Schedule review]
[Mark confirmed]
[Mark refuted]
[Mark partially confirmed]
[Mark expired]
[Mark unverifiable]
```

---

### 16.6 Claim editor

Поля:

```text
Claim text
Source
Article
Claim type
Status
Statement intent
Legal sensitivity
Published date
Expected resolve date
Next review date
Teams
Drivers
Season
Specificity score
Originality score
Initial confidence
Current confidence
Tags
Notes
```

---

### 16.7 Reviews page

Страница проверок:

```text
Due for review

Claim | Source | Type | Review date | Expected resolution | Status | Actions
```

Actions:

```text
[Open claim]
[Add evidence]
[Complete review]
[Skip]
[Reschedule]
```

---

### 16.8 Dataset builder

Для подготовки данных под LLM:

```text
Dataset name
Dataset type:
- chat_finetuning
- classification
- extraction
- rag_eval
- preference

Examples:
- input
- expected output
- metadata
- status
```

Экспорт:

```text
OpenAI JSONL
Generic JSON
CSV
```

---

## 17. Dataset examples

### 17.1 Classification example

```json
{
  "input": "Several paddock sources suggest Driver X is being considered by Mercedes for 2027.",
  "output": {
    "claimType": "driver_market",
    "isRumor": true,
    "teams": ["Mercedes"],
    "drivers": ["Driver X"],
    "season": 2027
  }
}
```

---

### 17.2 Claim extraction example

```json
{
  "input": "Insider X claims Team A may be using an illegal flexible rear wing.",
  "output": {
    "claimText": "Team A may be using an illegal flexible rear wing",
    "claimType": "technical_illegality",
    "status": "unconfirmed",
    "legalSensitivity": "high",
    "teams": ["Team A"]
  }
}
```

---

### 17.3 Chat fine-tuning example

```jsonl
{"messages":[{"role":"system","content":"Ты F1-аналитик. Не выдавай слухи за факты."},{"role":"user","content":"Можно ли верить слуху, что Team A использует запрещённое крыло?"},{"role":"assistant","content":"Пока это неподтверждённое обвинение, а не установленный факт. Источник имеет среднюю общую точность, но по техническим обвинениям его история слабее. Для уверенного вывода нужно официальное решение FIA или подтверждение от нескольких независимых надёжных источников."}]}
```

---

### 17.4 RAG eval example

```json
{
  "question": "Можно ли считать утверждение о запрещённом крыле Team A подтверждённым?",
  "expected_answer": "Нет. Claim имеет статус watching/unconfirmed. Есть supporting evidence от инсайдера, но нет official FIA confirmation.",
  "required_claim_ids": ["claim_uuid"],
  "expected_safety_behavior": "phrase_as_allegation"
}
```

---

## 18. Валидация данных

### Claim validation

Backend должен проверять:

- `claimText` не пустой;
- `claimType` задан;
- `status` задан;
- `confidenceInitial` от 0 до 1;
- `confidenceCurrent` от 0 до 1;
- `specificityScore` от 0 до 1;
- `originalityScore` от 0 до 1;
- для `technical_illegality` по умолчанию `legalSensitivity = high`;
- если `status = confirmed`, желательно иметь evidence со stance `confirms`;
- если `status = refuted`, желательно иметь evidence со stance `refutes`;
- если `expectedResolveAt` задан, он должен быть позже `publishedAt`;
- если `nextReviewAt` задан, он должен быть позже `publishedAt`.

---

### Evidence validation

Backend должен проверять:

- `stance` задан;
- `claimId` задан;
- если `stance = confirms/refutes`, желательно указать `sourceType`;
- official evidence должна иметь высокий `reliabilityWeight`;
- high sensitivity claim нельзя автоматически переводить в `confirmed` без evidence.

---

### SourceScore validation

Backend должен проверять:

- `score` от 0 до 1;
- `topic` уникален для source;
- unresolved claims не учитываются как resolved.

---

## 19. RAG-логика

Для F1-проекта лучше использовать RAG, а не пытаться обучать модель на всех новостях.

Логика ответа:

```text
1. Пользователь задаёт вопрос.
2. Backend определяет entities:
   - team;
   - driver;
   - season;
   - topic;
   - claim type.
3. Система ищет релевантные claims.
4. Система ищет articles и evidence.
5. Система подтягивает source scores.
6. PromptBuilder собирает контекст для LLM.
7. LLM отвечает с разделением:
   - факт;
   - слух;
   - обвинение;
   - подтверждено;
   - опровергнуто;
   - уровень уверенности.
```

---

## 20. Prompt policy для LLM

LLM должна соблюдать правила:

```text
1. Не выдавать слухи за факты.
2. Всегда указывать статус claim.
3. Для обвинений использовать осторожные формулировки.
4. Указывать, если claim неподтверждён.
5. Объяснять, почему источник считается надёжным или ненадёжным.
6. Учитывать историю источника по конкретной категории.
7. Не делать категоричный вывод без official evidence.
8. Если claim в статусе watching, объяснять, когда его можно будет проверить.
9. Если срок проверки прошёл, но resolution нет, говорить, что claim unresolved/expired, а не автоматически ложный.
```

Пример system prompt:

```text
Ты F1-аналитик. Отделяй факты от слухов, обвинений и неподтверждённых заявлений.

Всегда учитывай:
- статус claim;
- дату публикации;
- источник;
- историю точности источника;
- наличие official evidence;
- expectedResolveAt;
- nextReviewAt;
- legalSensitivity.

Если речь об обвинении в нарушении регламента, формулируй это как allegation, пока нет официального подтверждения FIA или другой надёжной evidence.

Если claim нельзя проверить сейчас, объясни, что это pending/watching claim, и укажи, какие события могут подтвердить или опровергнуть утверждение.
```

---

## 21. Импорт данных

В MVP:

```text
1. Manual import
   Пользователь вставляет title, url, summary, raw text.

2. JSON import
   Загрузка JSON-файла со статьями или claims.

3. RSS/import adapter
   Отдельный модуль для источников с RSS.
```

В будущем:

```text
- browser extension;
- Telegram bot для отправки ссылок;
- YouTube transcripts;
- X/Twitter posts;
- automatic claim extraction;
- automatic summary;
- automatic source matching.
```

---

## 22. Экспорт данных

Нужно поддержать:

```text
claims.json
sources.json
dataset.jsonl
rag_eval.json
source_scores.csv
```

Пример RAG export:

```json
{
  "claimId": "claim_uuid",
  "claimText": "Team A uses an illegal flexible rear wing",
  "status": "watching",
  "claimType": "technical_illegality",
  "expectedResolveAt": "2026-07-31T00:00:00.000Z",
  "nextReviewAt": "2026-05-21T00:00:00.000Z",
  "source": {
    "name": "Insider X",
    "type": "insider",
    "scoreForTopic": 0.44
  },
  "evidence": [
    {
      "stance": "supports",
      "summary": "Journalist Y mentioned similar rumors."
    }
  ]
}
```

---

## 23. MVP roadmap

### Этап 1 — Core data model

- Prisma schema;
- PostgreSQL;
- Sources CRUD;
- Articles CRUD;
- Claims CRUD;
- Evidence CRUD;
- базовый Angular UI.

---

### Этап 2 — Claim lifecycle

- claim statuses;
- claim timeline;
- resolve claim action;
- snapshots;
- evidence stance;
- deferred verification;
- claim reviews;
- due review page.

---

### Этап 3 — Source scoring

- score calculation service;
- score by topic;
- source profile page;
- claim impact calculation;
- unresolved claims excluded from score.

---

### Этап 4 — Dataset builder

- dataset CRUD;
- dataset examples;
- validation;
- JSONL export;
- RAG eval export.

---

### Этап 5 — RAG assistant

- article chunks;
- full-text search;
- embeddings;
- semantic search;
- prompt builder;
- ask endpoint;
- Angular chat UI.

---

### Этап 6 — Semi-automation

- article import;
- auto summary;
- auto entity extraction;
- auto claim suggestions;
- reviewer approval flow.

---

## 24. Рекомендуемый первый MVP

Первая полезная версия должна позволять вручную:

1. Создать источник.
2. Добавить статью или заметку.
3. Создать claim.
4. Добавить evidence.
5. Запланировать проверку claim.
6. Обновить статус claim.
7. Посмотреть timeline claim.
8. Пересчитать рейтинг источника.
9. Посмотреть профиль источника.
10. Экспортировать claims/dataset.

---

## 25. Главный принцип продукта

Система не должна отвечать:

```text
"Это правда."
```

Она должна отвечать:

```text
"Это неподтверждённое заявление.
Источник ранее был точен в driver market, но слабее в technical_illegality.
Официального подтверждения FIA нет.
Текущий статус: watching.
Ожидаемая дата проверки: 31 July 2026.
Уровень доверия: низкий/средний."
```

Ценность проекта — не просто собрать новости по Формуле‑1, а построить систему, которая помнит:

- кто что сказал;
- когда сказал;
- насколько конкретно сказал;
- можно ли это проверить сейчас;
- когда это можно будет проверить;
- кто подтвердил или опроверг позже;
- насколько часто источник был прав в прошлом.

Итоговая цель:

```text
F1 intelligence system =
news/rumors/claims database
+ deferred verification
+ source reputation scoring
+ RAG assistant
+ dataset builder for LLM workflows
```

---

## 26. Возможные следующие улучшения

После MVP можно добавить:

- автоматическое извлечение claims из статьи через LLM;
- автоматическое определение команд и пилотов;
- дедупликацию похожих claims;
- claim clustering;
- source originality score;
- browser extension для сохранения материалов;
- Telegram bot для отправки ссылок;
- интеграцию с календарём F1;
- автоматическое создание review tasks перед гоночным уикендом;
- граф связей между источниками, пилотами, командами и claims;
- визуализацию "кто первым сообщил";
- public/private mode для юридически чувствительных claims;
- scoring calibration;
- confidence history chart;
- экспорт в OpenAI JSONL;
- eval runner для проверки качества F1 assistant.
