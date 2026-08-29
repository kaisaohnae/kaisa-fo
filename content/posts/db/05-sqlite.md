---
slug: db-05
order: 5
category: db
categoryLabel: DB
title: "SQLite: 파일 하나로 충분한 임베디드 SQL"
summary: "서버 없이 파일 하나로 SQL을 쓰는 임베디드 DB로, 언제 충분하고 어디서 한계가 나는지를 정리한다."
publishedAt: 2025-04-29
tags: ["db"]
---

# SQLite: 파일 하나로 충분한 임베디드 SQL

> 요약: 서버 없이 파일 하나로 SQL을 쓰는 임베디드 DB로, 언제 충분하고 어디서 한계가 나는지를 정리한다.

---

## 1. 언제 SQLite인가

SQLite는 별도 서버 프로세스가 없다. 라이브러리가 **파일 하나**를 데이터베이스로 연다. 설치·계정·포트가 없다. “서버 설치 없이 SQL”이 필요하면 최우선 후보다.

작다는 뜻이 아니다. 임베디드 관계형 엔진이다. 모바일, 데스크톱, CLI, 테스트, 소규모 단일 서버 웹까지 실제 제품에 쓰인다.

| 맞는 경우 | 아닌 경우 |
|-----------|-----------|
| 데스크톱·모바일·CLI 로컬 저장 | 여러 서버가 같은 DB 파일을 동시에 쓸 때 |
| 프로토타입, 테스트 픽스처 | 높은 동시 쓰기 TPS가 필요할 때 |
| 읽기 위주 소규모 단일 인스턴스 | 운영급 HA·자동 페일오버가 필요할 때 |
| 엣지·임베디드, 오프라인 우선 앱 | 중앙 관리형 멀티테넌트 DB |
| CI에서 마이그레이션을 파일로 검증할 때 | 팀 전원이 원격 접속해 같은 DB를 쓸 때 |

“일단 Postgres로 시작”이 습관인 팀도 많다. 단일 노드·배포 단위가 파일과 같으면 SQLite가 운영이 더 단순하다. 반대로 **수평 확장하는 API 서버 여러 대**가 같은 파일을 마운트하면 깨진다.

---

## 2. 핵심 개념

**파일 = 데이터베이스.** `app.db` 하나가 테이블·인덱스·WAL 친구 파일을 포함한다. 경로와 권한·백업이 곧 운영이다.

**동적 타입.** 컬럼에 INTEGER를 선언해도 다른 타입을 넣을 수 있다. 엔진은 관대하다. 앱과 CHECK 제약으로 규약을 지키는 편이 안전하다.

**WAL.** Write-Ahead Log, 미리 쓰기 로그다. `journal_mode=WAL`이면 읽기와 쓰기가 덜 막힌다. 기본 DELETE 저널보다 동시성에 유리한 경우가 많다. WAL 모드면 `-wal`, `-shm` 파일이 옆에 생긴다. 복사할 때 셋 다 필요하거나, 백업 API를 쓴다.

**쓰기 락.** 한 시점에 쓰기 트랜잭션은 사실상 하나다. 읽기는 여러 개 가능하다. 다중 서버가 네트워크 파일 시스템(NFS 등) 위 같은 파일을 쓰면 잠금이 실패한다. 지원하지 않는다고 보는 편이 맞다.

**외래키는 기본이 꺼져 있다.** 연결마다 `PRAGMA foreign_keys = ON`을 켠다. ORM이 켜 주는지도 확인한다.

**트랜잭션**은 `BEGIN` / `COMMIT`이다. 여러 `INSERT`를 한 트랜잭션에 넣으면 쓰기가 훨씬 빠르다. 한 행마다 커밋하면 디스크 동기화 비용이 반복된다.

`INTEGER PRIMARY KEY`는 곧 ROWID다. 별도 UUID 문자열 PK는 인덱스가 커진다. 외부 공개 id가 필요하면 별 컬럼을 둔다.

---

## 3. 최소 예제 — 메모 앱

로컬 메모 저장을 가정한다.

```bash
sqlite3 app.db
```

```sql
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
PRAGMA busy_timeout = 5000;

CREATE TABLE notes (
  id         INTEGER PRIMARY KEY,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX notes_created_at_idx ON notes (created_at);

INSERT INTO notes (title, body) VALUES ('회의', '다음 주 배포 일정 확인');

SELECT id, title, created_at FROM notes ORDER BY created_at DESC;
```

앱 연결 예(의사 코드):

```python
import sqlite3

conn = sqlite3.connect("app.db")
conn.execute("PRAGMA foreign_keys = ON")
conn.execute("PRAGMA journal_mode = WAL")
conn.row_factory = sqlite3.Row
```

컨테이너·서버리스라면 파일 위치를 고정한다. 이미지 레이어 안 `app.db`는 재배포 때 사라진다. 볼륨 또는 객체 스토리지 동기화(운영 난이도 상승)를 전제로 둔다.

