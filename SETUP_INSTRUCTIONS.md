# הוראות התקנה והרצה

ראשית - הורד את הקבצים מהGit repo

## שלב 1: התקנת תלויות

פתח Terminal ב-Cursor והרץ:

```powershell
cd <FILE_PATH>
npm install
```

זה יתקין את כל החבילות הנדרשות:
- React
- Express
- Axios
- CORS
- Concurrently

## שלב 2: הרצת האפליקציה

### אופציה 1: הרצה משולבת (מומלץ)

```powershell
npm run dev
```

זה יריץ:
- Backend server על פורט 5000
- React app על פורט 3000

### אופציה 2: הרצה נפרדת

**טרמינל 1 - Backend:**
```powershell
npm run server
```

**טרמינל 2 - Frontend:**
```powershell
npm start
```

## שלב 3: פתיחת האפליקציה

1. חכה לראות "Compiled successfully!" בטרמינל
2. פתח דפדפן
3. גש ל: `http://localhost:3000`

## שימוש באפליקציה

1. הזן מיקום (עיר) בשדה "מיקום"
2. בחר מספר מבוגרים
3. לחץ על "חפש"
4. התוצאות יופיעו למטה בקוביות

## פתרון בעיות

### השרת לא מתחיל
- ודא ש-Node.js מותקן: `node --version`
- ודא ש-npm מותקן: `npm --version`
- מחק `node_modules` והתקן מחדש: `npm install`

### פורט תפוס
- Backend: שנה את `PORT` ב-`server.js` או השתמש ב-`PORT=5001 npm run server`
- Frontend: React יבקש להשתמש בפורט אחר אוטומטית

### שגיאת API
- האפליקציה תציג נתוני דוגמה במצב development אם ה-API לא עובד
- ודא שה-backend רץ לפני ביצוע חיפוש

## מבנה הקבצים

```
boom_assignment/
├── server.js              # Backend server
├── src/
│   ├── App.js            # React component ראשי
│   ├── App.css           # עיצוב
│   └── index.js          # Entry point
├── public/
│   └── index.html        # HTML template
└── package.json          # Dependencies
```

## הערות חשובות

- **אל תסגור את הטרמינל!** השרת צריך להמשיך לרוץ
- ודא שה-backend רץ (פורט 5000) לפני ביצוע חיפוש
- אם יש שגיאת CORS, ודא שה-backend רץ


