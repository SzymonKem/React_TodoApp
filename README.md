# React ToDo app

Prosta aplikacja listy zadań, przechowująca je w bazie danych. Zrealizowana za pomocą ReactJS, Express.js oraz MongoDb

## Podstawowa funkcjonalność

-   Użytkownik może dodawać nowe zadanie po uzupełnieniu tytuły i opisu zadania oraz potwierdzeniu klikająć przycisk "ADD TASK" lub klawisz `Enter`
-   Użytkownik może oznaczyć zadanie jako wykonane lub nie klikając na nie, zostanie ono przeniesione do odpowiedniej sekcji: "In progress" dla zadań nie wykonanych oraz "Done" dla zadań wykonanych
-   Użytkownik może edytować treść zadań nie wykonanych klikając przycisk "Edit task" będzie można wtedy wprowadzić nowy tytuł oraz opis oraz potwierdzić przyciskiem "Confirm" lub klawiszem `Enter`. Jeżeli nie zostaną podane nowe dane i użytkownik potwierdzi, zadanie będzie miało treść z przed edycji. Kliknięcie poza obszar edytowanego zadania również anuluje edytowanie.
-   Użytkownik może usuwać zadanie nie wykonane klikając przycisk "Delete task".
-   Każde zadanie ma swój odpowiednik w bazie danych. Oznacza to, że każda edycja, oznaczanie lub usunięcie zadania odpowiednio aktualizuje dokument w bazie danych.
-   Zadania są wyciągane z bazy danych przy każdym odświeżeniu strony co sprawia, że są zachowywane między wejściami na stronę.
