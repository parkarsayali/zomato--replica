import React from 'react';
import '../styles/Details.css';
import queryString from 'query-string';
import axios from 'axios';
import ReactDOM from 'react-dom';
import { Modal } from 'react-responsive-modal';
import "react-responsive-modal/styles.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import date from 'date-and-time';


//styles for modal
const styles = {
  fontFamily: "Poppins",
  textAlign: "center"

};
const GalleryModalStyles ={
  content:{
    backgroundColor:"#191919",
    padding: "55px 67px 111.4px 85.9px"
    }
};
class Details extends React.Component{
  
  constructor(){
    super();
    this.state = {
        //response will return an object for that it needs empty state
        restaurant:{},
        //resId for gtting menu items by restaurants
        resId:undefined,
        //menuItems array to store the menuitems fetched from api,from the response
        menuItems:[],
        openGallery:false,
        openMenuItem:false,
        openForm:false,
        subTotal:0,
        order:[],
        name:undefined,
        email:undefined,
        mobileNo:undefined,
        address:undefined,
        time:undefined
        
    }

}
    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const resId = qs.restaurant ;
        console.log(typeof(resId) );// restaurant is the key passed in the browserurl of details page

        //axios call to get restaurant details 
        axios({
            method:'GET',
            url:`http://localhost:2022/restaurantbyid/${resId}`,
            headers : {"Content-Type":"application/json"}
        }).then(response => this.setState({restaurant:response.data.restaurantDetails, resId} ) 
            //restaurantDetails is the key given in BE url
        ).catch(err => console.log(err))
       
    }
  
 
  // onclick function to open gallery modal
  onOpenGalleryModal = () => {
    this.setState({ openGallery: true });
  };
 
  // onclick function to close gallery modal
  onCloseGalleryModal = () => {
    this.setState({ openGallery:false });
  };

  onOpenMenuModal = () => {
    const {resId,openForm} = this.state;//resId destructured from componentdidmount
    this.setState({openMenuItem:true});
      //axios call to get menu items as per restaurant
      axios({
        method:'GET',
        url:`http://localhost:2022/menuitemsbyrestaurant/${resId}`,
        headers : {"Content-Type":"application/json"}
      }).then(response => this.setState({menuItems:response.data.MenuItems})).
      catch(err => console.log(err))
    

    //for pay now modal
    if(openForm){
      const{menuItems} = this.state;
      const order = menuItems.filter(item => item.qty!=0);
      this.setState({ order:order });
    }

  };
 
  // onclick function to close menu modal
  onCloseMenuModal = () => {
    this.setState({openMenuItem:false });
  };
  
  // to open form after pay now btn
  onOpenFormModal = () => {
    this.setState({ openForm: true })
  };

  onCloseFormModal= () => {
    this.setState({ openForm: false })
  };

  //for adding removing the items to cart
  addItems = (index,operationTpye) => {
    let total = 0;
    const items = [...this.state.menuItems];//the spread operator(...) is used to make a replica of menuItems[] so that the main array is not changed
    const item = items[index];
    const qty = item.qty;


    if (operationTpye == 'add'){
      item.qty = item.qty + 1;
    }
    else {
      item.qty = item.qty - 1;
    }
    items[index] = item;

    items.map((item) =>{
      total += item.qty * item.Price;
    })
    this.setState({ menuItems: items, subTotal: total });
  }
//to capture name,email,address,mobileno as user enters it so that it can be paassed to payment function
handleChange = (event,state) => {
  this.setState({ [state]:event.target.value});
}

isDate(val) {
  // Cross realm comptatible
  return Object.prototype.toString.call(val) === '[object Date]'
}

isObj = (val) => {
  return typeof val === 'object'
}

stringifyValue = (val) => {
  if (this.isObj(val) && !this.isDate(val)) {
      return JSON.stringify(val)
  } else {
      return val
  }
}

