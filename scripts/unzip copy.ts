import * as fs from 'fs';
import * as path from 'path';
import * as unzipper from 'unzipper';

interface UnzippedFile {
  fileName: string;
  data: Buffer;
}

async function unzipFilesInFolder(folderPath: string): Promise<UnzippedFile[]> {
  const unzippedFiles: UnzippedFile[] = [];

  try {
    const files = await fs.promises.readdir(folderPath);

    for (const file of files) {
      if (file.endsWith('.zip')) {
        const zipFilePath = path.join(folderPath, file);

        const extractedFiles = await unzipper.Open.file(zipFilePath);

        for (const entry of extractedFiles.files) {
          if (entry.path.endsWith('.pdf')) {
            const pdfData = await entry.buffer();
            unzippedFiles.push({
              fileName: entry.path,
              data: pdfData,
            });
          }
        }
      }
    }

    return unzippedFiles;
  } catch (error) {
    throw new Error(`Error unzipping files: ${error}`);
  }
}

const folderPath = 'zipdocs'; // Replace with the actual folder path
unzipFilesInFolder(folderPath)
  .then((unzippedFiles) => {
    console.log(`Unzipped ${unzippedFiles.length} PDF files:`);
    unzippedFiles.forEach((file) => {
      console.log(file.fileName);
      // You can choose what to do with the pdf data here
    });
  })
  .catch((error) => {
    console.error(error);
  });
