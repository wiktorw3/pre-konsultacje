# 🚀 Projekt PRE-KONSULTACJE

Projekt **PRE-KONSULTACJE** to platforma do zarządzania sesjami pre konsultacji, mająca na celu usprawnienie komunikacji między użytkownikami a ekspertami. Kluczowym elementem jest możliwość dodawania komentarzy oraz ich **automatyczna walidacja i moderacja** przy użyciu usług AI.

---

## 🛠️ 1. Uruchomienie Infrastruktury i Aplikacji

Aby uruchomić aplikację lokalnie, potrzebujesz **Docker** oraz **Java/Maven** (lub Gradle) do zbudowania projektu.

### 1.1 Uruchomienie Bazy Danych (PostgreSQL) 🐳

Projekt wymaga działającej bazy danych **PostgreSQL**. Najprostszym sposobem jest użycie Docker Compose.

1.  Upewnij się, że masz plik `docker-compose.yml` w katalogu głównym projektu (lub zdefiniuj go, aby uruchamiał PostgreSQL).
2.  Uruchom kontener z bazą danych:

    ```bash
    docker-compose up -d
    ```

3.  Sprawdź, czy konfiguracja bazy danych w pliku `application.properties` lub `application.yml` pasuje do ustawień w Docker Compose (domyślnie port 5432, nazwa bazy i hasło).

### 1.2 Budowanie i Uruchomienie Aplikacji (Spring Boot)

1.  **Sklonuj lub pobierz projekt.**
2.  **Zbuduj projekt** (np. używając Mavena):

    ```bash
    ./mvnw clean install
    ```

3.  **Uruchom aplikację Spring Boot:**

    ```bash
    java -jar target/nazwa-twojego-pliku-jar.jar
    ```

    Alternatywnie, uruchom projekt bezpośrednio z IDE (IntelliJ, Eclipse) za pomocą głównej klasy aplikacji.

---

## 🗺️ 2. Dokumentacja API (OpenAPI / Swagger UI)

Po pomyślnym uruchomieniu aplikacji, możesz uzyskać dostęp do interaktywnej dokumentacji API.

### 2.1 Interfejs Swagger UI

Dokumentacja OpenAPI jest dostępna poprzez interfejs graficzny Swagger UI.

* **Adres URL:** Po uruchomieniu aplikacji (domyślnie na porcie 8080), przejdź do:

    ```
    http://localhost:8080/swagger-ui.html
    ```

### 2.2 Plik Specyfikacji OpenAPI

Bezpośredni dostęp do pliku specyfikacji w formacie JSON (używany do generowania klientów lub integracji z narzędziami):

* **Adres URL:**

    ```
    http://localhost:8080/v3/api-docs
    ```

---

## 💻 3. Główne Funkcjonalności (Skrót)

* **Zarządzanie Konsultacjami:** CRUD (Create, Read, Update) i dezaktywacja.
* **Komentowanie:** Obsługa zalogowanych użytkowników oraz **użytkowników analogowych** (anonimowych).
* **Moderacja AI:** Automatyczne blokowanie komentarzy w przypadku niepowodzenia walidacji przez zewnętrzny serwis AI (`aiService`).
* **Pobieranie Danych:** Sortowanie aktywnych konsultacji według liczby komentarzy.
* **Zabezpieczenia (TODO):** Wymagana implementacja autoryzacji do endpointów moderatorskich.

---

## 🔗 4. Punkty do Rozwoju (TODO)

1.  **Autoryzacja:** Dodać zabezpieczenia (np. Spring Security, `@PreAuthorize`) do endpointów moderatorskich.
2.  **Obsługa Błędów:** Wdrożyć globalne handlery błędów (`@ControllerAdvice`).
3.  **Asynchroniczność:** Zmienić wywołania `WebClient` na nieblokujące (`Mono<String>`).
4.  **Testy Integracyjne:** Rozbudować testy jednostkowe o przypadki brzegowe i błędy.