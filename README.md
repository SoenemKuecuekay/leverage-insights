# LEVERAGE STRATEGIES - Insights System

Automatisiertes Insights-Blog mit monatlicher AI-gestützter Artikel-Generierung.

## 🚀 Features

- **Automatische Generierung**: Am 1. jeden Monats wird ein neuer Artikel generiert
- **Email-Benachrichtigung**: Du erhältst eine Email zur Freigabe
- **Einfache Freigabe**: Ein Klick im GitHub Actions Dashboard
- **Automatische Archivierung**: Ältere Artikel werden nach 18 Monaten archiviert

## 📁 Struktur

```
leverage-insights/
├── data/
│   └── articles.json      # Artikel-Datenbank
├── scripts/
│   ├── generate-article.js    # GPT-Generierung
│   └── approve-article.js     # Freigabe-Script
├── .github/
│   └── workflows/
│       └── generate-article.yml  # GitHub Actions
├── insights.html          # Die Insights-Seite
└── package.json
```

## ⚙️ Setup

### 1. Repository Secrets einrichten

Im GitHub Repository unter Settings → Secrets → Actions:

| Secret | Beschreibung |
|--------|--------------|
| `OPENAI_API_KEY` | Dein OpenAI API Key |
| `SMTP_USERNAME` | Email-Absender (optional) |
| `SMTP_PASSWORD` | Email-Passwort (optional) |

### 2. Dependencies installieren

```bash
npm install
```

### 3. Manuell testen

```bash
# Artikel generieren
npm run generate

# Pending Artikel anzeigen
npm run approve:list

# Neuesten Artikel freigeben
npm run approve
```

## 📧 Freigabe-Workflow

1. **Artikel wird generiert** (automatisch am 1. des Monats)
2. **Email-Benachrichtigung** an d.kuecuekay@extra-group.com
3. **Artikel prüfen** in `data/articles.json`
4. **Freigabe** via GitHub Actions → "Approve Article" → Run workflow
5. **Artikel ist live** auf der Insights-Seite

## 🔧 Konfiguration

In `scripts/generate-article.js`:

```javascript
const CONFIG = {
  model: 'gpt-4o',        // GPT Model
  maxArticles: 18,        // Max Artikel bevor archiviert wird
  categories: [...]       // Verfügbare Kategorien mit Gewichtung
};
```

## 📊 Kategorien

| Kategorie | Gewichtung | Beschreibung |
|-----------|------------|--------------|
| AI & Automation | 3 | Enterprise AI, Tools, Workflows |
| Creator Economy | 2 | Monetarisierung, Plattformen |
| Hospitality | 2 | Hotel Marketing, Direct Booking |
| Strategy | 2 | Digital ROI, Analytics |
| Case Study | 1 | Erfolgsgeschichten |

## 🔄 Manuelle Generierung

Du kannst jederzeit manuell einen Artikel generieren:

1. GitHub → Actions → "Generate Monthly Insight"
2. "Run workflow" klicken
3. Optional: Kategorie auswählen

---

**LEVERAGE STRATEGIES** - Digital Excellence for Creators, Hospitality & Enterprise
