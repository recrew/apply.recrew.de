import dayjs from "dayjs";

export const fileNameGenerator = (file: File,employee: any, tag: string, frontOrBack: string = 'Vorderseite') => {
    let name = '';
    switch(tag){
        case 'license':
            name = 'Füherschein_'+frontOrBack
            break;
        case 'student-verification':
            name = 'Immatrikulationsbescheinigung'
            break;
        case 'id-card':
            name = 'Personalausweis_'+frontOrBack;
            break;
        case 'passport':
            name = 'Reisepass_'+frontOrBack
            break;
        case 'health-certificate':
            name = 'Gesundheitszertifikat'
            break;
        default:
            name = 'CV_'+frontOrBack
            break;
    }
    return name + '_' + employee.firstName + '_' + employee.lastName + '_' + dayjs().format('DD.MM.YYYY') + '.' + file.name.split('.').pop()

}