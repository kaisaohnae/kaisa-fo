---
slug: db-02
order: 2
category: db
categoryLabel: DB
title: "MySQL: 웹 서비스에서 가장 흔한 관계형 DB"
summary: "웹에서 가장 흔히 만나는 관계형 DB로, InnoDB와 utf8mb4를 기준으로 인덱스·복제·백업을 정리한다."
publishedAt: 2023-12-20
tags: ["db"]
---

# MySQL: 웹 서비스에서 가장 흔한 관계형 DB

> 요약: 웹에서 가장 흔히 만나는 관계형 DB로, InnoDB와 utf8mb4를 기준으로 인덱스·복제·백업을 정리한다.

---

## 1. 언제 MySQL인가

MySQL은 웹 호스팅과 LAMP 스택에서 오래 쓰인 관계형 데이터베이스다. LAMP는 Linux, Apache, MySQL, PHP의 약자다. 워드프레스, 레거시 PHP, 단순 CRUD API에서 기본값인 경우가 많다. MariaDB는 호환 계열로 함께 언급된다. 엔진·SQL 방언은 버전마다 다르다. 운영 전에 문서를 확인한다.

| 맞는 경우 | 덜 맞는 경우 |
|-----------|--------------|
| 워드프레스·레거시 웹, 호스팅이 MySQL만 줄 때 | 복잡한 분석 SQL·윈도 함수가 핵심일 때 |
| 읽기 위주 단순 CRUD가 많을 때 | JSON·확장·표준 SQL을 한 엔진에서 깊게 쓸 때 (PostgreSQL) |
| RDS MySQL 등 관리형 접근성이 중요할 때 | 키-값 캐시·세션만 필요할 때 (Redis) |
| 팀·외주가 MySQL에 익숙할 때 | 파일 하나·임베디드면 충분할 때 (SQLite) |
| 읽기 레플리카로 조회를 나누고 싶을 때 | 스키마 없는 문서가 매일 바뀔 때 (MongoDB) |

익숙함과 생태계가 강점이다. “Postgres가 더 세다”는 이유만으로 바꾸지 않는다. 호스팅·기존 스키마·운영 경험이 MySQL이면 그대로 잘 쓰는 편이 싸다.

---

## 2. 핵심 개념

**스토리지 엔진**이 테이블의 저장 방식을 정한다. 실무 기본은 **InnoDB**다. 트랜잭션, 외래키, 크래시 복구를 지원한다. MyISAM은 레거시다. 신규 테이블에 쓰지 않는다.

**문자셋**은 글자를 바이트로 저장하는 규칙이다. **`utf8mb4`** 를 쓴다. 옛 이름 `utf8`은 3바이트라 이모지·일부 문자가 깨진다. 콜레이션은 비교·정렬 규칙이다. 팀 표준을 하나 정한다. 예: `utf8mb4_unicode_ci`. `ci`는 case-insensitive, 대소문자를 구분하지 않는다는 뜻이다.

**바이너리 로그(binlog)** 는 변경 이력을 기록한다. 복제(replication)와 시점 복구의 재료다. 복제는 보통 주(primary)에 쓰고, 읽기 레플리카에서 조회를 나눈다.

**인덱스**는 InnoDB에서 클러스터드 PK를 중심으로 잡힌다. PK가 길면 보조 인덱스도 커진다. `BIGINT` PK가 흔한 이유다.

**온라인 DDL**은 Data Definition Language, 스키마 변경 SQL이다. 큰 테이블 `ALTER`는 락이 길 수 있다. 버전·도구(pt-online-schema-change 등) 전략을 배포 전에 정한다.

연결 문자열은 시크릿이다.

```
mysql://APP_USER:YOUR_DB_PASSWORD@db.internal:3306/app
```

`sql_mode`는 느슨하면 잘못된 날짜·잘린 문자열이 조용히 들어간다. 팀 표준을 정하고 세션마다 달라지지 않게 한다.

---

## 3. 최소 예제 — 게시글 테이블

블로그 글 목록을 가정한다. 엔진·문자셋·인덱스를 한 번에 명시한다.

```sql
CREATE TABLE posts (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT UNSIGNED NOT NULL,
  title      VARCHAR(200) NOT NULL,
  body       MEDIUMTEXT NOT NULL,
  status     ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  KEY posts_user_id_idx (user_id),
  KEY posts_created_at_idx (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

```sql
INSERT INTO posts (user_id, title, body, status)
VALUES (1, '첫 글', '본문입니다.', 'published');

