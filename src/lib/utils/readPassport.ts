import { capitalize } from "./caseConverter";

let lastName = "";
let firstName = "";
let passportNumber = "";
let dateOfBirth = "";
let placeOfBirth = "";
let sex = "";
let maidenName = "";
let lastLine = "";
let type = "";
let code = "";
let address = {
    street: "",
    number: 0,
    place: "",
    zip: "",
    country: "",
    addressAddendum: "",
};
export const readPassport = (parsedText: string) => {
    const lines = parsedText.split("\n");
    lastLine = "";
    lines.forEach((line) => {
        if (lastLine.includes("Passport No.")) {
            let target = line.trim().replace(/\t/g, "").replace(/\s+/g, "");
            type = target.slice(0, 1);
            code = target.slice(1, 2);
            passportNumber = target.slice(2, 11).toUpperCase();
        } else if (lastLine.includes("Date de naissance")) {
            let [dob, mOrF, pob] = line
                .trim()
                .replace(/\t/g, ",")
                .replace(/\s+/g, "")
                .split(",");
            sex = mOrF;
            dateOfBirth = dob;
            placeOfBirth = pob;
        } else if (
            lastLine.includes(`${type}<${code}<<`) &&
            passportNumber === ""
        ) {
            passportNumber = capitalize(line.slice(0, 11));
        }
        lastLine = line;
    });
    return {
        passportNumber,
        dateOfBirth,
        placeOfBirth,
        sex,
    };
};

export const readIdFrontCard = (parsedText: string) => {
    const lines = parsedText.split("\n");
    lastLine = "";
    lines.forEach((line) => {
        if (lastLine.includes("BUNDESREPUBLIK")) {
            passportNumber = lastLine.split("\t")[2];
        } else if (lastLine.includes("IDENTITY CARD / CARTE D'IDENTITE")) {
            lastName = capitalize(line.trim());
            maidenName = lastName;
        } else if (lastLine.includes("Vornamen")) {
            firstName = capitalize(line.trim());
        } else if (lastLine.includes("Date de naissance")) {
            dateOfBirth = line.match(/\d{2}\.\d{2}\.\d{4}/)?.[0] ?? "";
        } else if (lastLine.includes("Geburtsort")) {
            placeOfBirth = capitalize(line.trim());
        } else if (lastLine.includes("[a]")) {
            maidenName = capitalize(line.trim().match(/[A-Z-\s]{3,}/)?.[0] ?? "");
        }
        lastLine = line;
    });
    return {
        lastName,
        firstName,
        passportNumber,
        dateOfBirth,
        placeOfBirth,
        maidenName,
    };
};

export const readIdBackCard = (parsedText: string) => {
    const lines = parsedText.split("\n");
    lastLine = "";
    lines.forEach((line) => {
        if (lastLine.includes("Anschrift/Address/Adresse")) {
            address.zip = line.split("\t")[1].split(" ")[0];
            address.place = line.split("\t")[1].split(" ")[1];
        } else if (lastLine.includes("Größe/Height/Taille")) {
            const digitMatch = line.match(/\d/);
            address.number = digitMatch ? parseInt(digitMatch?.[0]) : 0;
            address.street = line.replace(
                /\s+\d+[a-zA-Z]?(?:[-/]\d+)?[\s\t\r\n]*$/,
                "",
            );
        }
        lastLine = line;
    });
    return {
        address,
        country: "Deutschland",
    };
};