buildForm = ({ action, params }) => {
  const form = document.createElement('form')
  form.setAttribute('method', 'post')
  form.setAttribute('action', action)

  Object.keys(params).forEach(key => {
      const input = document.createElement('input')
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', key)
      input.setAttribute('value', this.stringifyValue(params[key]))
      form.appendChild(input)
  })

  return form
}

post = (details) => {
  const form = this.buildForm(details);
  document.body.appendChild(form);
  form.submit()
  form.remove()
}

getData = (data) => {
  return fetch(`http://localhost:2022/payment`, {
      method: "POST",
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
  }).then(response => response.json()).catch(err => console.log(err))
}

  // function for payment api call 
  payment = () => {
    const{subTotal,email} = this.state;
     var re = /\S+@\S+\.\S+/;
     
      if(re.test(email)){
        //payment api call
        this.getData({ amount: subTotal, email: email }).then(response => {
          var information = {
              action: "https://securegw-stage.paytm.in/order/process",
              params: response
          }
          this.post(information)
      })
      }
      else(
        alert('Email is not valid')
      )

    

  }
  //to add order details to collection

  order = () => {
    const{subTotal,address, menuItems} = this.state;
    const now = new Date();
    const pattern = date.compile('YYYY/MM/DD HH:mm:ss');
    var time=date.format(now, pattern);
    const inputObj = {
      items: menuItems,
      amount:subTotal,
      address:address,
      time:time
    }
    axios({
      method:'POST',
      url:`http://localhost:2022/orders`,
      headers : {"Content-Type":"application/json"},
      data : inputObj
      }).then(response => this.setState({orderData:response.data.order})).catch(err => console.log(err))
 
  }

    render(){
        //restaurant from  this.setState({restaurant:response.data.restaurantDetails}) is destructured here
        //open state of modal
        const {restaurant,openGallery,openMenuItem,menuItems, subTotal,openForm,order} = this.state;
        
        return(
            <div>
            <div className="container">
            <div className="DetailsPage row pt-4">
              {/* detailsPgsection is the div which has img parent and img */}
              <div className="detailsPgsection col-sm-12 col-md-12 col-lg-12">
                <div className="detailsPgImg_parent">
                  <img src={restaurant.image} alt="detailspg2x" />
                  <button id="clicktoseegallery" onClick={this.onOpenGalleryModal}>Click to see Image Gallery </button>
                </div>
              </div>
              {/* for restaurant name under the detailspg image */}
              <div className="details_resname col-sm-12 col-md-12 col-lg-12 pt-3">{restaurant.name}</div>
              {/* ordr btn */}
              <div className="order_btn col-sm-12 col-md-12 col-lg-12">
                <button id="placeorder" onClick={this.onOpenMenuModal}>Place Online Order</button>
              </div>
              {/* for details tabs */}
              <div className="details_tabs col-sm-12 col-md-12 col-lg-12 pt-3">
                <div className="tab  col-sm-6 col-md-6 col-lg-6">
                  <input type="radio" id="tab-1" name="tab-group-1" defaultChecked />
                  <label className="tab_label" htmlFor="tab-1">Overview</label>
                  <div className="content">
                    <div className="about mb-3">About this place</div>
                    <div className="head mb-2">Cuisine</div>
                    <div className="value mb-3">{restaurant && restaurant.cuisine ?
                          restaurant.cuisine.map((item) => `*${item.name}*`) : null }</div>
                    <div className="head mb-2">Average Cost</div>
                    <div className="value  mb-3">₹ {restaurant.min_cost} for two people(approx)</div>
                  </div>
                </div>
                <div className="tab col-sm-6 col-md-6 col-lg-6">
                  <input type="radio" id="tab-2" name="tab-group-1" />
                  <label className="tab_label" htmlFor="tab-2">Contact</label>
                  <div className="content">
                    <div className="head mb-2">Phone Number</div>
                    <div className="value mb-3">{restaurant.phone_no}</div>
                    <div className="head mb-2">{restaurant.name}</div>
                    <div className="value mb-3">{`${restaurant.locality}`}</div>
                  </div>
                </div>
                <Modal open={openGallery} onClose={this.onCloseGalleryModal}  style ={styles,GalleryModalStyles} center>
                      <div >
                          <Carousel 
                          showThumbs={false} 
                          showStatus ={false}
                          >
                          {restaurant && restaurant.thumb ?restaurant.thumb.map((thumbimg) => {
                            return <div>
                            <img src={thumbimg} height="400px" width="400px"/>
                           
                        </div>
                          }
                             ): null}
                            
                        </Carousel>
                      </div>
                </Modal>
                <Modal open={openMenuItem} onClose={this.onCloseMenuModal}  style ={styles} center>
                      <div className="row">
                            <div className="dark"> {`${restaurant.name}`} </div>
                            {menuItems.map((item,index) => {
                              return <div className="col-lg-12 col-md-12 col-sm-12 mb-3" style={{float:'left'}}>
                              <div className="col-lg-9 col-md-9 col-sm-9 col-xs-9" style={{display: 'inline-block'}}>
                                  <div className="medium">{`${item.name}`}</div>
                                  <div className="medium">₹ {`${item.Price}`}</div>
                                  <div className="value">{`${item.Description}`}</div>
                                  <hr></hr>
                                </div>
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3" style={{float:'right'}}>
                                  <img src={item.image}
                                   style={{ height: '75px', width: '75px', 'border-radius': '20px',objectFit:'cover'}}></img>
                                   {item.qty == 0 ? <div><button className="add-button" onClick={() => this.addItems(index, 'add')} style={{ position: 'absolute',bottom: '-14%',left: '15%'}}>Add</button></div> :
                                                <div className="add-number"><button onClick={() => this.addItems(index, 'subtract')} style={{border:'white',color:'#61b246'}}>-</button><span style={{ backgroundColor: 'white'}}>
                                                {item.qty}</span><button onClick={() => this.addItems(index, 'add')} style={{border:'white',color:'#61b246'}} >+</button></div>}
                                </div>
                              </div>
                              
                            })}
                            <div className="col-lg-9 col-md-9 col-sm-9 col-xs-9" style={{backgroundColor:'#f5f8ff',color:'#292c40',fontSize: '22px',
                            fontWeight: 'bold',float:'left',display :'inline-block'}}>
                                        Subtotal : ₹ {`${ subTotal}`}
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3"  style={{float:'right'}}>
                              <button className="paynow-btn" onClick={() => { {this.onOpenFormModal()}; {this.onCloseMenuModal()} }}>Pay Now</button>
                            </div>
                      </div>
                </Modal>
                <Modal open={openForm} onClose={this.onCloseFormModal}  style ={styles} center>
                      <div className="res_name col-lg-12 col-md-12 col-sm-12 mb-3" display="block">{restaurant.name}</div>
                        <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
                            <label className="head">Name:</label><br></br>
                            <input className="value"type='text' placeholder="Enter First Name" 
                            required onChange={(event)=> this.handleChange(event,'name')}></input>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 mb-3">  
                            <label className="head">Mobile Number:</label><br></br>
                            <input className="value"type='text' placeholder="Enter Mobile Number" 
                            required onChange={(event)=> this.handleChange(event,'mobileNo')}></input>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
                            <label className="head">Email:</label><br></br>
                            <input className="value"type='text' placeholder="Enter Email address" 
                            required onChange={(event)=> this.handleChange(event,'email')}></input>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
                            <label className="head">Address:</label><br></br>
                            <textarea className="value"type='textarea' placeholder="Enter the delivery address" rows="3" 
                            required onChange={(event)=> this.handleChange(event,'address')}></textarea>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
                            <span className="head">Ammount:</span>
                            <span className="head">₹ {subTotal}</span>
                        </div>
                        <div  className="col-lg-12 col-md-12 col-sm-12 mb-3">
                            <button id="placeorder" style={{float:'none'}} onClick={() => { {this.payment()}; {this.order()}; {this.onCloseFormModal()} }}>PROCEED</button>
                        </div>
                        
                </Modal>
              </div>
            </div>
          </div>
        </div>
        )
    }
}
export default Details;