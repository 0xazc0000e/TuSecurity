# 🔧 TUCC Backend Debug Guide

## المشكلة
صفحة تسجيل الدخول وإنشاء الحساب لا تعمل، والـ backend لا يبدأ بشكل صحيح.

## الحلول المقترحة

### 1. تشغيل Backend يدوياً
```bash
cd /home/azo/Documents/tu_clup_cyper_the_end111/backend

# تثبيت الاعتماديات
npm install

# تشغيل السيرفر
npm start
```

### 2. استخدام Vite Dev Server للـ Frontend
```bash
cd /home/azo/Documents/tu_clup_cyper_the_end111

# تشغيل الواجهة الأمامية
npm run dev
```

### 3. التحقق من المنافذ
- Frontend: http://localhost:5173 أو http://localhost:5174
- Backend: http://localhost:3001

### 4. اختبار API
```bash
# اختبار اتصال الـ backend
curl http://localhost:3001/test

# اختبار API endpoint
curl http://localhost:3001/api/test
```

## خطوات الإصلاح

### الخطوة 1: إعادة تثبيت الاعتماديات
```bash
rm -rf node_modules package-lock.json
npm install
```

### الخطوة 2: تشغيل السيرفرات بشكل منفصل
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend  
npm run dev
```

### الخطوة 3: التحقق من المتغيرات البيئية
```bash
# إنشاء ملف .env في backend/
echo "PORT=3001
JWT_SECRET=tu-cyber-security-secret-key-2024
DB_PATH=./cyberclub.db
FRONTEND_URL=http://localhost:5174" > backend/.env
```

## ملاحظات هامة
- تأكد من أن Node.js مثبت بشكل صحيح
- تأكد من أن المنافذ 3001 و 5174 متاحة
- تحقق من ملفات السجل لأي أخطاء
