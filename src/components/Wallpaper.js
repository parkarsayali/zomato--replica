import React from 'react';
import '../styles/wallpaper.css';
import { withRouter } from 'react-router';
import axios from 'axios';




class Wallpaper extends React.Component{
    constructor() {
        super();
        this.state = {
            restaurants:[],
            suggestions:[],
            resSearchTxt:undefined
        }
    }
     handleLocationChange =(event) => {
        const locationId = event.target.value;
        // locationId is the value of the location selected by the user,
        // it's stored in 'locationId' session variable to pass it to
        // the quicksearch component so that together locationId and 
        //mealtypeId can be passed to the filter page
        sessionStorage.setItem('locationId',locationId);

        axios({
            method:'GET',
            url:`http://localhost:2022/restaurantsbylocation/${locationId}`,
            headers:{'Content-Type':'application/json'}
        })
        .then(response => this.setState({ restaurants: response.data.restaurants}))//statename:response.data.keyname in getLocation function (message,locations:response)
        .catch()

    }
    handleResSearch =(event) =>{
        const {restaurants} =  this.state;
        const resSearchTxt = event.target.value;
        let filteredResSearch;

        if(resSearchTxt === ""){
            filteredResSearch=[];
        }
        else{
            filteredResSearch = restaurants.filter(item => item.name.toLowerCase().includes(resSearchTxt.toLowerCase()));
        }
        

        this.setState({suggestions: filteredResSearch,resSearchTxt:resSearchTxt});
    }

    handleResClick = (item) => {
        this.props.history.push(`/details?restaurant=${item._id}`)
        // this.props.history.push(`/details?restaurant=${item._id}`) to send the user directly
        // to the details page after clickng on the rest name from restaurant suggestions
    }
    renderSuggestions = () => {
        let { suggestions, resSearchTxt } = this.state;

        if (suggestions.length === 0 && resSearchTxt) {
            return (
                <ul className="suggestion_ul">
                    <li className="suggestion_li">No Match Found</li>
                </ul>
            )
        }
        return (
            <ul className="suggestion_ul">
                {
                    suggestions.map((item, index) => (<li className="suggestion_li" key={index} onClick={() => this.handleResClick(item)}>{`${item.name}, ${item.city}`}</li>))
                }
            </ul>
        );
    }


    render() {
        const {ddlocations} = this.props;

        return(
            <div>
                
                <div className="container-fluid">
                <div className="uppersection">
                    <div id="bannerrow" className="row bg-image img-fluid" style={{backgroundImage: 'url(../assets/banner.jpg)'}}>
                    {/* for logo */}
                    <div className="col-lg-4 col-md-4 col-sm-12 logo_cols " />
                    <div className="col-lg-4 col-md-4 col-sm-12  text-center">
                        <div className="logo mx-auto">
                        e!
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12 " />
                    {/* for text under logo */}
                    <div className="col-lg-2 col-md-2 col-sm-12 h-10" />
                    <div className="col-lg-8 col-md-8 col-sm-12 h-10">
                        <div className="textunderlogo text-center">
                        Find the best restaurants, cafés, and bars
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-2 col-sm-12 h-10" />
                    {/* for dd and search field */}
                    <div className="col-lg-6 col-md-6 col-sm-12 h-15 location_ddparent">
                        {/* for location dropdown */}
                        <span>
                         <select className="location_dd" onChange= {this.handleLocationChange}  >
                            <option className="location_options" value="0">Please select a location</option>
                            {ddlocations.map((item) => {
                                return <option className="location_options" value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                            })}
                        </select>
                        </span>
                    </div>
                    {/* for restaurant search input */}
                    <div className="col-lg-6 col-md-6 col-sm-12 h-15">
                        <div className="search_section">
                        <span className="search_icon"><svg xmlns="http://www.w3.org/2000/svg" width={17} height={17} fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                            </svg></span>
                            <input className ="search_restaurant" type="text" onChange={this.handleResSearch} placeholder="Search for restaurants" ></input>
                            {this.renderSuggestions()}
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Wallpaper);