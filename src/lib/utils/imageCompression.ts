/**
 * Compresses an image file using Canvas API
 * @param file - The original image file
 * @param maxWidth - Maximum width in pixels (default: 1920)
 * @param maxHeight - Maximum height in pixels (default: 1920)
 * @param quality - JPEG quality 0-1 (default: 0.85)
 * @param maxSizeBytes - Maximum file size in bytes (default: 1.8MB to stay under 2MB limit)
 * @returns Promise<File> - Compressed image file
 */
export async function compressImage(
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1920,
    quality: number = 0.85,
    maxSizeBytes: number = 1.8 * 1024 * 1024  // 1.8 MB safety margin
): Promise<File> {
    return new Promise((resolve, reject) => {
        // Only compress if it's an image
        if (!file.type.startsWith('image/')) {
            resolve(file);
            return;
        }

        // For very small files, don't compress
        if (file.size < 100 * 1024) { // Less than 100KB
            resolve(file);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target?.result as string;

            img.onload = () => {
                // Calculate new dimensions
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    const aspectRatio = width / height;

                    if (width > height) {
                        width = maxWidth;
                        height = width / aspectRatio;
                    } else {
                        height = maxHeight;
                        width = height * aspectRatio;
                    }
                }

                // Create canvas and compress
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                // Draw image on canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Helper function to compress with quality adjustment
                const compressWithQuality = (currentQuality: number, attempt: number = 1): void => {
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error('Could not compress image'));
                                return;
                            }

                            // Check if size is acceptable
                            if (blob.size <= maxSizeBytes || currentQuality <= 0.3) {
                                // Success or reached minimum quality
                                const compressedFile = new File(
                                    [blob],
                                    file.name,
                                    {
                                        type: 'image/jpeg',
                                        lastModified: Date.now()
                                    }
                                );

                                console.log(`Image compressed (attempt ${attempt}, quality ${Math.round(currentQuality * 100)}%): ${(file.size / 1024).toFixed(0)}KB → ${(compressedFile.size / 1024).toFixed(0)}KB`);

                                if (compressedFile.size > maxSizeBytes) {
                                    console.warn(`Warning: Could not compress below ${(maxSizeBytes / 1024 / 1024).toFixed(1)}MB. Final size: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
                                }

                                resolve(compressedFile);
                            } else {
                                // Too large, try again with lower quality
                                const newQuality = currentQuality - 0.1;
                                console.log(`File still ${(blob.size / 1024).toFixed(0)}KB, retrying with quality ${Math.round(newQuality * 100)}%...`);
                                compressWithQuality(newQuality, attempt + 1);
                            }
                        },
                        'image/jpeg',
                        currentQuality
                    );
                };

                // Start compression with initial quality
                compressWithQuality(quality);
            };

            img.onerror = () => {
                reject(new Error('Could not load image'));
            };
        };

        reader.onerror = () => {
            reject(new Error('Could not read file'));
        };
    });
}
