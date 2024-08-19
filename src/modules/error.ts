const loginRegisterPage = document.getElementById("log-in-register-page") as HTMLDivElement;

export function errorMessageLoginRegisterPage(errorMessage: string): void {
    
    const existingErrorPEl = document.getElementById("error-message") as HTMLParagraphElement;
    if (existingErrorPEl) {
        existingErrorPEl.remove();
    }

    const errorMessagePEl = document.createElement("p") as HTMLParagraphElement;
    errorMessagePEl.id = "error-message";
    errorMessagePEl.classList.add("centerText");
    errorMessagePEl.style.color = "red";
    errorMessagePEl.textContent = errorMessage; 


    loginRegisterPage.appendChild(errorMessagePEl);
}
