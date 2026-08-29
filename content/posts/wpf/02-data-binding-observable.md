---
slug: wpf-02
order: 2
category: wpf
categoryLabel: WPF
title: "데이터 바인딩과 ObservableCollection"
summary: "INotifyPropertyChanged와 ObservableCollection으로 값·목록 변경을 화면에 반영하고, DataTemplate로 행 UI를 분리하는 방법을 정리한다."
publishedAt: 2023-09-11
tags: ["wpf"]
---

# 데이터 바인딩과 ObservableCollection

> 요약: INotifyPropertyChanged와 ObservableCollection으로 값·목록 변경을 화면에 반영하고, DataTemplate로 행 UI를 분리하는 방법을 정리한다.

---

## 1. 왜 바인딩인가

WPF 컨트롤에 `textBlock.Text = name`을 매번 대입하면 View와 상태가 섞인다. 바인딩은 **소스 속성 ↔ 컨트롤 속성**을 XAML이 연결한다. 소스가 “바뀌었다”고 알려야 화면이 따라간다.

언제 무엇을 쓰는가.

| 상황 | 선택 |
|------|------|
| 이름·체크처럼 필드 하나 | `INotifyPropertyChanged` 속성 |
| 추가·삭제가 있는 목록 | `ObservableCollection<T>` |
| 행의 모양 | `DataTemplate` |
| 표시 형식만 다름 (bool → 색) | `IValueConverter` |

`List<T>`에 `Add`해도 UI는 모른다. 컬렉션 변경 알림이 있는 `ObservableCollection<T>`를 쓴다.

---

## 2. 핵심 구성

| 구성 | 한 줄 |
|------|--------|
| DataContext | 이 화면이 바라보는 데이터 소스. 바인딩의 루트 |
| Path | `User.Name`처럼 속성 경로 |
| Mode | `OneWay` 표시만, `TwoWay` 입력도 소스로 |
| UpdateSourceTrigger | `LostFocus` 기본. 타이핑마다면 `PropertyChanged` |
| `INotifyPropertyChanged` | 속성 setter에서 UI에 변경을 알린다 |
| `ObservableCollection<T>` | 항목 추가·삭제·이동을 UI에 알린다 |

`TextBox.Text`의 기본 Mode는 TwoWay다. `TextBlock.Text`는 OneWay다.

---

## 3. 동작하는 예: 사용자 목록

`ViewModels/UserItem.cs`:

```csharp
using CommunityToolkit.Mvvm.ComponentModel;

namespace MyApp.ViewModels;

public partial class UserItem : ObservableObject
{
    [ObservableProperty]
    private string name = "";

    [ObservableProperty]
    private bool isActive = true;
}
```

항목 안의 `Name`이 바뀌려면 항목 자체도 알림 객체여야 한다. `record` 문자열만 바꿔서는 행 텍스트가 안 바뀐다.

`ViewModels/MainViewModel.cs`:

```csharp
using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace MyApp.ViewModels;

public partial class MainViewModel : ObservableObject
{
    public ObservableCollection<UserItem> Users { get; } = new();

    [ObservableProperty]
    private UserItem? selectedUser;

    [ObservableProperty]
    private string draftName = "";

    public MainViewModel()
    {
        Users.Add(new UserItem { Name = "김하늘", IsActive = true });
        Users.Add(new UserItem { Name = "이준", IsActive = false });
    }

    [RelayCommand]
    private void AddUser()
    {
        var name = DraftName.Trim();
        if (name.Length == 0) return;
        Users.Add(new UserItem { Name = name });
        DraftName = "";
    }

    [RelayCommand]
    private void RemoveSelected()
    {
        if (SelectedUser is null) return;
        Users.Remove(SelectedUser);
        SelectedUser = null;
    }
}
```

`[ObservableProperty]` private 필드 `draftName`은 생성 코드에서 `DraftName` 속성이 된다. XAML과 명령은 `DraftName`을 쓴다.

`Views/MainWindow.xaml` 본문:

