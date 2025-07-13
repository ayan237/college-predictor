// pages/api/upload.ts

import { IncomingForm } from 'formidable';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm({ uploadDir: './parser/temp', keepExtensions: true });

  const { fields, files }: { fields: any; files: any } = await new Promise((resolve, reject) => {
  form.parse(req, (err, fields, files) => {
    if (err) reject(err);
    else resolve({ fields, files });
  });
});


  const file = files.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = Array.isArray(file) ? file[0].filepath : file.filepath;
  const pyPath = path.join(process.cwd(), 'parser', 'parse_cutoffs.py');

  const result = await new Promise((resolve, reject) => {
    const python = spawn('python', [pyPath, filePath]);

    let output = '';
    let error = '';

    python.stdout.on('data', (data) => (output += data.toString()));
    python.stderr.on('data', (data) => (error += data.toString()));

    python.on('close', (code) => {
      if (code === 0) resolve(output);
      else reject(error);
    });
  });

  const jsonPath = path.join(process.cwd(), 'parser', 'cutoff_data.json');
  const json = await fs.readFile(jsonPath, 'utf-8');
  return res.status(200).json(JSON.parse(json));
}
