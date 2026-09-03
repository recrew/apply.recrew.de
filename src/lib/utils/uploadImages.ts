import { formDataPost } from "$lib/api";
import { compressImage } from "$lib/utils/imageCompression";

// Sicherheitsabstand zum 2-MB-Limit der Upload-API
const UPLOAD_TARGET_SIZE = 1.8 * 1024 * 1024;

export default async function uploadImages(employee: any, uuid: string) {
    for (const image of employee.images) {
        if (!image.file) {
            continue;
        }

        try {
            // Letzter Choke-Point vor dem Upload: greift auch fuer Dateien,
            // die nicht ueber den ImageCropper hereinkommen (z.B. Arbeitserlaubnis).
            // compressImage ist idempotent, bereits verkleinerte Bilder bleiben unveraendert.
            image.file = await compressImage(image.file, UPLOAD_TARGET_SIZE);
        } catch (error) {
            // Original hochladen statt den Bewerbungsflow abzubrechen
            console.error("Image compression failed", error);
        }

        await formDataPost(`/hr/application/${uuid}/image`, image);
    }
}
