const fs = require("fs");
const { Transform } = require("stream");
const { pipeline } = require("stream/promises");

class CSVParser extends Transform {
  constructor(options = {}) {
    super({ objectMode: true });
    this.headers = null;
    this.lineNumber = 0;
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    try {
      const chunkString = chunk.toString('utf8');
      this.buffer += chunkString;
      const lines = this.buffer.split('\n');
      this.buffer = lines.pop();
      for (const line of lines) {
        const record = line.split(',');
      }
    } catch (error) {
      callback(error);
    }
  }

  _flush(callback) {

    try {
      if (this.buffer) {
        const record = this.buffer.split('\n')[0];
        this.push(record);
      }
      callback();
    } catch (error) {
      callback(error);
    }
  }
}

/**
 * Data Transformer Stream
 * Applies transformations to each record
 */
class DataTransformer extends Transform {
  constructor(options = {}) {
    super({ objectMode: true });
  }

  _transform(record, encoding, callback) {
    try {
      this.push({
        name: capitalizeName(record.name),
        email: normalizeEmail(record.email),
        phone: formatPhone(record.phone),
        birthdate: standardizeDate(record.birthdate),
        city: capitalizeName(record.city),
      });
      callback();
    } catch (error) {
      callback(error);
    }
  }
}

/**
 * CSV Writer Transform Stream
 * Converts objects back to CSV format
 */
class CSVWriter extends Transform {
  constructor(options = {}) {
    super({ objectMode: true });
    this.headerWritten = false;

  }

  _transform(record, encoding, callback) {
    try {
      if (!this.headerWritten) {
        this.headerWritten = true;
        this.push(escapeCSVField(Object.keys(record).join(',')));
      }
      this.push(escapeCSVField(Object.values(record).join(',')));
    } catch (error) {
      callback(error);
    }
  }
}

/**
 * Helper Functions
 */
/**
 * Escape CSV field
 * @param {string} value - Value to escape
 * @returns {string} Escaped value
 */
