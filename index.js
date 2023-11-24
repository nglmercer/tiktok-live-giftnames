const fs = require('fs');
const { JSDOM } = require('jsdom');
const path = require('path');
const readline = require('readline');
const cheerio = require('cheerio');

// Función para cambiar el nombre de un archivo
function renameFile(oldPath, newPath) {
    fs.rename(oldPath, newPath, function(err) {
        if (err) console.log('ERROR: ' + err);
    });
}

// Función para obtener los nombres de los divs y cambiar los nombres de los recursos
function getDivNamesAndChangeResourceNames() {
    const names = [];
    const oldNames = [];

    const html = fs.readFileSync('C:/Users/melser/Downloads/TikFinity.html', 'utf8');
    const $ = cheerio.load(html);

    $('div').each(function(index, element) {
        const divName = $(element).text().trim();
        names.push(divName);

        const imgElement = $(element).prev('img');
        if (imgElement.length > 0) {
            const src = imgElement.attr('src');
            const oldName = path.basename(src);
            oldNames.push(oldName);

            const extension = path.extname(oldName);
            const newName = `${divName}${extension}`;

            renameFile(path.join('C:/Users/melser/Downloads/TikFinity_files', oldName), path.join('C:/Users/melser/Downloads/TikFinity_files', newName));

            imgElement.attr('src', `./TikFinity_files/${newName}`);
        }
    });

    fs.writeFileSync('C:/Users/melser/Downloads/TikFinity.html', $.html());

    return { names, oldNames };
}

// Función para pedir confirmación al usuario
function askForConfirmation(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

// Función principal
async function main() {
    const { names, oldNames } = getDivNamesAndChangeResourceNames();
    const filesToRename = oldNames.slice(0, 200); // Limitar la cantidad de archivos a renombrar

    const answer = await askForConfirmation(`¿Estás seguro de que quieres renombrar ${filesToRename.length} archivos? (s/n) `);
    if (answer.toLowerCase() !== 's') {
        console.log('Operación cancelada.');
        return;
    }

    filesToRename.forEach(function(oldName, index) {
        const newName = `${names[index]}${path.extname(oldName)}`;
        const oldPath = path.join('C:/Users/melser/Downloads/TikFinity_files', oldName);
        const newPath = path.join('C:/Users/melser/Downloads/TikFinity_files', newName);
        renameFile(oldPath, newPath);
    });
}

main();