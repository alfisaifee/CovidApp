import React, { Component } from 'react';
import Pagination from 'react-js-pagination';
import ListGroup from '../common/listGroup';
import { paginate } from '../utils/paginate';
import { getContinents } from '../common/continentsList';
import _ from 'lodash';

export class CovidData extends Component {
    static displayName = CovidData.name;

    constructor(props) {
        super(props);
        this.state = {
            covidInfo: [],
            continents: [],
            loading: true,
            activePage: 1,
            pageSize: 10,
            selectedContinent: { name: "All" },
            sortColumn: { path: 'countryCountry', order: 'asc' },
        };
    }

    componentDidMount() {
        this.populateCovidData();
        const continents = [{ name: "All" }, ...getContinents()];
        this.setState({ continents });
    }

    handlePageChange = (page) => {
        this.setState({ activePage: page })
    }

    handleContinentSelect = (continent) => {
        this.setState({ selectedContinent: continent, activePage: 1 })
    }

    handleSort = (path) => {
        const sortColumn = { ...this.state.sortColumn }
        if (sortColumn.path === path)
            sortColumn.order = (sortColumn.order === 'asc') ? 'desc' : 'asc';
        else {
            sortColumn.path = path;
            sortColumn.order = 'asc';
        }
        this.setState({ sortColumn })
    }

    renderSortIcon = (column) => {
        const { sortColumn } = this.state;
        if (column !== sortColumn.path) return null;
        if (sortColumn.order === 'asc')
            return <i className="fa fa-sort-asc"></i>;
        return <i className="fa fa-sort-desc"></i>;
    }

    static renderCovidTable(covidInfo, activePage, pageSize, selectedContinent, handlePageChange, handleSort, sortColumn, renderSortIcon) {
        let filtered = selectedContinent && selectedContinent.name !== "All" ? covidInfo.filter(c => c.continent === selectedContinent.name) : covidInfo;
        let sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])
        let covidInfoPage = paginate(sorted, activePage, pageSize)
        let pagination = (sorted.length <= pageSize) ? null : CovidData.renderPagination(sorted, handlePageChange, activePage, pageSize);
        return (
            <div>
                <p> Showing data for {sorted.length} countries </p>
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

    static renderPagination(covidInfo, handlePageChange, activePage, pageSize) {
        return (
            <Pagination
                totalItemsCount={covidInfo.length}
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

    static renderFiltering(continents, handleContinentSelect, selectedContinent) {
        return (
            <ListGroup
                items={continents}
                selectedItem={selectedContinent}
                onItemSelect={handleContinentSelect}
            />);
    }

    render() {
        let contents = this.state.loading ? <p><em>Loading...</em></p> :
            CovidData.renderCovidTable(this.state.covidInfo, this.state.activePage, this.state.pageSize,
                this.state.selectedContinent, this.handlePageChange, this.handleSort, this.state.sortColumn, this.renderSortIcon);

        const filtering = CovidData.renderFiltering(this.state.continents, this.handleContinentSelect, this.state.selectedContinent);

        return (
            <div className="row">
                <div className="col-2">
                    {filtering}
                </div>
                <div className="col">
                    {contents}

                </div>
            </div>
        );
    }

    async populateCovidData() {
        const response = await fetch('api/coviddata');
        const data = await response.json();
        this.setState({ covidInfo: data.countries, loading: false });
    }
}