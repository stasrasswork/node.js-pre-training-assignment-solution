const fs = require("fs");
const fsPromises = require("fs").promises;
const util = require("util");

/**
 * Event Loop Analysis and Async Debugging
 * Learn Node.js event loop phases and fix broken async code
 */

/**
 * Analyze execution order of event loop phases
 * @returns {object} Analysis of execution order
 */
function analyzeEventLoop() {

  const executionOrder = [];

  const log = (msg) => executionOrder.push(msg);
  
  log("start");
  process.nextTick(() => log("microtask:nextTick #1"));
  Promise.resolve().then(() => log("microtask:promise #1"));

  setTimeout(() => {
    log("timers:setTimeout #1");

    process.nextTick(() => log("microtask in timers:nextTick"));
    Promise.resolve().then(() => log("microtask in timers:promise"));
  }, 0);

  setImmediate(() => log("check:setImmediate #1"));
  fs.readFile(__filename, () => {
    log("poll:fs.readFile");
    setImmediate(() => log("check after poll:setImmediate"));
    setTimeout(() => log("timers after poll:setTimeout(0)"), 0);
  });

  const s = fs.createReadStream(__filename);

  s.on("close", () => log("close callbacks:stream close"));
  s.destroy();
  
  log("sync:end");

  const analysis = {
    phases: [
      "timers",
      "pending callbacks",
      "idle/prepare (internal)",
      "poll",
      "check",
      "close callbacks",
    ],
    executionOrder: executionOrder,
    explanations: [
      "Synchronous code executes first.",
      "process.nextTick queue runs before Promise microtasks in Node.js.",
      "Microtasks run before moving to the next event loop phase.",
      "setTimeout callbacks execute in Timers phase.",
      "I/O callbacks (fs.readFile) are handled in Poll phase.",
      "setImmediate callbacks execute in Check phase.",
      "Close events execute in Close Callbacks phase.",
      "Inside I/O callback, setImmediate often fires before setTimeout(0).",
    ],
  };

  return analysis;
}

/**
 * Predict execution order for code snippets
 * @param {string} snippet - Code snippet identifier
 * @returns {array} Predicted execution order
 */
function predictExecutionOrder(snippet) {
  const predictions = {
    snippet1: [
      "Start",
      "End",
      "Next Tick 1",
      "Next Tick 2",
      "Promise 1",
      "Promise 2",
      "Timer 1",
      "Timer 2",
      "Immediate 1",
      "Immediate 2",
    ],
    snippet2: [
      "=== Start ===",
      "=== End ===",
      "NextTick",
      "Nested NextTick",
      "Timer",
      "NextTick in Timer",
      "Immediate",
      "NextTick in Immediate",
      "fs.readFile",
      "NextTick in readFile",
      "Immediate in readFile",
      "Timer in readFile"
    ],
  };

  return predictions[snippet] || [];
}

/**
 * Fix race condition in file processing
 * @returns {Promise} Promise that resolves when files are processed
 */
async function fixRaceCondition() {
  const files = ["file1.txt", "file2.txt", "file3.txt"];
  const timeoutMs = 3000;

  try {
    const result = await withTimeout(Promise.all(
      files.map(async (fileName, index) => {
        const content = await withTimeout(
          fsPromises.readFile(fileName, "utf8"),
          timeoutMs,
          `read ${fileName}`
        );

        return {
          index,
          file: fileName,
          content: content.trim(),
        };
      })

    ), timeoutMs, "fixRaceCondition");
    return result;
  } catch (error) {
    throw new Error(`Failed to process files: ${error.message}`);
  }
}

/**
 * Convert callback hell to async/await
 * @param {number} userId - User ID to process
 * @returns {Promise} Promise that resolves with processed user data
 */
