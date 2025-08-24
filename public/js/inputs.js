import { $$ } from './utils.js';


export function initInputs() {
    // ===============================
    // ! TODO --- INPUTS
    // ===============================

    console.log("inputs.js cargado")

    const inputContainers = $$(".input-container");


    inputContainers.forEach(container => {
        // permitir input o textarea
        const input = container.querySelector('input, textarea');
        if (!input) return;


        const refresh = () => container.classList.toggle('filled', input.value.trim() !== '');
        refresh();


        input.addEventListener('input', refresh);
        input.addEventListener('blur', refresh);
    });


    const resetearLabels = () => {
        inputContainers.forEach(container => {
            const input = container.querySelector('input, textarea');
            if (!input) return;


            container.classList.toggle('filled', input.value.trim() !== '')
        })
    }


    return { resetearLabels };
}