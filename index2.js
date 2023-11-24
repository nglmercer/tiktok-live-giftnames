const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Función para mover el atributo 'src' al final de un nodo
function moverSrcAlFinal(node) {
    const src = node.getAttribute('src');
    if (src !== null) {
        node.removeAttribute('src');
        node.setAttribute('src', src);
    }
}

// Función para verificar si un nodo o sus atributos contienen alguna palabra clave
function contienePalabraClave(node, palabrasClave) {
    const htmlDelNodo = node.outerHTML;
    for (let palabra of palabrasClave) {
        if (htmlDelNodo.includes(palabra)) {
            return true;
        }
    }

    // Check the node's attributes for keywords
    for (let attr of node.attributes) {
        for (let palabra of palabrasClave) {
            if (attr.value.includes(palabra)) {
                return true;
            }
        }
    }

    // Check the node's classes for keywords
    for (let clase of node.classList) {
        for (let palabra of palabrasClave) {
            if (clase.includes(palabra)) {
                return true;
            }
        }
    }

    // Check the next 4 sibling nodes for keywords
    let nextNode = node;
    for (let i = 0; i < 4; i++) {
        if (nextNode) {
            nextNode = nextNode.nextSibling;
            if (nextNode && nextNode.nodeName === 'DIV') {
                return true;
            }
        }
    }
}

// Función para eliminar código innecesario
function eliminarcodigo(palabrasClave) {
    const html = fs.readFileSync('C:/Users/melser/Downloads/TikFinity.html', 'utf-8');
    const dom = new JSDOM(html);

    // Remove all nodes that do not contain any of the keywords
    const allNodes = dom.window.document.body.getElementsByTagName('*');
    for (let i = allNodes.length - 1; i >= 0; i--) {
        const node = allNodes[i];
        if (contienePalabraClave(node, palabrasClave)) {
            moverSrcAlFinal(node);
            continue;
        }
        node.parentNode.removeChild(node);
    }

    fs.writeFileSync('C:/Users/melser/Downloads/TikFinity.html', dom.serialize());
}

// Función principal
function main() {
    // Palabras clave para conservar en el documento
    const palabrasClave = ['<img src="./TikFinity_files/', 'webp'];
    eliminarcodigo(palabrasClave);
}

main();