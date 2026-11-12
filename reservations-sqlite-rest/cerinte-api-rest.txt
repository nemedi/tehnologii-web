TEMA: API REST peste SQLite cu Node.js, Express si Sequelize
=============================================================

OBIECTIV
--------
Implementati un serviciu web REST care expune operatii CRUD pentru un set de
entitati, persistate intr-o baza de date SQLite prin Sequelize. Modelul de
referinta este proiectul "reservations-sqlite-rest" (entitatile Room, Contact,
Meeting si relatia Attendee). Cerintele de mai jos descriu comportamentul
asteptat; definirea modelelor Sequelize (tipuri, validari, asocieri) cade in
sarcina voastra, pornind de la lista de atribute data pentru fiecare entitate.


1. CERINTE TEHNICE GENERALE
---------------------------
1.1  Tehnologii: Node.js (ES Modules, fisiere .mjs), Express 5, Sequelize 6,
     sqlite3, dotenv, express-basic-auth.
1.2  Structura minima a proiectului:
       server.mjs      - pornirea aplicatiei, middleware-uri, montarea rutelor
       router.mjs      - definirea rutelor (endpoint-uri)
       service.mjs     - logica generica reutilizabila (handler-e CRUD)
       repository.mjs  - conexiunea Sequelize, modelele, asocierile, initialize()
       security.mjs    - autentificarea
       credentials.json - utilizatori si parole
       .env            - PORT (implicit 8080 daca lipseste)
1.3  Toate rutele sunt montate sub prefixul /api si sunt protejate cu HTTP
     Basic Authentication. Credentialele sunt citite din credentials.json.
     Cerere fara credentiale valide => 401.
1.4  Corpul cererilor si al raspunsurilor este JSON (express.json()).
1.5  La pornire, serverul deschide conexiunea (authenticate) si sincronizeaza
     schema (sync), apoi afiseaza un mesaj de confirmare cu portul.
1.6  Handler-ele din service.mjs trebuie sa fie GENERICE: primesc clasa Model ca
     parametru si se pot aplica oricarei entitati. Este interzis sa duplicati
     logica CRUD separat pentru fiecare entitate; router.mjs doar leaga rutele
     de handler-ele generice.
1.7  Cheia primara a fiecarei entitati principale este un UUID (v4) generat
     automat; clientul nu o trimite la creare. Tabelele nu au coloane de
     timestamp (createdAt/updatedAt).
1.8  Erorile neasteptate sunt tratate de un middleware de erori care raspunde
     cu 500 si un corp JSON.


2. CONTRACTUL API PENTRU O ENTITATE (COLECTIE) - /api/{entitati}
-----------------------------------------------------------------
Pentru FIECARE entitate principala se expun urmatoarele rute (exemplu pentru
o entitate numita "rooms"):

  Metoda   Ruta               Comportament                              Coduri
  -------  -----------------  ----------------------------------------  --------------------
  GET      /rooms             Lista inregistrarilor (cu filtrare,       200 cu lista JSON;
                              sortare, selectie de campuri, vezi 3).    204 daca lista e goala
  POST     /rooms             Creeaza o inregistrare din corpul JSON.   201 + antet Location
                                                                        catre resursa noua;
                                                                        400 daca payload invalid
  DELETE   /rooms             Sterge toate inregistrarile (truncate).   204
  GET      /rooms/:id         Returneaza o inregistrare dupa id         200 / 404
                              (suporta selectia de campuri).
  HEAD     /rooms/:id         Verifica existenta, fara corp.            200 / 404
  PUT      /rooms/:id         Inlocuire completa; toate campurile       204 / 400 / 404
                              obligatorii trebuie sa fie prezente.
  PATCH    /rooms/:id         Modificare partiala; se actualizeaza      204 / 404
                              doar campurile trimise.
  DELETE   /rooms/:id         Sterge inregistrarea.                     204 / 404

Observatii:
 - Antetul Location are forma
   {protocol}://{hostname}:{port}{baseUrl}{url}/{id-ul nou creat}.
 - Validarea "payload invalid" (400) se face generic, parcurgand atributele
   modelului (Model.tableAttributes): orice atribut care nu este cheie
   primara si are allowNull === false trebuie sa existe si sa aiba valoare in
   corp. Validarile Sequelize din model (ex. format email, valoare minima)
   trebuie sa fie definite de voi si sa respinga datele incorecte.
 - La PATCH se aplica doar atributele primite, apoi se salveaza inregistrarea.
 - Nu toate entitatile trebuie sa expuna toate metodele; pentru fiecare
   entitate din sectiunea 5 este specificat ce rute se cer.


