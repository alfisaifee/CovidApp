import React, { Component } from 'react';
import { renderCovidTable } from '../common/RenderCovidTable'
import { getContinents } from '../common/continentsList';
import { renderFiltering } from '../common/RenderFiltering';
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
            searchQuery: "",
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
        this.setState({ activePage: page });
    }

    handleContinentSelect = (continent) => {
        this.setState({ selectedContinent: continent, searchQuery:"", activePage: 1 });
    }

    handleSearch = (query) => {
        this.setState({ searchQuery: query, selectedContinent: null, activePage: 1 });
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
        let contents = this.state.loading ? <p><em>Loading...</em></p> :
            renderCovidTable(this.state.covidInfo, this.state.activePage, this.state.pageSize,
                this.state.selectedContinent, this.handlePageChange, this.handleSort,
                this.state.sortColumn, this.renderSortIcon, this.state.searchQuery, this.handleSearch);

        const filtering = renderFiltering(this.state.continents, this.handleContinentSelect,
            this.state.selectedContinent);

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