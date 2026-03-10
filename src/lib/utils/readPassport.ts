import { capitalize } from "./caseConverter";
import { parse as parseMrzLines } from "mrz";

export type DocumentType = 'id-card' | 'passport' | 'unknown';

// Extrahiert MRZ-Zeilen aus OCR-Text und parsed sie via mrz-Bibliothek.
const extractMRZ = (ocrText: string) => {
    // Versuche Fragmente zu heilen (Tabs entfernen, Zeilen die zusammengehören könnten)
    const lines = ocrText
        .split("\n")
        .map(l => l.replace(/[.\t\r\s]/g, "").toUpperCase())
        .filter(l => l.length >= 2 && !l.includes("SPECIMEN") && !l.includes("MUSTER"));

    // TD3: 2 Zeilen à 44 Zeichen (Reisepass)
    // Suche nach P< (Pass)
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("P<")) {
            let line1 = lines[i].padEnd(44, "<").slice(0, 44);
            let line2 = (lines[i + 1] ?? "").padEnd(44, "<").slice(0, 44);
            try {
                const result = parseMrzLines([line1, line2]);
                if (result.fields.lastName || result.fields.firstName) return result.fields;
            } catch { /* weiter */ }
        }
    }

    // TD1: 3 Zeilen à 30 Zeichen (Personalausweis)
    for (let i = 0; i < lines.length - 2; i++) {
        if (lines[i].length >= 10 && (lines[i].startsWith("ID") || lines[i].startsWith("I<"))) {
            const l1 = lines[i].padEnd(30, "<").slice(0, 30);
            const l2 = lines[i + 1].padEnd(30, "<").slice(0, 30);
            const l3 = lines[i + 2].padEnd(30, "<").slice(0, 30);
            try {
                const result = parseMrzLines([l1, l2, l3]);
                if (result.fields.lastName || result.fields.firstName) return result.fields;
            } catch { /* weiter */ }
        }
    }

    return null;
};

// Konvertiert MRZ-Datum (YYMMDD) in DD.MM.YYYY
const mrzDateToDisplay = (mrzDate: string | null | undefined): string => {
    if (!mrzDate || mrzDate.length !== 6) return "";
    const yy = parseInt(mrzDate.slice(0, 2));
    const mm = mrzDate.slice(2, 4);
    const dd = mrzDate.slice(4, 6);
    const year = yy > 30 ? 1900 + yy : 2000 + yy;
    return `${dd}.${mm}.${year}`;
};

export const detectDocumentType = (ocrText: string): DocumentType => {
    const hasMRZ = /P<[A-Z]{3}/.test(ocrText);
    if (hasMRZ) return 'passport';

    const idCardSignals = [
        'DEUTSCHLAND', 'IDENTITÄTSKARTE', 'Vornamen', 'Vorname', 'Geburtsort',
        'IDENTITY CARD', "CARTE D'IDENTITE",
    ];
    const passportSignals = [
        'REISEPASS', 'PASSPORT', 'DATE OF BIRTH', 'DATE DE NAISSANCE', 'NATIONALITY',
    ];

    const upperText = ocrText.toUpperCase();
    const idScore = idCardSignals.filter(signal => ocrText.includes(signal)).length;
    const passportScore = passportSignals.filter(signal => upperText.includes(signal)).length;

    if (idScore > passportScore) return 'id-card';
    if (passportScore > idScore) return 'passport';
    if (upperText.includes('REISEPASS') || upperText.includes('PASSPORT')) return 'passport';
    return 'unknown';
};

const STREET_PATTERN = /[A-ZÄÖÜa-zäöü][A-ZÄÖÜa-zäöü\s.,-]+\s+\d+[a-zA-Z]?/i;

