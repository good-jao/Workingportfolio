import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

interface StoredMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  inquiryType: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface OwnerConfig {
  pin: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const OWNER_CONFIG_FILE = path.join(DATA_DIR, 'owner-config.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default owner PIN is 2026
function getOwnerConfig(): OwnerConfig {
  try {
    if (fs.existsSync(OWNER_CONFIG_FILE)) {
      const content = fs.readFileSync(OWNER_CONFIG_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading owner config:', err);
  }
  const defaultConf = { pin: '2026' };
  try {
    fs.writeFileSync(OWNER_CONFIG_FILE, JSON.stringify(defaultConf, null, 2));
  } catch (err) {
    console.error('Error writing default owner config:', err);
  }
  return defaultConf;
}

function saveOwnerConfig(conf: OwnerConfig) {
  fs.writeFileSync(OWNER_CONFIG_FILE, JSON.stringify(conf, null, 2));
}

// Seed initial messages if file doesn't exist
const INITIAL_STORED_MESSAGES: StoredMessage[] = [
  {
    id: 'msg-seed-1',
    senderName: 'Sarah Jenkins',
    senderEmail: 'sarah.j@lumina-ventures.io',
    subject: 'Social Media Campaign & Carousel Creatives',
    inquiryType: 'Social Media Graphics',
    message: 'Hi Jao, I came across your portfolio and love your social media visual designs and carousel graphics. We are looking for a graphic designer for our upcoming product launch campaign. Let\'s discuss availability!',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isRead: false
  },
  {
    id: 'msg-seed-2',
    senderName: 'Marcus Vance',
    senderEmail: 'marcus@vancemedia.co',
    subject: 'Brand Identity & Visual Graphics Collaboration',
    inquiryType: 'Brand Identity',
    message: 'Hello Jao! We\'re preparing for a complete brand redesign with matching social media templates and marketing collateral. Your typography and visual compositions are outstanding. Would love to collaborate!',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    isRead: true
  }
];

function getMessages(): StoredMessage[] {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      const content = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading messages:', err);
  }
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(INITIAL_STORED_MESSAGES, null, 2));
  } catch (err) {
    console.error('Error writing initial messages:', err);
  }
  return INITIAL_STORED_MESSAGES;
}

function saveMessages(msgs: StoredMessage[]) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(msgs, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper middleware to verify owner token/PIN
  const verifyOwner = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    const currentPin = getOwnerConfig().pin;

    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized. Owner authentication required.' });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (token !== currentPin && token !== `owner-token-${currentPin}`) {
      return res.status(401).json({ error: 'Invalid owner PIN.' });
    }

    next();
  };

  // --- PUBLIC API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', ownerProtected: true });
  });

  // Client Submits a Message (Open to any client/visitor)
  app.post('/api/messages', (req, res) => {
    try {
      const { senderName, senderEmail, subject, inquiryType, message } = req.body;

      if (!senderName || !senderEmail || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required.' });
      }

      const newMsg: StoredMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        senderName: String(senderName).trim().slice(0, 100),
        senderEmail: String(senderEmail).trim().slice(0, 150),
        subject: String(subject || `${inquiryType || 'General'} Inquiry`).trim().slice(0, 200),
        inquiryType: String(inquiryType || 'General Inquiry').trim().slice(0, 50),
        message: String(message).trim().slice(0, 5000),
        createdAt: new Date().toISOString(),
        isRead: false
      };

      const messages = getMessages();
      messages.unshift(newMsg);
      saveMessages(messages);

      // Return ONLY confirmation, never existing messages
      res.json({
        success: true,
        messageId: newMsg.id,
        recipient: 'Jao Pangan',
        timestamp: newMsg.createdAt
      });
    } catch (err: any) {
      console.error('Error saving message:', err);
      res.status(500).json({ error: 'Failed to send message.' });
    }
  });

  // Owner Authentication Verification
  app.post('/api/owner/verify', (req, res) => {
    const { pin } = req.body;
    const currentPin = getOwnerConfig().pin;

    if (!pin || String(pin).trim() !== currentPin) {
      return res.status(401).json({ error: 'Incorrect passcode.' });
    }

    res.json({
      success: true,
      token: `owner-token-${currentPin}`,
      message: 'Owner mode unlocked'
    });
  });

  // --- OWNER-ONLY PROTECTED API ROUTES ---

  // Get all received messages (ONLY ACCESSIBLE WITH VALID OWNER PIN)
  app.get('/api/messages', verifyOwner, (req, res) => {
    try {
      const messages = getMessages();
      res.json({ messages });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch messages.' });
    }
  });

  // Mark a message as read
  app.patch('/api/messages/:id/read', verifyOwner, (req, res) => {
    try {
      const { id } = req.params;
      const messages = getMessages();
      const target = messages.find(m => m.id === id);
      if (target) {
        target.isRead = true;
        saveMessages(messages);
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update message.' });
    }
  });

  // Delete a message
  app.delete('/api/messages/:id', verifyOwner, (req, res) => {
    try {
      const { id } = req.params;
      let messages = getMessages();
      messages = messages.filter(m => m.id !== id);
      saveMessages(messages);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete message.' });
    }
  });

  // Change Owner PIN
  app.post('/api/owner/change-pin', verifyOwner, (req, res) => {
    try {
      const { newPin } = req.body;
      if (!newPin || String(newPin).trim().length < 4) {
        return res.status(400).json({ error: 'PIN must be at least 4 digits.' });
      }

      const cleanPin = String(newPin).trim();
      saveOwnerConfig({ pin: cleanPin });
      res.json({
        success: true,
        token: `owner-token-${cleanPin}`,
        message: 'Owner PIN updated successfully'
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update PIN.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
