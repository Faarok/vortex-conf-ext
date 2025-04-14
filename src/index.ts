import { types } from 'vortex-api';
import * as React from 'react';

async function getCategories() {
    let url = "https://www.confrerie-des-traducteurs.fr/api/skyrim/categories"; // API de la Confrérie

    try
    {
        let response = await fetch(url); // Appel à l'API
        if (!response.ok)
            throw new Error('Impossible de récupérer les catégories : ' + response.status);

        let json = await response.json();
        let categories = [];

        json.forEach((element: { Id: Number; Name: String; Description: String; }) => {
            categories.push({
                id: element.Id,
                name: element.Name,
                description: element.Description
            });
        });

        return categories;
    }
    catch (error)
    {
        console.error('Erreur:', error);
        return [];
    }
}

function injectStyles() {
    const style = document.createElement('style');

    style.type = 'text/css';
    style.innerHTML = `
        .title {
            margin: 1rem 0;
            width: 100%;
        }

        .main {
            min-height: 100%;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
        }

        .card {
            padding: 10px;
            border: solid 2px hsl(251, 8%, 40%);
            border-radius: 1rem;
            background-color: hsl(251, 8%, 25%);
            min-height: 100%;
            position: relative;
            transition: transform 0.2s ease;
        }

        .card:hover {
            transform: scale(1.02);
        }

        .card-body {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .card-title {
            border-bottom: solid 2px hsl(251, 8%, 75%);
            padding-bottom: 3px;
        }

        .card-content {
            text-wrap: wrap;
        }

        .card .card-link {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            cursor: pointer;
        }

        .card .btn-primary {
            background-color:hsl(21, 100%, 23.30%);
            width: 40%;
            align-self: center;
            transition: 0.2s ease;
        }

        .card .btn-primary:hover {
            background-color: hsl(21, 100.00%, 35%);
        }
    `;
    document.head.appendChild(style);
}


/**
 * Composant principal avec la sélection des catégories
 */
const MyMainPage = () => {
    const [categories, setCategories] = React.useState([]);

    React.useEffect(() => {
        injectStyles();
        const loadCategories = async () => {
            const fetched = await getCategories();
            setCategories(fetched);
        };

        loadCategories();
    }, []);

    const rows = categories.map((cat, index) =>
        React.createElement(
            'div',
            { className: 'grid-item', key: cat.id },
            React.createElement(
                'div',
                { className: 'card' },
                React.createElement(
                    'div',
                    { className: 'card-body' },
                    React.createElement('h5', { className: 'card-title' }, cat.name),
                    React.createElement('p', { className: 'card-content' }, cat.description),
                    // React.createElement(
                    //     'a',
                    //     {
                    //         href: `https://www.confrerie-des-traducteurs.fr/api/skyrim/categories/${cat.id}`,
                    //         className: 'btn btn-primary',
                    //     },
                    //     'Voir la catégorie'
                    // )
                ),
                React.createElement(
                    'a',
                    {
                        href: `https://www.confrerie-des-traducteurs.fr/api/skyrim/categories/${cat.id}`,
                        className: 'card-link',
                    },
                    null
                )
            )
        )
    );

    return React.createElement(
        'div',
        { className: 'main' },
        React.createElement(
            'h1',
            { className: 'text-center' },
            'Bienvenue sur l\'extension de la Confrérie des Traducteurs'
        ),
        React.createElement('h2', { className: 'text-center' }, 'Choix des catégories'),
        React.createElement('div', { className: 'grid' }, rows)
    );
};


/**
 * Fonction d'enregistrement de la page dans Vortex
 */
function main(context: types.IExtensionContext): boolean {
    context.registerMainPage(
        'search',                            // Icône
        'Confrérie',                       // Titre
        MyMainPage, // ← passe le contexte ici
        {
            id: 'confrerie-main-page',      // ID
            group: 'per-game',              // Groupe dans le menu
            visible: () => true             // Visible tout le temps
        }
    );

    return true;
}

export default main;