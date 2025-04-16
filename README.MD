# Biblioteca Digitale - Sistema di Gestione Biblioteca


Un sistema completo di gestione biblioteca con interfaccia utente React e backend Java Spring Boot, che permette agli utenti di sfogliare, cercare e prendere in prestito libri, e agli amministratori di gestire catalogo e monitorare prestiti.

## 📋 Indice

- Panoramica
- Funzionalità
- Struttura del Progetto
- Stack Tecnologico
- API Reference
- Installazione
- Screenshot
- Note di Sviluppo

## 📚 Panoramica

Biblioteca Digitale è un'applicazione web full-stack per la gestione di una biblioteca. Il sistema consente agli utenti di sfogliare il catalogo dei libri, effettuare ricerche, prendere in prestito e restituire libri. Gli amministratori hanno accesso a funzionalità di gestione come l'aggiunta, modifica ed eliminazione di libri, la visualizzazione di tutti i prestiti e l'analisi di report statistici.

## ✨ Funzionalità

### Funzionalità Utente
- **Autenticazione**: Login sicuro con JWT
- **Catalogo Libri**: Sfoglia il catalogo completo dei libri
- **Ricerca**: Cerca libri per titolo, autore o genere
- **Gestione Prestiti**: Prendi in prestito e restituisci libri
- **Monitoraggio Prestiti**: Visualizza lo storico dei prestiti personali

### Funzionalità Amministratore
- **Gestione Libri**: Aggiungi, modifica ed elimina libri dal catalogo
- **Gestione Prestiti**: Visualizza e monitora tutti i prestiti della biblioteca
- **Report Statistici**: Analizza dati sui libri più letti e l'andamento dei prestiti
- **Gestione Utenti**: Registra nuovi utenti/amministratori

## 🏗️ Struttura del Progetto

```
its-java-finale/
├── biblioteca-backend/               # Backend Java Spring Boot
│   ├── src/main/java/com/biblioteca/
│   │   ├── config/                   # Configurazioni Spring e sicurezza
│   │   ├── libri/                    # Entities, repositories, DTOs per libri
│   │   ├── prestiti/                 # Entities, repositories, DTOs per prestiti
│   │   ├── utenti/                   # Entities, controllers, providers per utenti
│   │   └── BibliotecaDigitaleApplication.java  # Entry point
│   └── resources/
│       └── application.properties    # Configurazione applicazione e database
│
└── biblioteca-frontend/              # Frontend React
    ├── public/                       # Asset pubblici
    └── src/
        ├── components/
        │   ├── admin/                # Componenti per amministratori
        │   │   ├── AdminBookList.jsx # Gestione libri
        │   │   ├── AllLoans.jsx      # Visualizzazione prestiti
        │   │   ├── BookForm.jsx      # Form per aggiunta/modifica libri
        │   │   ├── RegisterUser.jsx  # Registrazione utenti
        │   │   └── ReportPage.jsx    # Statistiche e report
        │   ├── auth/                 # Componenti per autenticazione
        │   ├── layout/               # Layout comuni (Navbar, Footer, ecc.)
        │   └── user/                 # Componenti per utenti
        │       ├── BookList.jsx      # Catalogo libri
        │       ├── BorrowBookDialog.jsx # Dialog conferma prestito
        │       └── LoansList.jsx     # Lista prestiti utente
        ├── context/                  # Context API per stato globale
        ├── services/                 # Servizi per chiamate API
        └── App.jsx                   # Componente principale e routing
```

## 🛠️ Stack Tecnologico

### Backend
- **Linguaggio**: Java 17
- **Framework**: Spring Boot 2.7.18
- **Database**: PostgreSQL su Neon.tech
- **ORM**: JPA/Hibernate
- **Sicurezza**: Spring Security + JWT
- **Build Tool**: Maven

### Frontend
- **Linguaggio**: JavaScript (React 19.1.0)
- **UI Framework**: Material-UI 7.0.2
- **Routing**: React Router 7.5.0
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Visualizzazione Dati**: Chart.js 4.4.8

### Strumenti di Sviluppo
- **IDE**: Visual Studio Code
- **Testing API**: Postman
- **Controllo Versione**: Git

