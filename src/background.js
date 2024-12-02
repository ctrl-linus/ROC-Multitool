import menuItems from './js/menuitems.js';
import urls from './js/urlList.js';

const fixedEncodeURI = (str) => {
    return encodeURI(str).replace('/%5B/g', '[').replace('/%5D/g', ']');
}

chrome.runtime.onInstalled.addListener(() => {
    for (let i = 0; i < menuItems.length; i++) {
        chrome.contextMenus.create({
            id: menuItems[i].id,
            title: menuItems[i].title,
            contexts: menuItems[i].contexts,
            parentId: menuItems[i].parentId
        });
    }
});

chrome.contextMenus.onClicked.addListener((contextClick) => {
    if (contextClick.selectionText && contextClick.menuItemId in urls) {
        const urlsForMenuItem = urls[contextClick.menuItemId];
        let encoded;
        switch (contextClick.menuItemId) {
            case "CC_Magic":
            case "CC_Defang":
            case "CC_Resolve_Domain":
                urlsForMenuItem.forEach((url) => {
                    encoded = url + btoa(fixedEncodeURI(contextClick.selectionText)).replaceAll('=', '');
                });
                break;
            case "fileExt Info":
                urlsForMenuItem.forEach((url) => {
                    encoded = url + fixedEncodeURI(contextClick.selectionText).replaceAll(".", "");
                });
                break;
            default:
                urlsForMenuItem.forEach((url) => {
                    encoded = url + fixedEncodeURI(contextClick.selectionText);
                });
                break;
        }
        chrome.tabs.create({ url: encoded });
    }
});
