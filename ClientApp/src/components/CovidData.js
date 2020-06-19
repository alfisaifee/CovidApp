import React, { Component } from 'react';
import { getContinents } from '../utils/continentsList';
import _ from 'lodash';
import CovidTable from './CovidTable';
import ListGroup from '../common/ListGroup';
import Pagination from 'react-js-pagination';
import { paginate } from '../utils/paginate';
import SearchBox from '../common/SearchBox';


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
            searchQuery: "",
            selectedContinent: { name: "All" },
            sortColumn: { path: 'countryCountry', order: 'asc' },
            date: "",
        };
    }

    componentDidMount() {
        this.populateCovidData();
        const continents = [{ name: "All" }, ...getContinents()];
        this.setState({ continents });
    }

    handlePageChange = (page) => {
        this.setState({ activePage: page });
    }

    handleContinentSelect = (continent) => {
        this.setState({ selectedContinent: continent, searchQuery:"", activePage: 1 });
    }

    handleSearch = (query) => {
        this.setState({
            searchQuery: query, selectedContinent: null, activePage: 1,
            sortColumn: { path: 'countryCountry', order: 'asc' }
        });
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

    render() {
        const { covidInfo: items, searchQuery, selectedContinent: selectedItem,
            sortColumn, activePage, pageSize, continents } = this.state

        let filtered = items;
        if (searchQuery)
            filtered = items.filter(c => c.countryCountry.toLowerCase().startsWith(searchQuery.toLowerCase()));
        else if (selectedItem && selectedItem.name !== "All")
            filtered = items.filter(c => c.continent === selectedItem.name);
        let sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])
        let covidInfoPage = paginate(sorted, activePage, pageSize)

        return (
            <div className="row">
                <div className="col-2">
                    <ListGroup
                        items={continents}
                        selectedItem={selectedItem}
                        onItemSelect={this.handleContinentSelect}
                    />
                </div>
                <div className="col">
                    <p> Showing data for {sorted.length} countries </p>
                    <SearchBox value={searchQuery} onChange={this.handleSearch} />
                    <CovidTable
                        items={covidInfoPage}                        
                        onSort={this.handleSort}                  
                        sortIcon={this.renderSortIcon}                        
                    />
                    {sorted.length < pageSize ? null :
                        <Pagination
                            totalItemsCount={sorted.length}
                            itemsCountPerPage={pageSize}
                            onChange={this.handlePageChange}
                            activePage={activePage}
                            itemClass="page-item"
                            linkClass="page-link"
                            hideNavigation={sorted.length / pageSize <= 5 ? true : false}
                        >
                        </Pagination>
                    }
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