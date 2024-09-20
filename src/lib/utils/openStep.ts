import {currentStep} from "../stores/currentStep";
export const reactToBoxInteraction = (ev: CustomEvent<{detail: boolean}>, step: number): boolean => {
    if(ev.detail) {
        currentStep.update(() => step)
    }
    return ev.detail
}