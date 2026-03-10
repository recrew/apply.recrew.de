export function latestImageByTag(images: any[], tag: string): any | null {
    return images
        .filter(img => img.imageTag === tag)
        .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))[0] ?? null;
}
