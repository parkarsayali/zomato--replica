import React from 'react';
import '../styles/Filter.css';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import axios from 'axios';


 class Filter extends React.Component{
    constructor() {
      super();
      this.state = {
          restaurants:[],
          locations:[],
          hcost:undefined,
          lcost:undefined,
          location:undefined,
          mealtypeId:undefined,
          cuisine:[],
          sort:undefined,
          page:undefined
      }
    }
     componentDidMount() {
        //capturing the value from the querystring

        /* this.props.location.search gives mealtype and location in
        string format ,that's why we need a parser that gives the 
        values in json format hence we use queryString package*/
        
        const qs=queryString.parse(this.props.location.search);

        const location=qs.location;
        const mealtype=qs.mealtype;

        //object to pass in the data key of axios
        const inputObj = {
          //in filter api we expect locationId,mealtypeId
           locationId:location,
           mealtypeId:mealtype
       };

       
        //filter api 
        axios({
        method: 'POST',
        url: 'http://localhost:2022/filter',
        headers : {'Content-Type':'application/json'},
        //to pass the data to request body we have 'data'
        data: inputObj
  })
     .then(response => this.setState({ restaurants:response.data.restaurants, 
     location: location, mealtype: mealtype})).catch();
 
    //location api call
        axios({
            method:'GET',
            url:'http://localhost:2022/locations',
            headers:{'Content-Type':'application/json'}
        })
        .then(response => this.setState({ locations: response.data.city}))//statename:response.data.keyname in getLocation function (message,locations:response)
        .catch()


      }
    //location dropdown filter
      handleLocationChange =(event) => {
        const location = event.target.value;
          axios({
            method:'GET',
            url:`http://localhost:2022/restaurantsbylocation/${location}`,
            headers:{'Content-Type':'application/json'}
        })
        .then(response => this.setState({ restaurants: response.data.restaurants}))//statename:response.data.keyname in getLocation function (message,locations:response)
        .catch()
      }

      //for pagination
    handlePage = (page) =>
    {
        const { location,mealtype,lcost,hcost,sort} = this.state;
        const inputObj = {
            lcost:lcost,
            hcost:hcost,
            sort:sort,
            locationId:location,
            mealtypeId:mealtype,
            page:page
            
        };
        axios({
            method : 'POST',
            url : 'http://localhost:2020/api/filter',
            headers : { 'Content-Type' : 'application/json' },
            data : inputObj
        }).then(response => this.setState({restaurants : response.data.restaurants,page})).catch()

    }
    handleSortChange = (sort) => {
      const { location, mealtype, lcost, hcost } = this.state;
      const inputObj = {
          sort: sort,
          locationId:location,
          mealtypeId:mealtype,
          lcost: lcost,
          hcost: hcost
      };
      axios({
        method : 'POST',
        url : 'http://localhost:2020/api/filter',
        headers : { 'Content-Type' : 'application/json' },
        data : inputObj
    }).then(response => this.setState({restaurants : response.data.restaurants,sort})).catch()
  }
  
  handleCostChange = (lcost, hcost) => {
    const { location, mealtype, sort } = this.state;
    const inputObj = {
        sort: sort,
        locationId:location,
        mealtypeId:mealtype,
        lcost: lcost,
        hcost: hcost
    };
    axios({
      method : 'POST',
      url : 'http://localhost:2020/api/filter',
      headers : { 'Content-Type' : 'application/json' },
      data : inputObj
  }).then(response => this.setState({restaurants : response.data.restaurants,lcost,hcost})).catch()
}

   
    //resId is unique _id of restaurant got from onclick event on restaurant records(from list of restaurants) 
    handleNavigate = (resId) => {
      this.props.history.push(`/details?restaurant=${resId}`);
    }
     render(){
       const { restaurants,locations } = this.state;

         return(
             <div>
             <div className="container">
             <div className="row">
               <div id="heading" className="pt-5">Breakfast Places in Mumbai</div>
               <div className="col-lg-4 col-md-4 col-sm-12 mt-3 pt-1 filters_section">
                  <div id="filter_heading" style={{display: 'inline'}}>Filters</div>
                  <span className="downSymbol">
                  <a data-toggle="collapse"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16" data-toggle ="collapse" >
                  <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                </svg></a></span>
                  <div className="filter_wrap mx-auto">
                      <div id="Select_Location" className="filter_types mt-2">Select Location</div>
                   {/* for the faint text inside the dd box */}
                   <div className="filter_location_dropdown">
                     <select className="select_location_rectangle"  onChange={this.handleLocationChange}>
                       <option className="filter_location_options" value="0">Please select a location</option>
                       {locations.map((item) => {
                        return <option className="filter_location_options"
                        value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                    })}
                     </select>
                   </div>
                   <div id="cuisine" className="filter_types mt-2">Cuisine
                     <div className="pt-3 suboptn_clr">
                       <input type="checkbox" className="checkbox" />
                       <span>North Indian</span>
                     </div>
                     <div className="pt-3 suboptn_clr">
                       <input type="checkbox" className="checkbox" />
                       <span>South Indian</span>
                     </div>
                     <div className="pt-3 suboptn_clr">
                       <input type="checkbox" className="checkbox" />
                       <span>Chinese</span>
                     </div>
                     <div className="pt-3 suboptn_clr">
                       <input type="checkbox" className="checkbox" />
                       <span>Fast Food</span>
                     </div>
                     <div className="pt-3 suboptn_clr">
                       <input type="checkbox" className="checkbox" />
                       <span>Streat Food</span>
                     </div>
                   </div>
                   <div id="cost_for_two" className="filter_types mt-3">Cost For Two
                     <div className="cost_range pt-3">
                       <input type="radio" name="costrange" 
                       onChange={() => {this.handleCostChange(1,500)}}/>
                       <span className="suboptn_clr">Less than ₹500</span>
                     </div>
                     <div className="cost_range pt-3">
                       <input type="radio" name="costrange"  
                       onChange={() => {this.handleCostChange(500,1000)}}/>
                       <span className="suboptn_clr"> ₹ 500 to ₹ 1000</span>
                     </div>
                     <div className="cost_range pt-3">
                       <input type="radio" name="costrange"
                        onChange={() => {this.handleCostChange(1000,1500)}}/>
                       <span className="suboptn_clr">₹1000 to ₹1500</span>
                     </div>
                     <div className="cost_range pt-3">
                       <input type="radio" name="costrange"
                       onChange={() => {this.handleCostChange(1500,2000)}}/>
                       <span className="suboptn_clr">₹1500 to ₹2000</span>
                     </div>
                     <div className="cost_range pt-3">
                       <input type="radio" name="costrange"
                       onChange={() => {this.handleCostChange(2000,10000)}}/>
                       <span className="suboptn_clr">₹2000+</span>
                     </div>
                   </div>
                   <div id="cost_for_two" className="filter_types mt-3">Sort
                     <div className="price_range pt-3">
                       <input type="radio" name="price_range"  onChange={() => this.handleSortChange(1)} />
                       <span className="suboptn_clr">Price low to high</span>
                     </div>
                     <div className="price_range pt-3">
                       <input type="radio" name="price_range"  onChange={() => this.handleSortChange(-1)}/>
                       <span className="suboptn_clr">Price high to low</span>
                     </div>
                   </div>
                 </div>
               </div>
               <div className="col-lg-7 col-md-7 col-sm-12 mt-3 pt-1 ml-3 cafes_list">
                    {restaurants && restaurants.length > 0 ? restaurants.map((item) => {
                        return (
                        <div className="cafes mb-5" onClick={ () => this.handleNavigate(item._id)}>
                        <div className="filter_img_parent"> 
                          <img src={item.image} />
                        </div>
                        <div className="cafe_data pl-3 mb-5">
                          <h2>{item.name}</h2>
                          <h3>{item.locality}</h3>
                          <h4>{item.city}</h4>
                        </div>
                        <hr />
                        <div> 
                          <div className="row" id="cuisnerow">  
                            <div className="col-lg-2 col-md-2 col-sm-6 cuisines_costfortwo" style={{display:"inline"}}>CUISINES:</div>
                            <div className="col-lg-10 col-md-10 col-sm-6 cuisines_costfortwovalues" style={{display:"inline"}}>{item.cuisine.map((cuis) => `*${cuis.name} `)}</div> 
                          </div>
                          <div className="row" id="cost_for_two row">  
                          <div className="col-lg-2 col-md-2 col-sm-6 cuisines_costfortwo" style={{display:"inline"}}>COST FOR TWO:</div>
                          <div className="col-lg-10 col-md-10 col-sm-6 cuisines_costfortwovalues" style={{display:"inline"}}>₹{item.min_cost}</div> 
                        </div>
                        </div>
                      </div>)
                    }):<div id="noresfound">No Restaurants Found </div>}
      
                  {restaurants && restaurants.length >0 ? <div className="centered-pagination mx-auto">
                  <div className="pagination">
                    <a href="#">&laquo;</a>
                    <a href="#" onClick={() => {this.handlePage(1)}} >1</a>
                    <a href="#" onClick={() => {this.handlePage(2)}} >2</a>
                    <a href="#" onClick={() => {this.handlePage(3)}} >3</a>
                    <a href="#" onClick={() => {this.handlePage(4)}} >4</a>
                    <a href="#" onClick={() => {this.handlePage(5)}} >5</a>
                    <a href="#" onClick={() => {this.handlePage(6)}} >6</a>
                    <a href="#">&raquo;</a>
                  </div>
                </div> : null }
                 
               </div>
             </div>
           </div>
     
        </div>
            
        )
     }
 }
 
 export default  withRouter(Filter);