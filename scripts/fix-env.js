const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

if (fs.existsSync(envPath)) {
  let content = fs.readFileSync(envPath, 'utf8');
  
  // Check if DIRECT_URL is already defined
  const hasDirectUrl = content.split('\n').some(line => {
    const trimmed = line.trim();
    return trimmed.startsWith('DIRECT_URL=') && !trimmed.startsWith('#');
  });

  if (!hasDirectUrl) {
    // Find active DATABASE_URL
    let dbUrl = null;
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('DATABASE_URL=') && !trimmed.startsWith('#')) {
        dbUrl = trimmed.substring('DATABASE_URL='.length).trim();
        break;
      }
    }

    if (dbUrl) {
      // Append DIRECT_URL to the file
      fs.appendFileSync(envPath, `\n# Added automatically by fix-env script\nDIRECT_URL=${dbUrl}\n`, 'utf8');
      console.log('Auto-configured DIRECT_URL in local .env to match DATABASE_URL');
    } else {
      console.warn('DATABASE_URL not found in .env, cannot auto-configure DIRECT_URL');
    }
  }
} else {
  console.log('.env file does not exist. Skipping auto-configuration of DIRECT_URL');
}
