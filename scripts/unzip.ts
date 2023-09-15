import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/utils/pinecone-client';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { PINECONE_INDEX_NAME } from '@/config/pinecone';
import * as yauzl from 'yauzl';
import * as fs from 'fs';
import * as path from 'path';

// Path to the directory containing ZIP files
const zipDirectoryPath = 'zipdocs';
const tempDirectory = 'tempdocs';  // Ensure this directory exists

export const run = async () => {
  try {
    // List all ZIP files in the directory
    const zipFiles = fs.readdirSync(zipDirectoryPath).filter(file => file.endsWith('.zip'));

    for (let zipFile of zipFiles) {
      await new Promise((resolve, reject) => {
        yauzl.open(path.join(zipDirectoryPath, zipFile), { lazyEntries: true }, (err, zipfile) => {
          if (err) throw err;

          zipfile.readEntry();

          zipfile.on('entry', (entry) => {
            if (/\.pdf$/.test(entry.fileName)) {
              zipfile.openReadStream(entry, (err, readStream) => {
                if (err) throw err;

                // Save the PDF file to the temporary directory
                let outputPath = path.join(tempDirectory, entry.fileName);
                readStream.pipe(fs.createWriteStream(outputPath));

                readStream.on('end', () => {
                  zipfile.readEntry();
                });
              });
            } else {
              zipfile.readEntry();
            }
          });

          zipfile.on('end', () => {
            resolve();
          });
        });
      });

      // Load and ingest each PDF file from the temporary directory
      const pdfFiles = fs.readdirSync(tempDirectory);

      for (let pdfFile of pdfFiles) {
        const pdfPath = path.join(tempDirectory, pdfFile);
        const loader = new PDFLoader(pdfPath);
        const rawDocs = await loader.load();

        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
          chunkOverlap: 200,
        });

        const docs = await textSplitter.splitDocuments(rawDocs);

        const embeddings = new OpenAIEmbeddings();
        const index = pinecone.Index(PINECONE_INDEX_NAME);

        await PineconeStore.fromDocuments(docs, embeddings, {
          pineconeIndex: index,
          namespace: pdfFile.split('.')[0],  // Use PDF filename as the namespace
          textKey: 'text',
        });

        // Optionally, remove the PDF file from the temporary directory after ingestion
        fs.unlinkSync(pdfPath);
      }
    }
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

(async () => {
  await run();
  console.log('ingestion complete');
})();
