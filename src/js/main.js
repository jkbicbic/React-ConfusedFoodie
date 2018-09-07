const ZOMATO_API = "https://developers.zomato.com/api/v2.1/search?entity_type=city&q=";
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

function ReShuffle(props){
    return(
        <div className="card card--transparent" style={{display: props.value ? 'block' : 'none'}}>
            <div className="input-group">
                <button className="input button btn-reverse" onClick={props.onClick}>Suggest More!</button>
            </div>
        </div>
    )
}



var RestSearch = createReactClass({

    getInitialState: function() {
        return {result: null, 
                search: {
                    srch: '', 
                    isSearchShown: true
                }, 
                result: {
                    res: null, 
                    isResultShown: false}
                }
    },

    getRest: function(){
        this.setState({search: {isSearchShown: false}});
        this.setState({result: {isResultShown: false}});
        getData(ZOMATO_API+this.state.search.srch+'&count=1&lat='+city.lat+'&lon='+city.lon)
        .then(data => {
            data.restaurants.map(restaurant => {
                this.setState({result: {res: restaurant.restaurant, isResultShown: true}});
            });
        })
    },

    componentWillMount: function() {
        getLocation();
    },

    render: function(){
        return(
            <div className="container">
                <RestInput onChange={this.onChange} onClick={this.getRest} value={this.state.search}/>
                <RestResult defaultValue={this.state.result}/>
                <ReShuffle onClick={this.getRest} value={this.state.result.isResultShown} />
            </div>
        )
    }
})

var RestResult = createReactClass({
    
    getInitialState: function(){
        return {isShown: false}
    },

    render: function(){
        var result = this.props.defaultValue;
        return(
            <div className="card fade-in-up" style={{display: result.isResultShown ? 'block' : 'none'}}>
                <div className="result-group" >
                    <div className="img">
                        <img src={result.res ? result.res.featured_image : ''}/>
                    </div>
                </div>
                <div className="result-group">
                    <div className="store name">
                        <h3>{result.res ? result.res.name : 'Name'}</h3>
                    </div>
                    <div className="store location">
                        <p>{result.res ? result.res.location.address : 'Location'}</p>
                    </div>
                    <div className="store rating" style={{backgroundColor: `#${result.res ? result.res.user_rating.rating_color:'000'}`}}>
                        <p>{result.res ? result.res.user_rating.aggregate_rating : '5'}</p>
                        <p>votes {result.res ? result.res.user_rating.votes : '1'}</p>
                    </div>
                </div>
            </div>
        )
    }
})

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