SELECT id, title, created_at
FROM posts
WHERE status = 'published'
ORDER BY created_at DESC
LIMIT 20;
```

쿼리가 느리면 `EXPLAIN`을 본다.

```sql
EXPLAIN SELECT id, title FROM posts WHERE user_id = 1 ORDER BY created_at DESC;
```

`type`, `rows`, `Extra`를 본다. `Using filesort`·`Using where`만 있고 인덱스가 안 타면 `WHERE`/`ORDER BY` 컬럼을 점검한다.

피해야 할 습관:

- `SELECT *`를 큰 테이블에서 습관적으로 쓰기
- `WHERE YEAR(created_at) = 2026`처럼 컬럼을 함수로 감싸기. 인덱스가 무력화된다
- PK/UK 없이 테이블을 만들기

---

## 4. 운영 시 주의

**연결.** `max_connections`와 앱 풀 크기를 맞춰 본다. 연결이 많다고 처리량이 늘지 않는다. 대기만 늘 수 있다. InnoDB 버퍼 풀(innodb_buffer_pool_size)은 자주 읽는 데이터가 메모리에 머물게 한다. 관리형이면 인스턴스 클래스와 함께 본다.

**백업.** 논리 덤프는 `mysqldump`다. 운영은 스냅샷 + binlog로 시점 복구를 검토한다. RDS면 자동 백업 보존 기간을 합의한다. 덤프만 있고 복원 테스트가 없으면 사고로 친다.

**복제.** 읽기 레플리카는 지연(replication lag)이 있다. “방금 쓴 글”을 레플리카에서 바로 읽으면 빈 결과가 날 수 있다. 쓰기 직후 읽기는 주로 보낸다.

**문자셋.** 연결·테이블·컬럼이 섞이면 이모지만 깨지는 사고가 난다. 클라이언트까지 `utf8mb4`로 통일한다.

**보안.** 앱 계정에 `GRANT ALL`을 주지 않는다. 필요한 DB·테이블만. 3306을 `0.0.0.0/0`으로 열지 않는다. 비밀번호는 `YOUR_DB_PASSWORD`처럼 시크릿으로 주입한다.

**마이그레이션.** 피크 시간에 큰 `ALTER`를 돌리지 않는다. 락·복제 지연을 배포 런북에 적는다.

**비용.** 관리형은 인스턴스·스토리지·백업·읽기 레플리카가 각각 돈이다. 개발 인스턴스는 밤낮 켜 두지 않는다. 슬로우 로그를 끄지 않는다. 인덱스 없이 풀스캔하면 CPU와 IOPS가 같이 오른다.

**관측.** `SHOW PROCESSLIST`로 긴 쿼리를 본다. `performance_schema` 또는 슬로우 쿼리 로그 임계값(초)을 합의한다. 잠금 대기가 길면 트랜잭션을 짧게 나눈다.

앱 계정 예. 호스트는 앱이 붙는 주소만.

```sql
CREATE USER 'app_user'@'10.0.%' IDENTIFIED BY 'YOUR_DB_PASSWORD';
GRANT SELECT, INSERT, UPDATE, DELETE ON app.* TO 'app_user'@'10.0.%';
FLUSH PRIVILEGES;
```

`%`만으로 전 구간을 열지 않는다. RDS면 마스터로 사용자를 만들고, 보안 그룹이 나머지 경계를 맡는다.

**흔한 실수.** `utf8`과 `utf8mb4` 혼용, PK 없는 테이블, `SELECT *`로 큰 TEXT를 목록에 싣기, 레플리카를 “즉시 일관”으로 가정하기. 네 가지가 장애의 대부분이다.

---

## 5. 정리

MySQL은 익숙함과 호스팅 접근성이 강점이다. **InnoDB + utf8mb4 + 인덱스 설계**만 지켜도 실수 대부분이 줄어든다. 복제는 지연을 전제로 쓰고, 백업은 복원까지 연습한다.

### 체크리스트

- [ ] 테이블 엔진을 InnoDB로 둔다. 트랜잭션·복구가 기본이다.
- [ ] 문자셋을 `utf8mb4`로 통일한다. `utf8` 3바이트는 이모지에서 깨진다.
- [ ] `EXPLAIN`으로 목록·상세 쿼리를 한 번씩 본다. 인덱스가 안 타면 트래픽과 함께 죽는다.
- [ ] binlog 또는 관리형 자동 백업을 켜고 복원을 연습한다.
- [ ] 앱 계정 권한과 3306 접근 범위를 최소로 줄인다.

`GRANT` 후 `SHOW GRANTS FOR 'app_user'@'10.0.%'`로 실제 권한을 확인한다. 마이그레이션 전용 사용자와 런타임 사용자를 나누면 `DROP` 실수가 줄어든다.

### 연습

1. 위 `posts` 테이블을 만들고 글 열 건을 넣는다.
2. `user_id` 조건 조회에 `EXPLAIN`을 붙여 `type`을 확인한다.
3. `mysqldump`로 덤프한 뒤 다른 스키마에 복원해 건수를 비교한다.
