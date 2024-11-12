export default function markEmptyFields() {

    let inputs = document.querySelectorAll('input, select');
    inputs.forEach((input) => {
        if(input.value.length < 1 ) {
            input.classList.add('ring-1');
            input.classList.add('ring-red-500');
            input.classList.add('border-red-500');
        } else {
            input.classList.remove('ring-1');
            input.classList.remove('ring-red-500');
            input.classList.remove('border-red-500');
        }
    })
}