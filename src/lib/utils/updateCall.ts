import {formDataPost} from "$lib/api";
import {page} from "$app/stores";

export default async function (employee:any){
    try{
        let updateObject = {...employee}
        if(employee.avatarFile && typeof employee.avatarFile === 'string'){
            delete updateObject.avatarFile;
        }
        await formDataPost('/hr/application/' + employee.uuid + '/update', updateObject)
    } catch (e){
        console.log("Storage error: ", e)
    }
}