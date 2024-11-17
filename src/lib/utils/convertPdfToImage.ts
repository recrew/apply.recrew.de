import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';


const shadowCanvas = document.createElement('canvas');
export async function convertPdfToImageFromFileInput(files:FileList) {
    return new Promise((resolve, reject)=>{
        let reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = async () => {
            const preview = await convertPdfToImage(reader.result, 'blob');
            resolve(preview);
        }
    });

}
export default async function convertPdfToImage(dataUrl: URL, format: 'dataurl' | 'blob' = 'dataurl') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs';
    const context = shadowCanvas.getContext('2d');

    const task = pdfjsLib.getDocument(dataUrl);
    const pdf = await task.promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({scale: 1.5});
    shadowCanvas.height = viewport.height;
    shadowCanvas.width = viewport.width;
    const renderContext = {
        canvasContext: context,
        transform: null,
        viewport: viewport
    };
    await page.render(renderContext).promise;
    if(format === 'blob') {
        return await new Promise((resolve) => {
            shadowCanvas.toBlob((blob)=>{
                resolve(blob)
            },'image/png');
        })

    }
    return shadowCanvas.toDataURL();
}