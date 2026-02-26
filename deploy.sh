#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}  🚀 TuSecurity Clean Deployment       ${NC}"
echo -e "${BLUE}=======================================${NC}"

cd backend || { echo -e "${RED}❌ Folder 'backend' not found!${NC}"; exit 1; }

# 1. إعداد رابط قاعدة البيانات
echo -e "${GREEN}[1/3] Setting up Database URL...${NC}"
cat <<EOF > .env
DATABASE_URL="postgresql://postgres:TUCC1447%40tucc2026@db.gyqhonidckxzwtjpofic.supabase.co:5432/postgres"
EOF

# 2. بناء الجداول والمزامنة
echo -e "${GREEN}[2/3] Pushing Schema to Supabase via Prisma...${NC}"
npx prisma db push || { echo -e "${RED}❌ Error pushing schema! Aborting.${NC}"; exit 1; }

# 3. الرفع إلى قيت هب
echo -e "${GREEN}[3/3] Committing and Pushing to GitHub...${NC}"
cd ..
git add .
git commit -m "Final Clean Deploy"
git push origin main

echo -e "${GREEN}🎉 All tasks completed successfully! 🎉${NC}"
