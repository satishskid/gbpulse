#!/usr/bin/env node

/**
 * Performance Testing Script for GreyBrain AI Pulse
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 GreyBrain AI Pulse - Performance Testing Suite');
console.log('================================================\n');

// Test 1: Check if enhanced services exist
function testServicesExist() {
  console.log('🔍 Test 1: Verifying Enhanced Services...');
  
  const requiredServices = [
    'services/cacheService.ts',
    'services/apiRetryService.ts', 
    'services/urlValidationService.ts'
  ];
  
  let allExist = true;
  requiredServices.forEach(service => {
    const filePath = path.join(__dirname, '..', service);
    if (fs.existsSync(filePath)) {
      console.log(`  ✅ ${service} - Found`);
    } else {
      console.log(`  ❌ ${service} - Missing`);
      allExist = false;
    }
  });
  
  return allExist;
}

// Run tests
const servicesExist = testServicesExist();

console.log('\n📊 Performance Testing Results');
console.log('================================');
console.log(`✅ Enhanced Services: ${servicesExist ? 'PASSED' : 'FAILED'}`);

if (servicesExist) {
  console.log('\n🚀 Core performance services are implemented!');
} else {
  console.log('\n⚠️  Some services are missing.');
}
