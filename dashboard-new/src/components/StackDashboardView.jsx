import * as React from "react";
import {Fragment} from "react";
import {getServices} from "../actions/getServices";
import {connect} from "react-redux";
import StackDisplay from "./StackDisplay";
import Grid from "react-bootstrap/es/Grid";
import Row from "react-bootstrap/es/Row";
import Col from "react-bootstrap/es/Col";

class StackDashboardView extends React.Component {

  componentDidMount() {
    this.props.dispatch(getServices());
  }

  render() {
    const { fetching, stacks } = this.props;

    if (fetching)
      return <p>Fetching current deployments...</p>;


    if (Object.keys(stacks).length === 0)
      return <Fragment>
        <h4 style={{marginBottom:"50px"}}>There are currently no deployments available to be shown!</h4>
        <img src={"https://media.giphy.com/media/13d2jHlSlxklVe/giphy.gif"} alt={"Nothing to see here..."} />
      </Fragment>

    return (
      <Grid fluid>
        <Row className={"row-header"}>
          <Col sm={2}>Stack</Col>
          <Col sm={2}>Component</Col>
          <Col sm={2}>JIRA Issue</Col>
          <Col sm={2}>Replicas</Col>
          <Col sm={4}>Container Image</Col>
        </Row>

        {
            Object
              .keys(stacks)
              .sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1)
              .map(stackName => <StackDisplay key={stackName} stackName={stackName} services={stacks[stackName]} />)
        }
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  fetching : state.stacks.fetchState === "FETCHING" || state.stacks.fetchState === "UNKNOWN",
  stacks : state.stacks.stacks,
});

export default connect(mapStateToProps)(StackDashboardView);
