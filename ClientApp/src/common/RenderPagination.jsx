import React from 'react';
import Pagination from 'react-js-pagination';

export function renderPagination(items, handlePageChange, activePage, pageSize) {

    return (
        <Pagination
            totalItemsCount={items.length}
            itemsCountPerPage={pageSize}
            onChange={handlePageChange}
            activePage={activePage}
            pageRangeDisplayed={5}
            itemClass="page-item"
            linkClass="page-link"
            prevPageText="prev"
            nextPageText="next"
        >
        </Pagination>);

}

