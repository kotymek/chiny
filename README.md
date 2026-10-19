# W tym samym czasie

[Otwórz atlas](https://kotymek.github.io/chiny/)

Polskojęzyczna historia Chin, Europy i ziem polskich: 14 przedziałów, 42 karty, 243 wydarzenia i 75 map dla 25 lat odniesienia (1200 p.n.e.–2000 n.e.).

Wyszukiwanie, filtry epok, wybór roku, skróty do Cezara, Mieszka I i roku 1200 oraz ukrywanie polskiej kolumny. Wybór roku mapy synchronizuje trzy regiony. Kliknięcie miniatury otwiera duży widok z legendą, źródłem i pobieraniem SVG. Okno obsługuje Escape i powrót fokusu.

## Uruchomienie i testy

Otwórz index.html w przeglądarce. Bez instalowania zależności. Mapy są lokalnymi plikami SVG. Google Fonts ma systemowy fallback.

Testy: `node tests/check.mjs`. Odtworzenie map z dołączonych danych: `node scripts/build-maps.mjs`.

Workflow .github/workflows/pages.yml publikuje gałąź main na GitHub Pages po testach.

## Edycja

- data.js: opisy epok i podstawowe wydarzenia.
- extra-events.js: dodatkowe wydarzenia i sortowanie.
- app.js: oś czasu, wyszukiwanie i nawigacja.
- historical-maps.js: wybór roku, miniatury, okno mapy i legenda.
- maps/: SVG, manifest, regionalne źródła GeoJSON i licencja.
- scripts/build-maps.mjs: generator map.

## Metoda i źródła

Mapy: André Ourednik i współautorzy, Historical Basemaps, wersja da7a4b735ecef70aebdc9c73e409d8a2500d50f3, GPL-3.0. [Opracowanie i źródła](maps/ATTRIBUTION.md), [licencja map](maps/LICENSE).

Dane są przycięte i uproszczone. Zachowano klasy precyzji granic. Brak danych nie oznacza braku mieszkańców. Mapy nie rekonstruują wszystkich wewnętrznych podziałów i nie rozstrzygają sporów terytorialnych. Nazwy zachowano w języku źródła.

Mapa przedstawia konkretny rok, nie cały przedział ani automatycznie rok wpisany w wyszukiwarce. Dawne mapy obejmują również obszary ludów i kultur. Ziemie polskie nie oznaczają istnienia Polski w starożytności. Daty służą porównaniom edukacyjnym; nie stosujemy roku zerowego. Odstępy między wierszami nie są proporcjonalne do czasu.

Treści: chronologie Smithsonian i Metropolitan Museum of Art, UNESCO, Narodowy Instytut Dziedzictwa i materiały podlinkowane przy wydarzeniach. Atlas to wybór edukacyjny i punkt wyjścia do dalszej lektury.
