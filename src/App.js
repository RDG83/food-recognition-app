import React, { Component } from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import "tachyons";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import Particles from "react-particles-js";
import FoodRecognition from "./components/FoodRecognition/FoodRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";

const particleOptions = {
    particles: {
        number: {
            value: 150,
        },
        line_linked: {
            shadow: {
                enable: true,
                color: "#3CA9D1",
                blur: 5,
            },
        },
    },
};

const initialState = {
    input: "",
    imageUrl: "",
    ingredients: [],
    route: "signin",
    isSignedIn: false,
    user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: "",
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = initialState;
    }

    loadUser = (data) => {
        this.setState({
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
                entries: data.entries,
                joined: data.joined,
            },
        });
    };

    findIngredients = (data) => {
        const foundIngredients = data.outputs[0].data.concepts;
        return foundIngredients;
    };

    setIngredients = (list) => {
        this.setState({ ingredients: list });
    };

    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    };

    onPictureSubmit = () => {
        this.setState({ imageUrl: this.state.input });
        fetch("https://secure-coast-73756.herokuapp.com/imageurl", {
            method: "post",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                input: this.state.input
            })
        })
            .then(response => response.json())
            .then(response => {
                if (response) {
                    fetch("https://secure-coast-73756.herokuapp.com/image", {
                        method: "put",
                        headers: { "Content-type": "application/json" },
                        body: JSON.stringify({
                            id: this.state.user.id,
                        }),
                    })
                        .then((data) => data.json())
                        .then((count) => {
                            this.setState(
                                Object.assign(this.state.user, { entries: count })
                            );
                        }).catch(console.log)
                }
                this.setIngredients(this.findIngredients(response));
            })
            .catch((err) => console.log(err))
    }


    onRouteChange = (route) => {
        if (route === "signin") {
            this.setState(initialState);
        } else if (route === "home") {
            this.setState({ isSignedIn: true });
        }
        this.setState({ route: route });
    };

    render() {
        return (
            <div className="App">
                <Particles className="particles" params={particleOptions} />
                <Navigation
                    isSignedIn={this.state.isSignedIn}
                    onRouteChange={this.onRouteChange}
                />
                {this.state.route === "home" ? (
                    <div>
                        <Logo />
                        <Rank
                            userEntries={this.state.user.entries}
                            userName={this.state.user.name}
                        />
                        <ImageLinkForm
                            onInputChange={this.onInputChange}
                            onPictureSubmit={this.onPictureSubmit}
                        />
                        <FoodRecognition
                            imageUrl={this.state.imageUrl}
                            ingredients={this.state.ingredients}
                        />
                    </div>
                ) : this.state.route === "signin" ? (
                    <Signin
                        loadUser={this.loadUser}
                        onRouteChange={this.onRouteChange}
                    />
                ) : (
                            <Register
                                onRouteChange={this.onRouteChange}
                                loadUser={this.loadUser}
                            />
                        )}
            </div>
        );
    }
}

export default App;