async function fixCallbackHell(userId) {
  const timeoutMs = 3000;
  const readJsonWithFallback = async (path, fallbackValue) => {
    try {
      const raw = await withTimeout(
        fsPromises.readFile(path, "utf8"),
        timeoutMs,
        `read ${path}`
      );
      try {
        return JSON.parse(raw);
      } catch (parseError) {
        return fallbackValue;
      }
    } catch (readError) {
      if (readError.code === "ENOENT") {
        return fallbackValue;
      }
      throw readError;
    }
  };
  try {
    const user = await readJsonWithFallback(`user-${userId}.json`, {
      id: userId,
      name: "Unknown",
      email: "unknown@example.com",
    });
    const preferences = await readJsonWithFallback(`preferences-${user.id}.json`, {
      theme: "light",
      language: "en",
      notifications: true,
    });
    const activity = await readJsonWithFallback(`activity-${user.id}.json`, {
      lastLogin: "2025-01-01",
      sessionsCount: 0,
      totalTime: 0,
    });
    const combinedData = {
      user,
      preferences,
      activity,
      processedAt: new Date().toISOString(),
    };
    await withTimeout(
      fsPromises.writeFile(
        `processed-${user.id}.json`,
        JSON.stringify(combinedData, null, 2),
        "utf8"
      ),
      timeoutMs,
      `write processed-${user.id}.json`
    );
    return combinedData;
  } catch (error) {
    throw new Error(`Failed to process user data: ${error.message}`);
  }
}

/**
 * Fix mixed promises and callbacks
 * @returns {Promise} Promise that resolves when processing is complete
 */
async function fixMixedAsync() {
  const timeoutMs = 3000;
  try {
    logWithPhase("processing: start reading input", "async");

    let data;
    try {
      data = await withTimeout(fsPromises.readFile("input.txt", "utf8"), timeoutMs, "read input.txt");
      logWithPhase("processing: input file found", "poll");
    } catch (error) {
      if (error.code === "ENOENT") {
        logWithPhase("processing: input missing, creating default input", "async");
        
        const writeData = "Hello World!";
        await withTimeout(fsPromises.writeFile("input.txt", writeData, "utf8"), timeoutMs, "write input.txt");
        data = await withTimeout(fsPromises.readFile("input.txt", "utf8"), timeoutMs, "re-read input.txt");
      } else {
        throw error;
      }
    }
    logWithPhase("processing: transforming input to uppercase", "async");
    const processedData = data.toUpperCase();

    await withTimeout(fsPromises.writeFile("output.txt", processedData, "utf8"), timeoutMs, "write output.txt");
    logWithPhase("completed: output written", "async");

    const verifyData = await withTimeout(fsPromises.readFile("output.txt", "utf8"), timeoutMs, "read output.txt");
    logWithPhase("result: output verified", "async");
    
    return {
      success: true,
      data: processedData,
      verifyData,
      processedDataLength: processedData.length,
      verifyDataLength: verifyData.length,
    }
  } catch (error) {
    throw new Error(`Failed to process data: ${error.message}`);
  }
}

/**
 * Demonstrate all event loop phases
 * @returns {Promise} Promise that resolves when demonstration is complete
 */
async function demonstrateEventLoop() {
  // TODO: Create comprehensive event loop demonstration
  // 1. Show timers phase (setTimeout, setInterval)
  // 2. Show pending callbacks phase
  // 3. Show poll phase (I/O operations)
  // 4. Show check phase (setImmediate)
  // 5. Show close callbacks phase
  // 6. Demonstrate microtask priority (nextTick, Promises)
  const tracer = createAsyncTracer("event-loop-demo");
  const log = (msg, phase = "phase", meta = {}) => {
    tracer.mark(msg, phase, meta);
  };

  log("start", "phase");

  setTimeout(() => {
    log("timers:setTimeout", "timers");
  }, 0);

  setImmediate(() => log("check:setImmediate", "check"));

  fs.readFile(__filename, () => {
    log("poll:fs.readFile", "poll");

    setImmediate(() => log("check after poll:setImmediate", "check"));
    setTimeout(() => log("timers after poll:setTimeout(0)", "timers"), 0);
  });

  process.nextTick(() => log("microtask:nextTick", "microtask"));

  Promise.resolve().then(() => log("microtask:promise", "microtask"));

  log("sync:end", "phase");

  const s = fs.createReadStream(__filename);
  s.on("close", () => log("close callbacks:stream close", "close"));
  s.destroy();

  await withTimeout(
    new Promise((resolve) => setTimeout(resolve, 25)),
    200,
    "demonstrateEventLoop settle"
  );
  const diagram = createEventLoopDiagram(tracer.flush());
  logWithPhase(`diagram:\n${diagram}`, "phase");

  return {
    success: true,
    events: tracer.flush(),
    diagram,
  };
}

