export async function checkImageType(imageBytes: Uint8Array): Promise<"jpg" | "jpeg" | null> {
    return new Promise(async (resolve, reject) => {
        const uint8Array = new Uint8Array(imageBytes);

        console.log(uint8Array[0], uint8Array[1])

        if (uint8Array[0] === 0xff && uint8Array[1] === 0xd8) resolve('jpg'); // JPG
        if (uint8Array[0] === 0xff && uint8Array[1] === 0xd8) resolve('jpeg'); // JPG

        reject('unknown');
    })
}