export const readPassport = (parsedText: string) => {
    let idNumber = "";
    let dateOfBirth = "";
    let placeOfBirth = "";
    let sex = "";
    let firstName = "";
    let lastName = "";
    let maidenName = "";

    const mrz = extractMRZ(parsedText);
    if (mrz) {
        dateOfBirth = mrzDateToDisplay(mrz.birthDate ?? null);
        idNumber = mrz.documentNumber ?? "";
        sex = mrz.sex ?? "";
        firstName = capitalize(mrz.firstName ?? "");
        lastName = capitalize(mrz.lastName ?? "");
        maidenName = lastName;
    }

    const lines = parsedText.split("\n");
    let lastLine = "";

    lines.forEach((line) => {
        const upperLine = line.toUpperCase();
        const upperLastLine = lastLine.toUpperCase();

        if (upperLastLine.includes("VORNAMEN") || upperLastLine.includes("GIVEN NAMES")) {
            if (!firstName) firstName = capitalize(line.replace(/-/g, " ").trim());
        } else if (upperLastLine.includes("NAME") && (upperLastLine.includes("SURNAME") || upperLastLine.includes("NOM"))) {
            if (!lastName) {
                const cleaned = line.replace(/^([a-z]\.?\s|\[[a-z]\]|\([a-z]\)|lal|la)/i, "").trim();
                lastName = capitalize(cleaned.split("+")[0].trim());
                if (!maidenName) maidenName = lastName;
            }
        } else if (upperLastLine.includes("GEBURTSDATUM") || upperLastLine.includes("DATE OF BIRTH") || upperLastLine.includes("DATE DE NAISSANCE")) {
            const match = line.match(/\d{2}\.\d{2}\.\d{4}/);
            if (match && !dateOfBirth) dateOfBirth = match[0];
        } else if (upperLastLine.includes("GEBURTSORT") || upperLastLine.includes("PLACE OF BIRTH") || upperLastLine.includes("LIEU DE NAISSANCE")) {
            if (!placeOfBirth) {
                // Filter für Hologramm-D oder einzelne Buchstaben nach dem Ort (z.B. BERLIN D)
                placeOfBirth = capitalize(line.split("\t")[0].split(" ")[0].trim());
            }
        } else if (upperLine.includes("PASS-NR") || upperLine.includes("PASSPORT NO")) {
             const parts = line.split("\t");
             const candidate = parts.find(p => /^[A-Z0-9]{8,10}$/.test(p.trim().replace(/[^A-Z0-9]/g, "")))?.trim().replace(/[^A-Z0-9]/g, "");
             if (candidate && !idNumber) idNumber = candidate;
        }

        lastLine = line;
    });

    return {
        passportBio: {
            firstName,
            lastName,
            idNumber,
            dateOfBirth,
            placeOfBirth,
            maidenName,
        },
        idNumber,
        dateOfBirth,
        placeOfBirth,
        sex,
    };
};

export const readIdFrontCard = (parsedText: string) => {
    let lastName = "";
    let firstName = "";
    let idNumber = "";
    let dateOfBirth = "";
    let placeOfBirth = "";
    let maidenName = "";
    let sex = "";
    let lastLine = "";

    const lines = parsedText.split("\n").map(l => l.replace(/\r/g, "").trim());

    lines.forEach((line) => {
        if (lastLine.includes("BUNDESREPUBLIK DEUTSCHLAND") || lastLine.includes("Dokument")) {
            const candidate = line.split("\t")[0].replace(/[^A-Z0-9]/g, "").trim();
            if (/^[A-Z0-9]{8,10}$/.test(candidate)) {
                idNumber = candidate;
            }
        } else if (line.includes("DEUTSCHLAND")) {
            const parts = line.split("\t");
            const candidate = parts.find(p => /^[A-Z0-9]{8,10}$/.test(p.trim().replace(/[^A-Z0-9]/g, "")))?.trim().replace(/[^A-Z0-9]/g, "");
            if (candidate) idNumber = candidate;

        // Nachname: Erweiterter Filter für Labels (a, b, lal, la, (a), etc.)
        } else if (/^([a-z]\.?\s|\[[a-z]\]|\([a-z]\)|lal|la)/i.test(line) && !line.includes("/")) {
            const cleaned = line.replace(/^([a-z]\.?\s|\[[a-z]\]|\([a-z]\)|lal|la)/i, "").trim();
            if (cleaned.length >= 2) {
                lastName = capitalize(cleaned.split("+")[0].trim());
                maidenName = lastName;
            }

        } else if (/^([b]\.?\s|\[b\]|\(b\)|lbl|lb)/i.test(line) && !line.includes("/")) {
            const nameMatch = line.match(/[A-ZÄÖÜ]{3,}/);
            if (nameMatch) {
                maidenName = capitalize(nameMatch[0].trim());
            }

        } else if (lastLine.includes("Vornamen") || lastLine.includes("Vorname")) {
            firstName = capitalize(line.replace(/-/g, " ").trim());

        } else if (lastLine.includes("Date de naissance") || lastLine.includes("Date of birth")) {
            const match = line.match(/\d{2}\.\d{2}\.\d{4}/);
            if (match) dateOfBirth = match[0];

        } else if (lastLine.includes("Geburtsort")) {
            // Filter für Hologramm-D oder einzelne Buchstaben nach dem Ort
            placeOfBirth = capitalize(line.split("\t")[0].trim());

        } else if (line.includes("IDENTITÄTSKARTE") && !idNumber) {
            const parts = line.split("\t");
            if (parts[1]) idNumber = parts[1].trim().replace(/[^A-Z0-9]/g, "").toUpperCase();
        }

        lastLine = line;
    });

    const mrz = extractMRZ(parsedText);
    if (mrz) {
        if (mrz.lastName) lastName = capitalize(mrz.lastName);
        if (mrz.firstName) firstName = capitalize(mrz.firstName);
        if (mrz.documentNumber) idNumber = mrz.documentNumber;
        if (mrz.birthDate) dateOfBirth = mrzDateToDisplay(mrz.birthDate ?? null);
        if (mrz.sex) sex = mrz.sex;
    }

    return { lastName, firstName, idNumber, dateOfBirth, placeOfBirth, maidenName, sex };
};

