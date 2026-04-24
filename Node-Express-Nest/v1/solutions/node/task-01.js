const EventEmitter = require("events");
const fs = require("fs");

/**
 * Custom Event Emitter for a messaging system
 * Extend Node.js EventEmitter to create a pub-sub messaging system
 */
class MessageSystem extends EventEmitter {
  constructor() {
    super();
    // Initialize the messaging system
    this.messages = [];
    this.users = new Set();
    this.messageId = 1;
  }

  /**
   * Send a message to the system
   *
   * Create a message object with id, type, content, timestamp, sender
   * Add message to messages array
   * Keep only last 100 messages for memory management
   * Emit the message event and specific type event
   *
   * @param {string} type - Message type ('message', 'notification', 'alert')
   * @param {string} content - Message content
   * @param {string} sender - Optional sender name
   * @returns {object} Created message object
   */
  sendMessage(type, content, sender = "System") {
    const message = {
      id: this.messageId++,
      type,
      content,
      sender,
      timestamp: Date.now(),
    };

    this.messages.push(message);

    if (this.messages.length >= 100) {
      this.messages.shift();
    }

    this.emit("message", message);
    this.emit(`${type}`, message);

    return message;
  }

  /**
   * Subscribe to all message types
   *
   * Listen to all messages using the 'message' event
   *
   * @param {function} callback - Callback function to handle messages
   */
  subscribeToMessages(callback) {
    this.on("message", callback);
  }

  /**
   * Subscribe to specific message type
   *
   *  Listen to specific message type events
   *
   * @param {string} type - Message type to subscribe to
   * @param {function} callback - Callback function to handle messages
   */
  subscribeToType(type, callback) {
    this.on(`${type}`, callback);
  }

  /**
   * Get current number of active users
   *
   * Return the number of users
   *
   * @returns {number} Number of active users
   */
  getUserCount() {
    return this.users.size;
  }

  /**
   * Get the last N messages (default 10)
   *
   * Return the last 'count' messages
   *
   * @param {number} count - Number of messages to retrieve
   * @returns {array} Array of recent messages
   */
  getMessageHistory(count = 10) {
    return this.messages.slice(-count);
  }

  /**
   * Add a user to the system
   *
   * Add user to users set (avoid duplicates)
   * Create and emit user-joined event
   *
   * @param {string} username - Username to add
   */
  addUser(username) {
    if (this.users.has(username)) {
      return;
    }
    this.users.add(username);
    this.emit("user-joined", {
      content: `User ${username} joined the system`,
    });
  }

  /**
   * Remove a user from the system
   *
   * Remove user from users set
   * Create and emit user-left event
   *
   * @param {string} username - Username to remove
   */
  removeUser(username) {
    if (!this.users.has(username)) {  
      return;
    }
    this.users.delete(username);
    this.emit("user-left", 
      {content: `User ${username} left the system`}
    );
  }

  /**
   * Get all active users
   *
   * Convert users Set to Array and return
   *
   * @returns {array} Array of usernames
   */
  getActiveUsers() {
    return Array.from(this.users);
  }

  /**
   * Clear all messages
   *
   * Clear messages array
   * Emit history-cleared event
   */
  clearHistory() {
    this.messages = [];
    this.emit("history-cleared");
  }

  /**
   * Get system statistics
   *
   * Calculate and return statistics
   *
   * @returns {object} System stats
   */
  getStats() {
    return {
      totalMessages: this.messages.length,
      activeUsers: this.users.size,
      messagesByType: this.messages.reduce((acc, message) => {
        acc[message.type] = (acc[message.type] || 0) + 1;
        return acc;
      }, {}),
    };
  }

  /**
   * Save messages to file
   *
   * @param {string} filename - Filename to save messages to
   */
  saveMessagesToFile(filename) {
    fs.writeFileSync(filename, JSON.stringify(this.messages, null, 'utf8'));
  }

  /**
   * Different user roles
   *
   * @param {string} username - Username to get role for
   * @returns {string} Role of the user
   */
  getUserRole(username) {
    return this.users.get(username)?.role ?? "user";
  }

  /**
   * Message filtering/search
   *
   * @param {string} query - Query to filter messages
   * @returns {array} Array of filtered messages
   */
  filterMessages(query) {
    if (!query) {
      return this.messages;
    }
    const q = query.toLowerCase();
    return this.messages.filter((message) =>  
      message.content.toLowerCase().includes(q)
    );
  }
}

// Export the MessageSystem class
module.exports = MessageSystem;

// Example usage (for testing):
const isReadyToTest = false;

if (isReadyToTest) {
  const messenger = new MessageSystem();

  // Subscribe to all messages
  messenger.subscribeToMessages((message) => {
    console.log(`[${message.type.toUpperCase()}] ${message.content}`);
  });

  // Subscribe to specific alert messages
  messenger.subscribeToType("alert", (message) => {
    console.log(`🚨 ALERT: ${message.content}`);
  });

  // Subscribe to user events
  messenger.subscribeToType("user-joined", (message) => {
    console.log(`👋 ${message.content}`);
  });

  messenger.subscribeToType("user-left", (message) => {
    console.log(`👋 ${message.content}`);
  });

  // Add users
  messenger.addUser("Alice");
  messenger.addUser("Bob");

  // Send various messages
  messenger.sendMessage("message", "Hello everyone!", "Alice");
  messenger.sendMessage("notification", "System maintenance in 1 hour");
  messenger.sendMessage("alert", "Server overload detected!");

  // Remove user
  messenger.removeUser("Bob");

  // Check system status
  console.log(`\nActive users: ${messenger.getUserCount()}`);
  console.log("Recent messages:", messenger.getMessageHistory()?.length);
  console.log("System stats:", messenger.getStats());
}
