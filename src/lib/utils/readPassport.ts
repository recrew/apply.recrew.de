import { capitalize } from "./caseConverter";

let lastName = "";
let firstName = "";
let passportNumber = "";
let idNumber = "";
let dateOfBirth = "";
let placeOfBirth = "";
let sex = "";
let maidenName = "";
let lastLine = "";
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
        if (lastLine.match(/[A-Z]<[A-Z]/)) {
            passportNumber = line.split("<")[0].slice(0, 9);
        } else if (
            lastLine.toUpperCase().includes("DATE DE NAISSANCE") ||
            lastLine.toUpperCase().includes("DATE OF BIRTH")
        ) {
            let lines: string[] = line
                .trim()
                .replace(/\t/g, ",")
                .replace(/\s+/g, "")
                .split(",");

            lines.forEach((item) => {
                if (item.includes(".") || item.length === 8) {
                    dateOfBirth = item.includes(".")
                        ? item
                        : item.slice(0, 2) +
                        "." +
                        item.slice(2, 4) +
                        "." +
                        item.slice(4, 8);
                }
                //matches gender
                if (item.match(/[MF]/)) {
                    sex = item.length === 1 ? item : "";
                }

                //matches place of birth
                if (item.match(/[A-Z]/) && item.length > 1 && sex) {
                    placeOfBirth = item.includes(" ") ? item.split(" ")[0] : item;
                }
            });
        } else if (
            (lastLine.toUpperCase().includes("SEX") && !sex) ||
            lastLine.toUpperCase().includes("SCHLATTAINA ")
        ) {
            sex = line.trim().replace(/\t/g, ",").split(",")[0];
        } else if (
            (lastLine.toUpperCase().includes("NATIONALITY") && !placeOfBirth) ||
            (lastLine.toUpperCase().includes("NATIONALITÉ") && !placeOfBirth)
        ) {
            placeOfBirth = line.toUpperCase().includes("SCHWEIZ")
                ? "SCHWEIZ"
                : line.trim().replace(/\t/g, ",").split(",")[0];
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
        if (line.includes("DEUTSCHLAND") || lastLine.includes("Dokument")) {
            let number: string[] = line.split("\t");
            idNumber = number.length > 2 ? number[2] : number[0];
        } else if (
            lastLine.includes("IDENTITY CARD / CARTE D'IDENTITE") ||
            lastLine.includes("Vorname")
        ) {
            lastName = capitalize(line.trim());
            maidenName = lastName;
        } else if (lastLine.includes("Vornamen")) {
            firstName = capitalize(line.trim());
        } else if (
            lastLine.includes("Date de naissance") ||
            lastLine.includes("Date of birth")
        ) {
            dateOfBirth = line.match(/\d{2}\.\d{2}\.\d{4}/)?.[0] ?? "";
        } else if (lastLine.includes("Geburtsort")) {
            placeOfBirth = capitalize(line.trim());
        } else if (line.includes("Nationality") && !firstName) {
            firstName = capitalize(lastLine.trim());
        } else if (lastLine.includes("[a]")) {
            maidenName = capitalize(line.trim().match(/[A-Z-\s]{3,}/)?.[0] ?? "");
        }
        lastLine = line;
    });
    return {
        lastName,
        firstName,
        idNumber,
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
        } else if (lastLine.includes("Place of birth")) {
            placeOfBirth = capitalize(line.trim());
        }
        lastLine = line;
    });
    return {
        address,
        country: "Deutschland",
        placeOfBirth,
    };
};
