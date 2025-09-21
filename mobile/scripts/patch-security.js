const fs = require('fs-extra');
const xml2js = require('xml2js');
const path = require('path');

/**
 * Patches Android and iOS security configurations
 * - Android: Network Security Config (HTTPS only, whitelist TheMealDB)
 * - iOS: App Transport Security (ATS) rules
 */

async function patchAndroidSecurity() {
  console.log('🔒 Patching Android security configuration...');
  
  const androidDir = path.join(__dirname, '../android');
  
  if (!fs.existsSync(androidDir)) {
    console.log('⚠️  Android platform not found, skipping Android security patch');
    return;
  }

  // Create network security config
  const networkSecurityConfig = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="false">
        <!-- Allow HTTPS connections to TheMealDB API -->
        <domain includeSubdomains="true">themealdb.com</domain>
    </domain-config>
    <!-- Disable cleartext traffic globally -->
    <base-config cleartextTrafficPermitted="false" />
</network-security-config>`;

  const resXmlDir = path.join(androidDir, 'app/src/main/res/xml');
  await fs.ensureDir(resXmlDir);
  await fs.writeFile(path.join(resXmlDir, 'network_security_config.xml'), networkSecurityConfig);

  // Patch AndroidManifest.xml to reference network security config
  const manifestPath = path.join(androidDir, 'app/src/main/AndroidManifest.xml');
  
  if (fs.existsSync(manifestPath)) {
    let manifest = await fs.readFile(manifestPath, 'utf8');
    
    // Add networkSecurityConfig attribute if not present
    if (!manifest.includes('android:networkSecurityConfig')) {
      manifest = manifest.replace(
        /<application([^>]*)>/,
        '<application$1 android:networkSecurityConfig="@xml/network_security_config">'
      );
      
      await fs.writeFile(manifestPath, manifest);
      console.log('✅ Updated AndroidManifest.xml with network security config');
    } else {
      console.log('ℹ️  Network security config already present in AndroidManifest.xml');
    }
  }
}

async function patchIOSSecurity() {
  console.log('🔒 Patching iOS security configuration...');
  
  const iosDir = path.join(__dirname, '../ios');
  
  if (!fs.existsSync(iosDir)) {
    console.log('⚠️  iOS platform not found, skipping iOS security patch');
    return;
  }

  // Find Info.plist file
  const appDir = path.join(iosDir, 'App');
  const infoPlistPath = path.join(appDir, 'Info.plist');
  
  if (!fs.existsSync(infoPlistPath)) {
    console.log('⚠️  Info.plist not found, skipping iOS security patch');
    return;
  }

  // Parse Info.plist
  const parser = new xml2js.Parser();
  const builder = new xml2js.Builder({
    xmldec: { version: '1.0', encoding: 'UTF-8' },
    doctype: {
      name: 'plist',
      pubid: '-//Apple//DTD PLIST 1.0//EN',
      sysid: 'http://www.apple.com/DTDs/PropertyList-1.0.dtd'
    }
  });
  
  const plistContent = await fs.readFile(infoPlistPath, 'utf8');
  const plist = await parser.parseStringPromise(plistContent);
  
  const dict = plist.plist.dict[0];
  
  // Add App Transport Security settings
  const atsKey = 'NSAppTransportSecurity';
  let atsIndex = dict.key.indexOf(atsKey);
  
  const atsConfig = {
    dict: [{
      key: [
        'NSAllowsArbitraryLoads',
        'NSExceptionDomains'
      ],
      false: [''], // NSAllowsArbitraryLoads = false
      dict: [{
        key: ['themealdb.com'],
        dict: [{
          key: ['NSExceptionAllowsInsecureHTTPLoads', 'NSIncludesSubdomains'],
          false: [''], // Only HTTPS allowed
          true: [''] // Include subdomains
        }]
      }]
    }]
  };
  
  if (atsIndex === -1) {
    // Add ATS configuration
    dict.key.push(atsKey);
    dict.dict.push(atsConfig);
    console.log('✅ Added App Transport Security configuration to Info.plist');
  } else {
    // Update existing ATS configuration
    dict.dict[atsIndex] = atsConfig;
    console.log('✅ Updated existing App Transport Security configuration in Info.plist');
  }
  
  // Write back to file
  const updatedPlist = builder.buildObject(plist);
  await fs.writeFile(infoPlistPath, updatedPlist);
}

async function main() {
  try {
    await patchAndroidSecurity();
    await patchIOSSecurity();
    console.log('🎉 Security patches completed successfully!');
  } catch (error) {
    console.error('❌ Error patching security configurations:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { patchAndroidSecurity, patchIOSSecurity };