/**
 * Create test files for debugging exercises
 */
async function createTestFiles() {
  // TODO: Create test files for the exercises
  // 1. Create sample user data files
  // 2. Create input files for processing
  // 3. Handle file creation errors gracefully

  const testData = {
    "user-123.json": {
      id: 123,
      name: "John Doe",
      email: "john@example.com",
    },
    "preferences-123.json": {
      theme: "dark",
      language: "en",
      notifications: true,
    },
    "activity-123.json": {
      lastLogin: "2025-01-01",
      sessionsCount: 42,
      totalTime: 3600,
    },
    "input.txt": "Hello World! This is test data for processing.",
    "file1.txt": "Content of file 1",
    "file2.txt": "Content of file 2",
    "file3.txt": "Content of file 3",
  };
  for (const [filename, content] of Object.entries(testData)) {
    try {
      await fsPromises.writeFile(filename, 
        JSON.stringify(content, null, 2), "utf8");
    } catch (error) {
      logWithPhase(
        `Failed to create test file ${filename}: ${error.message}`,
        "error"
      );
    }
  }
}

/**
 * Helper function to log with timestamps
 * @param {string} message - Message to log
 * @param {string} phase - Event loop phase
 */
function logWithPhase(message, phase = "unknown") {
  const timestamp = new Date().toISOString();
  
  const colors = {
    timers: "\x1b[33m",
    poll: "\x1b[36m",
    check: "\x1b[35m",
    microtask: "\x1b[32m",
    close: "\x1b[31m",
    async: "\x1b[34m",
    error: "\x1b[31m",
    phase: "\x1b[37m",
    unknown: "\x1b[37m",
  };
  
  const resetColor = "\x1b[0m";
  const phaseLabel = String(phase).toLowerCase();
  const phaseColor = colors[phaseLabel] || colors.unknown;

  console.log(
    `${phaseColor}🕐 [${timestamp}] [${phase}] | Message: ${message}${resetColor}`
  );
}

/**
 * Timeout wrapper for any async operation.
 * @template T
 * @param {Promise<T>} promise
 * @param {number} timeoutMs
 * @param {string} operationName
 * @returns {Promise<T>}
 */
function withTimeout(promise, timeoutMs, operationName = "operation") {
  let timer = null;

  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Timeout in ${operationName} after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timer) {
      clearTimeout(timer);
    }
  });
}

// Export functions and data
module.exports = {
  analyzeEventLoop,
  predictExecutionOrder,
  fixRaceCondition,
  fixCallbackHell,
  fixMixedAsync,
  demonstrateEventLoop,
  createTestFiles,
  logWithPhase,
};

// Example usage (for testing):
const isReadyToTest = false;

if (isReadyToTest) {
  async function runExamples() {
    logWithPhase("🔄 Starting Event Loop Analysis Examples...", "async");

    // Create test files
    await createTestFiles();

    // Demonstrate event loop
    logWithPhase("=== Event Loop Demonstration ===", "phase");
    await demonstrateEventLoop();

    // Analyze execution order
    logWithPhase("=== Execution Order Analysis ===", "phase");
    const analysis = analyzeEventLoop();
    logWithPhase("Analysis generated", "phase");

    // Fix broken code
    logWithPhase("=== Fixing Broken Code ===", "phase");
    try {
      await fixRaceCondition();
      logWithPhase("✅ Race condition fixed", "async");

      await fixCallbackHell(123);
      logWithPhase("✅ Callback hell converted", "async");

      await fixMixedAsync();
      logWithPhase("✅ Mixed async resolved", "async");
    } catch (error) {
      logWithPhase(`❌ Error fixing code: ${error.message}`, "error");
    }
  }

  runExamples();
}
