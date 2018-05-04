import React, {Component, Fragment} from 'react';
import {Provider} from "react-redux";
import store from "../store";
import Navbar from "react-bootstrap/es/Navbar";
import Grid from "react-bootstrap/es/Grid";
import Col from "react-bootstrap/es/Col";
import StackDashboardView from "./StackDashboardView";

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Fragment>
          <Navbar inverse>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#home">Bacabs</a>
              </Navbar.Brand>
            </Navbar.Header>
          </Navbar>

          <Grid>
            <Col md={12}>
              <StackDashboardView />
            </Col>
          </Grid>
        </Fragment>
      </Provider>
    );
  }
}

export default App;
