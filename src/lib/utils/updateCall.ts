import { formDataPost } from "$lib/api";
import { page } from "$app/stores";

export default async function(employee: any) {
    try {
        let updateObject = { ...employee };
        await formDataPost(
            "/hr/application/" + employee.uuid + "/update",
            updateObject,
        );
    } catch (e) {
        console.error("Storage error: ", e);
    }
}
