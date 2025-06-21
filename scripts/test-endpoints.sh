#!/bin/bash

echo "🧪 Testing Database API Endpoints..."
echo "=================================="

# Set the base URL (change this to your deployed URL)
BASE_URL="${NEXT_PUBLIC_API_URL:-http://localhost:3000}"

echo "🌐 Base URL: $BASE_URL"
echo ""

# Test 1: Database Setup (GET)
echo "1️⃣ Testing /api/database/setup (GET)..."
echo "----------------------------------------"
curl -s -w "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" \
  -H "Accept: application/json" \
  "$BASE_URL/api/database/setup" | jq '.' 2>/dev/null || echo "Response is not valid JSON"

echo ""
echo "=================================="
echo ""

# Test 2: Database Setup (POST)
echo "2️⃣ Testing /api/database/setup (POST)..."
echo "-----------------------------------------"
curl -s -w "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  "$BASE_URL/api/database/setup" | jq '.' 2>/dev/null || echo "Response is not valid JSON"

echo ""
echo "=================================="
echo ""

# Test 3: Supabase Test (GET)
echo "3️⃣ Testing /api/database/test-supabase (GET)..."
echo "------------------------------------------------"
curl -s -w "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" \
  -H "Accept: application/json" \
  "$BASE_URL/api/database/test-supabase" | jq '.' 2>/dev/null || echo "Response is not valid JSON"

echo ""
echo "=================================="
echo ""

# Test 4: Supabase Test (POST)
echo "4️⃣ Testing /api/database/test-supabase (POST)..."
echo "-------------------------------------------------"
curl -s -w "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  "$BASE_URL/api/database/test-supabase" | jq '.' 2>/dev/null || echo "Response is not valid JSON"

echo ""
echo "🏁 Testing completed!"
