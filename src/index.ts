import { types } from 'vortex-api';
import * as React from 'react';
import Slider from "react-slick";

const loadSlickStyles = () => {
    const link1 = document.createElement('link');
    link1.rel = 'stylesheet';
    link1.href = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.href = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css';
    document.head.appendChild(link2);
};

loadSlickStyles();

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

// TODO : Gérer affichage mod individuel (carrousel ?)
// TODO : Gérer download dans Vortex directement
// TODO : Toucher de l'herbe

function injectStyles() {
    const style = document.createElement('style');

    style.type = 'text/css';
    style.innerHTML = `
        * {
            box-sizing: border-box;
        }

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

        .grid.grid-5 {
            grid-template-columns: repeat(5, 1fr);
        }

        .card {
            border: solid 2px hsl(251, 8%, 40%);
            border-radius: 0.5rem;
            background-color: hsl(251, 8%, 25%);
            height: 100%;
            position: relative;
            transition: transform 0.2s ease;
        }

        .card:hover {
            transform: scale(1.02);
        }

        .card-body {
            padding: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
        }

        .card-body.mod {
            padding: unset;
        }

        .card-header {
            display: flex;
            column-gap: 40px;
            align-items: flex-end;
        }

        .card-body.mod .card-header {
            flex-direction: column;
        }

        .card-image {
            max-width: 20%;
        }

        .card-body.mod .card-image {
            max-width: unset;
            width: 100%;
            height: 170px;
            margin-bottom: 5px;
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0.5rem;
            object-fit: cover;
        }

        .card-title {
            border-bottom: solid 2px hsl(251, 8%, 75%);
            padding-bottom: 3px;
            margin: 0;
            width: 100%;
            padding: 5px;
        }

        .card-body.mod .card-title {
            text-align: center;
        }

        .card-content {
            text-wrap: wrap;
            padding: 5px;
        }

        .card-body.mod .card-content {
            text-align: center;
        }

        .card-footer {
            border-top: solid 2px lightgray;
            text-align: center;
            background-color: hsl(251, 8%, 23%);
            border-bottom-left-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
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

        .header {
            display: flex;
            flex-direction: column;
            min-height: 85vh;
        }

        .header .header-banner {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            min-height: 50vh;
            flex: 1;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
        }

        .header .header-banner a {
            cursor: pointer;
            color: #772a00;
        }

        .header .header-banner .header-banner-title {
            background-color: hsl(0deg 0% 0% / 60%);
            padding: 15px;
            width: 100%;
            text-align: center;
            text-shadow: 2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000, 1px 1px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 0 10px #000;
            text-transform: uppercase;
        }

        .header .header-banner .header-banner-title h1 {
            font-size: 2.5rem;
            color: #772a00;
        }

        .header .header-banner .header-banner-title h3 {
            margin: 0;
            padding: 0;
        }

        .header .header-breadcrumb ol {
            list-style: none;
            display: flex;
            padding: .75rem 1rem;
            margin: 0;
        }

        .breadcrumb-item {
            display: flex;
            cursor: pointer;
        }

        .breadcrumb-item:not(:first-of-type) {
            padding-left: .5rem;
        }

        .breadcrumb-item:not(:first-of-type)::before {
            content: "/";
            display: inline-block;
            padding-right: .5rem;
            color: #6c757d;
        }

        .header .header-translators {
            display: flex;
            justify-content: space-around;
        }

        .header-translators p {
            text-align: center;
            font-size: 1.5rem;
            margin: 0;
        }

        .header-translators span {
            color: #772a00;
        }

        .header-translators .unProofread {
            color: #fff;
            background-color: #772a00;
            border-radius: 5px;
            padding: 0 10px;
        }

        .slick-prev,
        .slick-next {
            width: 25px;
            height: 25px;
        }

        .slick-prev::before,
        .slick-next::before {
            cursor: pointer;
            font-size: 25px;
        }

        .slick-prev {
            left: 0;
        }

        .slick-next {
            right: 0;
        }

        .slick-slide img {
            max-width: 100%;
            max-height: 215px;
            width: auto;
            height: auto;
            margin: auto;
            position: relative;
            display: block;
            cursor: pointer;
        }

        .slick-dots {
            position: unset;
            bottom: unset;
        }

        .slick-dots li button:before,
        .slick-dots li.slick-active button:before {
            color: #fff;
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

        json.forEach((element: { Id: Number; Name: String; Description: String; HaveSubCategory: Boolean, ImageUrl: String }) => {
            categories.push({
                id: element.Id,
                name: element.Name,
                description: element.Description,
                subCategory: element.HaveSubCategory,
                imageUrl: element.ImageUrl
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

        json.ChildCategories.forEach((element: { Id: Number; Name: String; Description: String; ImageUrl: String; }) => {
            subCategories.push({
                id: element.Id,
                name: element.Name,
                description: element.Description,
                imageUrl: element.ImageUrl
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
            PreviewImageUrl: String,
            MiniDescription: String;
            Category: {
                Id: Number,
                Name: String
            },
            Authors: Array<Object>,
            Translators: Array<Object>,
            IsForSkyrimSE: Boolean
        }) => {
            if(element.IsForSkyrimSE)
            {
                mods.push({
                    id: element.Id,
                    name: element.Name,
                    image: element.PreviewImageUrl,
                    description: element.MiniDescription,
                    authors: element.Authors,
                    translators: element.Translators
                });
            }
        });

        return mods;
    }
    catch(e)
    {
        console.error(e);
        return [];
    }
}

async function getModById(modId: Number) {
    let url = `https://www.confrerie-des-traducteurs.fr/api/skyrim/mods/${modId}`; // API de la Confrérie

    try
    {
        let response = await fetch(url); // Appel à l'API

        if(!response.ok)
            throw new Error('Impossible de récupérer le mod : ' + response.status);

        let mod = await response.json();
        return mod;
    }
    catch (error)
    {
        console.error('Erreur:', error);
        return null;
    }
}