마이그레이션은 파일 스키마 버전 테이블을 두거나, Prisma·Drizzle처럼 SQLite를 지원하는 도구를 쓴다.

---

## 4. 운영 시 주의

**연결.** 요청마다 새 연결을 열어도 부담은 작은 편이다. 다만 쓰기 경합이 있으면 `SQLITE_BUSY`가 난다. `busy_timeout`을 두고, 긴 쓰기는 짧게 나눈다. 웹 서버 워커가 많으면 쓰기가 줄을 선다. 그때가 Postgres/MySQL로 옮길 신호다.

**백업.** 실행 중에 `app.db`만 복사하면 WAL과 어긋날 수 있다. `sqlite3 app.db ".backup backup.db"` 또는 `VACUUM INTO 'backup.db'`를 쓴다. Litestream 등으로 S3에 복제하는 운영도 있다. 복원 후 `PRAGMA integrity_check`를 한 번 돌린다.

**배포.** 다중 인스턴스가 같은 파일을 쓰지 않는다. 읽기 전용 레플리카를 파일 복사로 흉내 내는 패턴은 지연을 감수한다. HA가 필요하면 서버형 DB로 옮긴다.

**보안.** 파일 권한이 곧 접근 권한이다. 웹 루트에 `app.db`를 두지 않는다. 다운로드되면 전체가 유출된다. 암호화가 필요하면 SQLCipher 등 확장 또는 OS 디스크 암호화를 검토한다.

**디스크.** WAL이 안 체크포인트되면 파일이 커진다. 주기적 체크포인트와 디스크 용량 알람을 둔다.

**이동.** 나중에 Postgres로 옮길 수 있다. 다만 타입·`datetime` 문자열·부분 인덱스 문법이 다르다. “언젠가 이전”을 가정하면 앱의 SQL을 방언에 덜 묶는 편이 낫다. 지금은 SQLite가 맞으면 맞다고 쓴다.

**테스트.** 메모리 DB(`:memory:`)는 연결마다 비어 있다. 마이그레이션을 테스트마다 적용한다. 파일 DB 픽스처는 CI 워크스페이스에 남기지 않게 지운다.

옮겨야 할 신호는 대체로 이렇다. 쓰기 대기 큐가 상시 있다. 서버를 두 대로 늘려야 한다. 백업·페일오버 SLA가 파일 복사로 안 된다. 그때 Postgres나 MySQL로 간다. 스키마와 쿼리가 단순하면 이전이 덜 아프다.

**흔한 실수.** Docker 이미지 안에 DB 파일을 굽기, NFS 위에 SQLite, `PRAGMA foreign_keys`를 ORM이 켠 줄 알고 넘어가기. 세 가지가 데이터 유실로 이어진다.

---

## 5. 정리

SQLite는 작은 DB가 아니라 **임베디드 관계형 엔진**이다. 경계(단일 쓰기 주체, 파일 위치, 백업 방법)만 지키면 운영이 매우 단순해진다. 서버 여러 대가 같은 파일을 쓰는 순간부터는 다른 도구다.

### 체크리스트

- [ ] `PRAGMA foreign_keys = ON`을 연결마다 켠다. 기본값은 꺼져 있다.
- [ ] 동시 읽기가 있으면 WAL을 검토한다. 기본 저널은 읽기가 더 자주 막힌다.
- [ ] 실행 중 파일 복사 대신 `.backup` / `VACUUM INTO`를 쓴다. 깨진 복사는 복구가 아니다.
- [ ] DB 파일을 웹 공개 경로와 이미지 레이어 밖에 둔다.
- [ ] 인스턴스가 둘 이상이면 공유 파일 SQLite를 포기한다. 잠금이 네트워크에서 깨진다.

### 연습

1. `notes` 테이블을 만들고 세 건을 넣은 뒤 `ORDER BY created_at` 목록을 출력한다.
2. WAL 모드에서 `.backup`으로 복사한 파일을 열어 건수가 같은지 확인한다.
3. 두 프로세스가 동시에 `INSERT`할 때 `busy_timeout` 유무 차이를 관찰한다.

버전 테이블로 마이그레이션을 남기는 최소 예다.

```sql
CREATE TABLE schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

앱이 기동할 때 `version`을 보고 `ALTER TABLE`을 순서대로 적용한다. 파일 DB라도 스키마 이력은 텍스트로 남긴다. 운영자가 `sqlite3`로 손으로만 바꾸면 다음 배포가 깨진다.

동시 읽기가 많은 정적 사이트 생성기·분석 잡은 SQLite가 잘 맞는다. 쓰기를 한 프로세스에 모으면 된다. “웹 워커 8개가 같은 파일에 INSERT”는 설계가 틀린 것이다. 그때는 큐를 앞에 두거나 서버형 DB로 간다.
