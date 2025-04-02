# React ToDo app

Aplikacja listy zadań, przechowująca je w bazie danych. Zrealizowana za pomocą ReactJS,Node.js z Express.js oraz MongoDb

## Podstawowa funkcjonalność

-   Aby mieć dostęp do listy zadań użytkownik musi się zalogować lub zarejestrować.
-   Podczas logowania uzytkownik może zaznaczyć checkbox "Remember me" aby zostać zapamiętanym i nie musieć się logować.
-   Każdy użytkownik ma swoje zadania, które widzi po zalogowaniu się.
-   Uzytkownik może się wylogować i usunąć zapamiętanie przyciskiem "logout"
-   Użytkownik może dodawać nowe zadanie po kliknięciu przycisku "Add Task" oraz uzupełnieniu tytułu i opisu zadania w wyskakującym okienki oraz potwierdzeniu klikająć przycisk "ADD TASK" lub klawisz `Enter`
-   Użytkownik może oznaczyć zadanie jako wykonane lub nie klikając na nie, zostanie ono odpowiednio oznaczone.
-   Użytkownik może edytować treść zadań nie wykonanych klikając przycisk "Edit task", pojawi się wtedy okienko pozwalające na edycję oraz po potwierdzeniu przyciskiem "Confirm" lub klawiszem `Enter`. Jeżeli nie zostaną podane nowe dane i użytkownik potwierdzi, zadanie będzie miało treść z przed edycji. Kliknięcie poza obszar edytowanego zadania również anuluje edytowanie.
-   Użytkownik może usuwać zadanie nie wykonane klikając przycisk "Delete task".
-   Użytkownicy mogą tworzyć zespoły oraz dodawać do nich innych użytkowników. Każdy członek zespołu jest w stanie widzieć, zmieniać, dodawać i usuwać zadania w danym zespole.
-   Dodawać i usuwać użytkowników może tylko twórca(właściciel) zespołu.
-   Każda lista(użytkownika i zespołów) ma własną listę tagów, do której można dodawać nowe oraz je usuwać, są unikatowe dla każdej listy. Domyślne tagi oznaczają zadania wykonane i niewykonane.
-   Tagi można przypisywać zadaniom, można też filtrować zadania klikająć na tagi, którymi oznaczone zadania chcemy widzieć.
-   Zadania, zespoły oraz użytkownicy zespołów są aktualizowani w czasie rzeczywistym co oznacza, że gdy jeden użytkownik zespołu np. doda zadanie, pojawi się ono od razu u wszystkich innych użytkowników zespołu.
-   Każde zadanie ma swój odpowiednik w bazie danych. Oznacza to, że każda edycja, oznaczanie lub usunięcie zadania odpowiednio aktualizuje dokument w bazie danych.
-   Zadania są wyciągane z bazy danych przy każdym odświeżeniu strony co sprawia, że są zachowywane między wejściami na stronę.
