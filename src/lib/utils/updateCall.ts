import { formDataPost } from "$lib/api";
import { page } from "$app/stores";

export default async function(employee: any) {
    try {
        let updateObject = { ...employee };
        // Don't re-send existing avatar URLs — backend expects File or nothing
        if (updateObject.avatarFile && typeof updateObject.avatarFile === "string") {
            delete updateObject.avatarFile;
        }
        await formDataPost(
            "/hr/application/" + employee.uuid + "/update",
            updateObject,
        );
    } catch (e) {
        console.error("Storage error: ", e);
    }
}
