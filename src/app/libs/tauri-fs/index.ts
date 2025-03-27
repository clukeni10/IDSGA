// tauri-fs
import { writeFile, BaseDirectory, exists, mkdir } from '@tauri-apps/plugin-fs';

export async function saveFileLocal(
    pdfBytes: Uint8Array,
    fileName: string,
    dirPath: string,
    extension: string
) {
    try {
        const fullPath = `${dirPath}/${fileName}.${extension}`; // Corrigindo caminho do arquivo

        // Verifica se o diretório existe
        const dirExists = await exists(dirPath, { baseDir: BaseDirectory.AppLocalData });

        if (!dirExists) {
            await mkdir(dirPath, { baseDir: BaseDirectory.AppLocalData, recursive: true });
        }

        // Salva o arquivo no diretório correto
        await writeFile(fullPath, pdfBytes, { baseDir: BaseDirectory.AppLocalData });

        return fullPath;
    } catch (error) {
        console.error('Erro ao salvar o arquivo localmente:', error);
        throw error;
    }
}