function escapeCSVField(value) {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Capitalize names properly
 * @param {string} name - Name to capitalize
 * @returns {string} Capitalized name
 */
function capitalizeName(name) {
  // TODO: Implement name capitalization
  // 1. Handle empty/null names
  // 2. Split by spaces and hyphens
  // 3. Capitalize each part
  // 4. Join back together
  // Examples:
  // "john doe" → "John Doe"
  // "mary-jane smith" → "Mary-Jane Smith"

  if (!name) {
    return name;
  }
  const parts = name.split(' ');
  for (const part of parts) {
    const newPart = part.toLowerCase();
    parts[parts.indexOf(part)] = newPart;
    if (newPart.includes('-')) {
      const [first, last] = newPart.split('-');
      parts[parts.indexOf(newPart)] = first.charAt(0).toUpperCase() + first.slice(1) + '-' + last.charAt(0).toUpperCase() + last.slice(1);
    } else {
      parts[parts.indexOf(newPart)] = newPart.charAt(0).toUpperCase() + newPart.slice(1);
    }
  }
  return parts.join(' ');
}

/**
 * Normalize email addresses
 * @param {string} email - Email to normalize
 * @returns {string} Normalized email or original if invalid
 */
function normalizeEmail(email) {
  if (!email) {
    return email;
  }
  if (!email.includes('@') || !email.includes('.')) {
    return email;
  }
  return email.toLowerCase();
}

/**
 * Format phone numbers
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone or "INVALID"
 */
function formatPhone(phone) {
  if (!phone) {
    return phone;
  }
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 10) {
    return "INVALID";
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/**
 * Checks that year/month/day form a real calendar date (no rollover in Date).
 * @param {number} year
 * @param {number} month 1–12
 * @param {number} day 1–31
 * @returns {boolean}
 */
function isValidCalendarDate(year, month, day) {
  if (![year, month, day].every(Number.isFinite)) {
    return false;
  }
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }
  const dt = new Date(year, month - 1, day);
  return (
    dt.getFullYear() === year &&
    dt.getMonth() === month - 1 &&
    dt.getDate() === day
  );
}

/**
 * Standardize date formats
 * @param {string} date - Date to standardize
 * @returns {string} Date in YYYY-MM-DD format, or original if invalid / unknown format
 */
function standardizeDate(date) {
  if (date === undefined || date === null || date === "") {
    return date;
  }

  const s = String(date).trim();

  const formatYMD = (y, m, d) =>
    `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const formats = [
    [/^(\d{4})-(\d{2})-(\d{2})$/, (x) => [+x[1], +x[2], +x[3]]],
    [/^(\d{4})\/(\d{2})\/(\d{2})$/, (x) => [+x[1], +x[2], +x[3]]],
    [/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, (x) => [+x[3], +x[1], +x[2]]],
  ];

  for (const [re, toYMD] of formats) {
    const m = s.match(re);
    if (!m) {
      continue;
    }
    const [y, mo, d] = toYMD(m);
    return isValidCalendarDate(y, mo, d) ? formatYMD(y, mo, d) : date;
  }

  return date;
}

/**
 * Main function to process CSV file
 * @param {string} inputPath - Path to input CSV file
 * @param {string} outputPath - Path to output CSV file
 * @returns {Promise} Promise that resolves when processing is complete
 */
async function processCSVFile(inputPath, outputPath) {
  // TODO: Implement the main processing pipeline
  // 1. Create read stream from input file
  // 2. Create transform streams (CSVParser, DataTransformer, CSVWriter)
  // 3. Create write stream to output file
  // 4. Use pipeline() to connect all streams
  // 5. Handle errors appropriately
  // 6. Return promise that resolves when complete

  try {
    await pipeline(
      fs.createReadStream(inputPath),
      new CSVParser(),
      new DataTransformer(),
      new CSVWriter(),
      fs.createWriteStream(outputPath, { encoding: 'utf8' })
    );
  } catch (error) {
    throw new Error(`Failed to process CSV file: ${error.message}`);
  }
}

/**
 * Create sample input data for testing
 */
function createSampleData() {
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
  }
  fs.writeFileSync('data/users.csv', `name,email,phone,birthdate,city
    john doe,JOHN.DOE@EXAMPLE.COM,1234567890,12/25/1990,new york
    jane smith,Jane.Smith@Gmail.Com,555-123-4567,1985-03-15,los angeles
    bob johnson,BOB@TEST.COM,invalid-phone,03/22/1992,chicago
    alice brown,alice.brown@company.org,9876543210,1988/07/04,houston`);

  fs.writeFileSync('data/users_transformed.csv', `name,email,phone,birthdate,city
    John Doe,john.doe@example.com,(123) 456-7890,1990-12-25,New York
    Jane Smith,jane.smith@gmail.com,(555) 123-4567,1985-03-15,Los Angeles
    Bob Johnson,bob@test.com,INVALID,1992-03-22,Chicago
    Alice Brown,alice.brown@company.org,(987) 654-3210,1988-07-04,Houston`);

}

// Export classes and functions
module.exports = {
  CSVParser,
  DataTransformer,
  CSVWriter,
  processCSVFile,
  capitalizeName,
  normalizeEmail,
  formatPhone,
  standardizeDate,
  isValidCalendarDate,
  createSampleData,
};

// Example usage (for testing):
const isReadyToTest = false;

if (isReadyToTest) {
  // Create sample data
  createSampleData();

  // Process the file
  processCSVFile("data/users.csv", "data/users_transformed.csv")
    .then(() => {
      console.log("✅ File transformation completed successfully!");

      // Read and display results
      const output = fs.readFileSync("data/users_transformed.csv", "utf-8");
      console.log("\n📄 Transformed CSV output:");
      console.log(output);
    })
    .catch((error) => {
      console.error("❌ Error processing file:", error.message);
    });
}
