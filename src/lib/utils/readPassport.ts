import { capitalize } from "./caseConverter";


export const readPassport = (parsedText: string) => {
    const lines = parsedText.split("\n");
    let lastName = "";
    let firstName = "";
    let passportNumber = "";
    let dateOfBirth = "";
    let placeOfBirth = "";
    let sex = "";
    let maidenName = "";
    let lastLine = '';
    lines.forEach((line) => {
        if (lastLine.includes('Pass-Nr')) {
            passportNumber = line.match(/[A-Z0-9]{9}/)?.[0] ?? '';
        } else if (lastLine.includes('Date de naissance')) {
            dateOfBirth = line.match(/\d{2}\.\d{2}\.\d{4}/)?.[0] ?? '';
            sex = line.match(/\s[M|F]\s/)?.[0] ?? '';
        } else if (lastLine.includes('Geburtsort')) {
            placeOfBirth = capitalize(line.trim());
        } else if (lastLine.includes('Vornamen')) {
            firstName = capitalize(line.trim());
        } else if (lastLine.includes('Name')) {
            lastName = capitalize(line.trim().match(/[A-Z-]{3,}/)?.[0] ?? '');
            // geburtsname?
            if (line.includes("b")) {
                maidenName = capitalize(line.trim().match(/b[^A_Z]+([A-Z-]{3,})/)?.[1] ?? '');
            } else {
                maidenName = lastName;
            }
        }
        lastLine = line;
    });
    return {
        lastName,
        firstName,
        passportNumber,
        dateOfBirth,
        placeOfBirth,
        sex,
        maidenName,
    }
}