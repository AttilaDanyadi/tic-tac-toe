# TicTacToe

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

# Feladat terv

## 1. Layout kidolgozása

Legyen egy Layout page egy header menuvel, ami mindig látható.
A következő oldalak között lehessen navigálni:

### Welcome (Home)

### Mentett játékok (Browser)

### Játék

## 2. Adatmodel létrehozása

BoardData adatszerkezet, reprezántálja az api modelt.
Board class létrehozása BoardData kiterjesztésével vagy beágyazásával.
Ez az osztály dekorátor property getter-ekkel legyen kiegészítve.
Pl: BoardFull, BoardEmpty, HasWinnerPattern stb.

## 3. DataProvider létrehozása

A mellékelt api funkciók hívása http mondulon keresztül.
GET esetén Board class-t vagy listát adjon vissza.
POST, PUT esetén BoardData interface-t megvalósító objektum paramétert várjon.
DELETE esetén a törölni kívánt játék ID-ét.

## 4. DataProvider + model tesztelése

Letöltött játékból létrehozott Board class console.log-al való ellenőrzése

## 5. BoardComponent létrehozása

User interface komponens adatkötéssel Board class-hoz.
A BoardComponent legyen felhasználható a játékban és a mentett játékok oldalon is.
Lehetőleg különböző méretben is látható.
BoardComponent további lebontása cella komponensekre.

## 6. BoardComponent tesztelése

A tábla grafikája megfelel-e az adatnak?

## 7. Game browser oldal megvalósítása

Lista megjelenítés.
Játék megnyitás.
Játék törlés.
Későbbiekben lista szűrése.

## 7. Game oldal megvalósítása

Játék menetét controllálja.
"comuter strategy" intelligencia kidolgozása
Lehetőség a mentésre.