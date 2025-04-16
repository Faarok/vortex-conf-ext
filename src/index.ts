import { types } from 'vortex-api';
import * as React from 'react';

/**
* https://www.confrerie-des-traducteurs.fr/api/[game]/categories = Récupère toutes les catégories du site {game}
* https://www.confrerie-des-traducteurs.fr/api/[game]/categories/[id] = Récupère la catégorie avec l'ID {id} du site {game}
* https://www.confrerie-des-traducteurs.fr/api/[game]/categories/[id]/mods = Récupère tous les mods (avec les informations des listes de mods sur le site) de la catégorie avec l'ID {id} du site {game}
* https://www.confrerie-des-traducteurs.fr/api/[game]/mods/[id] = Récupère toutes les informations du mod avec l'ID {id} du site {game}
*
* Exemples :
* https://www.confrerie-des-traducteurs.fr/api/skyrim/categories
* https://www.confrerie-des-traducteurs.fr/api/skyrim/categories/21/
* https://www.confrerie-des-traducteurs.fr/api/skyrim/categories/2/mods
* https://www.confrerie-des-traducteurs.fr/api/skyrim/mods/1481
 */

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

        .grid-container {
            height: 70vh;
            overflow-y: scroll;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
            padding: 1rem;
        }

        .grid.grid-6 {
            grid-template-columns: repeat(6, 1fr);
        }

        .card {
            padding: 10px;
            border: solid 2px hsl(251, 8%, 40%);
            border-radius: 0.5rem;
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

        .card button.card-link {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            cursor: pointer;
            background-color: unset;
            border: unset;
        }

        .card .btn-primary {
            width: 40%;
            align-self: center;
        }

        .btn-primary {
            background-color:hsl(21, 100%, 23.30%);
            transition: 0.2s ease;
        }

        .btn-primary:hover {
            background-color: hsl(21, 100.00%, 35%);
        }

        .btn-back {
            margin-top: 2rem;
            font-size: 1.2rem;
            padding: 0.3em 0.6em;
        }
    `;

    document.head.appendChild(style);
}

async function getCategories() {
    let url = "https://www.confrerie-des-traducteurs.fr/api/skyrim/categories"; // API de la Confrérie

    try
    {
        let response = await fetch(url); // Appel à l'API

        if(!response.ok)
            throw new Error('Impossible de récupérer les catégories : ' + response.status);

        let json = await response.json();
        let categories = [];

        json.forEach((element: { Id: Number; Name: String; Description: String; HaveSubCategory: Boolean }) => {
            categories.push({
                id: element.Id,
                name: element.Name,
                description: element.Description,
                subCategory: element.HaveSubCategory
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

async function getSubCategories(id: Number) {
    let url = `https://www.confrerie-des-traducteurs.fr/api/skyrim/categories/${id}`;

    try
    {
        let response = await fetch(url); // Appel à l'API

        if(!response.ok)
            throw new Error('Impossible de récupérer les sous-catégories : ' + response.status);

        let json = await response.json();
        let subCategories = [];

        json.ChildCategories.forEach((element: { Id: Number; Name: String; Description: String; }) => {
            subCategories.push({
                id: element.Id,
                name: element.Name,
                description: element.Description
            });
        });

        return subCategories;
    }
    catch (error)
    {
        console.error('Erreur:', error);
        return [];
    }
}

async function getModsForCategory(catId: Number) {
    const url = `https://www.confrerie-des-traducteurs.fr/api/skyrim/categories/${catId}/mods`;

    try
    {
        const response = await fetch(url);

        if(!response.ok)
            throw new Error('Erreur lors du chargement des mods.');

        let json = await response.json();
        let mods = [];

        json.forEach((element: {
            Id: Number;
            Name: String;
            MiniDescription: String;
            Category: {
                Id: Number,
                Name: String
            }
        }) => {
            mods.push({
                id: element.Id,
                name: element.Name,
                description: element.MiniDescription
            });
        });

        return mods;
    }
    catch(e)
    {
        console.error(e);
        return [];
    }
}


/**
 * Composant principal avec la sélection des catégories
 */
const MyMainPage = () => {
    const [categories, setCategories] = React.useState([]);
    const [subCategories, setSubCategories] = React.useState([]);
    const [parentCategory, setParentCategory] = React.useState(null);
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [modsForCategory, setModsForCategory] = React.useState([]);

    React.useEffect(() => {
        injectStyles();
        const loadCategories = async () => {
            const fetchedCategories = await getCategories();
            setCategories(fetchedCategories);
        };

        loadCategories();
    }, []);

    const handleCategoryClick = async (cat: { id: Number; name: String; description: String; subCategory: Boolean }) => {
        if(cat.subCategory)
        {
            const fetchedSubCategories = await getSubCategories(cat.id);
            setSubCategories(fetchedSubCategories);
            setParentCategory(cat);
        }
        else
        {
            setSelectedCategory(cat);
            const mods = await getModsForCategory(cat.id);
            setModsForCategory(mods);
        }
    }

    let subTitle = 'Choix des catégories';

    if(modsForCategory.length > 0 && selectedCategory)
        subTitle = `Mods de la catégorie ${selectedCategory.name}`;
    else if(parentCategory && subCategories.length > 0)
        subTitle = `Sous-catégories de : ${parentCategory.name}`;

    const rows = (subCategories.length > 0 ? subCategories : categories).map((cat) =>
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
                ),
                React.createElement(
                    'button',
                    {
                        type: 'button',
                        className: 'card-link',
                        onClick: () => handleCategoryClick(cat)
                    }
                )
            )
        )
    );

    const mods = modsForCategory.map((mod) =>
        React.createElement(
            'div',
            { className: 'grid-item grid-6', key: mod.id },
            React.createElement(
                'div',
                { className: 'card' },
                React.createElement(
                    'div',
                    { className: 'card-body' },
                    React.createElement('h5', { className: 'card-title' }, mod.name),
                    React.createElement('p', { className: 'card-content' }, mod.description),
                ),
                React.createElement(
                    'button',
                    {
                        type: 'button',
                        className: 'card-link',
                        onClick: () => console.log(`mod ${mod.name} sélectionné`)
                        // onClick: () => handleModClick(mod)
                    }
                )
            )
        )
    );

    return React.createElement(
        'div',
        { className: 'main' },
        React.createElement('h1', { className: 'text-center' }, 'Bienvenue sur l\'extension de la Confrérie des Traducteurs'),
        React.createElement('h2', { className: 'text-center' }, subTitle),

        React.createElement(
            'div',
            { className: 'grid-container'},
            modsForCategory.length > 0
                ? React.createElement('div', { className: 'grid grid-6' }, mods)
                : React.createElement('div', { className: 'grid' }, rows),
        ),

        (subCategories.length > 0 || modsForCategory.length > 0) &&
            React.createElement(
                'button',
                {
                    className: 'btn btn-primary btn-back',
                    onClick: () => {
                        setSubCategories([]);
                        setParentCategory(null);
                        setSelectedCategory(null);
                        setModsForCategory([]); // ← reset les mods
                    }
                },
                'Retour aux catégories'
            )
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