# W tym samym czasie

Interaktywny atlas porównujący historię Chin, Europy i ziem polskich, od 1200 p.n.e. do 2000 n.e. Polska wersja językowa, 14 przedziałów, 42 karty z miniaturami map ośrodków, wyszukiwanie, filtry epok, wybór roku, trzy przykładowe porównania i linki do źródeł.

## Uruchomienie

Otwórz `index.html` w przeglądarce. Bez instalacji i bez procesu budowania. Opcjonalnie uruchom dowolny serwer statyczny w katalogu projektu. Fonty Google są opcjonalne; przy braku sieci strona używa fontów systemowych.

## Weryfikacja

`node tests/check.mjs`

## Publikacja

Workflow `.github/workflows/pages.yml` publikuje gałąź `main` na GitHub Pages. W Settings → Pages wybierz GitHub Actions, jeśli Pages nie zostało włączone automatycznie. Docelowy adres: https://kotymek.github.io/chiny/

## Treść i mapy

`data.js` zawiera przedziały, wydarzenia, ośrodki i źródła. `app.js` renderuje atlas i schematy lokalizacji. Mapki nie rekonstruują granic historycznych. Kontury są orientacyjne, punkty wynikają ze współrzędnych ośrodków. Biskupin w najwcześniejszym przedziale jest lokalizatorem regionu kultury łużyckiej, a nie datowaniem budowy słynnej osady. Datowanie p.n.e. nie używa roku zerowego. Karty opisują całe przedziały, nie dowolny pojedynczy rok. Podział na epoki służy nawigacji; historia Chin ma własną periodyzację. Materiał stanowi wybór edukacyjny, a źródła są punktami do dalszej lektury.

## Dostępność

Semantyczny HTML, obsługa klawiatury, etykiety pól, komunikaty wyszukiwania, opisy map, ograniczenie animacji według preferencji systemu i responsywny układ trzech kolumn.

