import React from 'react';

const CovidTable = (props) => {
    const { items, onSort, sortIcon } = props;

    return (
        <div>           
            <table className="table table-bordered" aria-labelledby="table-label">
                <thead className="thead-light">
                    <tr>
                        <th onClick={() => onSort('countryCountry')}>Country {sortIcon('countryCountry')}</th>
                        <th onClick={() => onSort('totalActive')}>Active {sortIcon('totalActive')} </th>
                        <th onClick={() => onSort('totalRecovered')}>Recovered {sortIcon('totalRecovered')} </th>
                        <th onClick={() => onSort('totalDeaths')}>Deaths {sortIcon('totalDeaths')} </th>
                        <th onClick={() => onSort('totalConfirmed')}>Total {sortIcon('totalConfirmed')} </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        items.map(info =>
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
        </div>
    );
}

export default CovidTable;