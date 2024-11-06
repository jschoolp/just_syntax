function loadSyntaxHighlighter() {
    const selectedLanguage = document.getElementById("languageSelect").value;
    const syntaxScript = document.getElementById("syntaxHighlighter");
    
    syntaxScript.remove();
    
    const newScript = document.createElement("script");
    newScript.id = "syntaxHighlighter";
    newScript.src = `${selectedLanguage}.js`;
    document.body.appendChild(newScript);
}
