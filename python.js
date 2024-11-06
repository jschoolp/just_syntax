// Ініціалізація списків команд, бібліотек, операторів тощо
const commands = ["print", "def", "class", "if", "else", "elif", "return", "import", "for", "while", "try", "except", "with", "in", "not", "or", "and", "from", "as"];
const libraries = ["math", "sys", "os", "re", "json", "time", "random", "datetime", "Tk", "Label", "tkinter", "Button"];
const operators = ["!=", "=", "==", "+", "-", "*", "/", "%", ">", "<", ">=", "<=", "!", "&&", "||", "**"];
const functions = ["len", "str", "int", "float", "input", "open", "range", "list", "dict", "set", "tuple", "type", "configure", "grid", "mainloop"];
const pythonArguments = ["text", "column", "row", "padx", "pady", "bg", "fg", "font", "width", "height", "command", "side", "fill", "expand", "anchor", "justify", "padding"];
const variables = [];
const pythonFunctions = []; // Список для збереження імен функцій
const TAB_SYMBOL = "→"; // Символ табуляції для textarea
const TAB_SIZE = 20; // Розмір табуляції у пікселях

function replaceTab(event) {
    const textarea = document.getElementById("codeInput");
    if (event.key === "Tab") {
        event.preventDefault(); 
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        textarea.value = textarea.value.substring(0, start) + TAB_SYMBOL + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + TAB_SYMBOL.length;
    }
}

function wrapInSpan(token, color, marginLeft = 0) {
    return `<span style="color: ${color}; font-size: 20px; font-family: terminal, monaco, monospace; margin-left: ${marginLeft}px;">${token}</span>`;
}

function findVariables(paragraphs) {
    paragraphs.forEach((paragraph) => {
        const words = paragraph.trim().split(' ');

        // Перевірка для функцій
        if (words[0] === "def" && words[1]) {
            const functionName = words[1].split('(')[0];
            if (!pythonFunctions.includes(functionName)) {
                pythonFunctions.push(functionName); 
            }
            
            const functionArgs = paragraph.match(/\(([^)]+)\)/);
            if (functionArgs && functionArgs[1]) {
                const args = functionArgs[1].split(",").map(arg => arg.trim());
                args.forEach(arg => {
                    if (!variables.includes(arg)) {
                        variables.push(arg);
                    }
                });
            }
        } else if (words.length > 1 && words[1] === '=') {
            const variableName = words[0].trim();
            if (!variables.includes(variableName)) {
                variables.push(variableName);
            }
        }
    });
}

function highlightToken(token, marginLeft = 0) {
    const cleanedToken = token.trim();

    if (variables.includes(cleanedToken)) {
        return wrapInSpan(token, "#333399", marginLeft); // колір змінних
    }
    if (pythonArguments.includes(cleanedToken)) {
        return wrapInSpan(token, "#333399", marginLeft); // колір аргументів
    }
    if (cleanedToken.startsWith("#")) {
        return wrapInSpan(token, "#40826D"); // колір коментарів
    }
    if (commands.includes(cleanedToken)) {
        return wrapInSpan(token, "#FF9966", marginLeft); // колір команд
    }
    if (libraries.includes(cleanedToken)) {
        return wrapInSpan(token, "#2E8B57", marginLeft); // колір бібліотек
    }
    if (cleanedToken === "." || cleanedToken === "," || cleanedToken === ":") {
        return wrapInSpan(token, "#000000", marginLeft); // стандартний колір для символів
    }
    if (operators.includes(cleanedToken)) {
        return wrapInSpan(token, "#2A3439", marginLeft); // колір операторів
    }
    if (functions.includes(cleanedToken) || pythonFunctions.includes(cleanedToken)) {
        return wrapInSpan(token, "#FF6600", marginLeft); // колір функцій
    }
    if (!isNaN(cleanedToken)) {
        return wrapInSpan(token, "#01796F", marginLeft); // колір чисел
    }
    if (/^["'][^"']*["']$/.test(token)) {
        return wrapInSpan(token, "#AF4035", marginLeft); // колір рядкових літералів
    }
    if (cleanedToken === "(" || cleanedToken === ")") {
        return wrapInSpan(token, "#0000FF", marginLeft); // колір синій для дужок
    }

    return wrapInSpan(token, "#000000", marginLeft); // колір за замовчуванням
}

function generateHighlightedCode() {
    const inputText = document.getElementById("codeInput").value;
    const paragraphs = inputText.split('\n');
    findVariables(paragraphs);

    const highlightedParagraphs = paragraphs.map((paragraph) => {
        let tabCount = 0;
        while (paragraph.startsWith(TAB_SYMBOL)) {
            tabCount++;
            paragraph = paragraph.slice(1);
        }

        const marginLeft = tabCount * TAB_SIZE;

        const tokens = [];
        const regex = /(".*?"|'.*?'|\w+|[=+*\/\-%><!&|(){}\[\]";,.:]|\s+|#.*$)/g;
        let match;

        while ((match = regex.exec(paragraph)) !== null) {
            tokens.push(match[0]);
        }

        const spans = tokens.map((token, index) => {
            const applyMargin = index === 0 ? marginLeft : 0;
            
            if (token.startsWith("#")) {
                return wrapInSpan(token, "#87a69c"); // колір коментарів
            }

            return highlightToken(token, applyMargin);
        });

        return `<p>${spans.join('')}</p>`;
    });

    document.getElementById("output").innerHTML = highlightedParagraphs.join('');
}

function copyHTMLCode() {
    const htmlContent = document.getElementById("output").innerHTML;
    const tempElement = document.createElement("textarea");
    tempElement.value = htmlContent;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand("copy");
    document.body.removeChild(tempElement);
    alert("Скопійовано!");
}
