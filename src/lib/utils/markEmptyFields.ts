export default function markEmptyFields(): boolean {
    let allOk = true;
    let inputs = document.querySelectorAll('input[required], select[required]');
    let scrolled = false;
    inputs.forEach((input) => {
        if(input.value.length < 1 ) {
            if(!scrolled){
                input.parentElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
                scrolled = true;
            }

            input.classList.add('ring-1');
            input.classList.add('ring-red-500');
            input.classList.add('border-red-500');
            allOk = false;
        } else {
            input.classList.remove('ring-1');
            input.classList.remove('ring-red-500');
            input.classList.remove('border-red-500');

        }

    })
    scrolled = false;
    return allOk;
}