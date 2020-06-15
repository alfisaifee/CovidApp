import React, { Component } from 'react';
import Pagination from 'react-js-pagination';
import { paginate } from '../utils/paginate';

export class CovidData extends Component {
    static displayName = CovidData.name;

    constructor(props) {
        super(props);
        this.state = { covidInfo: [], loading: true, activePage: 1, pageSize: 10 };
    }

    componentDidMount() {
        this.populateCovidData();
    }

    handlePageChange = (page) => {
        this.setState({ activePage: page })
    }

    static renderCovidTable(covidInfo, activePage, pageSize) {
        const covidInfoPage = paginate(covidInfo, activePage, pageSize)
        return (
            <div>
                <table className='table table-striped' aria-labelledby="table-label">
                    <thead>
                        <tr>
                            <th>Country</th>
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

    render() {
        let contents = this.state.loading ? <p><em>Loading...</em></p> :
            CovidData.renderCovidTable(this.state.covidInfo, this.state.activePage, this.state.pageSize);

        const paginate = CovidData.renderPagination(this.state.covidInfo, this.handlePageChange, this.state.activePage, this.state.pageSize);

        return (
            <div>
                <p id="tableLabel">{}</p>
                <p>The below table displays the information of covid-19 cases.</p>
                {contents}
                {paginate}
            </div>
        );
    }

    async populateCovidData() {
        const response = await fetch('api/coviddata');
        const data = await response.json();
        this.setState({ covidInfo: data, loading: false });
    }
}