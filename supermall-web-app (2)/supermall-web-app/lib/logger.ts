// Logging utility for the SuperMall application
// This implements comprehensive logging for all user actions and system events

interface LogEntry {
  timestamp: string
  level: "info" | "warn" | "error" | "debug"
  message: string
  data?: any
  userId?: string
  action?: string
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 1000 // Maximum number of logs to keep in memory

  private formatTimestamp(): string {
    return new Date().toISOString()
  }

  private addLog(level: LogEntry["level"], message: string, data?: any, action?: string): void {
    const logEntry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      message,
      data,
      action,
      userId: this.getCurrentUserId(),
    }

    this.logs.push(logEntry)

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Console output for development
    const consoleMessage = `[${logEntry.timestamp}] ${level.toUpperCase()}: ${message}`

    switch (level) {
      case "error":
        console.error(consoleMessage, data)
        break
      case "warn":
        console.warn(consoleMessage, data)
        break
      case "debug":
        console.debug(consoleMessage, data)
        break
      default:
        console.log(consoleMessage, data)
    }

    // Store logs in localStorage for persistence
    this.persistLogs()
  }

  private getCurrentUserId(): string | undefined {
    // In a real application, this would get the current user ID
    // For now, we'll check if admin is logged in
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminLoggedIn") === "true" ? "admin" : "anonymous"
    }
    return undefined
  }

  private persistLogs(): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("supermall_logs", JSON.stringify(this.logs.slice(-100))) // Store last 100 logs
      } catch (error) {
        console.warn("Failed to persist logs to localStorage:", error)
      }
    }
  }

  private loadPersistedLogs(): void {
    if (typeof window !== "undefined") {
      try {
        const persistedLogs = localStorage.getItem("supermall_logs")
        if (persistedLogs) {
          const logs = JSON.parse(persistedLogs)
          this.logs = Array.isArray(logs) ? logs : []
        }
      } catch (error) {
        console.warn("Failed to load persisted logs:", error)
        this.logs = []
      }
    }
  }

  // Public logging methods
  info(message: string, data?: any, action?: string): void {
    this.addLog("info", message, data, action)
  }

  warn(message: string, data?: any, action?: string): void {
    this.addLog("warn", message, data, action)
  }

  error(message: string, data?: any, action?: string): void {
    this.addLog("error", message, data, action)
  }

  debug(message: string, data?: any, action?: string): void {
    this.addLog("debug", message, data, action)
  }

  // Specific action logging methods
  logUserAction(action: string, details?: any): void {
    this.info(`User action: ${action}`, details, action)
  }

  logSystemEvent(event: string, details?: any): void {
    this.info(`System event: ${event}`, details, event)
  }

  logError(error: Error | string, context?: string): void {
    const errorMessage = error instanceof Error ? error.message : error
    const errorStack = error instanceof Error ? error.stack : undefined

    this.error(`Error${context ? ` in ${context}` : ""}: ${errorMessage}`, {
      stack: errorStack,
      context,
    })
  }

  logApiCall(endpoint: string, method: string, duration?: number, status?: number): void {
    this.info(
      `API call: ${method} ${endpoint}`,
      {
        method,
        endpoint,
        duration,
        status,
      },
      "api_call",
    )
  }

  logPageView(page: string): void {
    this.info(`Page view: ${page}`, { page }, "page_view")
  }

  logSearch(query: string, results?: number): void {
    this.info(
      `Search performed: "${query}"`,
      {
        query,
        results,
      },
      "search",
    )
  }

  logFilter(filterType: string, filterValue: string): void {
    this.info(
      `Filter applied: ${filterType} = ${filterValue}`,
      {
        filterType,
        filterValue,
      },
      "filter",
    )
  }

  // Admin specific logging
  logAdminLogin(email: string, success: boolean): void {
    if (success) {
      this.info(`Admin login successful: ${email}`, { email }, "admin_login_success")
    } else {
      this.warn(`Admin login failed: ${email}`, { email }, "admin_login_failed")
    }
  }

  logAdminLogout(): void {
    this.info("Admin logout", {}, "admin_logout")
  }

  logDataOperation(operation: string, entityType: string, entityId?: string, data?: any): void {
    this.info(
      `Data operation: ${operation} ${entityType}${entityId ? ` (${entityId})` : ""}`,
      {
        operation,
        entityType,
        entityId,
        data,
      },
      `data_${operation}`,
    )
  }

  // Utility methods
  getLogs(level?: LogEntry["level"], limit?: number): LogEntry[] {
    let filteredLogs = level ? this.logs.filter((log) => log.level === level) : this.logs

    if (limit) {
      filteredLogs = filteredLogs.slice(-limit)
    }

    return filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  getLogsByAction(action: string, limit?: number): LogEntry[] {
    let filteredLogs = this.logs.filter((log) => log.action === action)

    if (limit) {
      filteredLogs = filteredLogs.slice(-limit)
    }

    return filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  clearLogs(): void {
    this.logs = []
    if (typeof window !== "undefined") {
      localStorage.removeItem("supermall_logs")
    }
    this.info("Logs cleared", {}, "logs_cleared")
  }

  getLogStats(): {
    total: number
    byLevel: Record<string, number>
    byAction: Record<string, number>
    timeRange: { oldest: string; newest: string } | null
  } {
    const stats = {
      total: this.logs.length,
      byLevel: {} as Record<string, number>,
      byAction: {} as Record<string, number>,
      timeRange: null as { oldest: string; newest: string } | null,
    }

    this.logs.forEach((log) => {
      // Count by level
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1

      // Count by action
      if (log.action) {
        stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1
      }
    })

    // Calculate time range
    if (this.logs.length > 0) {
      const timestamps = this.logs.map((log) => log.timestamp).sort()
      stats.timeRange = {
        oldest: timestamps[0],
        newest: timestamps[timestamps.length - 1],
      }
    }

    return stats
  }

  // Initialize logger
  init(): void {
    this.loadPersistedLogs()
    this.info(
      "Logger initialized",
      {
        logsCount: this.logs.length,
        maxLogs: this.maxLogs,
      },
      "logger_init",
    )
  }
}

// Create and export singleton logger instance
const logger = new Logger()

// Initialize logger when module is loaded
if (typeof window !== "undefined") {
  logger.init()
}

export { logger }
export type { LogEntry }
