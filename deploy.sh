#!/bin/bash

# ألوان لتجميل المخرجات في التيرمنال
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}  🚀 TuSecurity Deployment Automation  ${NC}"
echo -e "${BLUE}=======================================${NC}"

# الدخول لمجلد الباك إند
cd backend || { echo -e "${RED}❌ Folder 'backend' not found!${NC}"; exit 1; }

# 1. إعداد رابط قاعدة البيانات في الباك إند
echo -e "${GREEN}[1/4] Setting up Database URL...${NC}"
cat <<EOF > .env
DATABASE_URL="postgresql://postgres:TUCC1447%40tucc2026@db.gyqhonidckxzwtjpofic.supabase.co:5432/postgres"
EOF
echo -e "✅ .env file updated successfully."

# 2. إصلاح تعارض Prisma للإصدار 7.4.1 آلياً
echo -e "${YELLOW}[2/4] Fixing Prisma schema compatibility...${NC}"
sed -i '/url[[:space:]]*=[[:space:]]*env("DATABASE_URL")/d' prisma/schema.prisma
echo -e "✅ Prisma schema fixed automatically."

# 3. بناء الجداول في Supabase
echo -e "${GREEN}[3/4] Pushing Schema to Supabase via Prisma...${NC}"
npx prisma db push

if [ $? -eq 0 ]; then
    echo -e "✅ Database schema pushed successfully."
else
    echo -e "${RED}❌ Error pushing database schema! Aborting deployment.${NC}"
    exit 1
fi

# 4. رفع التعديلات إلى قيت هب
echo -e "${GREEN}[4/4] Committing and Pushing to GitHub...${NC}"
cd .. # العودة للمجلد الرئيسي للمشروع
git add .
git commit -m "Auto-deploy: Final migration to PostgreSQL and Prisma"
git push origin main

echo -e "${BLUE}=======================================${NC}"
echo -e "${GREEN} 🎉 All tasks completed successfully! 🎉 ${NC}"
echo -e "${BLUE}=======================================${NC}"

