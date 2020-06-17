import React, { Component } from 'react';
import Pagination from 'react-js-pagination';
import ListGroup from '../common/listGroup';
import { paginate } from '../utils/paginate';
import { getContinents } from '../common/continentsList';

export class CovidData extends Component {
    static displayName = CovidData.name;

    constructor(props) {
        super(props);
        this.state = {
            covidInfo: [], continents: [], loading: true, activePage: 1, pageSize: 10, selectedContinent: { name: "Asia" }
        };
    }

    componentDidMount() {
        this.populateCovidData();
        this.setState({ continents: getContinents() });
    }

    handlePageChange = (page) => {
        this.setState({ activePage: page })
    }

    handleContinentSelect = (continent) => {
        this.setState({ selectedContinent: continent })
    }

    static renderCovidTable(covidInfo, activePage, pageSize, selectedContinent) {
        const filtered = selectedContinent ? covidInfo.filter(c => c.continent === selectedContinent.name) : covidInfo;
        const covidInfoPage = paginate(filtered, activePage, pageSize)
        return (
            <div>
                <table className='table table-striped' aria-labelledby="table-label">
                    <thead>
                        <tr>
                            <th>Country</th>
                            <th>Active Cases</th>
                            <th>Recovered Cases</th>
                            <th>Deaths</th>
                            <th>Total Cases</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            covidInfoPage.map(info =>
                                <tr key={info.countryCode}>
                                    <td>{info.countryCountry}</td>
                                    <td>{info.totalConfirmed - info.totalRecovered - info.totalDeaths}</td>
                                    <td>{info.totalRecovered}</td>
                                    <td>{info.totalDeaths}</td>
                                    <td>{info.totalConfirmed}</td>
                                </tr>
                            )}
                    </tbody>
                </table>
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
            CovidData.renderCovidTable(this.state.covidInfo, this.state.activePage, this.state.pageSize, this.state.selectedContinent);

        const paginate = CovidData.renderPagination(this.state.covidInfo, this.handlePageChange, this.state.activePage, this.state.pageSize);
        const filtering = CovidData.renderFiltering(this.state.continents, this.handleContinentSelect, this.state.selectedContinent);

        return (
            <div className="row">
                <div className="col-2">
                    {filtering}
                </div>
                <div className="col">
                    <p id="tableLabel">{}</p>
                    {contents}
                    {paginate}
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