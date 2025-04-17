const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiK0xTZVI0MGpINDkzejF2RXhKSHQ0M2VHanNTWG14Q255WlNKSlRiK2dHRT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiK3RCU0dqQ0lKWHB5OTk0ejJycEJTR3BUdTZKU2lMQkpxeFJoeDBxNFFGUT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJRQ3ZDd2Y1RXUwWXNwdDQzdkxjSmpBamtpazVLUCtRME1CZEFUemdrbldzPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJBMmQ2QnNqcnpSMjc2bE9BTmtoQlp5NXF0dUZ6WTlvSTBxNXZOdjRKQ0VVPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkdDejUrY3hlOXZFbml1S1VHcFE5Y0NoczQvMFZ1aTg4eXBCWm1Mck1aMFk9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjJoRkYxeXlGK3MrZ2FRY01tMmdkTG9ZUVZxai9oV2pxcDE4SFZBTnU5bGM9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTVB0bUdpTVRlMUdrbFB0QWtmU05DbnBZOEpMdUt2TVFNWVNxUzVrSzkxaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibjNCMVRsWlNUS0lHa1VOb21rT0JpRHpZbi9rRGtydURScmZZYnhRamlnND0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Iml2NjZsMnhPZFZRa0o1bU1ZTkt5M296MU1WeVVzeEJjNnFEbTdYRHlUdmdGZ2hYU0E0U3dKbjM0blVSNUtzWmo1anN6ajhuZTZxU1lqUmRTWmliL0FnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjAwLCJhZHZTZWNyZXRLZXkiOiJBR201bjdqUDYxQ21xWUpsdHJnejVUcFFmMEtNK1Zuck9ycjAyYUFwUGEwPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzIsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMiwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJfTVBaVDEwU1I3Q2VpWjNjdTZqWGZBIiwicGhvbmVJZCI6ImQ3NWJkNmE3LWJjY2QtNGIyOC1hNDRjLWNlZTRlNjk3MTkwYSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJabzhaQlNnejNDTVkzN2ZWMUVXcVpkWGVkYms9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUjNnakRZYXJtQ2N5aWJmajhpVFpNYmNJMVJjPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IldNV0M1N0NOIiwibWUiOnsiaWQiOiIyNTQ3ODg0MDkxMDU6NjVAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiU8OuZ3RyeWdnciBFeXN0ZWlubiBTaWd1csOwYXJzb24ifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ09TN3A3TUNFSm50ZzhBR0dBRWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IlY3V0w4Y2tTTlJISHpadWhSaXptVUlFLy84N2RrVEF6SFR0cnJhOVB3eW89IiwiYWNjb3VudFNpZ25hdHVyZSI6Ijk3Smc3WVZYYUc1cHpWZEszeEUxWXNTYytNa29WSFJlZmQ3RTlCVjVQVlBWQmdSemhBam4vSzNadGtPUFhyWDFYaFU4cjUxa09GNEJFaWpKNVpsY0RRPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJueXEvL3BCVkQ4VHNpNm5vYTdYRlhBRENtSXNhYU5uVzV1eHA5c2ZZeG5xM0VHN2lEMDhyVXp2RmZtY09FVkhsV0xVVkxNenpENXpxbzNudkk3NnVCZz09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjI1NDc4ODQwOTEwNTo2NUBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJWZTFpL0hKRWpVUng4MmJvVVlzNWxDQlAvL08zWkV3TXgwN2E2MnZUOE1xIn19XSwicGxhdGZvcm0iOiJzbWJhIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzQ0ODkzNjA3LCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQVAvaiJ9',
    PREFIXE: process.env.PREFIX || "@",
    OWNER_NAME: process.env.OWNER_NAME || "Sîgtryggr",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "254788409105",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_READ_MESSAGES: process.env.AUTO_READ_MESSAGES || "yes",       
    AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || "no",                     
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'EMINEM-MD',
    URL : process.env.BOT_MENU_LINKS || 'https://files.catbox.moe/yt2p1m.jpeg',
    MODE: process.env.PUBLIC_MODE || "no",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || 'typing',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
