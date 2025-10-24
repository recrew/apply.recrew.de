/**
 * Validates a German SV-Nummer (Rentenversicherungsnummer) with comprehensive plausibility checks
 *
 * Structure of German SV-Nummer (12 characters):
 * - Positions 1-2: Bereichsnummer (area code for Rentenversicherungsträger)
 * - Positions 3-8: Geburtsdatum (birth date in format TTMMJJ)
 * - Position 9: Anfangsbuchstabe des Geburtsnamens (initial of birth surname)
 * - Positions 10-11: Seriennummer (serial number indicating gender: 00-49 = male, 50-99 = female)
 * - Position 12: Prüfziffer (check digit - algorithm not publicly available)
 *
 * @param svNummer - The SV-Nummer to validate (format: BBTTMMJJXSSP, e.g., "65160684M007")
 * @param required - Whether the field is required (default: true)
 * @param birthDate - Optional birth date for cross-validation (format: YYYY-MM-DD or Date object)
 *                    Validates that the date in SV-Nummer matches the provided birth date
 * @param surname - Optional surname (Geburtsname) for cross-validation
 *                  Validates that the first letter matches position 9 in SV-Nummer
 * @param gender - Optional gender for cross-validation ('male'/'männlich'/'m' or 'female'/'weiblich'/'w'/'f')
 *                 Validates that serial number (positions 10-11) matches gender:
 *                 - 00-49 = male (männlich)
 *                 - 50-99 = female (weiblich)
 *
 * @returns Object with validation result:
 *          - isValid: boolean indicating if SV-Nummer is valid
 *          - error: string with detailed error message (empty if valid)
 *
 * @example
 * // Basic validation
 * validateSVNummer('65160684M007', true)
 *
 * @example
 * // Full cross-validation
 * validateSVNummer('65160684M007', true, '1984-06-16', 'Müller', 'male')
 * // Returns: { isValid: true, error: '' }
 *
 * @example
 * // Validation with mismatch
 * validateSVNummer('65160684M007', true, '1984-06-17', 'Müller', 'male')
 * // Returns: { isValid: false, error: 'Das Geburtsdatum in der SV-Nummer (16.06.1984) stimmt nicht...' }
 */
export function validateSVNummer(
	svNummer: string,
	required: boolean = true,
	birthDate?: string | Date | null,
	surname?: string | null,
	gender?: 'male' | 'female' | string | null
): { isValid: boolean; error: string } {
	if (!svNummer) {
		const error = required ? 'SV-Nummer ist erforderlich' : '';
		return { isValid: !required, error };
	}

	// Leerzeichen entfernen & Großbuchstaben erzwingen
	const sv = svNummer.replace(/\s+/g, '').toUpperCase();

	// 12 Zeichen prüfen
	if (sv.length !== 12) {
		return { isValid: false, error: 'SV-Nummer muss genau 12 Zeichen lang sein' };
	}

	// Grundstruktur prüfen: 2 Ziffern + 6 Ziffern + 1 Buchstabe + 3 Ziffern
	const pattern = /^(\d{2})(\d{6})([A-Z])(\d{3})$/;
	const match = sv.match(pattern);

	if (!match) {
		return { isValid: false, error: 'Ungültiges Format. Erwartetes Format: BB TTMMJJ X SSP (z.B. 65160684M007)' };
	}

	// Geburtsdatum extrahieren (TTMMJJ)
	const datePart = match[2];
	const day = parseInt(datePart.substring(0, 2));
	const month = parseInt(datePart.substring(2, 4));
	const year = parseInt(datePart.substring(4, 6));

	// Plausibles Datum prüfen
	const fullYear = year < 25 ? 2000 + year : 1900 + year; // heuristisch: <25 → 2000er
	const date = new Date(fullYear, month - 1, day);

	const validDate =
		date.getFullYear() === fullYear &&
		date.getMonth() === month - 1 &&
		date.getDate() === day;

	if (!validDate) {
		return { isValid: false, error: 'Ungültiges Geburtsdatum in der SV-Nummer' };
	}

	// Cross-validation: Wenn Geburtsdatum vorhanden ist, mit SV-Nummer abgleichen
	if (birthDate) {
		const birthDateObj = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;

		// Check if birthDate is valid
		if (birthDateObj && !isNaN(birthDateObj.getTime())) {
			const birthDay = birthDateObj.getDate();
			const birthMonth = birthDateObj.getMonth() + 1; // JavaScript months are 0-indexed
			const birthYear = birthDateObj.getFullYear();

			// Extract 2-digit year for comparison
			const birthYearShort = birthYear % 100;

			if (day !== birthDay || month !== birthMonth || year !== birthYearShort) {
				return {
					isValid: false,
					error: `Das Geburtsdatum in der SV-Nummer (${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${fullYear}) stimmt nicht mit dem angegebenen Geburtsdatum überein`
				};
			}
		}
	}

	// Cross-validation: Nachname (Geburtsname) - Anfangsbuchstabe muss mit Position 9 übereinstimmen
	if (surname && surname.length > 0) {
		const surnameInitial = surname.charAt(0).toUpperCase();
		const svLetter = match[3]; // Position 9 (der Buchstabe)

		if (surnameInitial !== svLetter) {
			return {
				isValid: false,
				error: `Der Anfangsbuchstabe des Nachnamens (${surnameInitial}) stimmt nicht mit dem Buchstaben in der SV-Nummer (${svLetter}) überein`
			};
		}
	}

	// Cross-validation: Geschlecht - Seriennummer gibt Geschlecht an
	// 00-49 = männlich, 50-99 = weiblich
	if (gender) {
		const serialNumber = parseInt(match[4].substring(0, 2)); // Erste 2 Ziffern der letzten 3 Ziffern (Seriennummer)
		const isMale = serialNumber >= 0 && serialNumber <= 49;
		const isFemale = serialNumber >= 50 && serialNumber <= 99;

		// Normalize gender input
		const normalizedGender = gender.toLowerCase();
		const isMaleGender = normalizedGender === 'male' || normalizedGender === 'männlich' || normalizedGender === 'm';
		const isFemaleGender = normalizedGender === 'female' || normalizedGender === 'weiblich' || normalizedGender === 'w' || normalizedGender === 'f';

		if (isMaleGender && !isMale) {
			return {
				isValid: false,
				error: `Die Seriennummer (${serialNumber.toString().padStart(2, '0')}) in der SV-Nummer deutet auf weiblich hin, aber das angegebene Geschlecht ist männlich`
			};
		}

		if (isFemaleGender && !isFemale) {
			return {
				isValid: false,
				error: `Die Seriennummer (${serialNumber.toString().padStart(2, '0')}) in der SV-Nummer deutet auf männlich hin, aber das angegebene Geschlecht ist weiblich`
			};
		}
	}

	// Note: The check digit (last digit) cannot be validated as the algorithm is not public
	// For actual verification, contact Deutsche Rentenversicherung or Krankenkasse

	return { isValid: true, error: '' };
}
