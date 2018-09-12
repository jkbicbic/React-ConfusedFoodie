const ZOMATO_API = "https://developers.zomato.com/api/v2.1/";
const API_KEY = "b044c4f4639ec622f10cf4e25714eb8a";
var city = {lat: 0, lon: 0};
var checkLoc;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    city.lat= position.coords.latitude;
    city.lon= position.coords.longitude;
}

function getData(url){
    return fetch(url,{
        headers: {
            "user-key": API_KEY,
        }
    })
    .then(response => response.json());
}


var RestSearch = createReactClass({

    getInitialState: function() {
        return {
            search: {
                srch: '', 
                isSearchShown: true
            }, 
            result: {
                res: [], 
                resDetail: null,
                isResultShown: false,
                traverseId: 0
            },
        }
    },

    getRestId: function(){
        this.setState({search: {isSearchShown: false}});
        this.setState({result: {isResultShown: false}});
        getData(ZOMATO_API+'search?entity_type=city&q='+this.state.search.srch+'&count=10&lat='+city.lat+'&lon='+city.lon+'&sort=rating&order=desc')
        .then(data => {
            console.log(data);
            var resId = [];
            data.restaurants.forEach((restaurant) => {
                resId.push(restaurant.restaurant.id);
            });
            this.setState({result: {res: resId, isResultShown: true, traverseId: 0}});
            this.getRestDetails(this.state.result.res[0])
        })
    },

    getRestDetails: function(resId){
        console.log(resId);
        getData(ZOMATO_API+'restaurant?res_id='+resId)
        .then(data => {
            console.log(data);
            var r = data;
            var result = Object.assign({}, this.state.result);   
            result.resDetail = r;                        
            this.setState({result: result});
            console.log(this.state.result)
        })
    },

    handleTraverse: function(){
        var result = Object.assign({}, this.state.result);
        this.getRestDetails(this.state.result.res[result.traverseId]);  
        result.traverseId = result.traverseId + 1;                        
        this.setState({result});
    },

    componentWillMount: function() {
        getLocation();
    },

    render: function(){
        return(
            <div className="container">
                <RestInput onClick={this.getRestId} value={this.state.search}/>
                <RestResult defaultValue={this.state.result}/>
                <div className="card card--transparent" style={{display: this.state.result.isResultShown ? 'block' : 'none'}}>
                    <div className="input-group">
                        <button className="input button btn-reverse" onClick={this.handleTraverse}>Suggest More!</button>
                    </div>
                </div>
            </div>
        )
    }
})


function RestResult(props) {
    console.log("Value:", props);
    if(props.res != null){
        return(
            <div className="card fade-in-up" style={{display: props.defaultValue.isResultShown ? 'block' : 'none'}}>
                <div className="result-group" >
                    <div className="img">
                        <img src={props.defaultValue.resDetail.featured_image}/>
                    </div>
                </div>
                <div className="result-group">
                    <div className="store name">
                        <h3>{props.defaultValue.resDetail.name }</h3>
                    </div>
                    <div className="store location">
                        <p>{props.defaultValue.resDetail.location.address }</p>
                    </div>
                    <div className="store rating" style={{backgroundColor: `#${props.defaultValue.resDetail.user_rating.rating_color}`}}>
                        <p>{props.defaultValue.resDetail.user_rating.aggregate_rating}</p>
                        <p>votes {props.defaultValue.resDetail.user_rating.votes}</p>
                    </div>
                </div>
            </div>
        )
    }
    else{
        return(
            <div>Error</div>
        )
    }
}

var RestInput = createReactClass({

    getInitialState: function(){
        return {isLocation: false, search: ""}
    },

    componentDidMount: function() {
        checkLoc = setInterval(()=>{
            if(city.lat != 0 && city.lon != 0){ 
                this.setState({isLocation: true})
                clearInterval(checkLoc);
            }
        }, 3000);
    },

    handleChange: function(e){
        this.setState({search: e.target.value});
    },
    
    render: function(){
        var search = this.props.value;
        search.srch = this.state.search;
        return(
            <div className="card fade-in-up"  style={{display: search.isSearchShown ? 'block' : 'none'}}>
                <div className="fade-in" style={{display: this.state.isLocation ? 'block' : 'none'}}>
                    <div className="input-group">
                        <img className="logo" src="src/img/ConfusedFoodie.png"/>
                        <p style={{textAlign: 'center'}}>i'll choose for you</p>
                    </div>
                    <div className="input-group">
                        <input className="input text" placeholder="Tell me your cravings" onChange={this.handleChange} value={this.state.search}/>
                    </div>
                    <div className="input-group">
                        <button className="input button" onClick={this.props.onClick}>Feeling Lucky!</button>
                    </div>
                </div>
                <div className="fade-in" style={{display: this.state.isLocation ? 'none' : 'block'}}>
                    <div className="input-group">
                        <h4 style={{textAlign: 'center'}}>getting your location</h4>
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        )
    }
})


ReactDOM.render(<RestSearch />, document.getElementById("app"))
