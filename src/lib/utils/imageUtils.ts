const byNewestId = (a: any, b: any) => (b.id ?? 0) - (a.id ?? 0);

export function latestImageByTag(images: any[], tag: string): any | null {
    return images.filter(img => img.imageTag === tag).sort(byNewestId)[0] ?? null;
}

/**
 * Seite ("Vorderseite"/"Rückseite") steckt im Dateinamen. Die S3-Location ist
 * URL-kodiert, teils mit "%20" statt "_" vor dem Seitennamen — daher alle drei
 * Schreibweisen prüfen.
 */
export function imageHasSide(image: { name?: string; location?: string }, side: string): boolean {
    const encodedSide = encodeURIComponent(side);
    return !!(
        image.name?.includes(`_${side}`) ||
        image.location?.includes(`_${side}`) ||
        image.location?.includes(`_${encodedSide}`) ||
        image.location?.includes(`%20${encodedSide}`)
    );
}

export function latestImageByTagAndSide(images: any[], tag: string, side: string): any | null {
    return images
        .filter(img => img.imageTag === tag && imageHasSide(img, side))
        .sort(byNewestId)[0] ?? null;
}
