# Mapy historyczne

Autor danych: André Ourednik i współautorzy projektu Historical Basemaps.
Źródło: https://github.com/aourednik/historical-basemaps
Wersja danych: da7a4b735ecef70aebdc9c73e409d8a2500d50f3.
Licencja danych i opracowanych map: GNU GPL v3, pełny tekst w [LICENSE](LICENSE).

Zmiany w tym projekcie (19 października 2026): wycięcie trzech regionów, uproszczenie wierzchołków dla skali ekranowej, odwzorowanie równoprostokątne ze skalowaniem długości geograficznej według środkowej szerokości regionu, kolorowanie, etykiety i eksport SVG. Dane źródłowe opracowanych map są w katalogu `source/`, a generator w `scripts/build-maps.mjs` repozytorium https://github.com/kotymek/chiny. Pole BORDERPRECISION zachowano w danych. Wartości 1 i 2 pokazano linią przerywaną, wartość 3 linią ciągłą. Nie zwiększano deklarowanej precyzji źródła.

Mapy są rekonstrukcjami edukacyjnymi, nie wyznaczeniem dokładnych granic. Dane projektu źródłowego są stale poprawiane i mogą zawierać błędy oraz uproszczenia, zwłaszcza w przypadku zależności lennych, okupacji, rozbicia dzielnicowego i stref wpływów. Kolor nie przesądza o suwerenności. W starożytności część pól przedstawia obszary kulturowe i ludy, a nie państwa. Etykiety zachowują nazewnictwo zbioru. Rok mapy odnosi się do migawki źródłowej i nie opisuje wszystkich lat epoki. Widok regionalny może ucinać imperia rozciągające się poza kadr.

## Odtworzenie map

Z katalogu repozytorium: `node scripts/build-maps.mjs` odtwarza SVG z dołączonych regionalnych plików GeoJSON. `node scripts/build-maps.mjs /ścieżka/do/historical-basemaps` ponownie wycina regiony ze zbioru źródłowego. Do odtworzenia identycznej wersji należy użyć wskazanego powyżej commitu.
