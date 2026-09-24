import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";

const shadowCanvas = document.createElement("canvas");

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs";

type OutputFormat = "dataurl" | "blob";

export async function convertPdfToImageFromFileInput(
    files: FileList | File[],
    format: OutputFormat = "blob",
) {
    const file = (files as any)?.[0] as File | undefined;
    if (!file) throw new Error("No file provided");

    // pdfjs works best with ArrayBuffer/Uint8Array
    return convertPdfToImage(await file.arrayBuffer(), format);
}

export default async function convertPdfToImage(
    pdfData: ArrayBuffer | Uint8Array | string,
    format: OutputFormat = "dataurl",
) {
    const context = shadowCanvas.getContext("2d");
    if (!context) throw new Error("Could not get 2D canvas context");

    const task = pdfjsLib.getDocument(pdfData as any);
    const pdf = await task.promise;

    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });

    shadowCanvas.width = Math.floor(viewport.width);
    shadowCanvas.height = Math.floor(viewport.height);

    await page.render({
        canvasContext: context,
        viewport,
    }).promise;

    if (format === "blob") {
        return canvasToBlob(shadowCanvas, "image/png");
    }

    return shadowCanvas.toDataURL("image/png");
}

function canvasToBlob(canvas: any, mime: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob: Blob | null) => {
            if (!blob) {
                reject(new Error("Canvas toBlob() returned null"));
                return;
            }
            resolve(blob);
        }, mime);
    });
}
