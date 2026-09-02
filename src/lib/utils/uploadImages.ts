import {formDataPost} from "$lib/api";
import {page} from "$app/stores";
import { compressImage } from "$lib/utils/imageCompression";

export default async function uploadImages(employee: any, uuid: string) {
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < employee.images.length; i++) {
            if(!employee.images[i].file) {
                continue
            }
            try{
                const imgEntry = employee.images[i];
                const originalFile = imgEntry.file as File;

                // Compress once per file and mark to avoid re-compression loops
                if (originalFile && !(originalFile as any).__compressed) {
                    try {
                        const compressed = await compressImage(originalFile);
                        (compressed as any).__compressed = true;
                        imgEntry.file = compressed;
                    } catch (e) {
                        // Fallback to original file on compression failure
                        imgEntry.file = originalFile;
                    }
                }

                await formDataPost('/hr/application/' + uuid + '/image', imgEntry)
            } catch (e) {
                reject(employee.images[i])
            }

        }
        resolve('uploaded')
    })

}
