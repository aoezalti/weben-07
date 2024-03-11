# weben-07
Projektspezifikation: Webshop 
I. Allgemein 
  a. Die Angabe lässt Ihnen gewisse Gestaltungs- und Implementierungsfreiheiten. Die Branche des Webshops kann frei gewählt werden (Möbel, Veranstaltungstickets, Elektronik, …). 
        Folgende Basis-Features sollen abgebildet werden: 
          i. Präsentation und Verwaltung von Produkten 
          ii. Warenkorbfunktionalität 
          iii. Kundenverwaltung 
          iv. Bestellungen & Rechnungen   
          v. Gutscheine verwalten und einlösen 
          vi. Administrationsbereich 
  b. Grün markierte Abschnitte bringen Bonuspunkte 
  c. Die Umsetzung des Projekts, wird sämtliche Inhalte der Lehrveranstaltungen Webtechnologien und Web Scripting beinhalten: 
          i. HTML, CSS, Bootstrap 
          ii. PHP, Sessions, Cookies 
          iii. Fileuploads, Datenbanken 
          iv. JavaScript, jQuery, AJAX 
  d. Achten Sie auf einen homogenen Prozessablauf innerhalb des Webshops (klarer Kaufprozess/Bedienung, keine „Dead-Ends“, …) 
  
  II. Projektstruktur und Grundlayout 
  a. Backend und Frontend müssen klar voneinander getrennt sein! 
          i. Daten zwischen Backend und Frontend müssen als JSON ausgetauscht werden. 
          ii. Es muss möglich sein, ein anderes/zusätzliches Frontend zu demselben Backend zu entwickeln (z.B. Android / iOS / Windows-App) 
  b. Organisieren Sie das Projekt in einer übersichtlichen Ordnerstruktur. 
  c. Für die Umsetzung wird ein objektorientierter Ansatz empfohlen (Verwendung von Klassen für User, Produkte, etc. 
  d. Legen Sie eine Datenbank (DB) sowie eine entsprechende DB-Service Klasse an, welche zentral die Zugriffe auf die DB implementiert. 

  Beispielstruktur: 
   
  Frontend (HTML, CSS, JS, relevant files.) 
  index.html 
   [res] 
   [css] 
   style.css 
   … 
   [img] 
   picture1.jpg 
   … 
   [js] 
   script.js 
   … 
   [sites] 
   cart.html 
   imprint.html 
   terms.html 
   … 
   
   
  Backend (PHP, relevant files): 
   [config] 
   dataHandler.php 
   dbacess.php 
   … 
   [models] 
   user.class.php 
   product.class.php 
   … 
   [productpictures] 
   product1.png 
   product2.png 
   … 
   [logic] 
   requestHandler.php 
   … 
 
  
III. Abgabemodalitäten 
  a. Das Projekt ist vollständig als zip/rar File im Moodle hochzuladen inklusive einer Kopie der MySQL-Datenbank 
  b. Kommentieren Sie Abläufe/Funktionen im Code 
  c. Falls weitere Konfigurationsschritte zur Inbetriebnahme d. Applikation nötig sind, legen Sie eine readme.txt-Datei bei.
