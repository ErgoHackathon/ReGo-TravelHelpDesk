#!/bin/bash

# ReGo Authentication API Test Script
# Run this after starting the backend server

echo "🧪 ReGo API Authentication Tests"
echo "=================================="
echo ""

BASE_URL="http://localhost:8080/api/v1"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo "Test 1: Health Check"
echo "--------------------"
response=$(curl -s -w "%{http_code}" -o /tmp/health.json ${BASE_URL%/api/v1}/health)
if [ "$response" = "200" ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
    cat /tmp/health.json | python3 -m json.tool 2>/dev/null || cat /tmp/health.json
else
    echo -e "${RED}✗ Health check failed (HTTP $response)${NC}"
fi
echo ""

# Test 2: User Registration
echo "Test 2: User Registration"
echo "-------------------------"
TIMESTAMP=$(date +%s)
TEST_EMAIL="test${TIMESTAMP}@company.com"

response=$(curl -s -w "%{http_code}" -o /tmp/register.json -X POST ${BASE_URL}/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${TEST_EMAIL}\",
    \"password\": \"Test123!\",
    \"firstName\": \"Test\",
    \"lastName\": \"User\",
    \"role\": \"EMPLOYEE\",
    \"department\": \"Engineering\"
  }")

if [ "$response" = "201" ]; then
    echo -e "${GREEN}✓ Registration successful${NC}"
    ACCESS_TOKEN=$(cat /tmp/register.json | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    USER_ID=$(cat /tmp/register.json | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    echo "Email: ${TEST_EMAIL}"
    echo "Token: ${ACCESS_TOKEN:0:20}..."
else
    echo -e "${RED}✗ Registration failed (HTTP $response)${NC}"
    cat /tmp/register.json
fi
echo ""

# Test 3: Login
echo "Test 3: Login"
echo "-------------"
response=$(curl -s -w "%{http_code}" -o /tmp/login.json -X POST ${BASE_URL}/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${TEST_EMAIL}\",
    \"password\": \"Test123!\"
  }")

if [ "$response" = "200" ]; then
    echo -e "${GREEN}✓ Login successful${NC}"
    ACCESS_TOKEN=$(cat /tmp/login.json | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    REFRESH_TOKEN=$(cat /tmp/login.json | grep -o '"refreshToken":"[^"]*' | cut -d'"' -f4)
    echo "Access Token: ${ACCESS_TOKEN:0:20}..."
    echo "Refresh Token: ${REFRESH_TOKEN:0:20}..."
else
    echo -e "${RED}✗ Login failed (HTTP $response)${NC}"
    cat /tmp/login.json
fi
echo ""

# Test 4: Get Profile (Protected Route)
echo "Test 4: Get Profile (Protected Route)"
echo "--------------------------------------"
response=$(curl -s -w "%{http_code}" -o /tmp/profile.json -X GET ${BASE_URL}/auth/profile \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

if [ "$response" = "200" ]; then
    echo -e "${GREEN}✓ Profile retrieved successfully${NC}"
    cat /tmp/profile.json | python3 -m json.tool 2>/dev/null || cat /tmp/profile.json
else
    echo -e "${RED}✗ Profile retrieval failed (HTTP $response)${NC}"
    cat /tmp/profile.json
fi
echo ""

# Test 5: Update Profile
echo "Test 5: Update Profile"
echo "----------------------"
response=$(curl -s -w "%{http_code}" -o /tmp/update.json -X PUT ${BASE_URL}/auth/profile \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"firstName\": \"Updated\",
    \"phone\": \"+919876543210\"
  }")

if [ "$response" = "200" ]; then
    echo -e "${GREEN}✓ Profile updated successfully${NC}"
    cat /tmp/update.json | python3 -m json.tool 2>/dev/null || cat /tmp/update.json
else
    echo -e "${RED}✗ Profile update failed (HTTP $response)${NC}"
    cat /tmp/update.json
fi
echo ""

# Test 6: Logout
echo "Test 6: Logout"
echo "--------------"
response=$(curl -s -w "%{http_code}" -o /tmp/logout.json -X POST ${BASE_URL}/auth/logout \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

if [ "$response" = "200" ]; then
    echo -e "${GREEN}✓ Logout successful${NC}"
    cat /tmp/logout.json
else
    echo -e "${RED}✗ Logout failed (HTTP $response)${NC}"
    cat /tmp/logout.json
fi
echo ""

# Test 7: Access Protected Route Without Token (Should Fail)
echo "Test 7: Access Protected Route Without Token"
echo "---------------------------------------------"
response=$(curl -s -w "%{http_code}" -o /tmp/noauth.json -X GET ${BASE_URL}/auth/profile)

if [ "$response" = "401" ]; then
    echo -e "${GREEN}✓ Correctly blocked unauthorized access${NC}"
    cat /tmp/noauth.json
else
    echo -e "${YELLOW}⚠ Expected 401 but got HTTP $response${NC}"
    cat /tmp/noauth.json
fi
echo ""

# Summary
echo "=================================="
echo "Test Summary"
echo "=================================="
echo "✓ = Test Passed"
echo "✗ = Test Failed"
echo ""
echo "If all tests passed, your authentication system is working correctly! 🎉"
echo ""
echo "Test user created:"
echo "Email: ${TEST_EMAIL}"
echo "Password: Test123!"
echo ""
echo "You can now test the frontend with these credentials."

# Cleanup
rm -f /tmp/health.json /tmp/register.json /tmp/login.json /tmp/profile.json /tmp/update.json /tmp/logout.json /tmp/noauth.json
