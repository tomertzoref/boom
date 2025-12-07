# Boom Assignment - Hotel Search Widget

אפליקציית Single Page Application לחיפוש מלונות עם React ו-Node.js.

## תכונות

- חיפוש מלונות לפי מיקום (עיר)
- בחירת מספר מבוגרים
- הצגת תוצאות בקוביות עם כל הפרטים
- עיצוב מודרני ומותאם למובייל

## התקנה

### 1. התקן את כל התלויות:
```bash
npm install
```

### 2. הרץ את השרת והאפליקציה:

**אופציה 1: הרצה משולבת (מומלץ)**
```bash
npm run dev
```
זה יריץ את ה-backend (port 5000) וה-frontend (port 3000) יחד.

**אופציה 2: הרצה נפרדת**

טרמינל 1 - Backend:
```bash
npm run server
```

טרמינל 2 - Frontend:
```bash
npm start
```

## שימוש

1. פתח את הדפדפן וגש ל: `http://localhost:3000`
2. הזן מיקום (עיר) בשדה החיפוש
3. בחר מספר מבוגרים
4. לחץ על "חפש"
5. התוצאות יופיעו למטה בקוביות

## מבנה הפרויקט

```
boom_assignment/
├── server.js          # Backend server (Express)
├── src/
│   ├── App.js         # React component ראשי
│   ├── App.css        # עיצוב
│   ├── index.js       # Entry point
│   └── index.css      # Global styles
├── public/
│   └── index.html     # HTML template
└── package.json       # Dependencies
```

## API

האפליקציה משתמשת ב-BoomNow API לחיפוש מלונות.

### Endpoints

- `POST /api/search` - חיפוש מלונות
  - Body: `{ location: string, adults: number }`
  - Returns: רשימת מלונות

## טכנולוגיות

- **Frontend**: React 18.2.0
- **Backend**: Node.js + Express
- **HTTP Client**: Axios
- **Styling**: CSS3 עם Flexbox ו-Grid

## הערות

- השרת רץ על פורט 5000
- האפליקציה רץ על פורט 3000
- ודא שהשרת רץ לפני ביצוע חיפוש
