import * as basicLightbox from 'basiclightbox';

export function onClickImg({ target: { dataset } }) { 
    basicLightbox
        .create(
            `<img width="" height="" src="${dataset.source}">`,
    )
        .show();
}

