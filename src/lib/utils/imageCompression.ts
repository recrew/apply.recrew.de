const DEFAULT_TARGET_SIZE = 1024 * 1024;
const MAX_IMAGE_DIMENSION = 3000;

export async function compressImage(
    blob: Blob,
    targetSize = DEFAULT_TARGET_SIZE,
): Promise<Blob> {
    if (blob.size <= targetSize && blob.type === "image/jpeg") {
        return blob;
    }

    const image = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas wird von diesem Browser nicht unterstützt.");

    let scale = Math.min(
        1,
        MAX_IMAGE_DIMENSION / Math.max(image.width, image.height),
    );

    for (let attempt = 0; attempt < 6; attempt += 1) {
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const compressed = await new Promise<Blob>((resolve, reject) =>
            canvas.toBlob(
                (result) =>
                    result
                        ? resolve(result)
                        : reject(new Error("Bild konnte nicht verarbeitet werden.")),
                "image/jpeg",
                0.82,
            ),
        );
        if (compressed.size <= targetSize) return compressed;

        scale *= Math.min(0.85, Math.sqrt(targetSize / compressed.size) * 0.95);
    }

    throw new Error("Das Bild konnte nicht unter 1 MB komprimiert werden.");
}
