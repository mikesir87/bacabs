import * as React from "react";
import {Fragment} from "react";
import {getServices} from "../actions/getServices";
import {connect} from "react-redux";
import StackDisplay from "./StackDisplay";

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
      <Fragment>
        {
          Object
            .keys(stacks)
            .sort((a, b) => a < b ? -1 : 1)
            .map(stackName => <StackDisplay key={stackName} stackName={stackName} services={stacks[stackName]} />)}
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  fetching : state.stacks.fetchState === "FETCHING" || state.stacks.fetchState === "UNKNOWN",
  stacks : state.stacks.stacks,
});

export default connect(mapStateToProps)(StackDashboardView);
