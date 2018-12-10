# Smartphone app voor TheBenZ

 * acc_viz is bedoelt om de ruwe accelerometer data te visualiseren.
 * benviz is de finale app die gebruikt wordt door Ben

## Installatie

De applicatie is gebouwd mbv [Cordova](http://cordova.apache.org). Dit is een framework om via html en javascript een native app te maken voor Android en iOS. Ideaal dus om een prototype te maken.

Om cordova te installeren volg je best [deze handleiding](https://cordova.apache.org/docs/en/latest/guide/cli/#installing-the-cordova-cli).

Als je de code van deze app bv via git hebt gedownload, ga je in een terminal naar de folder van de app en initialiseer je de plugins via:

`npm init`

Om een platform toe te voegen voer je het volgende uit (in dit vb android):

`cordova platform add android`

## Compileren

Om het te kunnen draaien heb je voor Android de SDK nodig en voor iOS xcode. Hiervoor heb je een extra installatie en configuratie nodig die goed uitgelegd staat op deze pagina's:

- [handleiding voor Android](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html)
- [handleiding voor iOS](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html)

