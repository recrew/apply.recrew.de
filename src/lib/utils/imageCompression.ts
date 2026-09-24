const DEFAULT_TARGET_SIZE = 1024 * 1024;
const MAX_IMAGE_DIMENSION = 3000;
const JPEG_QUALITY = 0.82;
const MAX_ATTEMPTS = 6;

const toJpegFile = (blob: Blob, originalName: string): File =>
    new File([blob], originalName.replace(/\.[^.]+$/, "") + ".jpg", {
        type: "image/jpeg",
        lastModified: Date.now(),
    });

const canvasToJpeg = (canvas: HTMLCanvasElement): Promise<Blob> =>
    new Promise((resolve, reject) =>
        canvas.toBlob(
            (result) =>
                result
                    ? resolve(result)
                    : reject(new Error("Bild konnte nicht verarbeitet werden.")),
            "image/jpeg",
            JPEG_QUALITY,
        ),
    );

export async function compressImage(
    file: File,
    targetSize = DEFAULT_TARGET_SIZE,
): Promise<File> {
    // PDFs und andere Nicht-Bilder unveraendert durchreichen - createImageBitmap wuerde werfen
    if (!file.type.startsWith("image/")) {
        return file;
    }
    // Idempotent: bereits komprimierte Bilder gehen unveraendert zurueck
    if (file.size <= targetSize && file.type === "image/jpeg") {
        return file;
    }

    const image = await createImageBitmap(file);
    try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) {
            throw new Error("Canvas wird von diesem Browser nicht unterstützt.");
        }

        let scale = Math.min(
            1,
            MAX_IMAGE_DIMENSION / Math.max(image.width, image.height),
        );
        let compressed!: Blob;

        for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
            canvas.width = Math.max(1, Math.round(image.width * scale));
            canvas.height = Math.max(1, Math.round(image.height * scale));
            // JPEG kennt keine Transparenz - ohne weissen Grund werden PNG-Alphabereiche schwarz
            context.fillStyle = "#fff";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);

            compressed = await canvasToJpeg(canvas);
            if (compressed.size <= targetSize) {
                break;
            }
            scale *= Math.min(0.85, Math.sqrt(targetSize / compressed.size) * 0.95);
        }

        // ponytail: bestes Ergebnis statt Abbruch - ein zu grosses Bild ist besser
        // als ein Bewerber, der im Formular haengen bleibt
        return toJpegFile(compressed, file.name);
    } finally {
        image.close();
    }
}
