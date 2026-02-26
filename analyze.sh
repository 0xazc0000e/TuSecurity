#!/bin/bash

# ألوان لتوضيح التقرير في التيرمنال
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}  🕵️‍♂️ TuSecurity Code Analyzer 🕵️‍♂️  ${NC}"
echo -e "${BLUE}=======================================${NC}"

# التأكد من وجود مجلد الباك إند
if [ ! -d "backend" ]; then
    echo -e "${RED}❌ Folder 'backend' not found! Please run this script from the root project folder.${NC}"
    exit 1
fi

echo -e "${YELLOW}Scanning 'backend' routes and controllers...${NC}\n"

# البحث عن أوامر SQLite القديمة
SQLITE_COUNT=$(grep -rnw 'backend' -e 'db.run' -e 'db.get' -e 'db.all' | wc -l)

# البحث عن أوامر Prisma الحديثة
PRISMA_COUNT=$(grep -rnw 'backend' -e 'prisma\.' -e 'PrismaClient' | wc -l)

# طباعة التقرير
echo -e "📊 **Scan Results:**"
echo -e "-------------------"
echo -e "🔹 Old SQLite commands found: ${RED}${SQLITE_COUNT}${NC}"
echo -e "🔹 Modern Prisma commands found: ${GREEN}${PRISMA_COUNT}${NC}"
echo -e "-------------------\n"

# تحليل النتيجة
if [ "$SQLITE_COUNT" -gt 0 ] && [ "$PRISMA_COUNT" -eq 0 ]; then
    echo -e "${RED}⚠️ Conclusion: Your routes are still fully written in the old SQLite format.${NC}"
elif [ "$PRISMA_COUNT" -gt 0 ] && [ "$SQLITE_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✅ Conclusion: Excellent! Your routes are fully modernized to use Prisma.${NC}"
elif [ "$SQLITE_COUNT" -gt 0 ] && [ "$PRISMA_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}⚠️ Conclusion: Mixed usage! You have both SQLite and Prisma commands in your code.${NC}"
else
    echo -e "${YELLOW}❓ Conclusion: No database commands found or different syntax used.${NC}"
fi

echo -e "\n${BLUE}=======================================${NC}"

