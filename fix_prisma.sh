#!/bin/bash

# ألوان للتنسيق
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}      🛠️ Prisma Output Fixer 🛠️      ${NC}"
echo -e "${BLUE}=======================================${NC}"

# التأكد من وجود مجلد الباك إند
if [ ! -d "backend" ]; then
    echo -e "${RED}❌ Folder 'backend' not found. Please run this in the root project folder.${NC}"
    exit 1
fi

SCHEMA_FILE="backend/prisma/schema.prisma"

if [ -f "$SCHEMA_FILE" ]; then
    # عملية جراحية: البحث عن أي سطر يحتوي على كلمة output وحذفه
    sed -i '/output[[:space:]]*=/d' "$SCHEMA_FILE"
    
    echo -e "${GREEN}✅ Successfully removed custom 'output' path from schema.prisma.${NC}"
    echo -e "Prisma will now generate the client in the default node_modules folder."
else
    echo -e "${RED}❌ Could not find schema file at $SCHEMA_FILE${NC}"
    exit 1
fi

echo -e "\n${GREEN}🎉 All set! You are ready to deploy. 🎉${NC}"
echo -e "${BLUE}=======================================${NC}"
