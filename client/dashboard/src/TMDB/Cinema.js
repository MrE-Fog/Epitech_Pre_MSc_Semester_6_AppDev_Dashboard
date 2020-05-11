import * as React from "react";
import {getDayFilms, getPopularFilms, getRatedFilms} from "./TMDBApi";

class Cinema extends React.Component {

    constructor(props) {
        super(props);
        this._films = [];
    }

    _getDayFilms() {
        getDayFilms().then(data => {
            this._films = data.results
            this.forceUpdate()
        });
    }

    _getPopularFilms() {
        getPopularFilms().then(data => {
            this._films = data.results
            this.forceUpdate()
        });
    }

    _getRatedFilms() {
        getRatedFilms().then(data => {
            this._films = data.results
            this.forceUpdate()
        });
    }

    render() {
        return (
            <div>
                <h1>Cinema</h1>

                <button onClick={this._getDayFilms}>Display the list of the day’s screenings</button>
                <button onClick={this._getPopularFilms}>Most popular movies</button>
                <button onClick={this._getRatedFilms}>Highest rated movies rated R</button>
            </div>
        )
    }
}

export default Cinema;