3. FILTRARE, SORTARE SI SELECTIE DE CAMPURI (pe GET colectie)
-------------------------------------------------------------
3.1  Filtrare - parametrul de query "filter":
       ?filter=camp-operator-valoare[,camp-operator-valoare ...]
     "operator" este numele unui operator din Sequelize.Op (eq, ne, gt, gte,
     lt, lte, like, ...). Conditiile separate prin virgula se combina cu AND.
     Exemplu: GET /api/rooms?filter=capacity-gte-10,name-like-%Sala%
3.2  Sortare - antetul "X-Sort": lista de campuri separate prin virgula, fiecare
     prefixat cu "+" (ascendent) sau "-" (descendent).
     Exemplu: X-Sort: -capacity,+name
3.3  Selectia campurilor - antetul "X-Fields": lista de campuri separate prin
     virgula care sa fie returnate.
     Exemplu: X-Fields: id,name
     Se aplica atat pe GET colectie, cat si pe GET /:id.
3.4  Daca parametrii/antetele lipsesc, nu se aplica nici filtrare, nici sortare,
     nici restrictionarea campurilor.


4. RELATII MANY-TO-MANY - SUBRESURSE
-------------------------------------
Pentru o relatie N:M intre doua entitati (de ex. Meeting <-> Contact prin
Attendee) se foloseste un tabel de legatura fara atribute proprii, iar API-ul
expune o subresursa a entitatii "gazda":

  Metoda   Ruta                          Comportament                      Coduri
  -------  ----------------------------  --------------------------------  ---------------
  GET      /gazde/:id/membri             Lista id-urilor membrilor         200 / 204 daca
                                         asociati (doar cheia straina      nu exista
                                         a membrului).
  DELETE   /gazde/:id/membri             Elimina toate asocierile gazdei.  204
  PUT      /gazde/:id/membri/:key        Adauga asocierea gazda-membru.    204
  DELETE   /gazde/:id/membri/:key        Elimina o asociere.               204 / 404

Handler-ele pentru subresurse sunt si ele generice: primesc modelul tabelului
de legatura si deduc cele doua chei din Model.primaryKeyAttributes (prima =
cheia membrului, a doua = cheia gazdei).

Relatii 1:N (cheie straina in entitatea "copil") se declara cu hasMany/belongsTo
si cheie straina cu nume explicit, iar valoarea cheii straine se trimite in
corpul JSON la creare, ca orice alt atribut.


5. ENTITATILE DE IMPLEMENTAT
-----------------------------
Alegeti UN set (sau cel atribuit de cadrul didactic). Tipurile de mai jos sunt
logice; alegeti voi tipurile Sequelize potrivite si validarile.
Legenda: * = obligatoriu (not null), PK = cheie primara UUID generata automat.

5.A  BIBLIOTECA
----------------
  Author  (/api/authors)
     id (PK), firstName*, lastName*, birthYear (intreg), country
     Validari: birthYear intre 1000 si anul curent.
  Book    (/api/books)
     id (PK), title*, isbn* (text, 13 caractere), publishedOn (data),
     pages* (intreg >= 1), authorId* (FK -> Author, relatie 1:N)
  Reader  (/api/readers)
     id (PK), name*, email* (format email valid), phone
  Loan    (/api/loans)
     id (PK), borrowedOn* (data), dueOn* (data), returnedOn (data, optional),
     bookId* (FK -> Book), readerId* (FK -> Reader)
     Validare cerinta: dueOn trebuie sa fie dupa borrowedOn.
  Relatie N:M: Book <-> Category (Category: id PK, name*, description)
     Tabel de legatura: BookCategory (fara atribute proprii)
     Subresursa: /api/books/:id/categories si /api/books/:id/categories/:key

5.B  CLINICA
-------------
  Doctor     (/api/doctors)
     id (PK), firstName*, lastName*, specialty*, licenseNumber*
  Patient    (/api/patients)
     id (PK), firstName*, lastName*, birthDate* (data), email (format email),
     phone
  Appointment (/api/appointments)
     id (PK), scheduledAt* (data+ora), durationMinutes* (intreg >= 5),
     notes (text scurt), doctorId* (FK -> Doctor), patientId* (FK -> Patient)
  Treatment  (/api/treatments)
     id (PK), name*, description, price* (zecimal >= 0)
  Relatie N:M: Appointment <-> Treatment
     Tabel de legatura: AppointmentTreatment (fara atribute proprii)
     Subresursa: /api/appointments/:id/treatments[/:key]

