---
slug: laravel-04
order: 4
category: laravel
categoryLabel: Laravel
title: "Validation, Form Request, API Resource"
summary: "들어오는 값은 Form Request로 검증하고, 나가는 JSON은 API Resource로 정해 두면 컨트롤러가 얇아진다."
publishedAt: 2024-11-08
tags: ["laravel"]
---

# Validation, Form Request, API Resource

> 요약: 들어오는 값은 Form Request로 검증하고, 나가는 JSON은 API Resource로 정해 두면 컨트롤러가 얇아진다.

---

## 1. 왜 컨트롤러에서 검증을 빼나

검증 규칙이 컨트롤러에 쌓이면 유스케이스가 안 보인다. Laravel은 이 역할을 **Form Request**에 둔다. HTTP 요청 하나를 위한 클래스이며, “이 사용자가 이 동작을 해도 되는지”(`authorize`)와 “필드가 올바른지”(`rules`)를 함께 담는다.

```bash
php artisan make:request StorePostRequest
```

```php
class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Post::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:120'],
            'slug' => ['nullable', 'alpha_dash', 'max:140', 'unique:posts,slug'],
            'body' => ['required', 'string'],
            'tag_ids' => ['array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => '제목을 입력하세요.',
        ];
    }
}
```

```php
public function store(StorePostRequest $request)
{
    $data = $request->validated();
}
```

`authorize()`가 false면 403이다. Policy(모델 권한, 5편)와 연결하면 컨트롤러마다 `if`를 반복하지 않는다.

컨트롤러에서는 `$request->all()`이 아니라 **`validated()`만** 쓴다. all은 검증을 우회한 필드까지 넘긴다.

---

## 2. 자주 쓰는 룰

| 룰 | 의미 |
|----|------|
| `required` / `nullable` | 필수 / 빈 값 허용 |
| `string`, `integer`, `boolean`, `array` | 타입 |
| `email`, `url`, `uuid` | 형식 |
| `max`, `min`, `between` | 길이·범위 |
| `unique:posts,slug` | 유일 |
| `exists:tags,id` | FK가 실제로 있음 |
| `confirmed` | `password_confirmation`과 같음 |
| `Rule::enum(PostStatus::class)` | Enum 값만 |
| `Rule::unique(...)->ignore($id)` | 수정 시 자기 행은 유일에서 제외 |

```php
use Illuminate\Validation\Rule;

'title' => ['required', Rule::unique('posts')->ignore($this->post)],
'status' => ['required', Rule::enum(PostStatus::class)],
```

수정 API에서 `unique`만 넣고 `ignore`를 빼면, 제목을 안 바꿔도 “이미 사용 중”이 난다. 가장 흔한 실수다.

---

## 3. 검증 전후 훅

슬러그를 비워 두면 제목에서 만들고 싶을 때 `prepareForValidation`을 쓴다. 룰만으로 표현하기 어려운 도메인 금지는 `after`에서 메시지를 추가한다.

```php
protected function prepareForValidation(): void
{
    $this->merge([
        'slug' => $this->slug ?: Str::slug($this->title ?? ''),
    ]);
}

public function after(): array
{
    return [
        function (Validator $validator) {
            if ($this->containsBlockedPhrase()) {
                $validator->errors()->add('body', '허용되지 않는 내용입니다.');
            }
        },
    ];
}
```

---

## 4. 검증 실패 JSON

JSON 요청의 기본은 **422**와 `message` + `errors`다. 프론트가 RFC 7807 형태를 원하면 `bootstrap/app.php`의 `withExceptions`에서 한곳에서 맞춘다. 컨트롤러마다 포맷을 바꾸지 않는다.

```php
$exceptions->render(function (ValidationException $e, Request $request) {
    if ($request->is('api/*')) {
        return response()->json([
            'title' => 'Validation Failed',
            'status' => 422,
            'errors' => $e->errors(),
        ], 422);
    }
});
```

---

## 5. API Resource

**API Resource**는 모델(또는 컬렉션)을 JSON 배열로 바꾸는 계층이다. `return $post;`로 Eloquent를 그대로 내보내면 `password` 해시, 내부 플래그, 아직 안 올린 관계가 섞일 수 있다. 응답 계약은 Resource가 지킨다.

```bash
php artisan make:resource PostResource
```

```php
class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'status' => $this->status->value,
            'author' => new UserResource($this->whenLoaded('user')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'published_at' => $this->published_at?->toIso8601String(),
        ];
    }
}
```

`whenLoaded`는 `with('user')`로 이미 불러온 때만 중첩한다. 없으면 키가 빠지므로 N+1도 막고, “항상 전체 그래프”를 강제하지 않는다.

```php
return new PostResource($post->load('user', 'tags'));
return PostResource::collection(Post::with('user')->paginate());
return (new PostResource($post))->response()->setStatusCode(201);
```

페이지네이션을 Resource 컬렉션에 넘기면 `data`·`links`·`meta`가 붙는다. 프론트와 `meta.current_page`를 문서로 맞춰 둔다.

```php
return PostResource::collection(
    Post::published()->with('user')->latest()->paginate(20)
);
```

무한 스크롤 피드면 오프셋보다 커서가 유리하다.

```php
Post::published()->orderBy('id')->cursorPaginate(20);
```

---

## 6. DTO는 선택

검증된 배열이 여러 계층을 지나면 키가 뭔지 잊힌다. 팀이 커지면 readonly DTO나 Spatie Laravel Data가 도움이 된다. 작은 API는 `validated()` 배열로도 충분하다.

```php
readonly class StorePostData
{
    public function __construct(
        public string $title,
        public string $body,
        public array $tagIds = [],
    ) {}

    public static function fromRequest(StorePostRequest $request): self
    {
        $v = $request->validated();

        return new self($v['title'], $v['body'], $v['tag_ids'] ?? []);
    }
}
```

---

## 7. 파일 업로드

```php
'cover' => ['nullable', 'image', 'max:2048', 'dimensions:max_width=2000'],
```

```php
$path = $request->file('cover')->store('covers', 's3');
```

`image` 룰은 MIME를 보지만, 확장자만 믿는 저장은 위험하다. 공개 디스크에 실행 가능한 파일을 두지 말고, 운영에서는 용량·MIME·저장 위치를 추가로 검토한다.

---

## 8. 흔한 실수

- `$request->all()`을 `Post::create`에 그대로 넣는다.
- 모델 JSON을 그대로 반환해 숨겨야 할 컬럼이 나간다.
- 수정 시 `unique`에 `ignore`가 없다.
- `authorize()`를 항상 true로 두고 Policy를 우회한다.
- 생성 응답을 200으로 보낸다. 생성은 201이 계약에 맞다.

---

## 연습

1. `StorePostRequest`와 `UpdatePostRequest`를 나눈다. 수정의 unique에는 ignore를 넣는다.
2. show/index를 `PostResource`로 통일한다.
3. API 검증 실패 JSON 포맷을 `withExceptions`에서 맞춘다.
4. 이미지 필드 검증 후 `storage` 또는 S3에 저장한다.