## 📡 API Reference

### Autenticazione
| Metodo | Endpoint | Descrizione |
| ------ | -------- | ----------- |
| POST | `/api/auth/register` | Registra un nuovo utente |
| POST | `/api/auth/login` | Effettua login e riceve JWT token |

### API Utente
| Metodo | Endpoint | Descrizione |
| ------ | -------- | ----------- |
| GET | `/api/user/libri` | Ottiene tutti i libri disponibili |
| POST | `/api/user/prestiti` | Prende in prestito un libro |
| GET | `/api/user/miei-prestiti` | Ottiene i prestiti dell'utente corrente |
| POST | `/api/user/restituisci/{id}` | Restituisce un libro in prestito |

### API Amministratore
| Metodo | Endpoint | Descrizione |
| ------ | -------- | ----------- |
| POST | `/api/admin/libri` | Aggiunge un nuovo libro |
| PUT | `/api/admin/libri/{id}` | Aggiorna un libro esistente |
| DELETE | `/api/admin/libri/{id}` | Elimina un libro |
| GET | `/api/admin/prestiti` | Ottiene tutti i prestiti della biblioteca |
| GET | `/api/admin/report/libri-piu-letti` | Ottiene statistiche sui libri più letti |

## 🚀 Installazione

### Prerequisiti
- Java 17
- Node.js e npm
- PostgreSQL o accesso al database cloud
- Maven

### Backend
```bash
cd its-java-finale/biblioteca-backend

# Compila e avvia il backend
mvn spring-boot:run
```

### Frontend
```bash
# In un altro terminale, naviga alla cartella frontend
cd its-java-finale/biblioteca-frontend

# Installa le dipendenze
npm install --force

# Avvia l'applicazione frontend
npm run start
```

L'applicazione sarà disponibile su http://localhost:3000

## 🖥️ Screenshot

### Login (Utente)
![Login](https://i.ibb.co/mCC23X9H/Screenshot-2025-04-15-173020.png)

### Pagina Catalogo Libri (Utente)
![Catalogo Libri](https://i.ibb.co/CGP8VmS/Screenshot-2025-04-15-172857.png)

### Gestione Prestiti (Utente)
![I Miei Prestiti](https://i.ibb.co/LhXHV659/Screenshot-2025-04-15-172912.png)

### Gestione Libri (Amministratore)
![Gestione Libri](https://i.ibb.co/Hf3xMQfk/Screenshot-2025-04-15-172923.png)

### Report Statistici (Amministratore)
![Report Statistici](https://i.ibb.co/s9sgtdRF/Screenshot-2025-04-15-173004.png)

### Registra Utente (Amministratore)
![Registra Utente](https://i.ibb.co/r2qV7qhL/Screenshot-2025-04-15-173013.png)

## 📝 Note di Sviluppo

### Modello Dati
- **Utenti (users)**: Informazioni utente con ruoli (utente o amministratore)
- **Libri (books)**: Dettagli sui libri con titolo, autore, genere, anno e disponibilità
- **Prestiti (loans)**: Relazioni tra utenti e libri con date di inizio, fine e restituzione

### Sicurezza
- Autenticazione basata su JWT con scadenza token
- Ruoli distinti per utenti e amministratori
- Password criptate con BCrypt

### UI/UX
- Design responsive compatibile con dispositivi mobili e desktop
- Tema personalizzato con colori primari e secondari coerenti
- Componenti interattivi con feedback visivo (hover, animazioni, ecc.)
- Messaggi di errore e successo chiari per le operazioni

### Gestione Stato
- Utilizzo di React Context API per gestire lo stato dell'autenticazione
- Gestione locale dello stato nei componenti per dati specifici
- Chiamate API centralizzate nei servizi per riutilizzo del codice

### Best Practices Implementate
- Validazione input lato client e server
- Gestione errori completa con feedback utente
- Separazione delle preoccupazioni (SoC) con architettura a componenti
- Codice DRY (Don't Repeat Yourself) con componenti riutilizzabili
- Design pattern RESTful per le API

---

Progetto sviluppato come esame finale per il corso di Java Developer presso ITS.