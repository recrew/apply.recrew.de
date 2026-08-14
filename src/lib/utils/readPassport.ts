import { capitalize } from "./caseConverter";
import { parse as parseMrzLines } from "mrz";

export type DocumentType = 'id-card' | 'passport' | 'unknown';

// ── Field Value Patterns ─────────────────────────────────────────────
const TRAILING_SINGLE_CHAR = /\s+[A-Z]$/i;
const GERMAN_DATE = /\d{2}\.\d{2}\.\d{4}/;
const DOCUMENT_NO = /^[A-Z0-9]{8,10}$/;
const STREET_WITH_NUMBER = /[A-ZÄÖÜa-zäöü][A-ZÄÖÜa-zäöü\s.,-]+\s+\d+[a-zA-Z]?/i;
const HOUSE_NUMBER = /(\d+[a-zA-Z]?)(\s|$|[^0-9a-zA-Z])/;
const STANDALONE_NUMBER = /^(\d+[a-zA-Z]?)$/;

// ── OCR Label Prefixes (German ID card field markers) ────────────────
const OCR_SURNAME_PREFIX = /^(\[a[\]A-Z]?\.?\s*|\([a]\)\.?\s*|a\.?\s+|lal\s*|la\s*)/i;
const OCR_MAIDEN_NAME_PREFIX = /^(\[b[\]A-Z]?\.?\s*|\(b\)\.?\s*|b\.?\s+|lbl\s*|lb\s*)/i;

// ── Inline Label Patterns ("Label\tValue" single-line OCR output) ────
const INLINE_FIRST_NAME = /(?:Vornamen?|Given Names?)\s*[\t:]\s*([A-ZÄÖÜ][^\n\t]+)/i;
const INLINE_LAST_NAME = /(?:Name|Surname|Nom)\s*[\t:]\s*([A-ZÄÖÜ][^\n\t+]+)/i;
const INLINE_DATE_OF_BIRTH = /(?:Geburtsdatum|Date of Birth|Date de naissance)\s*[\t:]\s*(\d{2}\.\d{2}\.\d{4})/i;
const INLINE_PLACE_OF_BIRTH = /(?:Geburtsort|Place of Birth|Lieu de naissance)\s*[\t:]\s*([A-ZÄÖÜ][^\n\t]+)/i;

// ── Passport/Nationality ─────────────────────────────────────────────
const PASSPORT_MRZ_START = /P<[A-Z]{3}/;
const NATIONALITY_AFTER_DATE_SEX = /\d{2}\.\d{2}\.\d{4}\t[MFmf]\t([A-ZÄÖÜ][A-ZÄÖÜa-zäöü]+)/;
const NATIONALITY_AFTER_DATE = /\d{2}\.\d{2}\.\d{4}[\s\t]+([A-ZÄÖÜa-zäöü]{4,})/;

// ── Physical Characteristics ─────────────────────────────────────────
const HEIGHT_CM = /(\d{2,3})\s*cm/i;

// ── Address Patterns ─────────────────────────────────────────────────
const ZIP_CITY_WITH_TAB = /\t\d{5}\s+\S+/;
const ZIP_CITY_AT_START = /^\d{5}\s+\S+/;
const ZIP_CITY_PREFIX = /^\d{5}\s/;

// ── Helpers ──────────────────────────────────────────────────────────

const cleanPlaceOfBirth = (raw: string): string => {
    const withoutTabs = raw.split("\t")[0].trim();
    return capitalize(withoutTabs.replace(TRAILING_SINGLE_CHAR, "").trim());
};

const cleanName = (raw: string): string =>
    capitalize(raw.replace(/-/g, " ").trim().replace(TRAILING_SINGLE_CHAR, "").trim());

const extractInline = <T>(text: string, pattern: RegExp, transform: (m: RegExpMatchArray) => T): T | null => {
    const m = text.match(pattern);
    return m ? transform(m) : null;
};

const parseStreetAndNumber = (text: string): { street: string; number: string } | null => {
    const match = text.match(HOUSE_NUMBER);
    if (!match || match.index === undefined) return null;
    return {
        street: capitalize(text.slice(0, match.index).trim()),
        number: match[1]
    };
};

const sanitizeDocNo = (s: string): string => s.replace(/[^A-Z0-9]/g, "");

const findDocNoInTabLine = (line: string): string | null => {
    const parts = line.split("\t");
    const match = parts.find(p => DOCUMENT_NO.test(sanitizeDocNo(p.trim())));
    return match ? sanitizeDocNo(match.trim()) : null;
};

const MRZ_NATIONALITY_MAP: Record<string, string> = {
    "D": "deutsch",
};

