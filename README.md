
# Wymagania

package npm, Git, mySQL Workbench, Xampp




# Wymagania

package npm, Git, mySQL Workbench, Xampp

## Instalacja
1. Pobranie repozytorium
2. Przełączenie się na branch `migration-to-sql`
3. Instalacja => npm install
4. Uruchomienie frontendu => npm run dev
5. Uruchomienie MySQL DATABASE 
6. Konfiguracja MySQL connection =>
hostname: "localhost"

port: "3306"

username: "root"

password: "" (brak hasła)

7. Import bazy danych z folderu `src/SQL`

8. Uruchomienie backendu:
`cd src/api` 

`node index.js`

# Konta do zalogowania

User: user1 user1

Admin: admin1 admin1

# Opis aplikacji

aplikacja pierwotnie służąca do weryfikacji obuwia za pomocą tagów NFC, wspiera możliwość dzielenia się swoją kolekcją obuwia oraz śledzenia profili innych użytkowników

## Kluczowe funkcjonalności:

- rejestracja
- logowanie
- Zamieszczanie komentarzy
- usuwanie komentarzy
- edycja nickname oraz opisu profilu
- rejestracja przedmiotów jako admin
- przesylanie przedmiotów