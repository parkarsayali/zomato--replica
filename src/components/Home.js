import React from 'react';
import Wallpaper from './Wallpaper';
import Quicksearch from './Quicksearch';
import axios from 'axios';




class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            locations:[],
            mealtypes:[]
        }
    }
    componentDidMount() {
        sessionStorage.clear();//to clear the session storage on the load of the homepage 
        //location and quickserach api call
        axios({
            method:'GET',
            url:'http://localhost:2022/locations',
            headers:{'Content-Type':'application/json'}
        })
        .then(response => this.setState({ locations: response.data.city}))//statename:response.data.keyname in getLocation function (message,locations:response)
        .catch()

        //quickserach api call
        axios({
            method:'GET',
            url:'http://localhost:2022/mealtypes',
            headers:{'Content-Type':'application/json'}
        })
        .then(response => this.setState({ mealtypes: response.data.meals}))
        .catch()

    }
    render() {
        const { locations,mealtypes } = this.state;
        return(
            <div>
                <Wallpaper ddlocations={locations} />
                <Quicksearch quicksearch={mealtypes} />
            </div>
            
        )
    }
}
export default Home;