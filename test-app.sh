#!/bin/bash

# Quick test script for Pokémon App
# This script helps you test the application step by step

echo "=========================================="
echo "Pokémon App - Testing Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js is installed${NC}"
echo ""

# Check backend dependencies
echo "Checking backend dependencies..."
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    cd backend && npm install && cd ..
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to install backend dependencies${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Backend dependencies already installed${NC}"
fi

# Check frontend dependencies
echo "Checking frontend dependencies..."
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    cd frontend && npm install && cd ..
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to install frontend dependencies${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
fi

# Check frontend .env file
echo "Checking frontend .env file..."
if [ ! -f "frontend/.env" ]; then
    echo -e "${YELLOW}Creating frontend .env file...${NC}"
    echo "REACT_APP_API_URL=http://localhost:3001/api" > frontend/.env
    echo -e "${GREEN}✓ Frontend .env file created${NC}"
else
    echo -e "${GREEN}✓ Frontend .env file exists${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}Setup complete!${NC}"
echo "=========================================="
echo ""
echo "To start the application:"
echo ""
echo "1. Open a terminal and start the backend:"
echo "   ${YELLOW}cd backend && npm start${NC}"
echo ""
echo "2. Open another terminal and start the frontend:"
echo "   ${YELLOW}cd frontend && npm start${NC}"
echo ""
echo "3. The app will open at http://localhost:3000"
echo ""
echo "Login credentials:"
echo "   Username: ${YELLOW}admin${NC}"
echo "   Password: ${YELLOW}admin${NC}"
echo ""
echo "For detailed testing instructions, see TESTING.md"
echo ""