export const readIdBackCard = (parsedText: string, ocrLines: { LineText: string }[] = []) => {
    let placeOfBirth = "";
    let lastLine = "";
    const address = { street: null as any, number: null as any, place: null as any, zip: null as any, country: "Deutschland", addressAddendum: null as any };

    const lines = parsedText.split("\n").map(l => l.replace(/\r/g, "").trim()).filter(Boolean);

    lines.forEach((line) => {
        if (lastLine.includes("Anschrift/Address/Adresse")) {
            const parts = line.split("\t");
            const addrPart = parts[1] ?? parts[0];
            address.zip = addrPart.split(" ")[0];
            address.place = capitalize(addrPart.split(" ").slice(1).join(" "));
        } else if (lastLine.includes("Größe/Height/Taille")) {
            const numberMatch = line.match(/^(\d+[a-zA-Z]?)$/);
            if (numberMatch) {
                address.number = numberMatch[1];
            }
        } else if (lastLine.includes("Place of birth")) {
            placeOfBirth = capitalize(line.trim());

        } else if (/\t\d{5}\s+\S+/.test(line) || /^\d{5}\s+\S+/.test(line)) {
            const zipCityPart = line.split("\t").find(p => /^\d{5}\s/.test(p.trim())) ?? line;
            address.zip = zipCityPart.trim().split(" ")[0];
            address.place = capitalize(zipCityPart.trim().split(" ").slice(1).join(" "));

        } else if (STREET_PATTERN.test(line) && !line.includes("<") && !address.street) {
            const numberMatch = line.match(/(\d+[a-zA-Z]?)(\s|$|[^0-9a-zA-Z])/);
            if (numberMatch) {
                address.number = numberMatch[1];
                address.street = capitalize(line.replace(new RegExp("\\s*" + numberMatch[1] + ".*$"), "").trim());
            }
        }
        lastLine = line;
    });

    if (!address.street && ocrLines.length > 0) {
        const streetLine = ocrLines.find(
            l => STREET_PATTERN.test(l.LineText.trim()) && !l.LineText.includes("<")
        );
        if (streetLine) {
            const text = streetLine.LineText.trim();
            const numberMatch = text.match(/(\d+[a-zA-Z]?)(\s|$|[^0-9a-zA-Z])/);
            if (numberMatch) {
                address.number = numberMatch[1];
                address.street = capitalize(text.replace(new RegExp("\\s*" + numberMatch[1] + ".*$"), "").trim());
            }
        }
    }

    return { address, country: "Deutschland", placeOfBirth };
};
