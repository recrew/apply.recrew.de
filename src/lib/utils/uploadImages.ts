import {formDataPost} from "$lib/api";
import {page} from "$app/stores";

export default async function uploadImages(employee: any, uuid: string) {
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < employee.images.length; i++) {
            if(!employee.images[i].file) {
                continue
            }
            try{
                await formDataPost('/hr/application/' + uuid + '/image', employee.images[i])
            } catch (e) {
                reject(employee.images[i])
            }

        }
        resolve('uploaded')
    })

}