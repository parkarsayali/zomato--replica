import React from 'react';
import '../styles/Quicksearch.css';
import { withRouter } from 'react-router';



class Quicksearch extends React.Component{
   handleClick=(mealTypeId) => {
       //getting session var 'locationId' from
       //wallpaper component using getItem 
       const locationId =sessionStorage.getItem(`locationId`);
       if(locationId){
           //if locationId session var is there we have to pass both mealtype and location
           //to the filter page
        this.props.history.push(`/filter?mealtype=${mealTypeId}&location=${locationId}`);
       }
       else{
        this.props.history.push(`/filter?mealtype=${mealTypeId}`);

       }
   }
    render(){
        const {quicksearch} = this.props;
        return(
            <div>
                        <div className="container">
                        <div className="lowersection">
                        <div id="lowerrow" className="row p-5">
                            <div className="col-lg-12 col-md-12 col-sm-12 pl-3 quick_searchesparent">
                            <div className="quick_searches">Quick Searches</div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 pl-3 pb-2">
                            <div className="quicksearch_subtxt"> Discover restaurants by type of meal</div>
                            </div>
                            {quicksearch.map((item) => {
                                return  <div className="col-lg-4 col-md-6 col-sm-12  pt-4 item_grid" onClick={() => this.handleClick(item.mealtype_id)}>
                                {/* for image and item details */}
                                <div className="img_itemdetails">
                                    <div className="img_parent"><img src={item.image} alt="breakfast" /></div>
                                    <div className="item_details">
                                    <div className="mealtypes">
                                        {item.name}
                                    </div>
                                    <div className="meal_subtext">
                                        {item.content}
                                    </div>
                                    </div>
                                </div>
                                </div>
                            })} 
                        </div>
                        </div>
                    </div>
            </div>
            
        )
    }
}
export default withRouter(Quicksearch);