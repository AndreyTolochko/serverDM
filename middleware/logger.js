import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

const cleanOldLogs = async (logFileName, logsDir) => {
    try {
        const files = await fs.promises.readdir(logsDir);
        const archiveFiles = files.filter(file => file.startsWith(logFileName.replace('.log', '-')) && file.endsWith('.log'));

        // Sort files by creation time, oldest first
        const sortedArchivedFiles = archiveFiles.sort((a, b) => {
            const statA = fs.statSync(path.join(logsDir, a));
            const statB = fs.statSync(path.join(logsDir, b));
            return statA.birthtimeMs - statB.birthtimeMs;
        });

        // Delete all archived logs except the most recent one
        while (sortedArchivedFiles.length > 1) {
            const fileToDelete = sortedArchivedFiles.shift();
            await fs.promises.unlink(path.join(logsDir, fileToDelete));
        }

    } catch (e) {
        console.log(`Error cleaning old log files: ${e}`);
    }
};


const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), "ddMMyyyy\tHH:mm:ss");
  const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`;

  try {
    const logsDir=path.join(process.cwd(), "logs");
    const logFilePath = path.join(logsDir, logFileName);

    if (!fs.existsSync(logsDir)) {
      await fs.promises.mkdir(logsDir);
    }
    if (fs.existsSync(logFilePath)) {
        const stats = fs.statSync(logFilePath);
        if (stats.size > 30000000) { // 30MB in bytes
            const archiveName = logFileName.replace('.log', `-${Date.now()}.log`);
            fs.renameSync(logFilePath, path.join(logsDir, archiveName));
            // Clean old logs after rotating
            await cleanOldLogs(logFileName, logsDir);
        }
    }
    await fs.promises.appendFile(logFilePath,logItem);
  } catch (e) {
    console.log(e);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t ${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(
    `${req.method}\t ${req.path} - ${req.url}\t ${req.headers.origin}`
  );
  next();
};

export default logger;
