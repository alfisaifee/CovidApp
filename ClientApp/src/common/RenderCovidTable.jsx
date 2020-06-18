import React from 'react';
import { paginate } from '../utils/paginate';
import { renderPagination } from '../common/RenderPagination';
import _ from 'lodash';
import SearchBox from './SearchBox';

export function renderCovidTable(covidInfo, activePage, pageSize, selectedContinent, handlePageChange, handleSort, sortColumn, renderSortIcon, searchQuery, handleSearch) {
    let filtered = covidInfo;
    if (searchQuery)
        filtered = covidInfo.filter(c => c.countryCountry.toLowerCase().startsWith(searchQuery.toLowerCase()));
    else if (selectedContinent && selectedContinent.name !== "All")
        filtered = covidInfo.filter(c => c.continent === selectedContinent.name);
    let sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])
    let covidInfoPage = paginate(sorted, activePage, pageSize)
    let pagination = (sorted.length <= pageSize) ? null : renderPagination(sorted, handlePageChange, activePage, pageSize);
    return (
        <div>
            <p> Showing data for {sorted.length} countries </p>
            <SearchBox value={searchQuery} onChange={handleSearch} />
            <table className='table table-striped' aria-labelledby="table-label">
                <thead>
                    <tr>
                        <th onClick={() => handleSort('countryCountry')}>Country {renderSortIcon('countryCountry')}</th>
                        <th onClick={() => handleSort('totalActive')}>Active {renderSortIcon('totalActive')} </th>
                        <th onClick={() => handleSort('totalRecovered')}>Recovered {renderSortIcon('totalRecovered')} </th>
                        <th onClick={() => handleSort('totalDeaths')}>Deaths {renderSortIcon('totalDeaths')} </th>
                        <th onClick={() => handleSort('totalConfirmed')}>Total {renderSortIcon('totalConfirmed')} </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        covidInfoPage.map(info =>
                            <tr key={info.countryCode}>
                                <td>{info.countryCountry}</td>
                                <td>{info.totalActive}</td>
                                <td>{info.totalRecovered}</td>
                                <td>{info.totalDeaths}</td>
                                <td>{info.totalConfirmed}</td>
                            </tr>
                        )}
                </tbody>
            </table>
            {pagination}
        </div>
    );
}