5.C  MAGAZIN ONLINE
--------------------
  Customer   (/api/customers)
     id (PK), firstName*, lastName*, email* (format email), address
  Product    (/api/products)
     id (PK), name*, description, price* (zecimal >= 0), stock* (intreg >= 0)
  Order      (/api/orders)
     id (PK), placedAt* (data+ora), status* (text; valori permise: NEW, PAID,
     SHIPPED, CANCELLED), customerId* (FK -> Customer)
  Relatie N:M: Order <-> Product (tabel OrderProduct, fara atribute proprii)
     Subresursa: /api/orders/:id/products[/:key]

5.D  EVENIMENTE / CURSURI
--------------------------
  Speaker    (/api/speakers)
     id (PK), name*, company, email* (format email)
  Venue      (/api/venues)
     id (PK), name*, city*, seats* (intreg >= 1)
  Event      (/api/events)
     id (PK), title*, description, startsAt* (data+ora), endsAt* (data+ora),
     venueId* (FK -> Venue)
  Participant (/api/participants)
     id (PK), firstName*, lastName*, email* (format email)
  Relatii N:M: Event <-> Participant (tabel Registration)
               Event <-> Speaker     (tabel Presentation)
     Subresurse: /api/events/:id/participants[/:key],
                 /api/events/:id/speakers[/:key]


6. CERINTE FUNCTIONALE SPECIFICE (pentru setul ales)
-----------------------------------------------------
6.1  Implementati TOATE rutele din sectiunea 2 pentru toate entitatile
     principale ale setului, mai putin cele pentru care enuntul spune altfel
     (de exemplu, entitatile din tabelele de legatura nu au rute proprii).
6.2  Implementati subresursele din sectiunea 4 pentru fiecare relatie N:M.
6.3  Declarati asocierile Sequelize (hasMany / belongsTo / belongsToMany) cu
     chei straine explicite, astfel incat cheile sa apara in tabele cu
     numele cerut.
6.4  Filtrarea, sortarea si selectia campurilor (sectiunea 3) trebuie sa
     functioneze pe TOATE entitatile fara cod suplimentar per entitate.
6.5  Tratati cazul in care id-ul din ruta nu exista (404) pentru GET, HEAD,
     PUT, PATCH si DELETE pe /:id.
6.6  Un POST/PUT cu atribute obligatorii lipsa sau cu valori care incalca
     validarile modelului trebuie sa intoarca 400 (nu 500). Atentie: in
     implementarea de referinta validarea generica verifica doar prezenta
     atributelor; completati cu tratarea erorilor de validare Sequelize
     (try/catch pe SequelizeValidationException => 400).


7. PUNCTE BONUS / CERINTE AVANSATE (optional)
----------------------------------------------
 - Paginare: ?page=1&size=20 pe GET colectie, cu antet X-Total-Count.
 - Verificarea existentei cheilor straine inainte de creare (raspuns 400 sau
   422 daca authorId/roomId etc. nu exista).
 - Validari de domeniu intre campuri (ex. data de sfarsit > data de inceput;
   stoc insuficient la plasarea comenzii).
 - Evitarea suprapunerilor (ex. doua programari la acelasi doctor in acelasi
   interval) cu raspuns 409 Conflict.
 - Protejarea impotriva injectarii de operatori/campuri necunoscute in
   "filter", "X-Sort" si "X-Fields" (lista alba de campuri si operatori).
 - Parole stocate cu hash in credentials.json.
 - Fisier de teste (colectie Postman/Insomnia sau fisier .http) care exerseaza
   toate rutele si codurile de raspuns.


8. LIVRABILE SI EVALUARE
-------------------------
Livrabile:
 - Arhiva (fara node_modules) sau repository Git cu proiectul complet.
 - package.json cu scripturile "debug" (nodemon server.mjs) si
   "release" (node server.mjs).
 - Un fisier README scurt cu pasii de instalare/rulare si credentialele de test.
 - Colectia de cereri de test (Postman / fisier .http).

Barem orientativ (100 puncte):
   10  Structura proiectului, pornire server, configurare .env
   10  Autentificare Basic cu credentials.json
   20  Modele Sequelize corecte (atribute, tipuri, validari, asocieri)
   25  Rute CRUD generice pe entitati (cod de stare si Location corecte)
   10  Filtrare, sortare, selectie campuri
   15  Subresurse N:M
   10  Tratarea erorilor (400/404/500) si calitatea codului
   +   Bonus (sectiunea 7) pana la 10 puncte

Penalizari: cod CRUD duplicat per entitate (-10), rute neprotejate (-10),
erori de validare care returneaza 500 in loc de 400 (-5).
