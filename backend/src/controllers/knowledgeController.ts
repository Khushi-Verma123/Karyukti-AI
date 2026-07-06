import { Response } from 'express';
import { db, KnowledgeDocument } from '../config/db';

export const getDocs = (req: any, res: Response) => {
  res.json(db.getDocs());
};

export const uploadDoc = (req: any, res: Response) => {
  const { name, content, type, size } = req.body;

  if (!name || !content) {
    return res.status(400).json({ error: 'Document name and content are required' });
  }

  const newDoc: KnowledgeDocument = {
    id: `doc-${Date.now()}`,
    name,
    size: size || content.length,
    content,
    type: type || 'text/plain',
    uploadedAt: new Date().toISOString()
  };

  db.addDoc(newDoc);
  db.addLog(
    'Knowledge Uploaded',
    `Knowledge file "${name}" uploaded.`,
    req.user?.id || null,
    req.user?.username || 'System'
  );

  res.status(201).json(newDoc);
};

export const deleteDoc = (req: any, res: Response) => {
  const { id } = req.params;
  db.deleteDoc(id);
  db.addLog(
    'Knowledge Deleted',
    `Knowledge file ID "${id}" removed.`,
    req.user?.id || null,
    req.user?.username || 'System'
  );

  res.json({ success: true });
};