const mrzNationalityToText = (code: string): string => {
    const clean = code.replace(/</g, "").trim().toUpperCase();
    return MRZ_NATIONALITY_MAP[clean] ?? "";
};

const extractCommonInlineFields = (parsedText: string) => ({
    firstName: extractInline(parsedText, INLINE_FIRST_NAME, m => cleanName(m[1])),
    dateOfBirth: extractInline(parsedText, INLINE_DATE_OF_BIRTH, m => m[1]),
    placeOfBirth: extractInline(parsedText, INLINE_PLACE_OF_BIRTH, m => cleanPlaceOfBirth(m[1])),
});

interface Address {
    street: string | null;
    number: string | null;
    place: string | null;
    zip: string | null;
    country: string;
    addressAddendum: string | null;
}

type MrzFields = ReturnType<typeof parseMrzLines>['fields'];

const extractMRZ = (ocrText: string): MrzFields | null => {
    const lines = ocrText
        .split("\n")
        .map(l => l.replace(/[.\t\r\s]/g, "").toUpperCase())
        .filter(l => l.length >= 2 && !l.includes("SPECIMEN") && !l.includes("MUSTER"));

    // TD3: 2 Zeilen à 44 Zeichen (Reisepass)
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("P<")) {
            const line1 = lines[i].padEnd(44, "<").slice(0, 44);
            const line2 = (lines[i + 1] ?? "").padEnd(44, "<").slice(0, 44);
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

const mrzDateToDisplay = (mrzDate: string | null | undefined): string => {
    if (!mrzDate || mrzDate.length !== 6) return "";
    const yy = parseInt(mrzDate.slice(0, 2));
    const mm = mrzDate.slice(2, 4);
    const dd = mrzDate.slice(4, 6);
    const yearIn2000s = 2000 + yy;
    const year = yearIn2000s > new Date().getFullYear() ? 1900 + yy : yearIn2000s;
    return `${dd}.${mm}.${year}`;
};

export const detectDocumentType = (ocrText: string): DocumentType => {
    if (PASSPORT_MRZ_START.test(ocrText)) return 'passport';

    const upperText = ocrText.toUpperCase();

    const idCardSignals = [
        'PERSONALAUSWEIS', 'IDENTITÄTSKARTE', 'IDENTITY CARD', "CARTE D'IDENTITE",
        'BUNDESREPUBLIK DEUTSCHLAND',
    ];
    const passportSignals = [
        'REISEPASS', 'FEDERAL REPUBLIC OF GERMANY',
    ];
    const hasPassportWord = /\bPASSPORT\b/.test(upperText);

    const idScore = idCardSignals.filter(signal => upperText.includes(signal)).length;
    const passportScore = passportSignals.filter(signal => upperText.includes(signal)).length + (hasPassportWord ? 1 : 0);

    if (idScore > passportScore) return 'id-card';
    if (passportScore > idScore) return 'passport';
    return 'unknown';
};

export const readPassport = (parsedText: string) => {

    let idNumber = "";
    let dateOfBirth = "";
    let placeOfBirth = "";
    let sex = "";
    let firstName = "";
    let lastName = "";
    let maidenName = "";
    let nationality = "";

    const mrz = extractMRZ(parsedText);

    if (mrz) {
        dateOfBirth = mrzDateToDisplay(mrz.birthDate ?? null);
        idNumber = mrz.documentNumber ?? "";
        sex = mrz.sex ?? "";
        firstName = capitalize((mrz.firstName ?? "").replace(TRAILING_SINGLE_CHAR, "").trim());
        lastName = capitalize((mrz.lastName ?? "").replace(TRAILING_SINGLE_CHAR, "").trim());
        maidenName = lastName;
    }

    if (!nationality) {
        const match = parsedText.match(NATIONALITY_AFTER_DATE_SEX);
        if (match) nationality = match[1].trim().toLowerCase();
    }

    // Fallback: MRZ nationality code
    if (!nationality && mrz?.nationality) {
        nationality = mrzNationalityToText(mrz.nationality);
    }

    const inlineFields = extractCommonInlineFields(parsedText);
    if (!firstName) firstName = inlineFields.firstName ?? "";
    if (!dateOfBirth) dateOfBirth = inlineFields.dateOfBirth ?? "";
    if (!placeOfBirth) placeOfBirth = inlineFields.placeOfBirth ?? "";

    if (!lastName) {
        const inlineLastName = extractInline(parsedText,
            INLINE_LAST_NAME, m => capitalize(m[1].trim().split("+")[0].trim())
        );
        if (inlineLastName) { lastName = inlineLastName; if (!maidenName) maidenName = lastName; }
    }

    const lines = parsedText.split("\n");
    let lastLine = "";

    lines.forEach((line) => {
        const upperLine = line.toUpperCase();
        const upperLastLine = lastLine.toUpperCase();

        if (upperLastLine.includes("VORNAMEN") || upperLastLine.includes("GIVEN NAMES")) {
            if (!firstName) firstName = cleanName(line);
        } else if (upperLastLine.includes("NAME") && (upperLastLine.includes("SURNAME") || upperLastLine.includes("NOM"))) {
            if (!lastName) {
                const cleaned = line.replace(OCR_SURNAME_PREFIX, "").trim();
                lastName = capitalize(cleaned.split("+")[0].trim());
                if (!maidenName) maidenName = lastName;
            }
        } else if (upperLastLine.includes("GEBURTSDATUM") || upperLastLine.includes("DATE OF BIRTH") || upperLastLine.includes("DATE DE NAISSANCE")) {
            const match = line.match(GERMAN_DATE);
            if (match && !dateOfBirth) dateOfBirth = match[0];
        } else if (upperLastLine.includes("GEBURTSORT") || upperLastLine.includes("PLACE OF BIRTH") || upperLastLine.includes("LIEU DE NAISSANCE")) {
            if (!placeOfBirth) placeOfBirth = cleanPlaceOfBirth(line);
        } else if (upperLine.includes("PASS-NR") || upperLine.includes("PASSPORT NO")) {
             const candidate = findDocNoInTabLine(line);
             if (candidate && !idNumber) idNumber = candidate;
        }

        lastLine = line;
    });

    return {
        passportBio: { firstName, lastName, idNumber, dateOfBirth, placeOfBirth, maidenName },
        idNumber,
        dateOfBirth,
        placeOfBirth,
        sex,
        nationality,
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
    let nationality = "";
    let lastLine = "";

    const mrz = extractMRZ(parsedText);
    if (mrz) {
        if (mrz.lastName) lastName = capitalize(mrz.lastName.replace(TRAILING_SINGLE_CHAR, "").trim());
        if (mrz.firstName) firstName = capitalize(mrz.firstName.replace(TRAILING_SINGLE_CHAR, "").trim());
        if (mrz.documentNumber) idNumber = mrz.documentNumber;
        if (mrz.birthDate) dateOfBirth = mrzDateToDisplay(mrz.birthDate ?? null);
        if (mrz.sex) sex = mrz.sex;
        maidenName = lastName;
        if (mrz.nationality) nationality = mrzNationalityToText(mrz.nationality);
    }

    const inlineFields = extractCommonInlineFields(parsedText);
    if (!firstName) firstName = inlineFields.firstName ?? "";
    if (!dateOfBirth) dateOfBirth = inlineFields.dateOfBirth ?? "";
    if (!placeOfBirth) placeOfBirth = inlineFields.placeOfBirth ?? "";

    const lines = parsedText.split("\n").map(l => l.replace(/\r/g, "").trim());
    let inSignatureZone = false;

    lines.forEach((line) => {
        const lowerLine = line.toLowerCase();
        if (lowerLine.includes("unterschrift") || lowerLine.includes("nterschrift") ||
            lowerLine.includes("signature") || lowerLine.includes("inhaberin") ||
            lowerLine.includes("bearer") || lowerLine.includes("titulaire")) {
            inSignatureZone = true;
        }

        if (lastLine.includes("BUNDESREPUBLIK DEUTSCHLAND") || lastLine.includes("Dokument")) {
            const candidate = findDocNoInTabLine(line);
            if (candidate && !idNumber) idNumber = candidate;

        } else if (line.includes("DEUTSCHLAND")) {
            const candidate = findDocNoInTabLine(line);
            if (candidate && !idNumber) idNumber = candidate;

        } else if (!inSignatureZone && (lastLine.includes("Name") && (lastLine.includes("Surname") || lastLine.includes("Nom")))
            && !lastLine.includes("Vornamen") && !lastLine.includes("Given name")) {
            if (!lastName) {
                const cleaned = line.replace(OCR_SURNAME_PREFIX, "").trim();
                lastName = capitalize(cleaned.split("+")[0].trim());
                if (!maidenName) maidenName = lastName;
            }

        } else if (!inSignatureZone && OCR_SURNAME_PREFIX.test(line) && !line.includes("/")) {
            const cleaned = line.replace(OCR_SURNAME_PREFIX, "").trim();
            if (cleaned.length >= 2) {
                if (!lastName) lastName = capitalize(cleaned.split("+")[0].trim());
                if (!maidenName) maidenName = capitalize(cleaned.split("+")[0].trim());
            }

        } else if (OCR_MAIDEN_NAME_PREFIX.test(line) && !line.includes("/")) {
            const nameMatch = line.match(/[A-ZÄÖÜ]{3,}/);
            if (nameMatch) maidenName = capitalize(nameMatch[0].trim());

        } else if ((lastLine.includes("Vornamen") || lastLine.includes("Vorname")) && !firstName) {
            firstName = cleanName(line);

        } else if ((lastLine.includes("Date de naissance") || lastLine.includes("Date of birth")) && !dateOfBirth) {
            const match = line.match(GERMAN_DATE);
            if (match) dateOfBirth = match[0];
            if (!nationality) {
                const natMatch = line.match(NATIONALITY_AFTER_DATE);
                if (natMatch) nationality = natMatch[1].trim().toLowerCase();
            }

        } else if (lastLine.includes("Geburtsort") && !placeOfBirth) {
            placeOfBirth = cleanPlaceOfBirth(line);

        } else if (line.includes("IDENTITÄTSKARTE") && !idNumber) {
            const parts = line.split("\t");
            if (parts[1]) idNumber = sanitizeDocNo(parts[1].trim());
        }

        lastLine = line;
    });

    return { lastName, firstName, idNumber, dateOfBirth, placeOfBirth, maidenName, sex, nationality };
};

export const readIdBackCard = (parsedText: string, ocrLines: { LineText: string }[] = []) => {

    let placeOfBirth = "";
    let idNumber = "";
    let height: number | null = null;
    let lastLine = "";
    const address: Address = { street: null, number: null, place: null, zip: null, country: "Deutschland", addressAddendum: null };

    const mrz = extractMRZ(parsedText);
    if (mrz?.documentNumber) idNumber = mrz.documentNumber;

    const lines = parsedText.split("\n").map(l => l.replace(/\r/g, "").trim()).filter(Boolean);

    lines.forEach((line) => {
        if (lastLine.includes("Anschrift/Address/Adresse")) {
            const parts = line.split("\t");
            const addrPart = parts[1] ?? parts[0];
            address.zip = addrPart.split(" ")[0];
            address.place = capitalize(addrPart.split(" ").slice(1).join(" "));
        } else if (lastLine.includes("Größe/Height/Taille")) {
            const numberMatch = line.match(STANDALONE_NUMBER);
            if (numberMatch) {
                address.number = numberMatch[1];
            }
        } else if (lastLine.includes("Place of birth")) {
            placeOfBirth = capitalize(line.trim());

        } else if (ZIP_CITY_WITH_TAB.test(line) || ZIP_CITY_AT_START.test(line)) {
            const zipCityPart = line.split("\t").find(p => ZIP_CITY_PREFIX.test(p.trim())) ?? line;
            address.zip = zipCityPart.trim().split(" ")[0];
            address.place = capitalize(zipCityPart.trim().split(" ").slice(1).join(" "));

        } else if (STREET_WITH_NUMBER.test(line) && !line.includes("<") && !address.street) {
            const parsed = parseStreetAndNumber(line);
            if (parsed) {
                address.street = parsed.street;
                address.number = parsed.number;
            }
        }
        lastLine = line;
    });

    // Extract height from ocrLines (preserves spatial order better than parsedText)
    if (ocrLines.length > 0) {
        for (let i = 0; i < ocrLines.length - 1; i++) {
            if (/Gr[öo]ße|Height|Taille/i.test(ocrLines[i].LineText)) {
                const heightMatch = ocrLines[i + 1].LineText.match(HEIGHT_CM);
                if (heightMatch) {
                    const val = parseInt(heightMatch[1]);
                    if (val >= 100 && val <= 250) height = val;
                    break;
                }
            }
        }
    }

    // Fallback: search parsedText lines for height pattern
    if (height === null) {
        for (const line of lines) {
            const heightMatch = line.match(HEIGHT_CM);
            if (heightMatch && !line.includes("<")) {
                const val = parseInt(heightMatch[1]);
                if (val >= 100 && val <= 250) {
                    height = val;
                    break;
                }
            }
        }
    }

    if (!address.street && ocrLines.length > 0) {
        const streetLine = ocrLines.find(
            l => STREET_WITH_NUMBER.test(l.LineText.trim()) && !l.LineText.includes("<")
        );
        if (streetLine) {
            const parsed = parseStreetAndNumber(streetLine.LineText.trim());
            if (parsed) {
                address.street = parsed.street;
                address.number = parsed.number;
            }
        }
    }

    const streetMissingOcrLines = !address.street && ocrLines.length > 0;

    return { address, country: "Deutschland", placeOfBirth, idNumber, streetMissingOcrLines, height };
};
