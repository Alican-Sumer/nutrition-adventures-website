// GENERIC JAVASCRIPT (Paste at top of story javascript)
window.setup = window.setup || {};

State.variables.title = "";
State.variables.description = "";
State.variables.nextText = "";
State.variables.nextPassage = "";
State.variables.backText = "";
State.variables.backPassage = "";


setup.buildCard = function() { 
    const title = State.variables.title || "";
    const description = State.variables.description || "";
    const nextText = State.variables.nextText || "";
    const nextPassage = State.variables.nextPassage || "";
    const backText = State.variables.backText || "";
    const backPassage = State.variables.backPassage || "";
  
    // Footer links
    const nextLink = (nextText && nextPassage)
        ? `<div class="next">[[${nextText}->${nextPassage}]]</div>`
        : "";

    const backLink = (backText && backPassage)
        ? `<div class="back">[[${backText}->${backPassage}]]</div>`
        : "";

    // Determine how many links exist
    const linkCount = [nextLink, backLink].filter(Boolean).length;
    const footerClass = linkCount === 1 ? "footer single" : "footer";

    const footer = (nextLink || backLink)
        ? `<div class="${footerClass}">${backLink}${nextLink}</div>`
        : "";

    return `
        <div class="card">
            <div class="title">${title}</div>
            <div class="description">${description}</div>
            ${footer}
        </div>
    `;
};

// Generic description function
setup.description = function(elements) {
    let descriptionHTML = ``;
    for (let element of elements) {
        descriptionHTML += `<div>${element}</div>`;
    }
    return descriptionHTML;
};

setup.elementConstructor = function(elements) {
    let elementHTML = ``;
    for (let element of elements) {
        // Build attribute string dynamically
        let attrs = "";
        for (let key in element) {
            if (key === "element" || key === "content") continue; // skip element and text
            if (element[key] !== undefined && element[key] !== "") {
                attrs += ` ${key}="${element[key]}"`;
            }
        }
        // Build HTML
        if (element.element.toLowerCase() === "img") {
            elementHTML += `<${element.element}${attrs}>`;
        } else {
            elementHTML += `<${element.element}${attrs}>${element.content ?? ""}</${element.element}>`;
        }
    }
    return elementHTML;
};