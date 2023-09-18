// import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
// import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
// import { PineconeStore } from 'langchain/vectorstores/pinecone';
// import { pinecone } from '@/utils/pinecone-client';
// import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
// import { PINECONE_INDEX_NAME } from '@/config/pinecone';
// import * as yauzl from 'yauzl';
// import * as fs from 'fs';
// import * as path from 'path';

// const zipDirectoryPath = 'zipdocs';
// const tempDirectory = 'tempdocs';

// const unzipPDFs = async (zipFilePath: string, dest: string) => {
//     return new Promise<void>((resolve, reject) => {
//         yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipfile) => {
//             if (err) return reject(err);
            
//             zipfile.readEntry();

//             zipfile.on('entry', (entry) => {
//                 if (/\.pdf$/.test(entry.fileName)) {
//                     zipfile.openReadStream(entry, (err, readStream) => {
//                         if (err) return reject(err);

//                         const outputPath = path.join(dest, entry.fileName);
//                         readStream.pipe(fs.createWriteStream(outputPath)).on('finish', () => zipfile.readEntry());
//                     });
//                 } else {
//                     zipfile.readEntry();
//                 }
//             });

//             zipfile.on('end', resolve);
//         });
//     });
// };

// const processPDFs = async (directory: string) => {
//     const files = fs.readdirSync(directory).filter(file => file.endsWith('.pdf'));

//     for (let file of files) {
//         const filePath = path.join(directory, file);

//         const loader = new PDFLoader(filePath);
//         const rawDocs = await loader.load();

//         const textSplitter = new RecursiveCharacterTextSplitter({
//             chunkSize: 1000,
//             chunkOverlap: 200,
//         });

//         const docs = await textSplitter.splitDocuments(rawDocs);
//         const embeddings = new OpenAIEmbeddings();
//         const index = pinecone.Index(PINECONE_INDEX_NAME);

//         await PineconeStore.fromDocuments(docs, embeddings, {
//             pineconeIndex: index,
//             namespace: file.split('.')[0],
//             textKey: 'text',
//         });

//         fs.unlinkSync(filePath);
//     }
// };

// export const run = async () => {
//     try {
//         const zipFiles = fs.readdirSync(zipDirectoryPath).filter(file => file.endsWith('.zip'));

//         for (let zipFile of zipFiles) {
//             await unzipPDFs(path.join(zipDirectoryPath, zipFile), tempDirectory);
//             await processPDFs(tempDirectory);
//         }

//     } catch (error) {
//         console.error('Error:', error);
//         throw new Error('Failed to ingest your data');
//     }
// };

// (async () => {
//     await run();
//     console.log('ingestion complete');
// })();
