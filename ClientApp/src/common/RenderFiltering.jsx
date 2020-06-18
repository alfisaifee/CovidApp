import React from 'react';
import ListGroup from './listGroup';

export function renderFiltering(item, handleItemSelect, selectedItem) {
    return (
        <ListGroup
            items={item}
            selectedItem={selectedItem}
            onItemSelect={handleItemSelect}
        />);
}