import { writeFile, BaseDirectory, exists, mkdir } from '@tauri-apps/plugin-fs';

export async function saveFileLocal(pdfBytes: Uint8Array, fileName: string, dirPath: string, extension: string) {
    try {
        const filePath = `${fileName}.${extension}`;

        const dirExists = await exists(dirPath, { baseDir: BaseDirectory.AppLocalData });
        
        if (!dirExists) {
            await mkdir(dirPath, { baseDir: BaseDirectory.AppLocalData, recursive: true });
        }
        
        await writeFile(filePath, pdfBytes, { baseDir: BaseDirectory.AppLocalData });
        return filePath;
    } catch (error) {
        console.error('Erro ao salvar o arquivo localmente:', error);
        throw error;
    }
} 