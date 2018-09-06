const ZOMATO_API = "https://developers.zomato.com/api/v2.1/search?entity_type=city&q=";
const API_KEY = "b044c4f4639ec622f10cf4e25714eb8a";
var city = {lat: 0, lon: 0};
var checkLoc;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
        //loading

    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    console.log(position);
    city.lat= position.coords.latitude;
    city.lon= position.coords.longitude;
    console.log(city);
    //turn off loading
}

function getData(url){
    return fetch(url,{
        headers: {
            "user-key": API_KEY,
        }
    })
    .then(response => response.json());
}

function Result(result){
    console.log(result);
    return(
        <div className="card fade-in-up">
            <div className="result-group" >
                <div className="img">
                    <img src={result.defaultValue.featured_image}/>
                </div>
            </div>
            <div className="result-group">
                <div className="store name">
                    <h3>{result.defaultValue.name}</h3>
                </div>
                <div className="store location">
                    <p>{result.defaultValue.location.address}</p>
                </div>
                <div className="store rating" style={{backgroundColor: `#${result.defaultValue.user_rating.rating_color}`}}>
                    <p>{result.defaultValue.user_rating.aggregate_rating}</p>
                    <p>votes {result.defaultValue.user_rating.votes}</p>
                </div>
            </div>
        </div>
    )
}

var RestSearch = createReactClass({
    getInitialState: function() {
        return {result: null, res: null, search: null, isLocation: false}
    },

    handleChange: function(e){
        this.setState({search: e.target.value})
    },

    // showInput: function(){
    //     if(city.lat != 0 && city.lon != 0){ 
    //         this.setState({isLocation: !this.state.isLocation})
    //         console.log(this.state.isLocation);
    //     }
    //     else{
    //         console.log("false");
    //     }
    // },

    getRest: function(){
        getData(ZOMATO_API+this.state.search+'&count=1&lat='+city.lat+'&lon='+city.lon)
        .then(data => {
            var results;
            this.setState({result: results});
            data.restaurants.map(restaurant => {
                results = restaurant.restaurant;
            });
            this.setState({res: <Result defaultValue={results}/>});
            console.log();
        })
    },

    componentWillMount: function() {
        getLocation();
    },

    componentDidMount: function() {
        checkLoc = setInterval(()=>{
            if(city.lat != 0 && city.lon != 0){ 
                this.setState({isLocation: true})
                console.log(this.state.isLocation);
                clearInterval(checkLoc);
            }
        }, 3000);
    },

    render: function(){
        return(
            <div className="container">
                <div className="card fade-in-up">
                    <div className="fade-in" style={{display: this.state.isLocation ? 'block' : 'none'}}>
                        <div className="input-group">
                            <img className="logo" src="src/img/ConfusedFoodie.png"/>
                            <p style={{textAlign: 'center'}}>i'll choose for you</p>
                        </div>
                        <div className="input-group">
                            <input className="input text" placeholder="Tell me your cravings" onChange={this.handleChange} />
                        </div>
                        <div className="input-group">
                            <button className="input button" onClick={this.getRest}>Get Restaurant</button>
                        </div>
                    </div>
                    <div className="fade-in" style={{display: this.state.isLocation ? 'none' : 'block'}}>
                        <div className="input-group">
                            <h4 style={{textAlign: 'center'}}>getting your location</h4>
                            <div className="spinner"></div>
                        </div>
                    </div>
                </div>
                {this.state.res}
            </div>
        )
    }
})


ReactDOM.render(<RestSearch />, document.getElementById("app"))