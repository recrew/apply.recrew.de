import { formDataPost } from "$lib/api";

export default async function uploadImages(employee: any, uuid: string) {
    for (const image of employee.images) {
        if (!image.file) {
            continue;
        }

        await formDataPost(`/hr/application/${uuid}/image`, image);
    }
}