```xml
<DockPanel Margin="16">
  <StackPanel DockPanel.Dock="Top" Orientation="Horizontal">
    <TextBox Width="180"
             Text="{Binding DraftName, UpdateSourceTrigger=PropertyChanged}" />
    <Button Content="추가" Command="{Binding AddUserCommand}" Margin="8,0,0,0" />
    <Button Content="선택 삭제" Command="{Binding RemoveSelectedCommand}" />
  </StackPanel>
  <ListBox ItemsSource="{Binding Users}"
           SelectedItem="{Binding SelectedUser}">
    <ListBox.ItemTemplate>
      <DataTemplate>
        <StackPanel Orientation="Horizontal">
          <CheckBox IsChecked="{Binding IsActive}" VerticalAlignment="Center" />
          <TextBlock Text="{Binding Name}" Margin="8,0,0,0" />
        </StackPanel>
      </DataTemplate>
    </ListBox.ItemTemplate>
  </ListBox>
</DockPanel>
```

- `ItemsSource` — 목록 소스
- `ItemTemplate` — 한 행이 바라보는 DataContext는 `UserItem`
- `SelectedItem` — 현재 선택. TwoWay로 ViewModel과 맞춘다
- `AddUserCommand` — `[RelayCommand] AddUser`가 생성하는 명령 이름

툴킷 없이 알림을 직접 쓰려면:

```csharp
public event PropertyChangedEventHandler? PropertyChanged;

private void OnPropertyChanged([CallerMemberName] string? name = null)
    => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
```

setter에서 `_name = value` 뒤에 `OnPropertyChanged()`를 호출한다. 알림이 없으면 바인딩 소스는 바뀌었는데 화면은 옛 값이다.

---

## 4. 변환과 모드

```xml
<TextBlock Text="{Binding Price, StringFormat={}{0:N0}원}" />
```

형식만이면 `StringFormat`으로 충분하다. bool → Visibility는 내장 `BooleanToVisibilityConverter` 또는 작은 `IValueConverter`다. ViewModel에 UI 타입(`Visibility`, `Brush`)을 넣지 않는 편이 테스트가 쉽다.

백그라운드 스레드에서 컬렉션을 바꾸면 예외가 난다. UI 스레드(`Dispatcher.Invoke`) 또는 `BindingOperations.EnableCollectionSynchronization`을 검토한다. 기본은 UI 스레드에서만 `Add`/`Remove`한다.

---

## 5. 주의 / 흔한 실수

- **속성 알림 없이 `Name = x`.** 화면이 안 바뀐다. 툴킷 또는 `OnPropertyChanged`.
- **`List<T>`를 `ItemsSource`에 넣고 나중에 `Add`.** 초기 표시만 되고 추가분이 안 붙는다.
- **컬렉션 프로퍼티를 get-only가 아닌 채 재할당.** `Users = new ObservableCollection<...>()`는 새 객체라, 바인딩이 옛 컬렉션을 볼 수 있다. `Clear` 후 `Add`하거나 알림이 있는 setter로 교체한다.
- **행 모델이 `string`뿐인데 행 내용을 바꾸고 기대.** 문자열은 알림이 없다. `UserItem`처럼 객체를 둔다.
- **`UpdateSourceTrigger` 기본값으로 타이핑마다 검증.** `TextBox`는 포커스를 잃어야 소스가 갱신된다. 즉시면 `PropertyChanged`를 명시한다.

---

## 정리

WPF 생산성은 컨트롤 종류가 아니라 **변경 통지 + 컬렉션 + 템플릿**이다.

- 필드 → `INotifyPropertyChanged` / `[ObservableProperty]`
- 목록 → `ObservableCollection<T>`
- 행 UI → `DataTemplate` (행의 DataContext = 항목)

---

## 연습

1. 추가 버튼으로 이름이 목록에 붙는지, 선택 삭제로 빠지는지 확인한다.
2. 행의 `CheckBox`를 토글해 `IsActive`가 유지되는지 확인한다.
3. `Users`를 `List<UserItem>`으로 바꿔 `Add`한 뒤 화면이 안 바뀌는 것을 보고 다시 `ObservableCollection`으로 되돌린다.
