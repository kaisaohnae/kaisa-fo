---
slug: wpf-06
order: 6
category: wpf
categoryLabel: WPF
title: "WPF 앱 실무 체크리스트"
summary: "MVVM 경계·성능·예외·배포·UX까지, WPF 앱을 내보내기 전에 항목마다 이유를 붙여 확인하는 실무 체크리스트다."
publishedAt: 2025-08-11
tags: ["wpf"]
---

# WPF 앱 실무 체크리스트

> 요약: MVVM 경계·성능·예외·배포·UX까지, WPF 앱을 내보내기 전에 항목마다 이유를 붙여 확인하는 실무 체크리스트다.

---

## 1. 아키텍처

- [ ] ViewModel이 `Window`/`MessageBox`/`OpenFileDialog`를 직접 호출하지 않는다 — UI 타입이 섞이면 테스트를 위해 창을 띄워야 한다.
- [ ] 액션은 `ICommand`/`[RelayCommand]`로 노출한다 — 코드비하인드 `Click`에 저장이 있으면 책임이 뷰에 붙는다.
- [ ] 대화상자·파일·설정은 서비스 인터페이스로 감싼다 — 구현만 갈아끼우면 CI에서 확인/취소를 시뮬레이션할 수 있다.
- [ ] `Views` / `ViewModels` / `Services` / `Models` 폴더를 일관되게 쓴다 — 창 코드에 도메인 로직이 쌓이면 찾기 어렵다.
- [ ] DataContext는 화면당 하나의 ViewModel을 루트로 둔다 — 컨트롤마다 다른 소스를 수동 대입하면 바인딩 오류를 못 본다.

---

## 2. 바인딩·상태

- [ ] 속성 변경에 `INotifyPropertyChanged` 또는 `[ObservableProperty]`가 있다 — 알림이 없으면 소스는 바뀌고 화면은 옛 값이다.
- [ ] 목록은 `ObservableCollection<T>`다 — `List<T>.Add`는 UI에 추가분을 알리지 않는다.
- [ ] 목록은 `ItemsSource` + `DataTemplate` + 알림 가능한 항목 객체다 — 행을 `string`만 쓰면 행 내용 변경이 화면에 반영되지 않는다.
- [ ] 백그라운드 스레드에서 컬렉션을 바꾸지 않는다 — UI 스레드가 아니면 `NotSupportedException`이 난다.
- [ ] 변환기·ViewModel에 `Visibility`/`Brush`를 남발하지 않는다 — UI 타입이 VM에 들어가면 재사용·테스트가 웹과 무관해진다.

---

## 3. 성능

- [ ] 큰 `ListBox`/`DataGrid`에서 가상화가 켜져 있는지 확인한다 — 가상화가 꺼지면 행 DOM(비주얼)이 모두 생긴다.
- [ ] 무거운 `IValueConverter`와 과도한 `OneWayToSource` 루프를 점검한다 — 변환이 렌더마다 파일을 읽으면 입력이 버벅인다.
- [ ] 이미지·아이콘 해상도를 창 크기에 맞게 줄인다 — 4K PNG를 툴바에 넣으면 메모리만 커진다.
- [ ] 디스크·HTTP는 `async` 명령으로 두고 UI 스레드를 막지 않는다 — `Thread.Sleep`/`GetAwaiter().GetResult()`는 창이 하얗게 언다.
- [ ] `Binding` 오류를 출력 창에서 없앤다 — 잘못된 Path는 예외 없이 빈 화면만 남긴다.

---

## 4. 안정성

- [ ] `App` 도메인 예외(`DispatcherUnhandledException` 등)를 로그로 남긴다 — 처리 안 된 예외는 프로세스만 죽고 원인은 사용자 PC에 없다.
- [ ] 저장·로드 실패를 대화상자 서비스로 알린다 — 실패를 `catch`만 하면 사용자는 성공으로 안다.
- [ ] 설정 파일에 버전을 두고 마이그레이션한다 — 필드가 빠지면 구버전 JSON이 역직렬화에 실패한다.
- [ ] 종료 시 미저장 변경을 `Confirm`으로 묻는다 — OS 종료와 창 닫기를 같은 경로로 태운다.

---

## 5. 배포

- [ ] 대상 TFM이 `net8.0-windows` / `net9.0-windows` 등 실제 설치 환경과 같다 — 프레임워크 의존 배포인데 런타임이 없으면 앱이 안 뜬다.
- [ ] self-contained vs framework-dependent를 명시한다 — 용량과 오프라인 설치 요구가 갈린다.
- [ ] MSIX 또는 설치 프로그램에 코드 서명을 검토한다 — 미서명 exe는 SmartScreen에 막힌다.
- [ ] 환경별 설정(로그 경로, API 주소)을 빌드 구성으로 나눈다 — 개발 URL이 고객 PC로 나가면 장애다.
- [ ] 자동 업데이트 정책(없음/사이드카/스토어)을 문서화한다 — 구버전 클라이언트가 API와 어긋나기 쉽다.

---

## 6. UX

- [ ] Tab 순서가 읽기 순서와 같다 — `TabIndex`가 제각각이면 키보드만으로 저장에 못 간다.
- [ ] `MinWidth`/`MinHeight`와 DPI 스케일을 실제 모니터에서 본다 — 125%에서 버튼이 잘리면 현장 PC와 다르다.
- [ ] 기본 버튼(`IsDefault`)과 취소(`IsCancel`)를 폼에 둔다 — Enter/Esc가 아무 동작도 안 하면 데스크톱 습관과 어긋난다.
- [ ] 고대비·다크 테마를 쓸 거면 브러시를 리소스 키로만 참조한다 — 하드코드 `#FFFFFF`는 다크에서 글자가 사라진다.

---

## 정리

WPF 품질은 컨트롤 개수가 아니라 **MVVM 규율과 배포 체크리스트를 끝까지 지키는 일**이다. 항목을 건너뛸 때는 티켓에 이유를 남긴다.
