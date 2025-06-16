export type SectionType = "rating-group" | "choice-group" | "text";

export interface RatingItem {
    id: string;
    label: string;
    value: number | null | "";
    max: number;
}

export interface ChoiceItem {
    id: string;
    label: string;
    /** value is either "", option[0] (="1" → positiv) or option[1] ("-1" → negativ) */
    value: string;
}

export interface RatingGroupSection {
    id: string;
    type: "rating-group";
    title?: string;
    description?: string;
    items: RatingItem[];
}

export interface ChoiceGroupSection {
    id: string;
    type: "choice-group";
    title?: string;
    description?: string;
    options: string[]; // e.g. ["1", "-1"]
    items: ChoiceItem[];
}

export interface TextSection {
    id: string;
    type: "text";
    title?: string;
    description?: string;
    value: string;
}

export type EvaluationSection =
    | RatingGroupSection
    | ChoiceGroupSection
    | TextSection;

export interface EvaluationTemplate {
    submittedBy: {
        uuid: string;
    };
    shifts: Shift[];
    sections: EvaluationSection[];
    [key: string]: unknown;
}
export interface Shift {
    name: string;
    date: string;
    id: string;
  }