/**
 * Composant principal avec la sélection des catégories
 */
const MyMainPage = () => {
    // Gestion des cards (catégories, sous-catégories, mods)
    const [categories, setCategories] = React.useState([]);
    const [subCategories, setSubCategories] = React.useState([]);
    const [parentCategory, setParentCategory] = React.useState(null);
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [modsForCategory, setModsForCategory] = React.useState([]);
    const [mod, setMod] = React.useState(null);

    // Gestion des modales
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [clickedImage, setClickedImage] = React.useState(null);

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
    };

    const handleModClick = async(mod: { id: Number; }) => {
        const fetchedMod = await getModById(mod.id);
        setMod(fetchedMod);
    };

    // Trie les images : image cliquée en premier
    const sortedImages = (mod: { Images: Array<{ Link: String }> }) => {
        return mod.Images.slice().sort((a, b) => {
            if(!clickedImage)
                return 0;

            return a.Link === clickedImage.Link ? -1 : b.Link === clickedImage.Link ? 1 : 0;
        });
    };

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
                    React.createElement(
                        'div',
                        { className: 'card-header' },
                        React.createElement('img', { className: 'card-image', src: cat.imageUrl }),
                        React.createElement('h5', { className: 'card-title' }, cat.name),
                    ),
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
            { className: 'grid-item grid-5', key: mod.id },
            React.createElement(
                'div',
                { className: 'card' },
                React.createElement(
                    'div',
                    { className: 'card-body mod' },
                    React.createElement(
                        'div',
                        { className: 'card-header' },
                        React.createElement('img', { className: 'card-image', src: mod.image }),
                        React.createElement('h5', { className: 'card-title' }, mod.name),
                    ),
                    React.createElement('p', { className: 'card-content', dangerouslySetInnerHTML: { __html: mod.description }}),
                    React.createElement(
                        'div',
                        { className: 'card-footer' },
                        React.createElement(
                            'p',
                            {},
                            'Mod de ' + mod.authors.map((a: { Name: String; }) => a.Name).join(', ')
                        ),
                        React.createElement(
                            'p',
                            {},
                            'Traduit par ' + mod.translators.map((t: { Name: String; }) => t.Name).join(', ')
                        )
                    )
                ),
                React.createElement(
                    'button',
                    {
                        type: 'button',
                        className: 'card-link',
                        onClick: () => handleModClick(mod)
                    }
                )
            )
        )
    );

    if(mod)
    {
        return React.createElement(
            'div',
            { className: 'main' },
            React.createElement(
                'div',
                { className: 'header' },
                React.createElement(
                    'div',
                    {
                        className: 'header-banner',
                        style: {
                            backgroundImage: `url('${mod.TopImage.Link}')`
                        }
                    },
                    React.createElement(
                        'div',
                        { className: 'header-banner-title' },
                        React.createElement('h1', { style: { margin: 0 }}, mod.Name),
                        React.createElement('h3', {}, mod.OriginalName),
                        React.createElement(
                            'h3',
                            {},
                            'Mod original de ',
                            ...mod.Authors.map((a: { Name: String, index: number }) => [
                                React.createElement(
                                    'a',
                                    {
                                        href: `https://www.confrerie-des-traducteurs.fr/membre/${a.Name}`,
                                        target: '_blank'
                                    },
                                    a.Name,
                                    a.index < mod.Authors.length - 1 ? ', ' : ''
                                )
                            ])
                        )
                    )
                ),
                React.createElement(
                    'nav',
                    { className: 'header-breadcrumb' },
                    React.createElement(
                        'ol',
                        {},
                        (selectedCategory || mod) &&
                        React.createElement(
                            'li',
                            {
                                className: 'breadcrumb-item',
                                onClick: () => {
                                    setSubCategories([]);
                                    setSelectedCategory(null);
                                    setParentCategory(null);
                                    setModsForCategory([]);
                                    setMod(null);
                                },
                            },
                            'Catégories'
                        ),
                        parentCategory &&
                        React.createElement(
                            'li',
                            {
                                className: 'breadcrumb-item',
                                onClick: () => {
                                    setModsForCategory([]);
                                    setMod(null);
                                },
                            },
                            parentCategory.name
                        ),
                        parentCategory && selectedCategory &&
                        React.createElement(
                            'li',
                            {
                                className: 'breadcrumb-item',
                                onClick: () => {
                                    setMod(null);
                                },
                            },
                            selectedCategory.name
                        ),
                        mod &&
                        React.createElement(
                            'li',
                            {
                                className: 'breadcrumb-item active',
                                style: {
                                    color: '#6c757d;',
                                    cursor: 'default'
                                }
                            },
                            mod.Name
                        )
                    )
                ),
                React.createElement(Slider, {
                    style: {
                        padding: '10px 50px'
                    },
                    dots: true,
                    infinite: false,
                    speed: 500,
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    nextArrow: React.createElement(
                        'button',
                        { className: 'slick-next slick-arrow', type: 'button' },
                        'Next'
                    ),
                    prevArrow: React.createElement(
                        'button',
                        { className: 'slick-prev slick-arrow', type: 'button' },
                        'Previous'
                    )
                },
                    mod.Images.map((image: { Link: String; Name: String; }, index: number) =>
                        React.createElement('div', { key: index },
                            React.createElement('img', { className: 'slider-image', src: image.Link, alt: image.Name })
                        )
                    )
                ),
                React.createElement('div', { className: 'header-translators' },
                    React.createElement('p', {}, 'Traduit par ',
                        React.createElement('span', {}, mod.Translators.map((t: { Name: String; }) => t.Name).join(', '))
                    ),
                    mod.Testers.length > 0 && React.createElement('p', {}, 'Testé par ',
                        React.createElement('span', {}, mod.Testers.map((t: { Name: String; }) => t.Name).join(', '))
                    ),
                    mod.Proofreaders.length > 0 && React.createElement('p', {}, 'Relu par ',
                        React.createElement('span', {}, mod.Proofreaders.map((p: { Name: String; }) => p.Name).join(', '))
                    ),
                    !mod.IsProofread && React.createElement('p', { className: 'unProofread' }, 'Ce mod n\'a pas encore été relu')
                ),
                isModalOpen && React.createElement(
                    'div',
                    {
                        style: {
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999
                        },
                        onClick: () => {
                            setIsModalOpen(false);
                            setClickedImage(null);
                        }
                    },
                    React.createElement(
                        'div',
                        {
                            style: {
                                backgroundColor: 'white',
                                padding: '20px',
                                borderRadius: '8px',
                                maxHeight: '80vh',
                                overflowY: 'auto',
                                maxWidth: '90vw'
                            },
                            onClick: (e) => e.stopPropagation()
                        },
                        React.createElement('h2', null, 'Images du mod'),
                        React.createElement(
                            'div',
                            {
                                style: {
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '10px',
                                    justifyContent: 'center',
                                    marginTop: '10px'
                                }
                            },
                            sortedImages(mod).map((img, i) =>
                                React.createElement('img', {
                                    key: `modal-image-${i}`,
                                    src: img.Link,
                                    alt: `Image ${i + 1}`,
                                    style: { maxHeight: '200px', borderRadius: '6px' }
                                })
                            )
                        ),
                        React.createElement(
                            'button',
                            {
                                onClick: () => {
                                    setIsModalOpen(false);
                                    setClickedImage(null);
                                },
                                style: { marginTop: '20px' }
                            },
                            'Fermer'
                        )
                    )
                )
            )
        );
    }
    else
    {
        return React.createElement(
            'div',
            { className: 'main' },
            React.createElement('h1', { className: 'text-center' }, 'Bienvenue sur l\'extension de la Confrérie des Traducteurs'),
            React.createElement('h2', { className: 'text-center' }, subTitle),

            React.createElement(
                'div',
                { className: 'grid-container'},
                React.createElement(
                    'div',
                    { className: 'grid grid-5' },
                    modsForCategory.length > 0 ? mods : rows
                )
            ),

            ((subCategories.length > 0 || modsForCategory.length > 0) && categories.length > 0) &&
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
    }
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