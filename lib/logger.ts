export type LogLevel = "info" | "warn" | "error"

interface LogEntry {
    level: LogLevel
    message: string
    context?: Record<string, unknown>
    timestamp: string
}

class Logger {
    private log(level: LogLevel, message: string, context?: Record<string, unknown>) {
        const entry: LogEntry = {
            level,
            message,
            context,
            timestamp: new Date().toISOString(),
        }

        // In development, we print to console. 
        // In production, this would be where we send to Sentry/LogRocket/etc.
        if (process.env.NODE_ENV === "development") {
            const style = {
                info: "color: #00bfff",
                warn: "color: #ffa500",
                error: "color: #ff4500",
            }[level]

            console[level](`%c[${level.toUpperCase()}]`, style, message, context || "")
        } else {
            // Production logging fallback (or integration point)
            console[level](JSON.stringify(entry))
        }
    }

    info(message: string, context?: Record<string, unknown>) {
        this.log("info", message, context)
    }

    warn(message: string, context?: Record<string, unknown>) {
        this.log("warn", message, context)
    }

    error(message: string, context?: Record<string, unknown>) {
        this.log("error", message, context)
    }
}

export const logger = new Logger()
